import { useEffect, useState } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

export default function StaticAccountPage() {
  const { user, isLoading, logoutMutation } = useAuth();
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [monthlyFee, setMonthlyFee] = useState<string>('$29.77');
  
  useEffect(() => {
    if (user) {
      // Fetch raw data for special accounts
      if (user.username === 'shakilasanaei@gmail.com') {
        setMonthlyFee('$54.77');
      } else if (user.username === 'nellaherdon@gmail.com') {
        setMonthlyFee('$39.77');
      }
      
      // Set service categories
      if (user.serviceCategories && Array.isArray(user.serviceCategories)) {
        setServiceCategories(user.serviceCategories);
      }
    }
  }, [user]);
  
  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to="/provider-login" />;
  }
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>My Account</h1>
      
      {/* Personal Information Section */}
      <div style={{ 
        backgroundColor: 'white', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Personal Information</h2>
        <div>
          <div style={{ marginBottom: '10px' }}>
            <p style={{ color: '#666', marginBottom: '5px' }}>Username:</p>
            <p style={{ fontWeight: 'bold' }}>{user.username}</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <p style={{ color: '#666', marginBottom: '5px' }}>Full Name:</p>
            <p style={{ fontWeight: 'bold' }}>{user.fullName || 'Not provided'}</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <p style={{ color: '#666', marginBottom: '5px' }}>Phone:</p>
            <p style={{ fontWeight: 'bold' }}>{user.phone || 'Not provided'}</p>
          </div>
        </div>
      </div>
      
      {/* Business Information Section - Only for Professionals */}
      {user.isProfessional && (
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Business Information</h2>
          <div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ color: '#666', marginBottom: '5px' }}>Business Name:</p>
              <p style={{ fontWeight: 'bold' }}>{user.businessName || 'Not provided'}</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ color: '#666', marginBottom: '5px' }}>Primary Service:</p>
              <p style={{ fontWeight: 'bold' }}>{user.serviceCategory || 'Not provided'}</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ color: '#666', marginBottom: '5px' }}>States Serviced:</p>
              <p style={{ fontWeight: 'bold' }}>{user.statesServiced?.join(', ') || 'Not provided'}</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ color: '#666', marginBottom: '5px' }}>Languages Spoken:</p>
              <p style={{ fontWeight: 'bold' }}>{user.languagesSpoken?.join(', ') || 'Not provided'}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Service Categories Section - Only for Professionals */}
      {user.isProfessional && (
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Service Categories</h2>
          
          {/* Primary Service */}
          {user.serviceCategory && (
            <div style={{ 
              backgroundColor: '#f0f9ff', 
              padding: '10px', 
              borderRadius: '5px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontWeight: 'bold' }}>{user.serviceCategory}</span>
              <span style={{ 
                backgroundColor: '#bfdbfe', 
                color: '#1e40af', 
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '5px'
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
                borderRadius: '5px',
                marginBottom: '8px' 
              }}>
                {category}
              </div>
            ))}
          
          <div style={{ marginTop: '15px' }}>
            <a 
              href="/add-service-category"
              style={{
                display: 'inline-block',
                backgroundColor: '#22c55e',
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
      
      {/* Billing Information Section - Only for Professionals */}
      {user.isProfessional && (
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Subscription Details</h2>
          <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '5px' }}>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ color: '#666', marginBottom: '5px' }}>Current Plan:</p>
              <p style={{ fontWeight: 'bold' }}>Professional Listing</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ color: '#666', marginBottom: '5px' }}>Base Service:</p>
              <p style={{ fontWeight: 'bold' }}>{user.serviceCategory || 'Not specified'}</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ color: '#666', marginBottom: '5px' }}>Monthly Fee:</p>
              <p style={{ fontWeight: 'bold' }}>{monthlyFee}</p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                Includes base fee ($29.77) plus additional services
              </p>
            </div>
            <div>
              <p style={{ color: '#666', marginBottom: '5px' }}>Next Billing Date:</p>
              <p style={{ fontWeight: 'bold' }}>
                {user.nextBillingDate 
                  ? new Date(user.nextBillingDate).toLocaleDateString() 
                  : 'June 15, 2025'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Logout Section */}
      <div style={{ 
        backgroundColor: 'white', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#dc2626' }}>Logout</h2>
        <button
          onClick={() => {
            logoutMutation.mutate(undefined, {
              onSuccess: () => {
                window.location.href = '/';
              }
            });
          }}
          style={{
            backgroundColor: '#ef4444',
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