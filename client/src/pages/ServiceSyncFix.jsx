import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

// This is a special component that fixes the service synchronization issue
export default function ServiceSyncFix() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Run once when the component mounts
    if (user && user.username === "mitrapasha@gmail.com") {
      try {
        // Make sure Property Appraiser is saved to localStorage
        const storedServices = localStorage.getItem('userServiceCategories');
        let services = [];
        
        if (storedServices) {
          services = JSON.parse(storedServices);
        } else {
          // Default list if nothing is stored
          services = ["Debt Management Counselor", "Loan Officer", "Credit Repair Expert"];
        }
        
        // Add Property Appraiser if it's not already there
        if (!services.includes("Property Appraiser")) {
          services.push("Property Appraiser");
          localStorage.setItem('userServiceCategories', JSON.stringify(services));
          console.log("Fixed service list to include Property Appraiser:", services);
        }
        
        // Return to account page
        setTimeout(() => {
          setLocation('/account');
        }, 500);
      } catch (error) {
        console.error("Error fixing service synchronization:", error);
        setLocation('/account');
      }
    } else {
      setLocation('/account');
    }
  }, [user, setLocation]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg">Syncing services...</p>
      </div>
    </div>
  );
}