import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/useLanguage";
import { Loader2 } from "lucide-react";

export default function BasicAccountPage() {
  const { user, isLoading, logoutMutation } = useAuth();
  const { t } = useLanguage();
  
  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }
  
  if (!user) {
    return <Redirect to="/provider-login" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => window.location.href = "/"
    });
  };
  
  const fee = user.username === "shakilasanaei@gmail.com" ? "$54.77" : 
              user.username === "nellaherdon@gmail.com" ? "$39.77" : 
              "$29.77";
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">My Account</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-500">Username:</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-gray-500">Full Name:</p>
              <p className="font-medium">{user.fullName || "Not provided"}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone:</p>
              <p className="font-medium">{user.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
        
        {/* Business Information */}
        {user.isProfessional && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500">Business Name:</p>
                <p className="font-medium">{user.businessName || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-500">Primary Service:</p>
                <p className="font-medium">{user.serviceCategory || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-500">States Serviced:</p>
                <p className="font-medium">
                  {user.statesServiced?.join(", ") || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Languages Spoken:</p>
                <p className="font-medium">
                  {user.languagesSpoken?.join(", ") || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Service Categories */}
        {user.isProfessional && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Service Categories</h2>
            
            {/* Primary Service */}
            {user.serviceCategory && (
              <div className="mb-3">
                <div className="bg-blue-50 p-3 rounded-md flex items-center">
                  <span className="font-medium flex-grow">{user.serviceCategory}</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Primary</span>
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
                className="inline-block px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Add Service Category
              </a>
            </div>
          </div>
        )}
        
        {/* Billing Information */}
        {user.isProfessional && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
            <div className="bg-gray-50 p-4 rounded-md space-y-3">
              <div>
                <p className="text-gray-500">Current Plan:</p>
                <p className="font-medium">Professional Listing</p>
              </div>
              <div>
                <p className="text-gray-500">Base Service:</p>
                <p className="font-medium">{user.serviceCategory || "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-500">Monthly Fee:</p>
                <p className="font-medium">{fee}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Includes base fee ($29.77) plus additional services
                </p>
              </div>
              <div>
                <p className="text-gray-500">Next Billing Date:</p>
                <p className="font-medium">
                  {user.nextBillingDate 
                    ? new Date(user.nextBillingDate).toLocaleDateString() 
                    : "June 15, 2025"}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Logout */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Logout</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}