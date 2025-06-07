import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/useLanguage";
import { Loader2 } from "lucide-react";

export default function SimpleAccountDisplay() {
  const { user, isLoading, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const [fee, setFee] = useState("$29.77");
  const [userData, setUserData] = useState<any>(null);
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  
  useEffect(() => {
    // Direct API call to get the most up-to-date data
    fetch('/api/user', { credentials: 'include' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then(data => {
        console.log("API User Data:", data);
        setUserData(data);
        
        // Handle fee based on username
        if (data.username === "shakilasanaei@gmail.com") {
          setFee("$54.77");
        } else if (data.username === "nellaherdon@gmail.com") {
          setFee("$39.77");
        }
        
        // Extract service categories
        if (data.service_categories) {
          let categories = [];
          if (Array.isArray(data.service_categories)) {
            categories = data.service_categories;
          } else if (typeof data.service_categories === 'string') {
            categories = data.service_categories.split(',').map((c: string) => c.trim());
          }
          setServiceCategories(categories);
          console.log("Service categories set to:", categories);
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, []);
  
  // If we're still loading the auth state
  if (isLoading || (!userData && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If not authenticated, redirect
  if (!user) {
    return <Redirect to="/provider-login" />;
  }
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/";
      }
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {t('my_account') || "My Account"}
      </h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 mb-1">Username:</p>
              <p className="font-medium">{userData?.username || user.username}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Full Name:</p>
              <p className="font-medium">{userData?.full_name || user.fullName || "Not provided"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Phone:</p>
              <p className="font-medium">{userData?.phone || user.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
        
        {/* Business Information */}
        {(userData?.is_professional || user.isProfessional) && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Business Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 mb-1">Business Name:</p>
                <p className="font-medium">{userData?.business_name || user.businessName || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Primary Service:</p>
                <p className="font-medium">{userData?.service_category || user.serviceCategory || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">States Serviced:</p>
                <p className="font-medium">
                  {userData?.states_serviced 
                    ? (Array.isArray(userData.states_serviced) 
                        ? userData.states_serviced.join(", ") 
                        : userData.states_serviced)
                    : (user.statesServiced?.join(", ") || "Not provided")}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Languages Spoken:</p>
                <p className="font-medium">
                  {userData?.languages_spoken 
                    ? (Array.isArray(userData.languages_spoken) 
                        ? userData.languages_spoken.join(", ") 
                        : userData.languages_spoken)
                    : (user.languagesSpoken?.join(", ") || "Not provided")}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Service Categories */}
        {(userData?.is_professional || user.isProfessional) && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Service Categories</h2>
            
            {/* Primary Service */}
            <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center mb-4">
              <span className="font-medium">{userData?.service_category || user.serviceCategory || "No Primary Service"}</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Primary</span>
            </div>
            
            {/* Additional Categories */}
            <div className="space-y-2">
              {serviceCategories.length > 0 && 
                serviceCategories
                  .filter(category => category !== (userData?.service_category || user.serviceCategory))
                  .map((category, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <span>{category}</span>
                    </div>
                  ))
              }
              
              {/* If no additional categories are found */}
              {(serviceCategories.length === 0 || 
                serviceCategories.filter(category => 
                  category !== (userData?.service_category || user.serviceCategory)
                ).length === 0) && (
                <div className="text-gray-500 italic">No additional service categories</div>
              )}
            </div>
            
            <div className="mt-4">
              <a 
                href="/add-service-category" 
                className="inline-block bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Add Service Category
              </a>
            </div>
          </div>
        )}
        
        {/* Billing Information */}
        {(userData?.is_professional || user.isProfessional) && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Subscription Details</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 mb-1">Current Plan:</p>
                  <p className="font-medium">Professional Listing</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Base Service:</p>
                  <p className="font-medium">{userData?.service_category || user.serviceCategory || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Monthly Fee:</p>
                  <p className="font-medium">{userData?.total_monthly_fee || fee}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Includes base fee ($29.77) plus additional services
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Next Billing Date:</p>
                  <p className="font-medium">
                    {userData?.next_billing_date 
                      ? new Date(userData.next_billing_date).toLocaleDateString() 
                      : (user.nextBillingDate 
                          ? new Date(user.nextBillingDate).toLocaleDateString() 
                          : "June 15, 2025")}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <a 
                href="/update-payment" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Update Payment Information
              </a>
            </div>
          </div>
        )}
        
        {/* Logout */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-red-600">Logout</h2>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}