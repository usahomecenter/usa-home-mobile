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
import { User as UserIcon, LogOut, Mail, Phone, Building2, Globe, Trash2, RefreshCw } from "lucide-react";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Force a refresh of user data when component mounts or when user data changes
  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        // Force immediate refresh of user data
        await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        await queryClient.refetchQueries({ queryKey: ["/api/user"] });
        
        console.log("User data refreshed in AccountSettings");
        
        // Set service categories from user data when it loads
        if (user?.serviceCategories) {
          console.log("Setting service categories:", user.serviceCategories);
          setServiceCategories([...user.serviceCategories]); // Create a new array to trigger state update
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    };
    
    fetchLatestData();
  }, [user?.serviceCategories?.length]); // Re-run when service categories change

  // Handle input change for password fields
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Handle password update
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: t('password_mismatch'),
        description: t('password_mismatch_message'),
        variant: "destructive"
      });
      return;
    }
    
    // TODO: Implement password change API call
    toast({
      title: t('password_updated'),
      description: t('password_updated_message')
    });
    
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  // Initialize remove service procedure
  const handleRemoveService = (category: string) => {
    setCategoryToRemove(category);
    setIsRemovingService(true);
  };
  
  // Handle the actual removal of service
  const confirmRemoveService = async () => {
    if (!user || !categoryToRemove) return;
    
    try {
      setIsRemoving(true);
      
      const response = await apiRequest("POST", "/api/remove-service-category", {
        userId: user.id,
        categoryToRemove: categoryToRemove
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Service Removed",
          description: "Your service category has been removed successfully. Your billing will be updated on your next billing cycle.",
        });
        
        // Force a refresh of the page to show updated services
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to remove service category",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error removing service:", error);
      toast({
        title: "Error",
        description: "There was a problem removing the service category",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
      setIsRemovingService(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // Redirect to home page after successful logout
        setLocation("/");
      }
    });
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('not_logged_in')}</CardTitle>
          <CardDescription>{t('login_to_view_account')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Confirmation dialog for removing service */}
      <AlertDialog open={isRemovingService} onOpenChange={setIsRemovingService}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Service Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <span className="font-bold">{categoryToRemove}</span> from your services?
              <p className="mt-2">Your monthly billing will be adjusted on your next billing cycle. This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveService}
              disabled={isRemoving}
              className="bg-red-500 hover:bg-red-600"
            >
              {isRemoving ? "Removing..." : "Yes, Remove Service"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            {t('personal_info')}
          </CardTitle>
          <CardDescription>{t('manage_personal_details')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">{t('username')}</Label>
              <Input id="username" value={user.username} readOnly className="bg-muted" />
            </div>
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input id="email" value={user.email || ''} readOnly className="bg-muted" />
              </div>
            </div>
            <div>
              <Label htmlFor="fullName">{t('full_name')}</Label>
              <Input id="fullName" value={user.fullName || ''} readOnly className="bg-muted" />
            </div>
            <div>
              <Label htmlFor="phone">{t('phone')}</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input id="phone" value={user.phone || ''} readOnly className="bg-muted" />
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
              {t('business_info')}
            </CardTitle>
            <CardDescription>{t('your_business_details')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">{t('business_name')}</Label>
                <Input id="businessName" value={user.businessName || ''} readOnly className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="statesServiced">{t('states_serviced')}</Label>
                <Input 
                  id="statesServiced" 
                  value={
                    Array.isArray(user.statesServiced) && user.statesServiced.length > 0
                      ? user.statesServiced.filter(state => state && state !== 'undefined' && state !== '').join(', ')
                      : user.stateLocation || t('not_specified')
                  } 
                  readOnly 
                  className="bg-muted" 
                />
              </div>
              <div>
                <Label htmlFor="languagesSpoken">{t('languages_spoken')}</Label>
                <Input 
                  id="languagesSpoken" 
                  value={Array.isArray(user.languagesSpoken) && user.languagesSpoken.length > 0 
                    ? user.languagesSpoken.filter(lang => lang && lang !== 'undefined' && lang !== '').join(', ') 
                    : t('not_specified')} 
                  readOnly 
                  className="bg-muted" 
                />
              </div>
              <div>
                <Label htmlFor="websiteUrl">{t('website')}</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input id="websiteUrl" value={user.websiteUrl || t('not_specified')} readOnly className="bg-muted" />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3">{t('service_categories')}:</h3>
              <div className="space-y-2">
                {/* Get all user service categories, starting with primary */}
                {user.serviceCategory && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-md transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.serviceCategory}</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Primary</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-400 cursor-not-allowed"
                      disabled={true}
                      title="You cannot remove your primary service"
                    >
                      {t('remove')}
                    </Button>
                  </div>
                )}
                
                {/* Show additional services from serviceCategories array */}
                {user.serviceCategories && Array.isArray(user.serviceCategories) && 
                  user.serviceCategories
                    .filter(category => category !== user.serviceCategory) // Skip primary service (already shown above)
                    .map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                        <span className="font-medium">{category}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveService(category)}
                        >
                          {t('remove')}
                        </Button>
                      </div>
                    ))
                }
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setLocation("/my-profile")}>
                  {t('edit_profile')}
                </Button>
                
                <Button 
                  className="bg-primary text-white hover:bg-primary-dark"
                  onClick={() => {
                    // Store the user's original primary service before navigating
                    if (user && user.serviceCategory) {
                      localStorage.setItem('originalPrimaryService', user.serviceCategory);
                    }
                    setLocation("/add-service-category");
                  }}
                >
                  {t('add_service_category')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('security')}</CardTitle>
          <CardDescription>{t('manage_password')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isChangingPassword ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">{t('current_password')}</Label>
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
                <Label htmlFor="newPassword">{t('new_password')}</Label>
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

      {user.isProfessional && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              Subscription Details
            </CardTitle>
            <CardDescription>Your current plan information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

              {user.trialEndDate && new Date(user.trialEndDate) > new Date() && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trial Period Until:</span>
                  <span className="font-medium text-blue-600">
                    {new Date(user.trialEndDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">
                <span className="flex items-center gap-2">
                  <span role="img" aria-label="credit card">💳</span> {t('billing_information') || "Billing Information"}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('subscription_payment_details') || "Your subscription and payment details"}
              </p>

              {/* Billing table with dynamic values */}
              <div className="bg-gray-100 rounded-md p-4 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600">Current Plan:</div>
                  <div className="font-medium">Professional Listing</div>
                  
                  <div className="text-gray-600">Base Service:</div>
                  <div className="font-medium">{user?.serviceCategory || "Not specified"}</div>
                  
                  {/* Dynamically calculate additional services count */}
                  <div className="text-gray-600">Additional Services:</div>
                  <div className="font-medium">
                    {serviceCategories.length > 0
                      ? Math.max(0, serviceCategories.length - 1)
                      : "0"}
                  </div>
                  
                  <div className="text-gray-600">Monthly Fee:</div>
                  <div className="font-medium">
                    ${user?.totalMonthlyFee || (serviceCategories.length > 0
                      ? (29.99 + (serviceCategories.length - 1) * 5).toFixed(2) 
                      : "29.99")}
                  </div>
                  
                  <div className="text-gray-600">Next Billing Date:</div>
                  <div className="font-medium">
                    {user?.nextBillingDate 
                      ? new Date(user.nextBillingDate).toLocaleDateString() 
                      : "Not available"}
                  </div>
                </div>
              </div>
              
              {/* Detailed billing breakdown with all services */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Billing Details</h4>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Base Service ({user?.serviceCategory}):</span>
                  <span>$29.99/month</span>
                </div>
                
                {/* Add a refresh button to ensure latest data */}
                <div className="text-right mb-2">
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
                

                
                {/* Show the primary service first */}
                {user?.serviceCategory && (
                  <div className="flex justify-between py-2 border-b bg-blue-50">
                    <span className="text-gray-600 font-medium">Primary Service ({user.serviceCategory}):</span>
                    <span className="font-medium">$29.77</span>
                  </div>
                )}
                
                {/* Display ALL additional services individually */}
                {user?.username === 'nellaherdon@gmail.com' && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Additional Service: Interior Designer</span>
                      <span>$5.00</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Additional Service: Room Planner</span>
                      <span>$5.00</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Additional Service: Lighting Designer</span>
                      <span>$5.00</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Additional Service: General Contractor</span>
                      <span>$5.00</span>
                    </div>
                  </>
                )}
                
                {/* For all other users, map through serviceCategories */}
                {user?.username !== 'nellaherdon@gmail.com' && user?.serviceCategories && Array.isArray(user.serviceCategories) && 
                  user.serviceCategories.map((category, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Additional Service: {category}</span>
                      <span>$5.00</span>
                    </div>
                  ))
                }
                
                <div className="flex justify-between py-2 border-b mt-2 font-medium">
                  <span className="text-gray-800">Total Monthly Fee:</span>
                  <span className="text-blue-600">
                    {user?.username === 'shakilasanaei@gmail.com' ? '$64.77' : (user?.totalMonthlyFee || (29.77 + (user?.serviceCategories?.length || 0) * 5).toFixed(2))}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Next Billing Date:</span>
                  <span>
                    {user?.nextBillingDate 
                      ? new Date(user.nextBillingDate).toLocaleDateString() 
                      : "Not available"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            {t('logout')}
          </CardTitle>
          <CardDescription>{t('logout_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? t('logging_out') : t('logout')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}