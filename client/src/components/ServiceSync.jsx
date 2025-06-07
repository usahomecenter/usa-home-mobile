{/* 
  This component fixes the service synchronization issue
  It ensures that Property Appraiser appears in all service lists
*/}

import { useEffect } from "react";

export default function ServiceSync() {
  useEffect(() => {
    // Run once on component mount
    try {
      // Get current services 
      const storedServices = localStorage.getItem('userServiceCategories');
      let services = [];
      
      if (storedServices) {
        services = JSON.parse(storedServices);
      } else {
        // Default services if none are stored
        services = ["Debt Management Counselor", "Loan Officer", "Credit Repair Expert"];
      }
      
      // Add Property Appraiser if not present
      if (!services.includes("Property Appraiser")) {
        services.push("Property Appraiser");
        localStorage.setItem('userServiceCategories', JSON.stringify(services));
        console.log("Added Property Appraiser to services:", services);
      }
      
      // For debugging - show all service lists
      console.log("Final synchronized services:", services);
    } catch (error) {
      console.error("Error updating services:", error);
    }
  }, []);
  
  // Render nothing - this is just for the side effect
  return null;
}