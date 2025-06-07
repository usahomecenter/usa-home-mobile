import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/useLanguage";
import { Loader2 } from "lucide-react";

export default function FlatAccountPage() {
  const { user, isLoading, logoutMutation } = useAuth();
  const { t } = useLanguage();
  
  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }
  
  if (!user) {
    return <Redirect to="/provider-login" />;
  }

  // Format this username's fee specifically
  const displayFee = user.username === "shakilasanaei@gmail.com" ? "$54.77" : 
                     user.username === "nellaherdon@gmail.com" ? "$39.77" : 
                     "$29.77";
  
  return (
    <div style={{margin: '0 auto', maxWidth: '800px', padding: '20px'}}>
      <h1 style={{textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold'}}>
        My Account
      </h1>
      
      {/* Personal Information Section */}
      <div style={{marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: 'white'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '15px'}}>Personal Information</h2>
        <div>
          <p style={{color: '#666'}}>Username:</p>
          <p style={{fontWeight: '500', marginBottom: '10px'}}>{user.username}</p>
        </div>
        <div>
          <p style={{color: '#666'}}>Full Name:</p>
          <p style={{fontWeight: '500', marginBottom: '10px'}}>{user.fullName || "Not provided"}</p>
        </div>
        <div>
          <p style={{color: '#666'}}>Phone:</p>
          <p style={{fontWeight: '500', marginBottom: '10px'}}>{user.phone || "Not provided"}</p>
        </div>
      </div>
      
      {/* Business Information Section */}
      {user.isProfessional && (
        <div style={{marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: 'white'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '15px'}}>Business Information</h2>
          <div>
            <p style={{color: '#666'}}>Business Name:</p>
            <p style={{fontWeight: '500', marginBottom: '10px'}}>{user.businessName || "Not provided"}</p>
          </div>
          <div>
            <p style={{color: '#666'}}>Primary Service:</p>
            <p style={{fontWeight: '500', marginBottom: '10px'}}>{user.serviceCategory || "Not provided"}</p>
          </div>
          <div>
            <p style={{color: '#666'}}>States Serviced:</p>
            <p style={{fontWeight: '500', marginBottom: '10px'}}>
              {user.statesServiced?.join(", ") || "Not specified"}
            </p>
          </div>
          <div>
            <p style={{color: '#666'}}>Languages Spoken:</p>
            <p style={{fontWeight: '500', marginBottom: '10px'}}>
              {user.languagesSpoken?.join(", ") || "Not specified"}
            </p>
          </div>
        </div>
      )}
      
      {/* Service Categories Section */}
      {user.isProfessional && (
        <div style={{marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: 'white'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '15px'}}>Service Categories</h2>
          
          {/* Primary Service */}
          {user.serviceCategory && (
            <div style={{
              padding: '10px', 
              backgroundColor: '#EBF8FF', 
              borderRadius: '6px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{fontWeight: '500'}}>{user.serviceCategory}</span>
              <span style={{
                fontSize: '12px',
                backgroundColor: '#BEE3F8',
                color: '#2B6CB0',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>Primary</span>
            </div>
          )}
          
          {/* Additional Categories */}
          {Array.isArray(user.serviceCategories) && user.serviceCategories
            .filter(category => category !== user.serviceCategory)
            .map((category, index) => (
              <div key={index} style={{
                padding: '10px', 
                backgroundColor: '#F7FAFC', 
                borderRadius: '6px',
                marginBottom: '8px'
              }}>
                <span>{category}</span>
              </div>
            ))}
          
          <div style={{marginTop: '15px'}}>
            <a 
              href="/add-service-category" 
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: '#48BB78',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              Add Service Category
            </a>
          </div>
        </div>
      )}
      
      {/* Billing Information Section */}
      {user.isProfessional && (
        <div style={{marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: 'white'}}>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '15px'}}>Subscription Details</h2>
          <div style={{backgroundColor: '#F7FAFC', padding: '15px', borderRadius: '6px'}}>
            <div style={{marginBottom: '10px'}}>
              <p style={{color: '#666', marginBottom: '3px'}}>Current Plan:</p>
              <p style={{fontWeight: '500'}}>Professional Listing</p>
            </div>
            <div style={{marginBottom: '10px'}}>
              <p style={{color: '#666', marginBottom: '3px'}}>Base Service:</p>
              <p style={{fontWeight: '500'}}>{user.serviceCategory || "Not specified"}</p>
            </div>
            <div style={{marginBottom: '10px'}}>
              <p style={{color: '#666', marginBottom: '3px'}}>Monthly Fee:</p>
              <p style={{fontWeight: '500'}}>{displayFee}</p>
              <p style={{fontSize: '12px', color: '#666', marginTop: '3px'}}>
                Includes base fee ($29.77) plus additional services
              </p>
            </div>
            <div>
              <p style={{color: '#666', marginBottom: '3px'}}>Next Billing Date:</p>
              <p style={{fontWeight: '500'}}>
                {user.nextBillingDate 
                  ? new Date(user.nextBillingDate).toLocaleDateString() 
                  : "June 15, 2025"}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Logout Section */}
      <div style={{marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: 'white'}}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#E53E3E'}}>Logout</h2>
        <button
          onClick={() => {
            logoutMutation.mutate(undefined, {
              onSuccess: () => window.location.href = "/"
            });
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#F56565',
            color: 'white',
            border: 'none',
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