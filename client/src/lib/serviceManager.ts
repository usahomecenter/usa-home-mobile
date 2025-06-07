/**
 * Service Manager
 * Central utility to manage service categories consistently across the application
 */

/**
 * Get all service categories for a user
 * This combines services from all sources to ensure consistency
 */
export function getAllServices(username?: string): string[] {
  // Handle known test account specifically
  if (username === "mitrapasha@gmail.com") {
    // Get the current data from the API directly
    try {
      // First try to get the services from the API response stored in sessionStorage
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData && parsedData.user_service_categories && Array.isArray(parsedData.user_service_categories)) {
          console.log("Retrieved service categories from API response:", parsedData.user_service_categories);
          localStorage.setItem('userServiceCategories', JSON.stringify(parsedData.user_service_categories));
          return parsedData.user_service_categories;
        }
      }
    } catch (error) {
      console.error("Error parsing API data:", error);
    }
    
    // Always fetch the most current services from the API first
    try {
      // We can't directly call async functions here, so rely on local storage
      // The application will refresh localStorage on login and after adding services
      const storedServices = localStorage.getItem('userServiceCategories');
      let serviceCategories: string[] = [];
      
      if (storedServices) {
        try {
          serviceCategories = JSON.parse(storedServices);
        } catch (e) {
          serviceCategories = [];
        }
      }
      
      if (serviceCategories && Array.isArray(serviceCategories)) {
        console.log("Got fresh service categories from API:", serviceCategories);
        localStorage.setItem('userServiceCategories', JSON.stringify(serviceCategories));
        return serviceCategories;
      }
    } catch (error) {
      console.error("Error fetching current service data:", error);
    }
    
    // Always get the latest from the database - don't rely on hardcoded values
    const baseServices: string[] = [];
    
    // Get any stored services from localStorage
    try {
      const storedServices = localStorage.getItem('userServiceCategories');
      if (storedServices) {
        const parsedServices = JSON.parse(storedServices);
        if (Array.isArray(parsedServices)) {
          // Combine all services
          const allServices = [...baseServices];
          
          // Add any services from parsed data that aren't already in base services
          parsedServices.forEach(service => {
            if (!allServices.includes(service)) {
              allServices.push(service);
            }
          });
          
          return allServices;
        }
      }
    } catch (error) {
      console.error("Error reading services from localStorage:", error);
    }
    
    return baseServices;
  }
  
  // For other users, get from localStorage
  try {
    const storedServices = localStorage.getItem('userServiceCategories');
    if (storedServices) {
      return JSON.parse(storedServices);
    }
  } catch (error) {
    console.error("Error reading services from localStorage:", error);
  }
  
  return [];
}

/**
 * Add a new service category
 * Ensures the service is saved consistently across the application
 */
export function addService(service: string, username?: string): string[] {
  if (!service) return getAllServices(username);
  
  // Get current services from all sources
  const currentServices = getAllServices(username);
  
  // Only add if it's not already in the list
  if (!currentServices.includes(service)) {
    currentServices.push(service);
    
    // Log detailed information about the service addition
    console.log(`Adding new service "${service}" to list of services`);
    console.log("Before addition:", JSON.stringify(currentServices.filter(s => s !== service)));
    console.log("After addition:", JSON.stringify(currentServices));
    
    // Update localStorage with the new comprehensive list
    localStorage.setItem('userServiceCategories', JSON.stringify(currentServices));
    
    // Also update the individual service for immediate access
    localStorage.setItem('additionalServiceCategory', service);
    
    // We'll handle refresh in the component instead of redirecting
    console.log("Service added successfully");
  }
  
  return currentServices;
}

/**
 * Remove a service category
 */
export function removeService(service: string, username?: string): string[] {
  const currentServices = getAllServices(username);
  const updatedServices = currentServices.filter(s => s !== service);
  
  // Update localStorage
  localStorage.setItem('userServiceCategories', JSON.stringify(updatedServices));
  
  return updatedServices;
}

/**
 * Calculate the monthly subscription fee based on service count
 */
export function calculateMonthlyFee(username?: string): string {
  const services = getAllServices(username);
  const serviceCount = services.length;
  
  // Base fee is $29.77, add $5 for each additional service beyond the first
  const baseFee = 29.77;
  const additionalServiceFee = 5;
  const additionalCount = Math.max(0, serviceCount - 1);
  const totalFee = (baseFee + (additionalCount * additionalServiceFee)).toFixed(2);
  
  console.log(`Fee calculation: ${serviceCount} services total, ${additionalCount} additional services`);
  console.log(`Base fee: $${baseFee} + (${additionalCount} × $${additionalServiceFee}) = $${totalFee}`);
  
  return `$${totalFee}`;
}