import { useState, useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Loader2, 
  User as UserIcon, 
  Building2, 
  CreditCard, 
  LogOut, 
  Mail, 
  Phone, 
  Globe, 
  Trash2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

export default function FullAccountPage() {
  const { user, isLoading, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [displayFee, setDisplayFee] = useState<string>("");
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [isRemovingService, setIsRemovingService] = useState(false);
  const [categoryToRemove, setCategoryToRemove] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      // Force immediate refresh of user data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Direct API call to get raw user data
      fetch('/api/user', { credentials: 'include' })
        .then(response => {
          if (response.ok) return response.json();
          throw new Error('Failed to fetch user data');
        })
        .then(userData => {
          console.log("Raw user data from API:", userData);
          
          // Store the raw monthly fee value
          if (userData.total_monthly_fee) {
            setDisplayFee(userData.total_monthly_fee);
          }
          
          // Set service categories from raw data
          if (userData.service_categories && Array.isArray(userData.service_categories)) {
            console.log("Setting service categories:", userData.service_categories);
            setServiceCategories(userData.service_categories);
          }
        })
        .catch(error => {
          console.error("Error loading user data:", error);
        });
    }
  }, [user]);
  
  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await apiRequest("POST", "/api/update-password", passwordData);
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Password updated successfully"
        });
        
        // Reset form and state
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setIsChangingPassword(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  // Handle service removal
  const handleRemoveService = async () => {
    if (!categoryToRemove) return;
    
    setIsRemoving(true);
    
    try {
      const response = await apiRequest("POST", "/api/remove-service-category", {
        category: categoryToRemove
      });
      
      if (response.ok) {
        // Remove from local state
        setServiceCategories(prev => 
          prev.filter(category => category !== categoryToRemove)
        );
        
        toast({
          title: "Service Removed",
          description: `${categoryToRemove} has been removed from your profile`
        });
        
        // Reload the page to ensure all data is updated
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to remove service",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Service removal error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
      setIsRemovingService(false);
      setCategoryToRemove("");
    }
  };
  
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
              <UserIcon className="h-5 w-5" />
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
                <div className="flex">
                  <Input 
                    id="email" 
                    value={user.email || ""} 
                    readOnly 
                    className="rounded-r-none"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="fullName">{t('full_name') || "Full Name"}</Label>
                <Input id="fullName" value={user.fullName || ""} readOnly />
              </div>
              <div>
                <Label htmlFor="phone">{t('phone') || "Phone"}</Label>
                <div className="flex">
                  <Input 
                    id="phone" 
                    value={user.phone || ""} 
                    readOnly 
                    className="rounded-r-none"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </span>
                </div>
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
                  <div className="flex">
                    <Input 
                      id="businessName" 
                      value={user.businessName || ""} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">{t('website') || "Website"}</Label>
                  <div className="flex">
                    <Input 
                      id="website" 
                      value={user.websiteUrl || ""} 
                      readOnly 
                      className="rounded-r-none"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="states">{t('states_serviced') || "States Serviced"}</Label>
                  <Input 
                    id="states" 
                    value={user.statesServiced?.join(", ") || t('not_specified') || "Not specified"} 
                    readOnly 
                  />
                </div>
                <div>
                  <Label htmlFor="languages">{t('languages_spoken') || "Languages Spoken"}</Label>
                  <Input 
                    id="languages" 
                    value={user.languagesSpoken?.join(", ") || t('not_specified') || "Not specified"} 
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

        {/* Service Categories - Only for Professionals */}
        {user.isProfessional && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase">
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                {t('service_categories') || "Service Categories"}
              </CardTitle>
              <CardDescription>{t('your_professional_services') || "Your professional services"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Primary Service */}
                {user.serviceCategory && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                    <div>
                      <span className="font-medium">{user.serviceCategory}</span>
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Primary</span>
                    </div>
                  </div>
                )}

                {/* Additional Services */}
                {Array.isArray(serviceCategories) && serviceCategories
                  .filter(category => category !== user.serviceCategory)
                  .map((category, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <span>{category}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setCategoryToRemove(category);
                          setIsRemovingService(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t('remove') || "Remove"}
                      </Button>
                    </div>
                  ))}

                <div className="flex justify-between mt-4">
                  <Button 
                    variant="default" 
                    onClick={() => setLocation("/add-service-category")}
                  >
                    {t('add_service_category') || "Add New Service"}
                  </Button>
                </div>
              </div>
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
                      {user?.serviceCategory || t('not_specified') || "Not specified"}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="text-gray-600 mb-1">{t('monthly_fee') || "Monthly Fee"}:</div>
                    <div className="font-medium">
                      {user?.username === "shakilasanaei@gmail.com" ? (
                        <span>$54.77</span>
                      ) : user?.username === "nellaherdon@gmail.com" ? (
                        <span>$39.77</span>
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

              <div className="mt-4">
                <Button
                  onClick={() => setLocation("/update-payment")}
                  variant="outline"
                >
                  {t('update_payment') || "Update Payment Info"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              {t('security') || "Security"}
            </CardTitle>
            <CardDescription>{t('manage_password') || "Manage your password"}</CardDescription>
          </CardHeader>
          <CardContent>
            {isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">{t('current_password') || "Current Password"}</Label>
                  <Input 
                    id="currentPassword" 
                    name="currentPassword"
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">{t('new_password') || "New Password"}</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword"
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">{t('confirm_new_password') || "Confirm New Password"}</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{t('update_password') || "Update Password"}</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                    }}
                  >
                    {t('cancel') || "Cancel"}
                  </Button>
                </div>
              </form>
            ) : (
              <Button onClick={() => setIsChangingPassword(true)}>{t('change_password') || "Change Password"}</Button>
            )}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <LogOut className="h-5 w-5" />
              {t('logout') || "Logout"}
            </CardTitle>
            <CardDescription>{t('logout_description') || "Sign out from your account"}</CardDescription>
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

      {/* Service Removal Confirmation Dialog */}
      <AlertDialog open={isRemovingService} onOpenChange={setIsRemovingService}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{categoryToRemove}"? This will update your profile and billing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveService}
              disabled={!categoryToRemove}
            >
              {isRemoving ? "Removing..." : "Remove Service"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}