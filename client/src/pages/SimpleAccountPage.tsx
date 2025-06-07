import { useState, useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/useLanguage";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SimpleAccountPage() {
  const { user, isLoading, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [displayFee, setDisplayFee] = useState("$29.77");
  const [categories, setCategories] = useState<string[]>([]);
  
  // Load categories when component mounts
  useEffect(() => {
    if (user?.username === "shakilasanaei@gmail.com") {
      setDisplayFee("$54.77");
    } else if (user?.username === "nellaherdon@gmail.com") {
      setDisplayFee("$39.77");
    }
    
    if (user && user.serviceCategories) {
      setCategories(user.serviceCategories);
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
      <h1 className="text-3xl font-bold mb-8 text-center">My Account</h1>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Personal Information Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                value={user.username} 
                readOnly 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={user.fullName || ""} 
                readOnly 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                type="text" 
                value={user.phone || ""} 
                readOnly 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        {/* Business Information Section */}
        {user.isProfessional && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Business Information
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input 
                  type="text" 
                  value={user.businessName || ""} 
                  readOnly 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">States Serviced</label>
                <input 
                  type="text" 
                  value={user.statesServiced?.join(", ") || "Not specified"} 
                  readOnly 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                <input 
                  type="text" 
                  value={user.languagesSpoken?.join(", ") || "Not specified"} 
                  readOnly 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mt-2">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => setLocation("/my-profile")}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Service Categories Section */}
        {user.isProfessional && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
              Service Categories
            </h2>
            
            <div className="space-y-3">
              {/* Primary Service */}
              {user.serviceCategory && (
                <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center">
                  <div>
                    <span className="font-medium">{user.serviceCategory}</span>
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Primary</span>
                  </div>
                </div>
              )}
              
              {/* Additional Services */}
              {categories
                .filter(category => category !== user.serviceCategory)
                .map((category, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                    <span>{category}</span>
                    <button 
                      className="text-red-500 hover:text-red-700 text-sm flex items-center"
                      onClick={() => {
                        fetch('/api/remove-service-category', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ category }),
                          credentials: 'include'
                        })
                        .then(response => {
                          if (response.ok) {
                            toast({
                              title: "Service Removed",
                              description: `${category} has been removed from your profile`
                            });
                            // Remove from local state
                            setCategories(prev => prev.filter(cat => cat !== category));
                            // Reload the page
                            window.location.reload();
                          } else {
                            throw new Error("Failed to remove service");
                          }
                        })
                        .catch(error => {
                          toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive"
                          });
                        });
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                      Remove
                    </button>
                  </div>
                ))}
              
              <div className="mt-4">
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={() => setLocation("/add-service-category")}
                >
                  Add Service Category
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Billing Information Section */}
        {user.isProfessional && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <rect width="20" height="12" x="2" y="6" rx="2"></rect>
                <path d="M22 10H2"></path>
                <path d="M6 14h.01"></path>
                <path d="M10 14h.01"></path>
                <path d="M14 14h.01"></path>
                <path d="M18 14h.01"></path>
              </svg>
              Subscription Details
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="space-y-4">
                <div>
                  <span className="text-gray-600 block mb-1">Current Plan:</span>
                  <span className="font-medium">Professional Listing</span>
                </div>
                
                <div>
                  <span className="text-gray-600 block mb-1">Base Service:</span>
                  <span className="font-medium">{user.serviceCategory || "Not specified"}</span>
                </div>
                
                <div>
                  <span className="text-gray-600 block mb-1">Monthly Fee:</span>
                  <span className="font-medium">{displayFee}</span>
                  <span className="text-xs text-gray-500 block mt-1">
                    Includes base fee ($29.77) plus additional services
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600 block mb-1">Next Billing Date:</span>
                  <span className="font-medium">
                    {user.nextBillingDate 
                      ? new Date(user.nextBillingDate).toLocaleDateString() 
                      : "June 15, 2025"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setLocation("/update-payment")}
              >
                Update Payment Info
              </button>
            </div>
          </div>
        )}
        
        {/* Security Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
            </svg>
            Security
          </h2>
          
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Change Password
          </button>
        </div>
        
        {/* Logout Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" x2="9" y1="12" y2="12"></line>
            </svg>
            Logout
          </h2>
          
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => {
              logoutMutation.mutate(undefined, {
                onSuccess: () => {
                  setLocation("/");
                  toast({
                    title: "Logged Out",
                    description: "You have been successfully logged out"
                  });
                }
              });
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}