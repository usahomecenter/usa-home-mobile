import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { PlusCircle, X } from "lucide-react";

type ProfessionalPaymentProps = {
  service: string;
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const ProfessionalPayment = ({ service, navState, setNavState }: ProfessionalPaymentProps) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // State for additional service categories
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [additionalServiceInput, setAdditionalServiceInput] = useState("");
  
  // Check if the user is coming from adding an additional service category
  useEffect(() => {
    const additionalServiceCategory = localStorage.getItem('additionalServiceCategory');
    const originalPrimaryService = localStorage.getItem('originalPrimaryService');
    
    if (additionalServiceCategory) {
      // If we have an original primary service, use that instead of the current service parameter
      // which might be incorrectly set to the additional service
      if (originalPrimaryService) {
        // Override the service prop with the real primary service
        // NOTE: We can't directly modify the service prop, but we'll handle this in the UI rendering
        localStorage.setItem('realPrimaryService', originalPrimaryService);
        
        // Add the new service as an additional one
        if (additionalServiceCategory !== originalPrimaryService) {
          setAdditionalServices(prev => {
            if (!prev.includes(additionalServiceCategory)) {
              return [...prev, additionalServiceCategory];
            }
            return prev;
          });
        }
      } else {
        // Legacy flow - if no originalPrimaryService is stored
        if (additionalServiceCategory !== service) {
          setAdditionalServices(prev => {
            if (!prev.includes(additionalServiceCategory)) {
              return [...prev, additionalServiceCategory];
            }
            return prev;
          });
        }
      }
      
      // Clear the stored values after using them
      localStorage.removeItem('additionalServiceCategory');
      // Keep originalPrimaryService in storage for potential future use
    }
  }, [service]);
  
  // Main sections for organization
  const mainSections = [
    "Build Home",
    "Design Home",
    "Finance & Real Estate"
  ];
  
  // Use static data for categories organized by main sections
  const staticCategories = [
    // BUILD HOME
    { id: 1, section: "Build Home", name: "Construction & Building" },
    { id: 2, section: "Build Home", name: "MEP (Mechanical, Electrical, Plumbing)" },
    { id: 3, section: "Build Home", name: "Utilities & Infrastructure" },
    // DESIGN HOME
    { id: 4, section: "Design Home", name: "Design & Planning" },
    { id: 5, section: "Design Home", name: "Interior & Furnishing" },
    { id: 6, section: "Design Home", name: "Outdoor & Landscaping" },
    // FINANCE & REAL ESTATE - Matched with Finance homepage subcategories
    { id: 7, section: "Finance & Real Estate", name: "Credit Repair Specialists" },
    { id: 8, section: "Finance & Real Estate", name: "Debt Management" },
    { id: 9, section: "Finance & Real Estate", name: "Mortgage & Loan Professionals" },
    { id: 10, section: "Finance & Real Estate", name: "Construction Finance Experts" },
    { id: 11, section: "Finance & Real Estate", name: "Home Improvement Financing" },
    { id: 12, section: "Finance & Real Estate", name: "Equity & Refinance Specialists" },
    { id: 13, section: "Finance & Real Estate", name: "First-Time Buyer Specialists" },
    { id: 14, section: "Finance & Real Estate", name: "Real Estate Investment Experts" },
    { id: 15, section: "Finance & Real Estate", name: "Real Estate & Property Professionals" },
    { id: 16, section: "Finance & Real Estate", name: "Financial & Legal Advisors" }
  ];
  
  // Subcategories mapped by parent category ID - Matched with Finance homepage subcategories
  const staticSubcategoriesMap: Record<number, any[]> = {
    // BUILD HOME
    1: [ // Construction & Building
      { id: 101, name: "General Contractors" },
      { id: 102, name: "Structural Specialists" },
      { id: 103, name: "Concrete Contractors" },
      { id: 104, name: "Masonry Contractors" },
      { id: 105, name: "Framing Contractors" }
    ],
    2: [ // MEP
      { id: 201, name: "Electrical Contractors" },
      { id: 202, name: "Plumbing Contractors" },
      { id: 203, name: "HVAC Contractors" },
      { id: 204, name: "Fire Protection Systems" }
    ],
    3: [ // Utilities & Infrastructure
      { id: 301, name: "Sewer Contractors" },
      { id: 302, name: "Water Supply Specialists" },
      { id: 303, name: "Storm Drainage Experts" },
      { id: 304, name: "Site Grading & Preparation" }
    ],
    // DESIGN HOME
    4: [ // Design & Planning
      { id: 401, name: "Architects" },
      { id: 402, name: "Interior Designers" },
      { id: 403, name: "Landscape Architects" },
      { id: 404, name: "Structural Engineers" }
    ],
    5: [ // Interior & Furnishing
      { id: 501, name: "Kitchen Designers" },
      { id: 502, name: "Bathroom Designers" },
      { id: 503, name: "Flooring Specialists" },
      { id: 504, name: "Cabinetry & Millwork" }
    ],
    6: [ // Outdoor & Landscaping
      { id: 601, name: "Landscapers" },
      { id: 602, name: "Deck & Patio Builders" },
      { id: 603, name: "Pool Contractors" },
      { id: 604, name: "Outdoor Living Specialists" }
    ],
    // FINANCE & REAL ESTATE - Matched with Finance homepage services
    7: [ // Credit Repair Specialists
      { id: 701, name: "Credit Repair Expert" },
      { id: 702, name: "Credit Score Analyst" },
      { id: 703, name: "Credit Rebuilding Advisor" }
    ],
    8: [ // Debt Management
      { id: 801, name: "Debt Management Counselor" },
      { id: 802, name: "Debt Settlement Negotiator" },
      { id: 803, name: "Debt Consolidation Advisor" }
    ],
    9: [ // Mortgage & Loan Professionals
      { id: 901, name: "Mortgage Broker" },
      { id: 902, name: "Loan Officer" },
      { id: 903, name: "Mortgage Banker" },
      { id: 904, name: "FHA Loan Specialist" },
      { id: 905, name: "VA Loan Specialist" }
    ],
    10: [ // Construction Finance Experts
      { id: 1001, name: "Construction Loan Specialist" },
      { id: 1002, name: "Building Project Financier" },
      { id: 1003, name: "Architectural Finance Consultant" },
      { id: 1004, name: "Contractor Finance Advisor" }
    ],
    11: [ // Home Improvement Financing
      { id: 1101, name: "Renovation Loan Specialist" },
      { id: 1102, name: "Home Improvement Financial Advisor" },
      { id: 1103, name: "HELOC Specialist" },
      { id: 1104, name: "Green Improvement Financier" }
    ],
    12: [ // Equity & Refinance Specialists
      { id: 1201, name: "Refinance Specialist" },
      { id: 1202, name: "Equity Release Consultant" },
      { id: 1203, name: "Cash-Out Refinance Specialist" }
    ],
    13: [ // First-Time Buyer Specialists
      { id: 1301, name: "First-Time Homebuyer Counselor" },
      { id: 1302, name: "Down Payment Assistance Specialist" },
      { id: 1303, name: "Affordable Housing Consultant" }
    ],
    14: [ // Real Estate Investment Experts
      { id: 1401, name: "Investment Property Specialist" },
      { id: 1402, name: "REIT Advisor" },
      { id: 1403, name: "Property Portfolio Manager" },
      { id: 1404, name: "Real Estate Investment Consultant" }
    ],
    15: [ // Real Estate & Property Professionals
      { id: 1501, name: "Real Estate Agent" },
      { id: 1502, name: "Property Appraiser" },
      { id: 1503, name: "Escrow Officer" },
      { id: 1504, name: "Real Estate Attorney" }
    ],
    16: [ // Financial & Legal Advisors
      { id: 1601, name: "Financial Planner" },
      { id: 1602, name: "Property Tax Consultant" },
      { id: 1603, name: "Estate Planning Attorney" },
      { id: 1604, name: "Investment Advisor" },
      { id: 1605, name: "Tax Specialist" }
    ]
  };

  const [categories] = useState<any[]>(staticCategories);
  const [selectedMainSection, setSelectedMainSection] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
  
  // Update subcategories when a category is selected
  useEffect(() => {
    if (selectedCategory === null) {
      setSubcategories([]);
      return;
    }
    
    // Use the static subcategories data
    setIsLoadingSubcategories(true);
    setTimeout(() => {
      setSubcategories(staticSubcategoriesMap[selectedCategory] || []);
      setIsLoadingSubcategories(false);
    }, 300); // Small delay to show loading state
    
  }, [selectedCategory]);
  
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expirationDate: "",
    cvc: "",
    zipCode: "",
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for card number to add spaces every 4 digits
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
      // Add spaces after every 4 digits
      const formatted = truncated.replace(/(\d{4})(?=\d)/g, '$1 ');
      
      setFormData({ ...formData, [name]: formatted });
    } else if (name === 'zipCode') {
      // Allow only digits and limit to 5 characters
      const digitsOnly = value.replace(/\D/g, '');
      const truncated = digitsOnly.slice(0, 5);
      
      setFormData({ ...formData, [name]: truncated });
    } else if (name === 'cvc') {
      // Allow only digits and limit based on card type
      const digitsOnly = value.replace(/\D/g, '');
      // American Express CVC is 4 digits, others are 3 digits
      const currentCardNumber = formData.cardNumber.replace(/\s/g, '');
      const isAmex = /^3[47]/.test(currentCardNumber);
      const maxCvcDigits = isAmex ? 4 : 3;
      const truncated = digitsOnly.slice(0, maxCvcDigits);
      
      setFormData({ ...formData, [name]: truncated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, agreeToTerms: checked });
    if (errors.agreeToTerms) {
      setErrors({ ...errors, agreeToTerms: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required";
    if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    if (!formData.expirationDate.trim()) newErrors.expirationDate = "Expiration date is required";
    if (!formData.cvc.trim()) newErrors.cvc = "CVC is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    
    // Card number validation based on card issuer
    const cardNumberString = formData.cardNumber.replace(/\s/g, '');
    if (formData.cardNumber && cardNumberString) {
      // Detect card type based on first digits
      const isAmex = /^3[47]/.test(cardNumberString);
      const isVisa = /^4/.test(cardNumberString);
      const isMastercard = /^5[1-5]/.test(cardNumberString);
      const isDiscover = /^6(?:011|5)/.test(cardNumberString);
      
      if (isAmex && cardNumberString.length !== 15) {
        newErrors.cardNumber = "American Express cards must be 15 digits";
      } else if ((isVisa || isMastercard || isDiscover) && cardNumberString.length !== 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      } else if (!isAmex && !isVisa && !isMastercard && !isDiscover && !/^\d{15,16}$/.test(cardNumberString)) {
        newErrors.cardNumber = "Card number must be 15-16 digits";
      }
    }

    // Expiration date validation (MM/YY format)
    const expDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (formData.expirationDate && !expDateRegex.test(formData.expirationDate)) {
      newErrors.expirationDate = "Please use MM/YY format";
    }

    // CVC validation (3-4 digits)
    const cvcRegex = /^[0-9]{3,4}$/;
    if (formData.cvc && !cvcRegex.test(formData.cvc)) {
      newErrors.cvc = "CVC must be 3-4 digits";
    }

    // ZIP Code validation (exactly 5 digits)
    const zipRegex = /^[0-9]{5}$/;
    if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
      newErrors.zipCode = "ZIP code must be exactly 5 digits";
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the membership terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Determine the correct primary service
        // First check for the original primary service stored from the user's account
        // If that doesn't exist, use realPrimaryService as a fallback
        // Finally fall back to the service parameter
        const originalPrimaryService = localStorage.getItem('originalPrimaryService');
        const realPrimaryService = localStorage.getItem('realPrimaryService');
        const primaryService = originalPrimaryService || realPrimaryService || service;
        
        // Log the service details for debugging
        console.log("Service details for payment:", {
          originalPrimaryService,
          realPrimaryService,
          serviceParam: service,
          primaryServiceUsed: primaryService,
          additionalServices
        });
        
        // Create the complete service categories array with the correct primary service first
        const allServiceCategories = [primaryService, ...additionalServices];
        
        // Get existing service categories if user is already a professional
        const existingServicesCount = user?.isProfessional ? (user.serviceCategories?.length || 0) : 0;
        
        // Calculate the monthly subscription amount based on whether this is a new professional or an existing one
        let subscriptionAmount;
        
        if (user?.isProfessional) {
          // For existing professionals, we charge $5 per additional service
          // Adding just one more service to their existing services
          subscriptionAmount = 29.77 + ((existingServicesCount + additionalServices.length - 1) * 5);
        } else {
          // For new professionals, base fee + additional services
          subscriptionAmount = 29.77 + (additionalServices.length * 5);
        }
        
        // Check if the user is already logged in as a professional
        if (user && user.isProfessional) {
          // This is an existing professional adding additional service categories
          
          // Get the fresh user data to ensure we have the most up-to-date service list
          const userResponse = await fetch('/api/user', { 
            credentials: 'include',
            headers: { 'Cache-Control': 'no-cache' }
          });
          
          if (!userResponse.ok) {
            throw new Error('Failed to fetch updated user data');
          }
          
          const userData = await userResponse.json();
          console.log("Fetched latest user data in ProfessionalPayment:", userData);
          
          // Get the user's existing service categories from fresh data
          const existingServiceCategories = userData.user_service_categories || [];
          console.log("Existing service categories from API:", existingServiceCategories);
          
          // Get the additional service category from localStorage (set by ProfessionalListingQuestion)
          const newServiceCategory = localStorage.getItem('additionalServiceCategory');
          console.log("New service category from localStorage:", newServiceCategory);
          
          // Create a set of unique categories from both sources
          const allCategoriesSet = new Set([...existingServiceCategories]);
          
          // Add the new category if it exists
          if (newServiceCategory && !allCategoriesSet.has(newServiceCategory)) {
            allCategoriesSet.add(newServiceCategory);
          }
          
          // Add any additional services that were manually entered
          additionalServices.forEach(category => {
            if (!allCategoriesSet.has(category)) {
              allCategoriesSet.add(category);
            }
          });
          
          // Convert set back to array
          const updatedServiceCategories = Array.from(allCategoriesSet);
          console.log("Updated service categories to be saved:", updatedServiceCategories);
          
          // Update only the serviceCategories and subscription amount
          const response = await apiRequest("PATCH", "/api/update-profile", {
            serviceCategories: updatedServiceCategories,
            subscriptionAmount: 29.77 + ((updatedServiceCategories.length - 1) * 5) // Recalculate based on total categories
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update profile");
          }
          
          toast({
            title: "Service Categories Updated",
            description: `You've successfully added new service categories to your professional listing.`,
          });
          
          // Navigate back to account page
          setLocation('/my-account');
        } else {
          // New professional signup flow
          // Get stored states and languages from localStorage
          const statesJson = localStorage.getItem("selectedStates");
          const languagesJson = localStorage.getItem("selectedLanguages");
          
          // Parse the JSON strings
          const statesServiced = statesJson ? JSON.parse(statesJson) : [];
          const languagesSpoken = languagesJson ? JSON.parse(languagesJson) : ["English"];
          
          // Make sure we have at least one state
          if (statesServiced.length === 0) {
            toast({
              title: "Missing Information",
              description: "At least one state location is required. Please go back and select your states.",
              variant: "destructive",
            });
            return;
          }
          
          // Update the profile with the final required information
          const response = await apiRequest("PATCH", "/api/update-profile", {
            // Store first state in legacy field for backward compatibility
            stateLocation: statesServiced[0],
            // Use the new array fields
            statesServiced,
            languagesSpoken,
            // Store primary service in legacy field for backward compatibility
            serviceCategory: service,
            // Use the new array field for multiple services
            serviceCategories: allServiceCategories,
            isActive: true,
            subscriptionStatus: "trial", // Start with trial status
            subscriptionAmount: subscriptionAmount // Store the calculated subscription amount
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update profile");
          }
          
          toast({
            title: "Payment Successful",
            description: `Your professional listing has been created with ${allServiceCategories.length} service categories.`,
          });
          
          // Determine where to navigate after payment
          const additionalServiceCategory = localStorage.getItem('additionalServiceCategory');
          const isAddingNewService = additionalServiceCategory !== null;
          
          console.log("Navigation after payment:", {
            isProfessional: user?.isProfessional,
            isAddingNewService,
            additionalServiceCategory,
            user
          });
          
          if (user?.isProfessional && isAddingNewService) {
            // Existing professional adding new service - go to additional service success page
            setLocation('/my-account');
          } else {
            // New professional - go to document upload page
            setLocation(`/professional-document-upload/${encodeURIComponent(service)}`);
          }
        }
      } catch (error) {
        console.error('Payment error:', error);
        toast({
          title: "Payment Error",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Payment Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
    }
  };

  // Function to format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Function to format expiration date
  const formatExpirationDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg mb-6">
        <CardHeader className="text-center bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardTitle className="font-heading text-2xl">Payment Information</CardTitle>
          <CardDescription className="text-white/90">
            Get listed as a {localStorage.getItem('originalPrimaryService') || localStorage.getItem('realPrimaryService') || service} professional
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-8">
            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20 mb-6">
              <h3 className="font-heading font-bold text-lg mb-2">Professional Listing - Monthly Subscription</h3>
              
              {/* Primary service - display with highlight */}
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-md mb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-muted-foreground">Primary Service:</span>
                    <h4 className="font-semibold text-primary text-lg">
                      {localStorage.getItem('originalPrimaryService') || localStorage.getItem('realPrimaryService') || service}
                    </h4>
                  </div>
                  <span className="font-medium text-lg">$29.77</span>
                </div>
              </div>
              
              {/* Additional Services */}
              {additionalServices.length > 0 && (
                <div className="space-y-3 border-t border-accent/20 pt-3 mt-3 mb-3">
                  <h4 className="text-sm font-semibold">Additional Service Categories:</h4>
                  <div className="space-y-2">
                    {additionalServices.map((additionalService, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{additionalService}</span>
                          <button 
                            type="button"
                            onClick={() => setAdditionalServices(prev => prev.filter((_, i) => i !== index))}
                            className="ml-2 p-1 text-red-500 hover:text-red-700 bg-white rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-medium">$5.00</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Total calculation */}
                  <div className="flex justify-between font-medium border-t border-accent/20 pt-3 mt-2">
                    <span>Total Monthly Subscription:</span>
                    <span>${(29.77 + (additionalServices.length * 5)).toFixed(2)}</span>
                  </div>
                </div>
              )}
              
              {/* Add another service field */}
              <div className="mt-3 mb-3 border border-dashed border-accent/30 rounded-md p-3 bg-accent/5">
                <h4 className="text-sm font-semibold mb-2">Add More Service Categories</h4>
                <p className="text-xs text-neutral-light mb-2">
                  You can add additional service categories for a nominal fee of $5.00 per category.
                </p>
                
                {/* Structured category selection */}
                <div className="space-y-3 mb-3">
                  {/* Main Section Dropdown - Step 1 */}
                  <div className="space-y-1.5">
                    <Label htmlFor="mainSectionSelect" className="text-xs font-medium">
                      Step 1: Select Main Section
                    </Label>
                    <div className="relative">
                      <select
                        id="mainSectionSelect"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer appearance-none pr-8"
                        onChange={(e) => {
                          // Reset category selection when main section changes
                          setSelectedCategory(null);
                          // Selected section is used in the next dropdown
                          setSelectedMainSection(e.target.value);
                        }}
                        value={selectedMainSection || ""}
                      >
                        <option value="">Select a main section</option>
                        {mainSections.map((section) => (
                          <option key={section} value={section}>
                            {section}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Category dropdown - Step 2 (only shown if main section is selected) */}
                  {selectedMainSection && (
                    <div className="space-y-1.5">
                      <Label htmlFor="categorySelect" className="text-xs font-medium">
                        Step 2: Select Category
                      </Label>
                      <div className="relative">
                        <select
                          id="categorySelect"
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer appearance-none pr-8"
                          value={selectedCategory || ""}
                          onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                          disabled={isLoadingCategories}
                        >
                          <option value="">Select a category</option>
                          {categories
                            .filter(category => category.section === selectedMainSection)
                            .map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                          ))}
                        </select>
                        {isLoadingCategories ? (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        ) : (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Subcategory dropdown - Step 3 */}
                  {selectedCategory !== null && (
                    <div className="space-y-1.5">
                      <Label htmlFor="subcategorySelect" className="text-xs font-medium">
                        Step 3: Select Subcategory
                      </Label>
                      <div className="relative">
                        <select
                          id="subcategorySelect"
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer appearance-none pr-8"
                          onChange={(e) => {
                            if (e.target.value) {
                              const subcategory = subcategories.find(sc => sc.id === parseInt(e.target.value));
                              if (subcategory) {
                                const serviceName = subcategory.name;
                                setAdditionalServiceInput(serviceName);
                              }
                            }
                          }}
                          disabled={isLoadingSubcategories}
                        >
                          <option value="">Select a subcategory</option>
                          {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </option>
                          ))}
                        </select>
                        {isLoadingSubcategories ? (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        ) : (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Custom service input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="additionalServiceInput" className="text-xs font-medium">
                      Service Name
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="additionalServiceInput"
                        value={additionalServiceInput}
                        onChange={(e) => setAdditionalServiceInput(e.target.value)}
                        placeholder="Service name or custom service"
                        className="text-sm h-10"
                      />
                      <Button 
                        type="button"
                        variant="default"
                        className="shrink-0 text-sm bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 px-4"
                        onClick={() => {
                          const serviceToAdd = additionalServiceInput.trim();
                          if (serviceToAdd && 
                              !additionalServices.includes(serviceToAdd) &&
                              serviceToAdd !== service) {
                            setAdditionalServices(prev => [...prev, serviceToAdd]);
                            // Show success toast with animation
                            toast({
                              title: "Service Added",
                              description: `Added "${serviceToAdd}" as an additional service category.`,
                              variant: "default",
                            });
                            
                            // Reset form fields
                            setAdditionalServiceInput("");
                            setSelectedCategory(null);
                            
                            // Briefly highlight total amount to show it's updated
                            const totalElement = document.querySelector(".subscription-total");
                            if (totalElement) {
                              totalElement.classList.add("animate-pulse");
                              setTimeout(() => {
                                totalElement.classList.remove("animate-pulse");
                              }, 1000);
                            }
                          } else if (additionalServiceInput.trim() === service) {
                            toast({
                              title: "Duplicate Service",
                              description: "This is already your primary service category.",
                              variant: "destructive",
                            });
                          } else if (additionalServices.includes(additionalServiceInput.trim())) {
                            toast({
                              title: "Duplicate Service",
                              description: "You've already added this service category.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <PlusCircle className="w-4 h-4 mr-1" /> Add Service ($5)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Trial info and total */}
              <div className="flex justify-between items-center mb-2 text-sm text-neutral-light">
                <span>First Month</span>
                <span>FREE (Trial)</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-accent/30 pt-3 mt-3">
                <span className="font-bold text-lg">Monthly Subscription Total</span>
                <span className="font-bold text-lg text-primary subscription-total">
                  ${user?.isProfessional 
                    ? (29.77 + (((user.serviceCategories?.length || 0) + additionalServices.length - 1) * 5)).toFixed(2)
                    : (29.77 + (additionalServices.length * 5)).toFixed(2)
                  }
                </span>
              </div>
              
              <div className="flex justify-between font-bold border-t border-accent/30 pt-3 mt-3 text-green-600">
                <span className="text-lg">Due Today</span>
                <span className="text-lg">$0.00</span>
              </div>
            </div>
            
            <div className="rounded-lg p-4 border border-blue-200 bg-blue-50 mb-4">
              <h4 className="font-medium text-blue-800 mb-1">Important Payment Information:</h4>
              <p className="text-blue-700 text-sm mb-2">
                • Your 30-day free trial starts today: {new Date().toLocaleDateString()}
              </p>
              <p className="text-blue-700 text-sm mb-2">
                • First charge of ${user?.isProfessional 
                    ? (29.77 + (((user.serviceCategories?.length || 0) + additionalServices.length - 1) * 5)).toFixed(2)
                    : (29.77 + (additionalServices.length * 5)).toFixed(2)
                  } will occur on: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
              <p className="text-blue-700 text-sm mb-2">
                • Your subscription includes {user?.isProfessional 
                    ? (user.serviceCategories?.length || 0) + additionalServices.length 
                    : additionalServices.length + 1} service categories
              </p>
              <p className="text-blue-700 text-sm">
                • You can cancel anytime before the trial ends with no charge
              </p>
            </div>
            
            <p className="text-neutral-light text-sm">
              After your 30-day free trial, your card will be automatically charged ${user?.isProfessional 
                  ? (29.77 + (((user.serviceCategories?.length || 0) + additionalServices.length - 1) * 5)).toFixed(2)
                  : (29.77 + (additionalServices.length * 5)).toFixed(2)
                } each month 
              for continued professional listing services in {user?.isProfessional 
                  ? (user.serviceCategories?.length || 0) + additionalServices.length 
                  : additionalServices.length + 1} categories.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Full Name</Label>
              <Input
                id="cardholderName"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={errors.cardholderName ? "border-red-500" : ""}
              />
              {errors.cardholderName && <p className="text-sm text-red-500">{errors.cardholderName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => {
                  const formattedValue = formatCardNumber(e.target.value);
                  setFormData({ ...formData, cardNumber: formattedValue });
                  if (errors.cardNumber) {
                    setErrors({ ...errors, cardNumber: "" });
                  }
                }}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className={errors.cardNumber ? "border-red-500" : ""}
              />
              {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expirationDate">Expiration Date (MM/YY)</Label>
                <Input
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={(e) => {
                    const formattedValue = formatExpirationDate(e.target.value);
                    setFormData({ ...formData, expirationDate: formattedValue });
                    if (errors.expirationDate) {
                      setErrors({ ...errors, expirationDate: "" });
                    }
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={errors.expirationDate ? "border-red-500" : ""}
                />
                {errors.expirationDate && <p className="text-sm text-red-500">{errors.expirationDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength={4}
                  className={errors.cvc ? "border-red-500" : ""}
                />
                {errors.cvc && <p className="text-sm text-red-500">{errors.cvc}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Billing ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="12345"
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
            </div>

            <div className="flex items-start mt-6">
              <div className="flex items-center h-5">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={handleCheckboxChange}
                  className={errors.agreeToTerms ? "border-red-500" : ""}
                />
              </div>
              <div className="ml-3 text-sm">
                <Label
                  htmlFor="agreeToTerms"
                  className="text-neutral-light font-normal"
                >
                  I agree to the <a href="#" className="text-primary hover:underline">Membership Agreement</a> and authorize USA Home to charge my card ${user?.isProfessional 
                    ? (29.77 + (((user.serviceCategories?.length || 0) + additionalServices.length - 1) * 5)).toFixed(2)
                    : (29.77 + (additionalServices.length * 5)).toFixed(2)
                  } after the 30-day free trial ends
                </Label>
                {errors.agreeToTerms && <p className="text-sm text-red-500 mt-1">{errors.agreeToTerms}</p>}
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary-dark py-6 text-lg font-medium"
              >
                Pay Now &amp; Start Free Trial
              </Button>
            </div>

            <p className="text-xs text-center text-neutral-light mt-4">
              Your payment information is securely processed. Your card will not be charged until after your 30-day (1-month) free trial ends, at which point you will be charged ${user?.isProfessional 
                ? (29.77 + (((user.serviceCategories?.length || 0) + additionalServices.length - 1) * 5)).toFixed(2)
                : (29.77 + (additionalServices.length * 5)).toFixed(2)
              } per month.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalPayment;