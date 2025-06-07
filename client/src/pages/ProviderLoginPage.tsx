import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";


const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof formSchema>;

const ProviderLoginPage = () => {
  const [location, setLocation] = useLocation();
  const { loginMutation } = useAuth();
  // Use temporary translation function since we're having issues with the provider
  const t = (key: string): string => {
    const translations: Record<string, string> = {
      username: "Username",
      password: "Password",
      login: "Login",
      enter_your_username: "Enter your username",
      enter_your_password: "Enter your password",
      forgot_password: "Forgot your password?",
      dont_have_account: "Don't have an account?",
      sign_up: "Sign up",
      service_provider_login: "Service Provider Login",
      provider_login_description: "Enter your username and password to access your provider account"
    };
    return translations[key] || key;
  };
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    // Use the authentication system from the useAuth hook
    loginMutation.mutate(values, {
      onSuccess: (user) => {
        // Force a slight delay to ensure auth state is updated, then redirect
        setTimeout(() => {
          if (user.isProfessional) {
            setLocation("/my-profile");
          } else {
            setLocation("/my-account");
          }
          // Force page refresh to ensure UI updates properly
          window.location.reload();
        }, 500);
      }
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t('service_provider_login')}</CardTitle>
          <CardDescription>
            {t('provider_login_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('username')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('enter_your_username')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder={t('enter_your_password')} 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <Eye className="h-4 w-4 text-gray-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('login')}...
                  </>
                ) : (
                  t('login')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            variant="link" 
            className="px-0 text-sm font-normal text-blue-600 hover:text-blue-800"
            onClick={() => setLocation("/forgot-password")}
          >
            {t('forgot_password')}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {t('dont_have_account')}{" "}
            <Button 
              variant="link" 
              className="p-0 text-blue-600 hover:text-blue-800"
              onClick={() => setLocation("/professional-signup-page")}
            >
              {t('sign_up')}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProviderLoginPage;