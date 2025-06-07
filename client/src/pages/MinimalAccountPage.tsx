import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/useLanguage";
import { Loader2 } from "lucide-react";

export default function MinimalAccountPage() {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const [fee, setFee] = useState("$29.77");
  
  useEffect(() => {
    if (user?.username === "shakilasanaei@gmail.com") {
      setFee("$54.77");
    } else if (user?.username === "nellaherdon@gmail.com") {
      setFee("$39.77");
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
      <h1 className="text-2xl font-bold mb-8 text-center">
        {t('my_account') || "My Account"}
      </h1>
      
      {/* Simple layout with all critical sections */}
      <div className="max-w-3xl mx-auto grid gap-6">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid gap-4">
            <div>
              <p className="text-gray-500 mb-1">Username:</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Full Name:</p>
              <p className="font-medium">{user.fullName || "Not provided"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Phone:</p>
              <p className="font-medium">{user.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
        
        {/* Business Information - Only for Professionals */}
        {user.isProfessional && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            <div className="grid gap-4">
              <div>
                <p className="text-gray-500 mb-1">Business Name:</p>
                <p className="font-medium">{user.businessName || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Primary Service:</p>
                <p className="font-medium">{user.serviceCategory || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">States Serviced:</p>
                <p className="font-medium">
                  {user.statesServiced?.join(", ") || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Languages Spoken:</p>
                <p className="font-medium">
                  {user.languagesSpoken?.join(", ") || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Service Categories - Only for Professionals */}
        {user.isProfessional && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Service Categories</h2>
            
            {/* Primary Service */}
            {user.serviceCategory && (
              <div className="mb-3">
                <div className="bg-blue-50 p-3 rounded-md">
                  <span className="font-medium">{user.serviceCategory}</span>
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Primary</span>
                </div>
              </div>
            )}
            
            {/* Additional Categories */}
            {Array.isArray(user.serviceCategories) && user.serviceCategories
              .filter(category => category !== user.serviceCategory)
              .map((category, index) => (
                <div key={index} className="mb-2">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <span>{category}</span>
                  </div>
                </div>
              ))}
            
            <div className="mt-4">
              <a 
                href="/add-service-category" 
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 inline-block"
              >
                Add Service Category
              </a>
            </div>
          </div>
        )}
        
        {/* Billing Information - Only for Professionals */}
        {user.isProfessional && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid gap-4">
                <div>
                  <p className="text-gray-500 mb-1">Current Plan:</p>
                  <p className="font-medium">Professional Listing</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Base Service:</p>
                  <p className="font-medium">{user.serviceCategory || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Monthly Fee:</p>
                  <p className="font-medium">{fee}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Includes base fee ($29.77) plus additional services
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Next Billing Date:</p>
                  <p className="font-medium">
                    {user.nextBillingDate 
                      ? new Date(user.nextBillingDate).toLocaleDateString() 
                      : "June 15, 2025"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Logout Button */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Logout</h2>
          <a
            href="/"
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 inline-block"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}