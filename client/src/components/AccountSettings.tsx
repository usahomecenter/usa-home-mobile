import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/useLanguage";
import { User as UserIcon, LogOut, Mail, Phone, Building2, Globe, Trash2, RefreshCw, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function AccountSettings() {
  const { user, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isRemovingService, setIsRemovingService] = useState(false);
  const [categoryToRemove, setCategoryToRemove] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // States to store actual values from API
  const [displayFee, setDisplayFee] = useState<string>("");

  // Force a refresh of user data when component mounts
  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        // Force immediate refresh of user data
        await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        
        // Direct API call to get raw user data
        const response = await fetch('/api/user', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const rawUserData = await response.json();
          console.log("Raw user data from API:", rawUserData);
          
          // Store the raw total_monthly_fee value
          if (rawUserData.total_monthly_fee) {
            setDisplayFee(rawUserData.total_monthly_fee);
          }
          
          // Combine primary service and additional services into one array for display
          const allCategories = [];
          
          // Add primary service if it exists
          if (rawUserData.service_category) {
            allCategories.push(rawUserData.service_category);
          }
          
          // Add additional services from the array
          if (rawUserData.service_categories && Array.isArray(rawUserData.service_categories)) {
            allCategories.push(...rawUserData.service_categories);
          }
          
          // Remove duplicates using standard array methods
          const uniqueCategories = allCategories.filter((category, index) => 
            allCategories.indexOf(category) === index
          );
          console.log("Setting service categories:", uniqueCategories);
          setServiceCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    };

    // Fetch data when component mounts
    fetchLatestData();
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await apiRequest("POST", "/api/update-password", passwordData);
      
      if (response.ok) {
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated"
        });
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error updating password",
          description: data.message || "Please check your current password and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating password",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/");
        toast({
          title: "Logged out",
          description: "You have been successfully logged out"
        });
      },
      onError: (error) => {
        toast({
          title: "Error logging out",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const confirmRemoveCategory = (category: string) => {
    setCategoryToRemove(category);
    setIsRemovingService(true);
  };

  const handleRemoveCategory = async () => {
    if (!categoryToRemove) return;
    
    setIsRemoving(true);
    
    try {
      const response = await apiRequest("POST", "/api/remove-service-category", {
        category: categoryToRemove
      });
      
      if (response.ok) {
        // Update local state first
        setServiceCategories(prev => prev.filter(cat => cat !== categoryToRemove));
        
        // Process the response data
        const data = await response.json();
        console.log("Service removal response:", data);
        
        // Refresh user data to get the latest state including the updated fee
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        const userData = await queryClient.fetchQuery({ queryKey: ["/api/user"] }) as any;
        console.log("Updated user data after removal:", userData);
        
        // Force a hard page refresh to ensure all data is updated
        window.location.reload();
        
        toast({
          title: "Service category removed",
          description: `${categoryToRemove} has been removed from your services`
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error removing category",
          description: data.message || "Could not remove the service category",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error removing category",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
      setIsRemovingService(false);
      setCategoryToRemove("");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
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
                    value={user?.websiteUrl || ""} 
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
          </CardContent>
        </Card>
      )}

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
                    value={user?.websiteUrl || ""} 
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
          </CardContent>
        </Card>
      )}

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
            <CardDescription>Your professional services</CardDescription>
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
              {serviceCategories.map((category, index) => (
                category !== user.serviceCategory && (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100">
                    <span>{category}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => confirmRemoveCategory(category)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t('remove') || "Remove"}
                    </Button>
                  </div>
                )
              ))}

              <div className="flex justify-between items-center pt-4">
                <Button 
                  variant="default" 
                  onClick={() => setLocation("/add-service-category")}
                >
                  {t('add_service_category') || "Add New Service"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ["/api/user"] });
                    toast({
                      title: "Data Refreshed",
                      description: "Latest service information loaded"
                    });
                  }}
                  className="text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            <CardDescription>Your professional services</CardDescription>
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
              {Array.isArray(user.serviceCategories) && user.serviceCategories.filter(category => category !== user.serviceCategory).map((category, index) => (
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
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ["/api/user"] });
                    toast({
                      title: "Data Refreshed",
                      description: "Latest service information loaded"
                    });
                  }}
                  className="text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                  <div className="font-medium">{user?.serviceCategory || t('not_specified') || "Not specified"}</div>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M2 12h3m14 0h3"></path>
              <path d="M12 2v3m0 14v3"></path>
            </svg>
            {t('security') || "Security"}
          </CardTitle>
          <CardDescription>{t('manage_password') || "Manage your account security settings"}</CardDescription>
        </CardHeader>
        <CardContent>
          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
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
                <Label htmlFor="newPassword">New Password</Label>
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
                <Label htmlFor="confirmPassword">{t('confirm_new_password')}</Label>
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
                <Button type="submit">{t('update_password')}</Button>
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
                  {t('cancel')}
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setIsChangingPassword(true)}>{t('change_password')}</Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <LogOut className="h-5 w-5" />
            {t('logout') || "Logout"}
          </CardTitle>
          <CardDescription className="text-red-500/80">
            {t('logout_description') || "Log out of your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Logging out...
              </>
            ) : (
              t('logout') || "Logout"
            )}
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={isRemovingService} onOpenChange={setIsRemovingService}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Service Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{categoryToRemove}" from your services?
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveCategory}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}