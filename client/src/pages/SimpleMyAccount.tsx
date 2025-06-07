import { useAuth } from "@/hooks/use-auth";
import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "@/hooks/useLanguage";
import { Loader2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { Redirect, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";

export default function SimpleMyAccount() {
  const { user, isLoading, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAccountManagement, setShowAccountManagement] = useState(false);
  const [showAdditionalServices, setShowAdditionalServices] = useState(true);
  
  // Handle language context safely
  const langContext = useContext(LanguageContext);
  const t = langContext?.t || ((key: string) => key);

  // FORCE COMPLETE REFRESH EVERY TIME
  useEffect(() => {
    // Nuclear option - clear everything and reload
    queryClient.clear();
    queryClient.invalidateQueries();
    
    // If coming from service addition, force page reload
    const serviceAdded = localStorage.getItem('serviceJustAdded');
    if (serviceAdded) {
      localStorage.removeItem('serviceJustAdded');
      window.location.reload();
    }
  }, []);
  
  // Additional refresh on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/provider-login" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // Clear all local storage and redirect to home
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      },
      onError: (error) => {
        console.error("Logout error:", error);
        // Even if there's an error, try to redirect
        window.location.href = "/";
      }
    });
  };

  const handleReturnHome = () => {
    setLocation('/');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Top Navigation Buttons */}
      <div className="flex justify-end space-x-4 mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Log Out
        </button>

      </div>
      
      <h1 className="text-3xl font-bold mb-8 text-center">
        {t('my_account')}
      </h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Basic Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-base">{user.fullName || user.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-base">{user.email || user.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-base">{user.phone || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">States</label>
                <p className="text-base">
                  {Array.isArray(user.statesServiced) && user.statesServiced.length > 0 
                    ? user.statesServiced.join(', ')
                    : user.stateLocation || "Not specified"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Languages</label>
                <p className="text-base">
                  {Array.isArray(user.languagesSpoken) && user.languagesSpoken.length > 0 
                    ? user.languagesSpoken.join(', ')
                    : "English"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Years of Experience</label>
                <p className="text-base">{user.yearsExperience ? `${user.yearsExperience} years` : "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Categories */}
        {user.isProfessional && (
          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Service Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Add Service</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Add a new expertise to your professional profile. Each additional service costs $5/month.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  To add a new expertise to your professional profile, use our dedicated service selection page. Each additional expertise costs $5/month on top of your base fee.
                </p>
                <button 
                  onClick={() => window.location.href = '/add-service-category'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>+</span> Add New Expertise
                </button>
              </div>

              {/* Current Services */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Current Services</h3>
                <div className="space-y-3">
                  {user.serviceCategories && user.serviceCategories.length > 0 ? (
                    <>
                      {/* Main Service - Always Visible */}
                      {user.serviceCategories.map((service, index) => 
                        service === user.serviceCategory && (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-blue-50 border-blue-200">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{service}</span>
                              <Badge className="bg-blue-600 text-white text-xs">Main Service</Badge>
                            </div>
                          </div>
                        )
                      )}
                      
                      {/* Additional Services - Hideable */}
                      {user.serviceCategories.filter(service => service !== user.serviceCategory).length > 0 && (
                        <>
                          <div className="flex items-center justify-between">
                            <h4 className="text-md font-medium text-gray-700">
                              Additional Services ({user.serviceCategories.filter(service => service !== user.serviceCategory).length})
                            </h4>
                            <button
                              onClick={() => setShowAdditionalServices(!showAdditionalServices)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                            >
                              {showAdditionalServices ? (
                                <>
                                  <EyeOff className="h-4 w-4" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4" />
                                  Show
                                </>
                              )}
                            </button>
                          </div>
                          
                          {showAdditionalServices && (
                            <div className="space-y-2">
                              {user.serviceCategories
                                .filter(service => service !== user.serviceCategory)
                                .map((service, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 border-gray-200">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{service}</span>
                                    </div>
                                    <button className="text-red-500 hover:text-red-700 text-xl font-bold">
                                      ×
                                    </button>
                                  </div>
                                ))}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      No additional services added yet
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Fee */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Monthly Fee:</h3>
                    <p className="text-sm text-gray-600">
                      Base fee: $29.77 + ${user.serviceCategories ? (user.serviceCategories.length - 1) * 5 : 0} for additional services
                    </p>
                  </div>
                  <div className="text-xl font-bold">
                    ${user.totalMonthlyFee || (29.77 + (user.serviceCategories ? (user.serviceCategories.length - 1) * 5 : 0)).toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Billing History */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-blue-50 transition-colors py-3"
            onClick={() => setShowBillingHistory(!showBillingHistory)}
          >
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-blue-700">Subscription Billing History</CardTitle>
              {showBillingHistory ? (
                <ChevronUp className="h-4 w-4 text-blue-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-blue-600" />
              )}
            </div>
          </CardHeader>
          {showBillingHistory && (
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                View your recent subscription payments and billing information.
              </div>
              
              {/* Current Subscription Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Current Subscription</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    Active
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Monthly Fee:</span>
                    <span className="ml-2 font-medium">${user.totalMonthlyFee || (() => {
                      const baseAmount = 29.77;
                      const serviceCategories = user.serviceCategories || [];
                      const additionalServices = Math.max(0, serviceCategories.length - 1);
                      const additionalFee = additionalServices * 5;
                      return (baseAmount + additionalFee).toFixed(2);
                    })()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Next Billing:</span>
                    <span className="ml-2">{user.nextBillingDate ? new Date(user.nextBillingDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'No billing date set'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Subscription Started:</span>
                    <span className="ml-2">{user.subscriptionStartDate ? new Date(user.subscriptionStartDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'No subscription active'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Billing Cycle:</span>
                    <span className="ml-2">{user.stripeCustomerId && user.subscriptionStatus === 'active' ? 'Monthly' : 'Not active'}</span>
                  </div>
                </div>
              </div>

              {/* Recent Payments */}
              <div>
                <h4 className="font-medium mb-3">Recent Payments</h4>
                <div className="space-y-3">
                  {/* Show message when no actual payment data is available */}
                  <div className="border rounded-lg p-4 text-center bg-gray-50">
                    <div className="text-gray-600 mb-2">
                      <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      No payment history available yet
                    </div>
                    <div className="text-sm text-gray-500">
                      Payment records will appear here once billing begins
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </CardContent>
          )}
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-green-50 transition-colors py-3"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-green-700">Change Password</CardTitle>
              {showChangePassword ? (
                <ChevronUp className="h-4 w-4 text-green-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-green-600" />
              )}
            </div>
          </CardHeader>
          {showChangePassword && (
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value="••••••••••••"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Update Password
              </button>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Account Management */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-red-50 transition-colors py-3"
            onClick={() => setShowAccountManagement(!showAccountManagement)}
          >
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-red-700">Account Management</CardTitle>
              {showAccountManagement ? (
                <ChevronUp className="h-4 w-4 text-red-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </CardHeader>
          {showAccountManagement && (
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Delete My Account</h3>
              <p className="text-gray-600 text-sm mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                Delete My Account
              </button>
            </div>
          </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}