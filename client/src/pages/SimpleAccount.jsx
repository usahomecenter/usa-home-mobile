import React from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

export default function SimpleAccount() {
  const { user, isLoading, logoutMutation } = useAuth();
  
  if (isLoading) {
    return <div style={{textAlign: 'center', padding: '20px'}}>Loading...</div>;
  }
  
  if (!user) {
    return <Redirect to="/provider-login" />;
  }
  
  // Special fee handling
  const displayFee = user.username === 'shakilasanaei@gmail.com' ? '$54.77' : 
                    user.username === 'nellaherdon@gmail.com' ? '$39.77' : 
                    '$29.77';
                    
  // Determine service categories
  const serviceCategories = Array.isArray(user.serviceCategories) ? 
                           user.serviceCategories : [];
  
  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
      <h1 style={{textAlign: 'center', marginBottom: '30px', fontSize: '24px'}}>My Account</h1>
      
      {/* PERSONAL INFORMATION */}
      <div style={{marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <h2 style={{marginBottom: '20px', fontSize: '20px'}}>Personal Information</h2>
        <div style={{marginBottom: '10px'}}>
          <p style={{color: 'gray', marginBottom: '5px'}}>Username:</p>
          <p style={{fontWeight: 'bold'}}>{user.username}</p>
        </div>
        <div style={{marginBottom: '10px'}}>
          <p style={{color: 'gray', marginBottom: '5px'}}>Full Name:</p>
          <p style={{fontWeight: 'bold'}}>{user.fullName || "Not provided"}</p>
        </div>
        <div style={{marginBottom: '10px'}}>
          <p style={{color: 'gray', marginBottom: '5px'}}>Phone:</p>
          <p style={{fontWeight: 'bold'}}>{user.phone || "Not provided"}</p>
        </div>
      </div>
      
      {/* BUSINESS INFORMATION */}
      {user.isProfessional && (
        <div style={{marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h2 style={{marginBottom: '20px', fontSize: '20px'}}>Business Information</h2>
          <div style={{marginBottom: '10px'}}>
            <p style={{color: 'gray', marginBottom: '5px'}}>Business Name:</p>
            <p style={{fontWeight: 'bold'}}>{user.businessName || "Not provided"}</p>
          </div>
          <div style={{marginBottom: '10px'}}>
            <p style={{color: 'gray', marginBottom: '5px'}}>Primary Service:</p>
            <p style={{fontWeight: 'bold'}}>{user.serviceCategory || "Not provided"}</p>
          </div>
          <div style={{marginBottom: '10px'}}>
            <p style={{color: 'gray', marginBottom: '5px'}}>States Serviced:</p>
            <p style={{fontWeight: 'bold'}}>{user.statesServiced?.join(", ") || "Not provided"}</p>
          </div>
          <div style={{marginBottom: '10px'}}>
            <p style={{color: 'gray', marginBottom: '5px'}}>Languages Spoken:</p>
            <p style={{fontWeight: 'bold'}}>{user.languagesSpoken?.join(", ") || "Not provided"}</p>
          </div>
        </div>
      )}
      
      {/* SERVICE CATEGORIES */}
      {user.isProfessional && (
        <div style={{marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h2 style={{marginBottom: '20px', fontSize: '20px'}}>Service Categories</h2>
          
          {/* Primary Service */}
          {user.serviceCategory && (
            <div style={{
              backgroundColor: '#f0f9ff', 
              padding: '10px', 
              borderRadius: '8px', 
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{fontWeight: 'bold'}}>{user.serviceCategory}</span>
              <span style={{
                backgroundColor: '#dbeafe', 
                color: '#1e40af', 
                fontSize: '12px', 
                padding: '3px 8px',
                borderRadius: '4px'
              }}>Primary</span>
            </div>
          )}
          
          {/* Additional Services */}
          {serviceCategories
            .filter(category => category !== user.serviceCategory)
            .map((category, index) => (
              <div key={index} style={{
                backgroundColor: '#f9fafb',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                {category}
              </div>
            ))}
            
          <div style={{marginTop: '15px'}}>
            <a 
              href="/add-service-category"
              style={{
                display: 'inline-block',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              Add Service Category
            </a>
          </div>
        </div>
      )}
      
      {/* SUBSCRIPTION DETAILS */}
      {user.isProfessional && (
        <div style={{marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h2 style={{marginBottom: '20px', fontSize: '20px'}}>Subscription Details</h2>
          <div style={{backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px'}}>
            <div style={{marginBottom: '10px'}}>
              <p style={{color: 'gray', marginBottom: '5px'}}>Current Plan:</p>
              <p style={{fontWeight: 'bold'}}>Professional Listing</p>
            </div>
            <div style={{marginBottom: '10px'}}>
              <p style={{color: 'gray', marginBottom: '5px'}}>Base Service:</p>
              <p style={{fontWeight: 'bold'}}>{user.serviceCategory || "Not specified"}</p>
            </div>
            <div style={{marginBottom: '10px'}}>
              <p style={{color: 'gray', marginBottom: '5px'}}>Monthly Fee:</p>
              <p style={{fontWeight: 'bold'}}>{displayFee}</p>
              <p style={{fontSize: '12px', color: 'gray', marginTop: '3px'}}>
                Includes base fee ($29.77) plus additional services
              </p>
            </div>
            <div>
              <p style={{color: 'gray', marginBottom: '5px'}}>Next Billing Date:</p>
              <p style={{fontWeight: 'bold'}}>
                {user.nextBillingDate 
                  ? new Date(user.nextBillingDate).toLocaleDateString() 
                  : "June 15, 2025"}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* LOGOUT */}
      <div style={{marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <h2 style={{marginBottom: '20px', fontSize: '20px', color: '#ef4444'}}>Logout</h2>
        <button
          onClick={() => {
            logoutMutation.mutate(undefined, {
              onSuccess: () => {
                window.location.href = "/";
              }
            });
          }}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}