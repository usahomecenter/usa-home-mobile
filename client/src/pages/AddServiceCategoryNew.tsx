import { useState, useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import { getAllServices, addService } from "@/lib/serviceManager";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ExistingServicesDisplay from "@/components/ExistingServicesDisplay";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/useLanguage";
import FixedServiceAdder from "@/components/FixedServiceAdder";
import { 
  Loader2, 
  PlusCircle, 
  ChevronRight, 
  CreditCard, 
  CheckCircle,
  User, 
  X, 
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSubcategoryStrings } from "@/lib/subcategoryDefinitions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AddServiceCategoryNew() {
  const { user, isLoading } = useAuth();
  // Create a fallback translation function to prevent errors
  let t = (key: string) => key;
  
  // Try to use the language provider, but don't crash if it's not available
  try {
    const languageContext = useLanguage();
    t = languageContext.t;
  } catch (error) {
    console.log("Language provider not available, using fallback translations");
  }
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [removingCategory, setRemovingCategory] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  
  // State for category selection based on homepage sections
  const [mainSection, setMainSection] = useState("");
  const [primaryCategory, setPrimaryCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [service, setService] = useState("");
  
  // Payment form state
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    zipCode: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Derived states
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  
  // Define main sections matching the homepage buttons
  const mainSections = [
    "Build Home",
    "Design Home",
    "Finance & Real Estate"
  ];

  // If not logged in, redirect to login
  if (!isLoading && !user) {
    return <Redirect to="/login" />;
  }
  
  // Update available categories when main section changes
  useEffect(() => {
    if (mainSection === "Build Home") {
      setAvailableCategories([
        "Construction & Building",
        "MEP (Mechanical, Electrical, Plumbing)",
        "Utilities & Infrastructure",
        "Renewable & Solar",
        "Energy & Building Systems",
        "Environmental & Compliance",
        "Additional Expertise"
      ]);
    } else if (mainSection === "Design Home") {
      setAvailableCategories([
        "Architect",
        "Structural Engineer",
        "Civil Engineer",
        "Urban Planner",
        "Interior Designer",
        "Landscape Architect",
        "Sustainability Consultant"
      ]);
    } else if (mainSection === "Finance & Real Estate") {
      setAvailableCategories([
        "Credit Repair Specialists",
        "Debt Management",
        "Mortgage & Loan Professionals",
        "Construction Finance Experts",
        "Home Improvement Financing",
        "Equity & Refinance Specialists",
        "First Time Buyer Specialist",
        "Real Estate Investment Expert",
        "Real Estate & Property Professionals",
        "Financial & Legal Advisors"
      ]);
    } else {
      setAvailableCategories([]);
    }
    
    // Reset other fields when main section changes
    setPrimaryCategory("");
    setSubCategory("");
    setService("");
  }, [mainSection]);
  
  // Update available subcategories when primary category changes
  useEffect(() => {
    if (primaryCategory) {
      if (mainSection === "Design Home") {
        switch (primaryCategory) {
          case "Architect":
            setAvailableSubCategories([
              "Concept Development",
              "Schematic Design", 
              "Design Development", 
              "Construction Documentation",
              "3D Modeling & Visualization"
            ]);
            break;
          case "Structural Engineer":
            setAvailableSubCategories([
              "Structural Analysis",
              "Material Selection", 
              "Foundation Design", 
              "Seismic & Wind Analysis",
              "Reinforcement Detailing"
            ]);
            break;
          case "Civil Engineer":
            setAvailableSubCategories([
              "Structural Engineering",
              "Site Development", 
              "Transportation Engineering", 
              "Water Resources",
              "Utility Planning"
            ]);
            break;
          case "Urban Planner":
            setAvailableSubCategories([
              "Land Use Planning",
              "Zoning Regulations & compliance", 
              "Community Development Plans", 
              "Transportation Planning",
              "Environmental impact assessment"
            ]);
            break;
          case "Interior Designer":
            setAvailableSubCategories([
              "Space Planning",
              "Furniture & Fixtures Selection", 
              "Material & Finish Selection", 
              "Lighting Design",
              "Acoustical Design"
            ]);
            break;
          case "Landscape Architect":
            setAvailableSubCategories([
              "Site analysis & Master planning",
              "Planting Design", 
              "Hardscape Design", 
              "Irrigation & Drainage Systems",
              "Sustainable Landscape Design"
            ]);
            break;
          case "Sustainability Consultant":
            setAvailableSubCategories([
              "LEED Certification consulting",
              "Renewable Energy integration", 
              "Building Envelope Optimization", 
              "Energy Modeling & Simulations",
              "Green Materials & Construction Practices"
            ]);
            break;
          default:
            setAvailableSubCategories([primaryCategory]);
        }
      } else if (mainSection === "Build Home") {
        switch (primaryCategory) {
          case "Construction & Building":
            setAvailableSubCategories([
              "General Contractor",
              "Foundation Specialist", 
              "Structural Steel & Framing", 
              "Masonry & Bricklayer",
              "Carpentry",
              "Welding & Material Fabrication",
              "Roofing & Cladding",
              "Window & Door Installer",
              "Insulation Contractor",
              "Drywall & Plasterer",
              "Flooring Specialist",
              "Painter & Sprayer",
              "Cabinetmaker & Millworker",
              "Pool Builder",
              "Gardening & Landscaping Expert"
            ]);
            break;
          case "MEP (Mechanical, Electrical, Plumbing)":
            setAvailableSubCategories([
              "HVAC Technician",
              "Electrician", 
              "Plumber"
            ]);
            break;
          case "Utilities & Infrastructure":
            setAvailableSubCategories([
              "Utility Connection Spy",
              "Septic System Expert"
            ]);
            break;
          case "Renewable & Solar":
            setAvailableSubCategories([
              "Solar Installer",
              "Solar Designer"
            ]);
            break;
          case "Energy & Building Systems":
            setAvailableSubCategories([
              "Home Automation Specialist"
            ]);
            break;
          case "Environmental & Compliance":
            setAvailableSubCategories([
              "LEED Consultant",
              "Environmental Impact Assessor"
            ]);
            break;
          case "Insulation & Weatherization":
            setAvailableSubCategories([
              "Insulation Contractor",
              "Weatherization Expert", 
              "Energy Efficiency Consultant", 
              "Spray Foam Specialist"
            ]);
            break;
          case "Exterior Finishing Specialists":
            setAvailableSubCategories([
              "Siding Contractor",
              "Window Installer", 
              "Door Installer", 
              "Stucco Specialist",
              "Stone Veneer Installer",
              "Exterior Painter"
            ]);
            break;
          case "Interior Finishing Specialists":
            setAvailableSubCategories([
              "Drywall Contractor",
              "Finish Carpenter", 
              "Trim Carpenter", 
              "Interior Painter",
              "Tile Installer",
              "Flooring Installer",
              "Cabinetry Specialist"
            ]);
            break;
          case "General Contractors":
            setAvailableSubCategories([
              "General Contractor",
              "Construction Manager", 
              "Design-Build Contractor", 
              "Custom Home Builder",
              "Renovation Specialist"
            ]);
            break;
          case "Additional Expertise":
            setAvailableSubCategories([
              "Security System Installer",
              "Locksmith",
              "Soundproofing Specialist",
              "Accessibility Expert",
              "Pest Control Professional",
              "Waste Management & Recycling Coordinator",
              "Metal Work & Welding Specialist"
            ]);
            break;
          default:
            // Use the category itself as the subcategory
            setAvailableSubCategories([primaryCategory]);
        }
      } else if (mainSection === "Design Home") {
        switch (primaryCategory) {
          case "Architect":
            setAvailableSubCategories([
              "Concept Development",
              "Schematic Design", 
              "Design Development", 
              "Construction Documentation",
              "3D Modeling & Visualization"
            ]);
            break;
          case "Structural Engineer":
            setAvailableSubCategories([
              "Structural Analysis",
              "Material Selection", 
              "Foundation Design", 
              "Seismic & Wind Analysis",
              "Reinforcement Detailing"
            ]);
            break;
          case "Civil Engineer":
            setAvailableSubCategories([
              "Structural Engineering",
              "Site Development", 
              "Transportation Engineering", 
              "Water Resources",
              "Utility Planning"
            ]);
            break;
          case "Urban Planner":
            setAvailableSubCategories([
              "Land Use Planning",
              "Zoning Regulations & compliance", 
              "Community Development Plans", 
              "Transportation Planning",
              "Environmental impact assessment"
            ]);
            break;
          case "Interior Designer":
            setAvailableSubCategories([
              "Space Planning",
              "Furniture & Fixtures Selection", 
              "Material & Finish Selection", 
              "Lighting Design",
              "Acoustical Design"
            ]);
            break;
          case "Landscape Architect":
            setAvailableSubCategories([
              "Site Analysis & Master Planning",
              "Planting Design", 
              "Hardscape Design", 
              "Irrigation & Drainage Systems",
              "Sustainable Landscape Design"
            ]);
            break;
          case "Sustainability Consultant":
            setAvailableSubCategories([
              "LEED Certification consulting",
              "Renewable Energy integration", 
              "Building Envelope Optimization", 
              "Energy Modeling & Simulations",
              "Green Materials & Construction Practices"
            ]);
            break;
          default:
            // Use the category itself as the subcategory
            setAvailableSubCategories([primaryCategory]);
        }
      } else if (mainSection === "Finance & Real Estate") {
        switch (primaryCategory) {
          case "Credit Repair Specialists":
            setAvailableSubCategories([
              "Credit Repair Expert",
              "Credit Score Analyst", 
              "Credit Rebuilding Advisor"
            ]);
            break;
          case "Debt Management":
            setAvailableSubCategories([
              "Debt Management Counselor",
              "Debt Settlement Negotiator", 
              "Debt Consolidation Advisor"
            ]);
            break;
          case "Mortgage & Loan Professionals":
            setAvailableSubCategories([
              "Mortgage Broker",
              "Loan Officer", 
              "Mortgage Banker", 
              "FHA Loan Specialist"
            ]);
            break;
          case "Construction Finance Experts":
            setAvailableSubCategories([
              "Construction Loan Specialist",
              "Building Project Financier", 
              "Architectural Finance Consultant", 
              "Constructor Finance Advisor"
            ]);
            break;
          case "Home Improvement Financing":
            setAvailableSubCategories([
              "Renovation Loan Specialist",
              "Home Improvement Financial Advisor", 
              "HELOC Specialist", 
              "Green Improvement Financier"
            ]);
            break;
          case "Equity & Refinance Specialists":
            setAvailableSubCategories([
              "Refinance Specialist",
              "Equity Release Consultant", 
              "Cash-out Refinance Specialist"
            ]);
            break;
          case "First Time Buyer Specialist":
            setAvailableSubCategories([
              "First-time Homebuyer Counselor",
              "Down Payment Assistance Specialist", 
              "Affordable Housing Consultant"
            ]);
            break;
          case "Real Estate Investment Expert":
            setAvailableSubCategories([
              "Investment Property Specialist",
              "REIT Advisor", 
              "Property Portfolio Manager", 
              "Real Estate Investment Consultant"
            ]);
            break;
          case "Real Estate & Property Professionals":
            setAvailableSubCategories([
              "Real Estate Agent",
              "Property Appraiser", 
              "Escrow Officer", 
              "Real Estate Attorney"
            ]);
            break;
          case "Financial & Legal Advisors":
            setAvailableSubCategories([
              "Financial Planner",
              "Property Tax Consultant", 
              "Estate Planning Attorney", 
              "Investment Advisor",
              "Tax Specialist"
            ]);
            break;
          default:
            // Use the category itself as the subcategory
            setAvailableSubCategories([primaryCategory]);
        }
      } else {
        setAvailableSubCategories([]);
      }
    } else {
      setAvailableSubCategories([]);
    }
    
    // Reset subcategory and service when primary category changes
    setSubCategory("");
    setService("");
  }, [primaryCategory, mainSection]);
  
  // Just store user category as needed for new service addition
  const [currentCategories, setCurrentCategories] = useState<string[]>([]);
  const [showServiceList, setShowServiceList] = useState(false);
  
  // Update available services when subcategory changes
  useEffect(() => {
    if (subCategory) {
      if (mainSection === "Finance & Real Estate") {
        // For finance, the subcategory is the service
        setService(subCategory);
      } else {
        // For other categories like Build, use subcategory as service
        setService(subCategory);
      }
      
      // Debug message when a service is selected
      console.log(`Selected service: ${subCategory}`);
      console.log(`Current services: ${currentCategories.join(', ')}`);
    } else {
      setService("");
    }
  }, [subCategory, primaryCategory, mainSection, currentCategories]);
  
  // This effect will run whenever user data changes
  useEffect(() => {
    // Reset categories list
    let categories: string[] = [];
    
    if (user) {
      console.log("User logged in, loading service categories");
      
      // First include the primary service category
      if (user?.serviceCategory) {
        categories.push(user.serviceCategory);
      }
      
      // Then add any additional categories from the serviceCategories array
      if (user?.serviceCategories && Array.isArray(user.serviceCategories)) {
        user.serviceCategories.forEach(category => {
          // Only add if it's not already in the array (avoid duplicates)
          if (category && !categories.includes(category)) {
            categories.push(category);
          }
        });
      }
    }
    
    // Log for debugging before setting state
    console.log("Setting categories:", categories);
    
    // Update the state with all found categories
    setCurrentCategories(categories);
  }, [user?.username, user?.serviceCategory, user?.serviceCategories]);
  
  // Force a refresh of the user data when the component mounts
  useEffect(() => {
    // Fetch fresh data when component loads
    const refreshData = async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      console.log("User data refreshed");
    };
    
    refreshData();
  }, []);
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error for this field
    setErrors({
      ...errors,
      [name]: ''
    });
    
    // Special handling for card number to format with spaces
    if (name === 'cardNumber') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // Detect card type and set appropriate limit
      let maxDigits = 16; // Default for most cards
      if (/^3[47]/.test(digitsOnly)) {
        maxDigits = 15; // American Express
      }
      
      // Limit digits based on card type
      const truncated = digitsOnly.slice(0, maxDigits);
      
      // Format based on card type
      let formatted = '';
      if (/^3[47]/.test(truncated)) {
        // American Express: 4-6-5 format
        for (let i = 0; i < truncated.length; i++) {
          if (i === 4 || i === 10) {
            formatted += ' ';
          }
          formatted += truncated[i];
        }
      } else {
        // Other cards: 4-4-4-4 format
        for (let i = 0; i < truncated.length; i++) {
          if (i > 0 && i % 4 === 0) {
            formatted += ' ';
          }
          formatted += truncated[i];
        }
      }
      
      setFormData({
        ...formData,
        [name]: formatted
      });
    } else if (name === 'expirationDate') {
      // Auto-format expiration date with slash
      const digitsOnly = value.replace(/\D/g, '');
      let formatted = '';
      
      if (digitsOnly.length >= 2) {
        formatted = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4);
      } else {
        formatted = digitsOnly;
      }
      
      setFormData({
        ...formData,
        [name]: formatted
      });
    } else if (name === 'zipCode') {
      // Allow only exactly 5 digits for zip code
      const digitsOnly = value.replace(/\D/g, '');
      const truncated = digitsOnly.slice(0, 5);
      
      setFormData({
        ...formData,
        [name]: truncated
      });
    } else if (name === 'cvc') {
      // CVV validation: 3 digits for most cards, 4 for Amex
      const digitsOnly = value.replace(/\D/g, '');
      const currentCardNumber = formData.cardNumber.replace(/\s/g, '');
      const isAmex = /^3[47]/.test(currentCardNumber);
      const maxCvcDigits = isAmex ? 4 : 3;
      const truncated = digitsOnly.slice(0, maxCvcDigits);
      
      setFormData({
        ...formData,
        [name]: truncated
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  // Validate the payment form
  const validatePaymentForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name on card is required';
    }
    
    // Remove spaces for validation
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else {
      // Validate based on card type
      const isAmex = /^3[47]/.test(cardNumberDigits);
      const expectedLength = isAmex ? 15 : 16;
      const cardTypeName = isAmex ? 'American Express' : 'card';
      
      if (cardNumberDigits.length !== expectedLength) {
        newErrors.cardNumber = `${cardTypeName} number must be ${expectedLength} digits`;
      }
    }
    
    if (!formData.expirationDate.trim()) {
      newErrors.expirationDate = 'Expiration date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expirationDate)) {
      newErrors.expirationDate = 'Expiration date must be in MM/YY format';
    }
    
    if (!formData.cvc.trim()) {
      newErrors.cvc = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = 'CVC must be 3 or 4 digits';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    
    // Form is valid if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle service category selection form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If no subcategory is selected, show a warning but don't proceed
    if (!subCategory) {
      toast({
        title: "No Service Selected",
        description: "Please select a service to add before proceeding to payment.",
        variant: "destructive"
      });
      return;
    }
    
    // Store the selected service category in localStorage to ensure it persists
    // This helps prevent "No Service Selected" errors during payment processing
    localStorage.setItem('pendingServiceCategory', subCategory);
    console.log("Selected service:", subCategory);
    
    // Check if the subcategory is already in their categories
    if (currentCategories.includes(subCategory)) {
      toast({
        title: "Already Listed",
        description: `You are already listed as a ${subCategory} professional`,
        variant: "destructive"
      });
      
      // Show the Already Listed UI instead of continuing
      localStorage.setItem('alreadyListedCategory', subCategory);
      setLocation("/already-listed");
      return;
    }
    
    // Check for similar categories to prevent duplicate/related listings
    const similarServiceDetected = currentCategories.some(cat => {
      // Check if either string contains the other
      return (
        cat.toLowerCase().includes(subCategory.toLowerCase().replace(/s$/, '')) || 
        subCategory.toLowerCase().includes(cat.toLowerCase().replace(/s$/, ''))
      ) && cat !== subCategory;
    });
    
    if (similarServiceDetected) {
      toast({
        title: "Similar Service Detected",
        description: "You already offer a similar service category",
        variant: "destructive"
      });
      
      // Show the Already Listed UI instead of continuing
      localStorage.setItem('alreadyListedCategory', subCategory);
      setLocation("/already-listed");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Store the new service category in localStorage for payment processing and immediate display
      localStorage.setItem('additionalServiceCategory', subCategory);
      
      // Add to the full list of services using the central service manager
      try {
        // Use the service manager to add the service consistently across the application
        const updatedServices = addService(subCategory, user?.username);
        console.log("Service added through service manager:", subCategory);
        console.log("Updated service list:", updatedServices);
      } catch (error) {
        console.error("Error updating service categories:", error);
      }
      
      // Store the user's original primary service category
      if (user && user.serviceCategory) {
        localStorage.setItem('originalPrimaryService', user.serviceCategory);
      }
      
      // Instead of redirecting, show the payment form directly on this page
      setShowPaymentForm(true);
      setIsSubmitting(false);
      
    } catch (error) {
      toast({
        title: "Failed to Add Category",
        description: "There was an error adding the new service category",
        variant: "destructive"
      });
      console.error("Error adding service category:", error);
      setIsSubmitting(false);
    }
  };
  
  // Handle payment form submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate payment form
    if (!validatePaymentForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get the actual selected service from the form
      // Check all possible sources in order of specificity
      let serviceToAdd = "";
      
      // First check if we have a directly selected service 
      if (service && service.trim() !== "") {
        serviceToAdd = service;
      } 
      // Then check if we have a selected subcategory
      else if (subCategory && subCategory.trim() !== "") {
        serviceToAdd = subCategory;
      }
      // Then check if we selected a main category + primary category combination
      else if (primaryCategory && primaryCategory.trim() !== "") {
        // Create a service name from the category
        serviceToAdd = primaryCategory;
      }
      // Last resort check for anything in localStorage
      else {
        const storedService = localStorage.getItem('additionalServiceCategory') || 
                              localStorage.getItem('pendingServiceCategory');
        if (storedService) {
          serviceToAdd = storedService;
        }
      }
      
      // If we still don't have a service, show an error and exit
      if (!serviceToAdd) {
        toast({
          title: "Service Selection Required",
          description: "Please select a service category before proceeding to payment.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log("Selected service:", serviceToAdd);
      
      // Store it in localStorage for good measure
      localStorage.setItem('additionalServiceCategory', serviceToAdd);
      localStorage.setItem('pendingServiceCategory', serviceToAdd);
      
      const originalPrimaryService = localStorage.getItem('originalPrimaryService');
      
      // Simply use the retrieved service for the remainder of this function
      // We don't need setState since we're using the variable directly
      
      // Important - directly define the service being added from the category selection
      const additionalServiceCategory = serviceToAdd;
      
      // Prepare the data to be sent to the server
      const paymentData = {
        // Payment details (in a real app, process with Stripe/etc)
        cardDetails: {
          name: formData.name,
          // Only send the last 4 digits for security
          last4: formData.cardNumber.replace(/\s/g, '').slice(-4),
          expirationDate: formData.expirationDate,
          zipCode: formData.zipCode
        },
        additionalServiceCategory, // The field that was missing in the error
        originalPrimaryService: originalPrimaryService || null,
        // Add "skipPaymentCheck" flag to force direct addition 
        // This ensures the service is added right away without payment check
        skipPaymentCheck: true,
        // Make sure we're using the correct service count for fee calculation
        forceRecalculateFees: true
      };
      
      // DON'T update local state until server confirms success
      // This prevents the $89.77 pricing flash when clicking "Complete Payment"
      
      console.log("Sending service category data:", paymentData);
      
      // Make the API request to add a new service category
      const response = await apiRequest("POST", "/api/add-service-category", paymentData);
      
      if (response.ok) {
        const result = await response.json();
        
        console.log("Service category addition result:", result);
        
        // Update our local service categories list to include the new service
        if (additionalServiceCategory) {
          // Make a direct database call to get the latest service categories
          console.log("Refreshing service categories after successful addition");
          
          // First update our local state
          if (!currentCategories.includes(additionalServiceCategory)) {
            const updatedCategories = [...currentCategories, additionalServiceCategory];
            console.log("Updating local service categories to:", updatedCategories);
            setCurrentCategories(updatedCategories);
            
            // Update localStorage for immediate access across pages
            localStorage.setItem('userServiceCategories', JSON.stringify(updatedCategories));
          }
          
          // Get the updated service categories directly from the API response
          if (result.serviceCategories && Array.isArray(result.serviceCategories)) {
            console.log("Saving API response service categories to localStorage:", result.serviceCategories);
            localStorage.setItem('userServiceCategories', JSON.stringify(result.serviceCategories));
            localStorage.setItem('serviceRefreshTimestamp', Date.now().toString());
          }
          
          // Clear any cached user data to force fresh fetch
          sessionStorage.removeItem('userData');
          
          // Then force the auth context to refresh
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
            console.log("User data refreshed after adding service");
          }, 500);
          
          // Clear localStorage cache after successful service addition to ensure fresh data
          console.log("Cleared localStorage after successful service addition");
        }
        
        // Invalidate all user-related queries to ensure data is fresh
        await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        
        // Show success message with accurate service count
        const serviceCount = result.serviceCategories ? result.serviceCategories.length : 0;
        const additionalCount = Math.max(0, serviceCount - 1);
        const totalFee = (29.77 + (additionalCount * 5)).toFixed(2);
        
        toast({
          title: "Service Added Successfully",
          description: `You are now listed as a professional with ${serviceCount} services in total. Your monthly subscription will be $${result.totalMonthlyFee.toFixed(2)} starting from your next billing date.`,
        });
        
        // Set flag to indicate service was just added for My Account page refresh
        localStorage.setItem('serviceJustAdded', 'true');
        localStorage.setItem('newServiceCount', serviceCount.toString());
        localStorage.setItem('newTotalFee', result.totalMonthlyFee.toFixed(2));
        
        setPaymentSuccess(true);
        
        // Don't clear localStorage immediately to allow other components to detect the addition
        // We'll clear them after a timeout to ensure components have time to read the new service
        setTimeout(() => {
          localStorage.removeItem('additionalServiceCategory');
          localStorage.removeItem('originalPrimaryService');
          console.log("Cleared localStorage after successful service addition");
        }, 10000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process payment");
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment",
        variant: "destructive"
      });
      console.error("Payment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle removing a service category
  const handleRemoveCategory = async (category: string) => {
    if (!category) return;
    
    setRemovingCategory(category);
    setIsRemoving(true);
    
    try {
      const response = await apiRequest("POST", "/api/remove-service-category", {
        categoryToRemove: category
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Show success message
        toast({
          title: "Service Category Removed",
          description: result.message,
        });
        
        // Force a refresh to update the user object
        window.location.href = "/my-account";
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove service category");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error removing the service category",
        variant: "destructive"
      });
      console.error("Error removing service category:", error);
    } finally {
      setRemovingCategory("");
      setIsRemoving(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 md:p-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-fade-in">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <CardTitle className="text-2xl md:text-3xl mb-4 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Service Added Successfully!
              </CardTitle>
              
              <CardDescription className="text-base md:text-lg text-gray-700 mb-4 max-w-lg">
                Your additional service category has been added to your professional profile. Your profile will now appear in searches for this service.
              </CardDescription>
              
              <div className="mb-8 bg-green-50 p-3 rounded-lg border border-green-100 max-w-lg">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Service added successfully!</span> The additional $5 fee for this service will be applied on your next billing date. No immediate payment has been processed.
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={async () => {
                    // FORCE COMPLETE CACHE RESET
                    queryClient.clear();
                    await queryClient.invalidateQueries();
                    await queryClient.refetchQueries({ queryKey: ["/api/user"] });
                    localStorage.setItem('serviceJustAdded', 'true');
                    // Force page reload to ensure fresh data
                    window.location.href = "/my-account";
                  }}
                  className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Go to My Account
                </Button>
                
                <Button
                  onClick={() => setLocation("/")}
                  variant="outline"
                  className="px-6"
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Card className="max-w-5xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                {showPaymentForm ? "Complete Your Payment" : "Add Service Category"}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                {showPaymentForm 
                  ? "Enter your payment details to complete your service listing" 
                  : "Add additional service categories to expand your professional profile"}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/user"] });
                setLocation("/my-account");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Current service categories - now hideable */}
          {currentCategories.length > 0 && (
            <div className="mb-8 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-lg text-gray-800">Your Current Service Categories ({currentCategories.length})</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowServiceList(!showServiceList)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {showServiceList ? "Hide" : "Show"}
                </Button>
              </div>
              {showServiceList && (
                <div className="space-y-3">
                  {currentCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-green-500'} mr-3`}></div>
                      <span className="font-medium">{category}</span>
                      {index === 0 && <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Primary</span>}
                    </div>
                    
                    {/* Remove category button with confirmation */}
                    {currentCategories.length > 1 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                            disabled={isRemoving}
                          >
                            {isRemoving && removingCategory === category ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Service Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove "{category}" from your services? 
                              This will update your monthly billing on your next billing date.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleRemoveCategory(category)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))}
                
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex items-center text-blue-700">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Your primary service cannot be removed. You must maintain at least one active service.</span>
                  </div>
                </div>
              </div>
              )}
            </div>
          )}

          {!showPaymentForm ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Category Selection */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl text-blue-800 mb-6 flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5 text-blue-600" />
                  Add New Service Category
                </h3>
                
                <div className="space-y-5">
                  {/* Main Section */}
                  <div className="space-y-3">
                    <Label htmlFor="mainSection" className="text-gray-700 font-medium">
                      <span className="inline-flex items-center text-blue-700">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-bold flex items-center justify-center mr-2">1</span>
                        Select Main Section
                      </span>
                    </Label>
                    <Select value={mainSection} onValueChange={setMainSection}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a main section" />
                      </SelectTrigger>
                      <SelectContent>
                        {mainSections.map((section) => (
                          <SelectItem key={section} value={section}>
                            {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Primary Category */}
                  <div className="space-y-3">
                    <Label htmlFor="primaryCategory" className="text-gray-700 font-medium">
                      <span className="inline-flex items-center text-blue-700">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-bold flex items-center justify-center mr-2">2</span>
                        Select Category
                      </span>
                    </Label>
                    <Select 
                      value={primaryCategory} 
                      onValueChange={setPrimaryCategory}
                      disabled={!mainSection}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Subcategory */}
                  <div className="space-y-3">
                    <Label htmlFor="subcategory" className="text-gray-700 font-medium">
                      <span className="inline-flex items-center text-blue-700">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-bold flex items-center justify-center mr-2">3</span>
                        Select Service Type
                      </span>
                    </Label>
                    <Select 
                      value={subCategory} 
                      onValueChange={setSubCategory}
                      disabled={!primaryCategory}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubCategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ["/api/user"] });
                    setLocation("/my-account");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={() => {
                    // Validate that a service is actually selected
                    if (!subCategory || !subCategory.trim()) {
                      toast({
                        title: "Service Selection Required",
                        description: "Please select a service category before proceeding to payment.",
                        variant: "destructive"
                      });
                      return;
                    }
                    
                    // Check if the service is already in their current categories
                    if (currentCategories.includes(subCategory)) {
                      toast({
                        title: "Already Listed",
                        description: `You are already listed as a ${subCategory} professional`,
                        variant: "destructive"
                      });
                      return;
                    }
                    
                    // If validation passes, proceed to payment
                    setShowPaymentForm(true);
                  }}
                  disabled={!subCategory}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 h-auto text-sm sm:text-base whitespace-normal min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment {subCategory ? `for ${subCategory}` : ''}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Payment Information Section */}
              <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl text-blue-800 mb-6 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                  Payment Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-5">
                    {/* Name on Card */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">Name on Card</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Smith"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Card Number */}
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-gray-700 font-medium">Card Number</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={errors.cardNumber ? "border-red-500" : ""}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Expiration Date */}
                      <div className="space-y-2">
                        <Label htmlFor="expirationDate" className="text-gray-700 font-medium">Expiration</Label>
                        <Input
                          id="expirationDate"
                          name="expirationDate"
                          placeholder="MM/YY"
                          value={formData.expirationDate}
                          onChange={handleInputChange}
                          className={errors.expirationDate ? "border-red-500" : ""}
                        />
                        {errors.expirationDate && (
                          <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>
                        )}
                      </div>
                      
                      {/* CVC */}
                      <div className="space-y-2">
                        <Label htmlFor="cvc" className="text-gray-700 font-medium">CVC</Label>
                        <Input
                          id="cvc"
                          name="cvc"
                          placeholder="123"
                          value={formData.cvc}
                          onChange={handleInputChange}
                          className={errors.cvc ? "border-red-500" : ""}
                        />
                        {errors.cvc && (
                          <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Zip Code */}
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-gray-700 font-medium">Zip Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="12345"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={errors.zipCode ? "border-red-500" : ""}
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Terms & Conditions */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="agreeToTerms" 
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, agreeToTerms: checked as boolean})
                      }
                    />
                    <Label 
                      htmlFor="agreeToTerms"
                      className={`text-sm ${errors.agreeToTerms ? "text-red-500" : ""}`}
                    >
                      I agree to the terms of service and privacy policy
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>
              
              {/* Payment information */}
              {(subCategory || service) && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h4 className="font-semibold text-blue-800">Subscription Details</h4>
                      <p className="text-sm text-gray-600">Adding: {subCategory || service}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Charged on Next Billing Cycle
                        </span>
                      </div>
                    </div>
                    <div className="text-right mt-2 md:mt-0">
                      <p className="text-sm text-gray-600">Base fee: $29.77/month</p>
                      <p className="text-sm text-gray-600">
                        Current services ({currentCategories.length}): ${currentCategories.length > 1 ? ((currentCategories.length - 1) * 5).toFixed(2) : '0.00'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Adding 1 service: +$5.00
                      </p>
                      <p className="font-bold text-blue-800">
                        New Total: ${(29.77 + ((currentCategories.length - 1 + 1) * 5)).toFixed(2)}/month
                      </p>
                      <p className="text-xs text-blue-700 font-medium mt-1">
                        Additional $5.00 will be charged on your next billing date
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPaymentForm(false)}
                >
                  Back to Service Selection
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Payment
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}