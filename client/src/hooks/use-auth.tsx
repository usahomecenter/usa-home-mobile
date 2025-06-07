import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as BaseUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { translations } from "./useLanguage";

// Extended User type with subscription info
export interface User extends Omit<BaseUser, 'totalMonthlyFee'> {
  subscription?: {
    amount: number;
    status: string;
  };
  totalMonthlyFee?: number | string | null;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
  isProfessional?: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  });
  
  // Update login status in localStorage when user data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
    }
  }, [user]);
  
  // Get current language from localStorage
  const getCurrentLanguage = () => {
    const savedLanguageCode = localStorage.getItem('languageCode') || 'en';
    return savedLanguageCode;
  };
  
  // Translation function
  const t = (key: string): string => {
    const currentLanguageCode = getCurrentLanguage();
    // If translation exists for current language, return it
    if (translations[currentLanguageCode] && translations[currentLanguageCode][key]) {
      return translations[currentLanguageCode][key];
    }
    
    // Fallback to English
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    
    // If no translation is found, return the key itself
    return key;
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      // Set flag in localStorage to help with route protection
      localStorage.setItem('isLoggedIn', 'true');
      toast({
        title: t('login_successful'),
        description: t('welcome_back').replace('{username}', user.username),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('login_failed'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: t('registration_successful'),
        description: t('welcome_new_user').replace('{username}', user.username),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('registration_failed'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      // Clear all auth data from storage
      localStorage.removeItem('isLoggedIn');
      localStorage.clear();
      sessionStorage.clear();
      
      // Force full page navigation to ensure complete logout
      window.location.href = '/';
    },
    onError: (error: Error) => {
      toast({
        title: t('logout_failed'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}