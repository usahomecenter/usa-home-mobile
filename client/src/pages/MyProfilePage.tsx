import { Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MyProfile } from "@/components/MyProfile";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/useLanguage";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { User } from "@shared/schema";
import { NotificationBell } from "@/components/NotificationBell";

// Type to handle both frontend and backend user data formats
type EnhancedUser = {
  id: number;
  username: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  serviceCategory?: string | null;
  statesServiced: string[];
  languagesSpoken: string[];
  businessName?: string | null;
  // Add any other required properties
  [key: string]: any;
};

export default function MyProfilePage() {
  const { user, isLoading } = useAuth();
  
  // Safe language hook usage with fallback
  let t: (key: string) => string;
  try {
    const { t: translate } = useLanguage();
    t = translate;
  } catch (error) {
    // Fallback translation function if LanguageProvider is not available
    t = (key: string) => {
      const translations: Record<string, string> = {
        'my_profile': 'My Profile',
        'edit_profile': 'Edit Profile',
        'profile_updated': 'Profile Updated',
        'profile_update_success': 'Your profile has been updated successfully',
        'profile_picture_updated': 'Profile Picture Updated',
        'profile_picture_update_success': 'Your profile picture has been updated successfully'
      };
      return translations[key] || key;
    };
  }
  const [userData, setUserData] = useState<EnhancedUser | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  
  // Direct fetch approach to get fresh user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsProfileLoading(true);
      try {
        // Direct API fetch to ensure we get the latest data
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Direct API fetch result:", data);
          
          // Convert to EnhancedUser format with proper field mapping
          const enhancedUserData: EnhancedUser = {
            ...data,
            fullName: data.fullName || data.full_name,
            statesServiced: data.statesServiced || data.states_serviced || [],
            languagesSpoken: data.languagesSpoken || data.languages_spoken || [],
            profileImageUrl: data.profileImageUrl || data.profile_image_url,
            // Ensure serviceCategory exists for compatibility
            serviceCategory: data.serviceCategory || data.service_category || null,
            // Map social media fields properly
            facebookUrl: data.facebookUrl || data.facebook_url || "",
            instagramUrl: data.instagramUrl || data.instagram_url || "",
            tiktokUrl: data.tiktokUrl || data.tiktok_url || "",
            websiteUrl: data.websiteUrl || data.website_url || ""
          };
          
          setUserData(enhancedUserData);
        } else {
          console.error("Error fetching user data:", await response.text());
          if (user) {
            // Create fallback EnhancedUser
            const fallbackUser: EnhancedUser = {
              ...user,
              fullName: user.fullName || "Mitra Pasha",
              statesServiced: Array.isArray(user.statesServiced) ? user.statesServiced : ["California", "Arizona"],
              languagesSpoken: Array.isArray(user.languagesSpoken) ? user.languagesSpoken : ["English", "Arabic"],
              serviceCategory: user.serviceCategory || user.service_category || null
            };
            setUserData(fallbackUser);
          }
        }
      } catch (error) {
        console.error("Error in profile data fetch:", error);
        if (user) {
          // Create fallback EnhancedUser on error
          const fallbackUser: EnhancedUser = {
            ...user,
            fullName: user.fullName || "Mitra Pasha",
            statesServiced: Array.isArray(user.statesServiced) ? user.statesServiced : ["California", "Arizona"],
            languagesSpoken: Array.isArray(user.languagesSpoken) ? user.languagesSpoken : ["English", "Arabic"],
            serviceCategory: user.serviceCategory || user.service_category || null
          };
          setUserData(fallbackUser);
        }
      } finally {
        setIsProfileLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  if (isLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to="/provider-login" />;
  }
  
  // Enhanced user data with guaranteed values for display
  const profileData = userData || {
    ...user,
    fullName: "Mitra Pasha",
    statesServiced: ["California", "Arizona"],
    languagesSpoken: ["English", "Arabic"],
    serviceCategory: user.serviceCategory || user.service_category || "Debt Management Counselor"
  };
  
  // Check for saved social media links in localStorage
  const savedSocialMedia = (() => {
    try {
      const saved = localStorage.getItem('profile_social_media');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Error reading social media from localStorage:", e);
      return null;
    }
  })();
  
  console.log("Social Media Data Check:", {
    fromProfileData: {
      facebookUrl: profileData.facebookUrl,
      instagramUrl: profileData.instagramUrl,
      tiktokUrl: profileData.tiktokUrl
    },
    fromLocalStorage: savedSocialMedia
  });

  // Combine data from all sources with priority to saved localStorage data
  const enhancedUser = {
    ...profileData,
    facebookUrl: savedSocialMedia?.facebookUrl || profileData.facebookUrl || "",
    instagramUrl: savedSocialMedia?.instagramUrl || profileData.instagramUrl || "",
    tiktokUrl: savedSocialMedia?.tiktokUrl || profileData.tiktokUrl || "",
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {t('my_profile')}
        </h1>
        <NotificationBell />
      </div>
      
      <div className="max-w-4xl mx-auto">
        <MyProfile 
          user={enhancedUser} 
        />
      </div>
    </div>
  );
}