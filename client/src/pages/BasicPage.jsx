import React, { useState, useEffect } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

function BasicPage() {
  const { user, isLoading, logoutMutation } = useAuth();
  const [fee, setFee] = useState("$29.77");
  
  const [serviceCategories, setServiceCategories] = useState([]);
  const [isPageReady, setIsPageReady] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Special fee handling
      if (user.username === "shakilasanaei@gmail.com") {
        setFee("$54.77");
      } else if (user.username === "nellaherdon@gmail.com") {
        setFee("$39.77");
      }
      
      // Log user data to help with debugging
      console.log("User data:", user);
      console.log("Service categories:", user.serviceCategories);
      
      // Fix: Use raw userData to access service_categories and modify the user object
      fetch('/api/user', { credentials: 'include' })
        .then(response => response.json())
        .then(rawData => {
          console.log("Raw API data:", rawData);
          
          // Create an array of service categories from the raw API response
          if (rawData.service_categories) {
            const servicesList = typeof rawData.service_categories === 'string' 
              ? rawData.service_categories.split(',') 
              : (Array.isArray(rawData.service_categories) 
                  ? rawData.service_categories 
                  : []);
            
            console.log("Extracted service categories:", servicesList);
            
            // Store in state instead of modifying user object directly
            setServiceCategories(servicesList);
            
            // Also set as property on user object for compatibility
            user.serviceCategories = servicesList;
          }
          
          // Mark page as ready to render
          setIsPageReady(true);
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          setIsPageReady(true); // Still mark as ready even if there's an error
        });
    }
  }, [user]);
  
  if (isLoading || !isPageReady) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        height: '100vh'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 2s linear infinite',
        }}>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to="/provider-login" />;
  }
  
  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
      <h1 style={{textAlign: 'center', marginBottom: '20px', fontSize: '24px'}}>My Account</h1>
      
      {/* PERSONAL INFO */}
      <div style={{border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '20px', background: 'white'}}>
        <h2 style={{fontSize: '20px', marginBottom: '15px'}}>Personal Information</h2>
        <div>
          <div style={{marginBottom: '10px'}}>
            <div style={{color: '#666', marginBottom: '4px'}}>Username:</div>
            <div style={{fontWeight: 'bold'}}>{user.username}</div>
          </div>
          <div style={{marginBottom: '10px'}}>
            <div style={{color: '#666', marginBottom: '4px'}}>Full Name:</div>
            <div style={{fontWeight: 'bold'}}>{user.fullName || "Not specified"}</div>
          </div>
          <div>
            <div style={{color: '#666', marginBottom: '4px'}}>Phone:</div>
            <div style={{fontWeight: 'bold'}}>{user.phone || "Not specified"}</div>
          </div>
        </div>
      </div>
      
      {/* BUSINESS INFO */}
      {user.isProfessional && (
        <div style={{border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '20px', background: 'white'}}>
          <h2 style={{fontSize: '20px', marginBottom: '15px'}}>Business Information</h2>
          <div>
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#666', marginBottom: '4px'}}>Business Name:</div>
              <div style={{fontWeight: 'bold'}}>{user.businessName || "Not specified"}</div>
            </div>
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#666', marginBottom: '4px'}}>Primary Service:</div>
              <div style={{fontWeight: 'bold'}}>{user.serviceCategory || "Not specified"}</div>
            </div>
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#666', marginBottom: '4px'}}>States Serviced:</div>
              <div style={{fontWeight: 'bold'}}>{user.statesServiced?.join(", ") || "Not specified"}</div>
            </div>
            <div>
              <div style={{color: '#666', marginBottom: '4px'}}>Languages Spoken:</div>
              <div style={{fontWeight: 'bold'}}>{user.languagesSpoken?.join(", ") || "Not specified"}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* SERVICE CATEGORIES */}
      {user.isProfessional && (
        <div style={{border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '20px', background: 'white'}}>
          <h2 style={{fontSize: '20px', marginBottom: '15px'}}>Service Categories</h2>
          
          {/* Primary Service */}
          {user.serviceCategory && (
            <div style={{
              background: '#f0f9ff', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{fontWeight: 'bold'}}>{user.serviceCategory}</span>
              <span style={{
                background: '#bfdbfe',
                color: '#1e40af',
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                Primary
              </span>
            </div>
          )}
          
          {/* Additional Services */}
          {Array.isArray(serviceCategories) && 
            serviceCategories
              .filter(category => category !== user.serviceCategory)
              .map((category, index) => (
                <div key={index} style={{
                  background: '#f9fafb',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '8px'
                }}>
                  {category}
                </div>
              ))
          }
          
          <div style={{marginTop: '15px'}}>
            <a 
              href="/add-service-category"
              style={{
                display: 'inline-block',
                background: '#22c55e',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '5px',
                textDecoration: 'none'
              }}
            >
              Add Service Category
            </a>
          </div>
        </div>
      )}
      
      {/* BILLING DETAILS */}
      {user.isProfessional && (
        <div style={{border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '20px', background: 'white'}}>
          <h2 style={{fontSize: '20px', marginBottom: '15px'}}>Subscription Details</h2>
          <div style={{background: '#f9fafb', padding: '15px', borderRadius: '5px'}}>
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#666', marginBottom: '4px'}}>Current Plan:</div>
              <div style={{fontWeight: 'bold'}}>Professional Listing</div>
            </div>
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#666', marginBottom: '4px'}}>Base Service:</div>
              <div style={{fontWeight: 'bold'}}>{user.serviceCategory || "Not specified"}</div>
            </div>
            <div style={{marginBottom: '10px'}}>
              <div style={{color: '#666', marginBottom: '4px'}}>Monthly Fee:</div>
              <div style={{fontWeight: 'bold'}}>{fee}</div>
              <div style={{fontSize: '12px', color: '#666', marginTop: '2px'}}>
                Includes base fee ($29.77) plus additional services
              </div>
            </div>
            <div>
              <div style={{color: '#666', marginBottom: '4px'}}>Next Billing Date:</div>
              <div style={{fontWeight: 'bold'}}>
                {user.nextBillingDate 
                  ? new Date(user.nextBillingDate).toLocaleDateString() 
                  : "June 15, 2025"}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* LOGOUT */}
      <div style={{border: '1px solid #ccc', borderRadius: '8px', padding: '20px', background: 'white'}}>
        <h2 style={{fontSize: '20px', marginBottom: '15px', color: '#dc2626'}}>Logout</h2>
        <button
          onClick={() => {
            logoutMutation.mutate(undefined, {
              onSuccess: () => {
                window.location.href = "/";
              }
            });
          }}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default BasicPage;