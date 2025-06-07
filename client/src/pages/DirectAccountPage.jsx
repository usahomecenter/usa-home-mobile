import React, { useState, useEffect } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { calculateMonthlyFee, getAllServices } from '@/lib/serviceManager';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function DirectAccountPage() {
  // Basic states
  const { user, isLoading, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [userData, setUserData] = useState(null);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [fee, setFee] = useState("$29.77");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Service operation states
  const [isRemoving, setIsRemoving] = useState(false);
  const [serviceAdded, setServiceAdded] = useState(false);
  
  // Password change states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Fetch data directly from API
  useEffect(() => {
    // Only fetch if user is logged in
    if (user) {
      // Check if there's a service refresh timestamp to force a fresh fetch
      const refreshTimestamp = localStorage.getItem('serviceRefreshTimestamp');
      const headers = {
        'Cache-Control': 'no-cache'
      };
      
      if (refreshTimestamp) {
        // Clear the timestamp after using it
        localStorage.removeItem('serviceRefreshTimestamp');
      }
      
      fetch('/api/user', { 
        credentials: 'include',
        headers
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then(data => {
        console.log("Direct API fetch result:", data);
        setUserData(data);
        setIsDataLoaded(true);
        
        // Store the user data in sessionStorage for service manager to use
        if (data.user_service_categories) {
          sessionStorage.setItem('userData', JSON.stringify(data));
          console.log("Saved user data to sessionStorage with service categories:", data.user_service_categories);
        }
        
        // Get all user service categories from the API response
        let allServices = [];
        
        // Check multiple possible fields for service data - prioritize the array field
        if (data.service_categories && Array.isArray(data.service_categories)) {
          console.log("Using service_categories array from API:", data.service_categories);
          allServices = data.service_categories.filter(service => service);
        } else if (data.serviceCategories && Array.isArray(data.serviceCategories)) {
          console.log("Using serviceCategories from API:", data.serviceCategories);
          allServices = data.serviceCategories.filter(service => service);
        } else if (data.user_service_categories && Array.isArray(data.user_service_categories)) {
          console.log("Using user_service_categories from API:", data.user_service_categories);
          allServices = data.user_service_categories.filter(service => service);
        } else if (data.service_category) {
          // Handle single service category field as fallback
          console.log("Using single service_category from API:", data.service_category);
          allServices = [data.service_category];
        } else {
          // Fallback to service manager
          console.log("Falling back to service manager for user:", user.username);
          allServices = getAllServices(user.username);
        }
        
        // If still empty, make a direct call to get service categories
        if (allServices.length === 0) {
          console.log("No services found, making direct API call for service categories");
          fetch('/api/user-services', { credentials: 'include' })
            .then(response => response.json())
            .then(serviceData => {
              if (serviceData.services && Array.isArray(serviceData.services)) {
                console.log("Retrieved services from dedicated endpoint:", serviceData.services);
                setServiceCategories(serviceData.services);
                localStorage.setItem('userServiceCategories', JSON.stringify(serviceData.services));
              }
            })
            .catch(err => console.error("Error fetching services:", err));
        }
        
        console.log("All services combined:", allServices);
        
        // Ensure we always have an array, even if it's empty
        if (!Array.isArray(allServices)) {
          allServices = [];
        }
        
        setServiceCategories(allServices);
        
        // Save the complete list to localStorage to ensure consistency
        localStorage.setItem('userServiceCategories', JSON.stringify(allServices));
        
        // Calculate fee based on number of services
        const calculatedFee = calculateMonthlyFee(user.username);
        console.log("Calculated fee from service manager:", calculatedFee);
        setFee(calculatedFee);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [user, serviceAdded]);
  
  // Function to handle removing a service
  const handleRemoveService = async (serviceToRemove) => {
    if (isRemoving) return; // Prevent multiple clicks
    
    setIsRemoving(true);
    
    try {
      // Fetch the latest user data first
      const userResponse = await fetch('/api/user', { 
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await userResponse.json();
      
      // Get current services
      const currentServices = userData.user_service_categories || 
        JSON.parse(localStorage.getItem('userServiceCategories') || '[]');
      
      // Filter out the service to remove
      const updatedServices = currentServices.filter(service => service !== serviceToRemove);
      
      // Make API request to update services
      const response = await fetch('/api/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          serviceCategories: updatedServices
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove service');
      }
      
      // Update local state and storage
      localStorage.setItem('userServiceCategories', JSON.stringify(updatedServices));
      sessionStorage.setItem('userData', JSON.stringify({
        ...userData,
        user_service_categories: updatedServices
      }));
      
      setServiceCategories(updatedServices);
      
      // Calculate new fee based on remaining services
      const newFee = ((updatedServices.length - 1) * 5 + 29.77).toFixed(2);
      setFee(`$${newFee}`);
      
      toast({
        title: "Service Removed",
        description: `Successfully removed ${serviceToRemove} from your services.`,
        variant: "default"
      });
      
      // Toggle service added to refresh data
      setServiceAdded(prev => !prev);
    } catch (error) {
      console.error('Error removing service:', error);
      toast({
        title: "Error",
        description: `Failed to remove service: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
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
      const response = await fetch("/api/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(passwordData),
      });
      
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
      toast({
        title: "Error",
        description: "An error occurred while updating password",
        variant: "destructive"
      });
    }
  };
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Redirect to="/provider-login" />;
  }
  
  // Determine if the user is a professional
  const isProfessional = user?.is_professional === true;
  
  // Prepare display data from both user and userData
  const displayData = {
    username: user?.username || userData?.username || '',
    email: user?.email || userData?.email || '',
    full_name: user?.full_name || userData?.full_name || '',
    phone: user?.phone || userData?.phone || '',
    business_name: user?.business_name || userData?.business_name || '',
    service_category: user?.service_category || userData?.service_category || '',
    serviceCategory: user?.serviceCategory || userData?.serviceCategory || '',
    state_location: user?.state_location || userData?.state_location || '',
    stateLocation: user?.stateLocation || userData?.stateLocation || '',
    website_url: user?.website_url || userData?.website_url || '',
    websiteUrl: user?.websiteUrl || userData?.websiteUrl || '',
    is_active: user?.is_active || userData?.is_active || false,
    subscription_status: user?.subscription_status || userData?.subscription_status || 'inactive',
    years_experience: user?.years_experience || userData?.years_experience || 0,
  };
  
  // Styling constants
  const sectionStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    background: 'white'
  };
  
  const titleStyle = {
    fontSize: '20px',
    marginBottom: '15px'
  };
  
  const fieldStyle = {
    marginBottom: '15px'
  };
  
  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block'
  };
  
  const valueStyle = {
    color: '#444'
  };
  
  // Render the account page
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Personal Information</h2>
        
        <div style={fieldStyle}>
          <div style={labelStyle}>Name</div>
          <div style={valueStyle}>{displayData.full_name}</div>
        </div>
        
        <div style={fieldStyle}>
          <div style={labelStyle}>Email</div>
          <div style={valueStyle}>{displayData.email}</div>
        </div>
        
        <div style={fieldStyle}>
          <div style={labelStyle}>Phone</div>
          <div style={valueStyle}>{displayData.phone}</div>
        </div>
        
        {isProfessional && (
          <>
            <div style={fieldStyle}>
              <div style={labelStyle}>Business Name</div>
              <div style={valueStyle}>{displayData.business_name}</div>
            </div>
            
            <div style={fieldStyle}>
              <div style={labelStyle}>State</div>
              <div style={valueStyle}>{displayData.state_location || displayData.stateLocation}</div>
            </div>
            
            <div style={fieldStyle}>
              <div style={labelStyle}>Years of Experience</div>
              <div style={valueStyle}>{displayData.years_experience}</div>
            </div>
          </>
        )}
      </div>
      
      {isProfessional && (
        <div style={sectionStyle}>
          <h2 style={titleStyle}>Service Categories</h2>
          
          {/* Service Addition Component */}
          <Card className="mb-6 shadow-sm border-blue-100">
            <CardContent className="pt-4">
              <h3 className="text-lg font-medium text-blue-700 mb-2">Add Service</h3>
              
              <p className="text-sm text-gray-500 mb-4">
                Add a new expertise to your professional profile. Each additional service costs $5/month.
              </p>
              
              {/* Simple button approach */}
              <div className="space-y-5">
                <p className="text-sm text-gray-600 mb-4">
                  To add a new expertise to your professional profile, use our dedicated service selection page.
                  Each additional expertise costs $5/month on top of your base fee.
                </p>
                
                <Button
                  onClick={() => setLocation('/add-service-category')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add New Expertise
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Current Services List */}
          <div>
            <h3 className="text-lg font-medium mb-4">Your Current Services</h3>
            
            {serviceCategories.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-center">
                You have not added any services yet.
              </div>
            ) : (
              <div className="space-y-2">
                {serviceCategories.map((service, index) => {
                  // Check if this service is the main service for any professional
                  const isMainService = service === userData?.service_category || 
                                      service === user?.serviceCategory || 
                                      service === user?.service_category ||
                                      (serviceCategories.length > 0 && index === 0 && !userData?.service_category && !user?.serviceCategory);
                  
                  return service && (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-md ${
                      isMainService 
                        ? 'bg-blue-100 border-2 border-blue-300 shadow-md' 
                        : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={isMainService ? 'font-semibold text-blue-800' : ''}>{service}</span>
                        {isMainService && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            Main Service
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveService(service)}
                        disabled={isRemoving}
                        className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        {isRemoving ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Monthly Fee:</span>
                <span className="font-bold text-lg">{fee}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Base fee: $29.77 + ${(serviceCategories.length - 1) * 5.00} for additional services
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Account management section */}
      <div style={sectionStyle} className="mt-6">
        <h2 style={titleStyle}>Account Management</h2>
        
        <div className="mb-6">
          <div className="flex flex-col space-y-2">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-2">Delete My Account</h3>
              <p className="text-sm text-gray-500 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button 
                variant="destructive"
                onClick={() => window.location.href = '/data-deletion'}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete My Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section - Password Change */}
      <div style={sectionStyle}>
        <h3 style={titleStyle}>🔒 Security</h3>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Manage your password and account security
        </p>
        
        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit} style={{ marginTop: '20px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Current Password</label>
              <input
                type="text"
                value="••••••••••••••••••••"
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  cursor: 'not-allowed'
                }}
              />
            </div>
            
            <div style={fieldStyle}>
              <label style={labelStyle}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 40px 8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showNewPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div style={fieldStyle}>
              <label style={labelStyle}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 40px 8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button type="submit">Update Password</Button>
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
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button onClick={() => setIsChangingPassword(true)}>
            Change Password
          </Button>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <Button 
          variant="destructive" 
          className="mr-2"
          onClick={() => {
            logoutMutation.mutate(undefined, {
              onSuccess: () => {
                toast({
                  title: "Logged Out",
                  description: "You have been successfully logged out.",
                });
                // Clear ALL storage data to prevent any cross-account contamination
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/';
              },
              onError: (error) => {
                toast({
                  title: "Logout Failed",
                  description: error.message,
                  variant: "destructive",
                });
              }
            });
          }}
        >
          Log Out
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Return to Home
        </Button>
      </div>
    </div>
  );
}

export default DirectAccountPage;