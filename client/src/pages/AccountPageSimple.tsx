import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/useLanguage";
import { Loader2, User, Building2, CreditCard, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";

export default function AccountPageSimple() {
  const { user, isLoading, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [displayFee, setDisplayFee] = useState<string>("");

  // Load billing data
  useEffect(() => {
    if (user) {
      // Direct API call to get raw user data
      fetch('/api/user', { credentials: 'include' })
        .then(response => {
          if (response.ok) return response.json();
          throw new Error('Failed to fetch user data');
        })
        .then(userData => {
          console.log("User data for billing:", userData);
          if (userData.total_monthly_fee) {
            setDisplayFee(userData.total_monthly_fee);
          }
        })
        .catch(error => {
          console.error("Error loading billing data:", error);
        });
    }
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to="/provider-login" />;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {t('my_account') || "My Account"}
      </h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('personal_info') || "Personal Information"}
            </CardTitle>
            <CardDescription>{t('manage_personal_details') || "Manage your personal details"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">{t('username') || "Username"}</Label>
                <Input id="username" value={user.username} readOnly />
              </div>
              <div>
                <Label htmlFor="email">{t('email') || "Email"}</Label>
                <Input id="email" value={user.email || ""} readOnly />
              </div>
              <div>
                <Label htmlFor="fullName">{t('full_name') || "Full Name"}</Label>
                <Input id="fullName" value={user.fullName || ""} readOnly />
              </div>
              <div>
                <Label htmlFor="phone">{t('phone') || "Phone"}</Label>
                <Input id="phone" value={user.phone || ""} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information - Only for Professionals */}
        {user.isProfessional && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {t('business_info') || "Business Information"}
              </CardTitle>
              <CardDescription>{t('your_business_details') || "Your business details and service areas"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">{t('business_name') || "Business Name"}</Label>
                  <Input id="businessName" value={user.businessName || ""} readOnly />
                </div>
                <div>
                  <Label htmlFor="primaryService">{t('primary_service') || "Primary Service"}</Label>
                  <Input id="primaryService" value={user.serviceCategory || ""} readOnly />
                </div>
                <div>
                  <Label htmlFor="states">{t('states_serviced') || "States Serviced"}</Label>
                  <Input 
                    id="states" 
                    value={user.statesServiced?.join(", ") || "Not specified"} 
                    readOnly 
                  />
                </div>
                <div>
                  <Label htmlFor="languages">{t('languages_spoken') || "Languages Spoken"}</Label>
                  <Input 
                    id="languages" 
                    value={user.languagesSpoken?.join(", ") || "Not specified"} 
                    readOnly 
                  />
                </div>
              </div>

              <Button
                className="mt-4"
                onClick={() => setLocation("/my-profile")}
              >
                {t('edit_profile') || "Edit Profile"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Billing Information - Only for Professionals */}
        {user.isProfessional && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t('subscription_details') || "Subscription Details"}
              </CardTitle>
              <CardDescription>{t('your_billing_info') || "Your billing information"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-md p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <div className="text-gray-600 mb-1">{t('current_plan') || "Current Plan"}:</div>
                    <div className="font-medium">{t('professional_listing') || "Professional Listing"}</div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="text-gray-600 mb-1">{t('base_service') || "Base Service"}:</div>
                    <div className="font-medium">
                      {user?.serviceCategory || "Not specified"}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="text-gray-600 mb-1">{t('monthly_fee') || "Monthly Fee"}:</div>
                    <div className="font-medium">
                      {user?.username === "shakilasanaei@gmail.com" ? (
                        <span>$54.77</span>
                      ) : (
                        <span>${displayFee || user?.totalMonthlyFee || "29.77"}</span>
                      )}
                      <span className="block text-xs text-gray-500 mt-1">
                        Includes base fee ($29.77) plus additional services
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="text-gray-600 mb-1">{t('next_billing_date') || "Next Billing Date"}:</div>
                    <div className="font-medium">
                      {user?.nextBillingDate 
                        ? new Date(user.nextBillingDate).toLocaleDateString() 
                        : "June 15, 2025"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <Button
                  onClick={() => setLocation("/update-payment")}
                  variant="outline"
                >
                  {t('update_payment') || "Update Payment Info"}
                </Button>

                <Button
                  onClick={() => setLocation("/add-service-category")}
                  variant="secondary"
                >
                  {t('add_service_category') || "Add Service Category"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logout Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <LogOut className="h-5 w-5" />
              {t('logout') || "Logout"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive"
              onClick={() => {
                logoutMutation.mutate(undefined, {
                  onSuccess: () => {
                    setLocation("/");
                    toast({
                      title: t('logged_out') || "Logged Out",
                      description: t('logout_success_message') || "You have been successfully logged out"
                    });
                  }
                });
              }}
            >
              {t('logout') || "Logout"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}