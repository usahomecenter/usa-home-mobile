import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, User, Building2, Tag, CreditCard, LogOut } from "lucide-react";

// Simple streamlined account page
export default function FinalAccountPage() {
  const { user, isLoading, logoutMutation } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [fee, setFee] = useState("$29.77");
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    if (user) {
      // Set fee based on username
      if (user.username === "shakilasanaei@gmail.com") {
        setFee("$54.77");
      } else if (user.username === "nellaherdon@gmail.com") {
        setFee("$39.77");
      }
      
      // Fetch the latest user data from the API
      fetch('/api/user', { 
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' } 
      })
        .then(response => response.json())
        .then(data => {
          console.log("API User Data:", data);
          setUserData(data);
          
          // Process service categories
          if (data.service_categories) {
            const cats = Array.isArray(data.service_categories) 
              ? data.service_categories 
              : typeof data.service_categories === 'string'
                ? data.service_categories.split(',').map((c: string) => c.trim())
                : [];
                
            console.log("Setting service categories:", cats);
            setCategories(cats);
          }
        })
        .catch(err => console.error("Error fetching user data:", err));
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
  
  // Combine data from both sources
  const displayName = userData?.full_name || user.fullName || user.username;
  const isProfessional = userData?.is_professional || user.isProfessional;
  const primaryService = userData?.service_category || user.serviceCategory;
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Account</h1>
      
      <div className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-blue-500" />
            <h2 className="text-xl font-bold">Personal Information</h2>
          </div>
          
          <div className="grid gap-4">
            <div>
              <p className="text-gray-500 text-sm">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="font-medium">{displayName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-medium">{userData?.phone || user.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
        
        {/* Business Info */}
        {isProfessional && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="text-green-500" />
              <h2 className="text-xl font-bold">Business Information</h2>
            </div>
            
            <div className="grid gap-4">
              <div>
                <p className="text-gray-500 text-sm">Business Name</p>
                <p className="font-medium">{userData?.business_name || user.businessName || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">States Serviced</p>
                <p className="font-medium">
                  {userData?.states_serviced 
                    ? (Array.isArray(userData.states_serviced) 
                        ? userData.states_serviced.join(", ") 
                        : userData.states_serviced)
                    : (user.statesServiced?.join(", ") || "Not provided")}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Languages Spoken</p>
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
        {isProfessional && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="text-purple-500" />
              <h2 className="text-xl font-bold">Service Categories</h2>
            </div>
            
            {/* Primary Service */}
            {primaryService && (
              <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center mb-3">
                <p className="font-medium">{primaryService}</p>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Primary</span>
              </div>
            )}
            
            {/* Additional Categories */}
            <div className="space-y-2 mb-4">
              {categories
                .filter(cat => cat !== primaryService)
                .map((category, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-md">
                    {category}
                  </div>
                ))
              }
            </div>
            
            <a 
              href="/add-service-category"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Service Category
            </a>
          </div>
        )}
        
        {/* Subscription */}
        {isProfessional && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-amber-500" />
              <h2 className="text-xl font-bold">Subscription Details</h2>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Current Plan</p>
                  <p className="font-medium">Professional Listing</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Base Service</p>
                  <p className="font-medium">{primaryService || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Monthly Fee</p>
                  <p className="font-medium">{userData?.total_monthly_fee || fee}</p>
                  <p className="text-xs text-gray-500 mt-1">Includes base fee ($29.77) plus additional services</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Next Billing Date</p>
                  <p className="font-medium">
                    {userData?.next_billing_date 
                      ? new Date(userData.next_billing_date).toLocaleDateString() 
                      : user.nextBillingDate 
                        ? new Date(user.nextBillingDate).toLocaleDateString() 
                        : "June 15, 2025"}
                  </p>
                </div>
              </div>
            </div>
            
            <a 
              href="/update-payment"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Update Payment Info
            </a>
          </div>
        )}
        
        {/* Logout */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <LogOut className="text-red-500" />
            <h2 className="text-xl font-bold text-red-500">Logout</h2>
          </div>
          
          <button
            onClick={() => {
              logoutMutation.mutate(undefined, {
                onSuccess: () => window.location.href = "/"
              });
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}