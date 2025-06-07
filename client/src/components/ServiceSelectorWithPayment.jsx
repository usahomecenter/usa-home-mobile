import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, 
  CreditCard, 
  CheckCircle, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { addService, calculateMonthlyFee } from '@/lib/serviceManager';
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ServiceSelectorWithPayment() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Main states
  const [step, setStep] = useState('selection'); // 'selection', 'payment', 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFee, setCurrentFee] = useState('');
  const [newFee, setNewFee] = useState('');
  
  // Service selection state
  const [mainCategory, setMainCategory] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  
  // Payment form state
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    zipCode: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  
  // Load current fee on component mount
  useEffect(() => {
    if (user?.username) {
      const fee = calculateMonthlyFee(user.username);
      setCurrentFee(fee);
    }
  }, [user]);
  
  // Main categories
  const mainCategories = [
    { value: "Build", label: "Build Home" },
    { value: "Design", label: "Design Home" },
    { value: "Finance", label: "Finance & Real Estate" }
  ];
  
  // Reset lower-level selections when parent changes
  useEffect(() => {
    setCategory('');
    setSubCategory('');
  }, [mainCategory]);
  
  useEffect(() => {
    setSubCategory('');
  }, [category]);
  
  // Categories based on main selection
  const getCategoryOptions = () => {
    if (mainCategory === 'Build') {
      return [
        { value: "Construction & Building", label: "Construction & Building" },
        { value: "MEP (Mechanical, Electrical, Plumbing)", label: "MEP (Mechanical, Electrical, Plumbing)" },
        { value: "Utilities & Infrastructure", label: "Utilities & Infrastructure" },
        { value: "Renewable & Solar", label: "Renewable & Solar" },
        { value: "Energy & Building Systems", label: "Energy & Building Systems" },
        { value: "Environmental & Compliance", label: "Environmental & Compliance" },
        { value: "Additional Expertise", label: "Additional Expertise" }
      ];
    } 
    else if (mainCategory === 'Design') {
      return [
        { value: "Architect", label: "Architect" },
        { value: "Structural Engineer", label: "Structural Engineer" },
        { value: "Civil Engineer", label: "Civil Engineer" },
        { value: "Urban Planner", label: "Urban Planner" },
        { value: "Interior Designer", label: "Interior Designer" },
        { value: "Landscape Architect", label: "Landscape Architect" },
        { value: "Sustainability Consultant", label: "Sustainability Consultant" }
      ];
    } 
    else if (mainCategory === 'Finance') {
      return [
        { value: "Credit Repair Specialists", label: "Credit Repair Specialists" },
        { value: "Debt Management", label: "Debt Management" },
        { value: "Mortgage & Loan Professionals", label: "Mortgage & Loan Professionals" },
        { value: "Construction Finance Experts", label: "Construction Finance Experts" },
        { value: "Home Improvement Financing", label: "Home Improvement Financing" },
        { value: "Equity & Refinance Specialists", label: "Equity & Refinance Specialists" },
        { value: "Real Estate & Property Professionals", label: "Real Estate & Property Professionals" },
        { value: "Financial & Legal Advisors", label: "Financial & Legal Advisors" }
      ];
    } 
    else {
      return [];
    }
  };
  
  // Subcategories based on category selection  
  const getSubcategoryOptions = () => {
    if (!category) return [];
    
    // Build Home Subcategories
    if (mainCategory === 'Build') {
      if (category === "Construction & Building") {
        return [
          { value: "General Contractor", label: "General Contractor" },
          { value: "Foundation Specialist", label: "Foundation Specialist" },
          { value: "Structural Steel & Framing", label: "Structural Steel & Framing" },
          { value: "Masonry & Bricklayer", label: "Masonry & Bricklayer" },
          { value: "Carpentry", label: "Carpentry" },
          { value: "Welding & Material Fabrication", label: "Welding & Material Fabrication" },
          { value: "Roofing & Cladding", label: "Roofing & Cladding" },
          { value: "Window & Door Installer", label: "Window & Door Installer" },
          { value: "Insulation Contractor", label: "Insulation Contractor" },
          { value: "Drywall & Plasterer", label: "Drywall & Plasterer" },
          { value: "Flooring Specialist", label: "Flooring Specialist" },
          { value: "Painter & Sprayer", label: "Painter & Sprayer" },
          { value: "Cabinetmaker & Millworker", label: "Cabinetmaker & Millworker" },
          { value: "Pool Builder", label: "Pool Builder" },
          { value: "Gardening & Landscaping Expert", label: "Gardening & Landscaping Expert" }
        ];
      }
      else if (category === "MEP (Mechanical, Electrical, Plumbing)") {
        return [
          { value: "HVAC Technician", label: "HVAC Technician" },
          { value: "Electrician", label: "Electrician" },
          { value: "Plumber", label: "Plumber" }
        ];
      }
      else if (category === "Utilities & Infrastructure") {
        return [
          { value: "Utility Connection Spy", label: "Utility Connection Spy" },
          { value: "Septic System Expert", label: "Septic System Expert" }
        ];
      }
      else if (category === "Renewable & Solar") {
        return [
          { value: "Solar Installer", label: "Solar Installer" },
          { value: "Solar Designer", label: "Solar Designer" }
        ];
      }
      else if (category === "Energy & Building Systems") {
        return [
          { value: "Home Automation Specialist", label: "Home Automation Specialist" }
        ];
      }
      else if (category === "Environmental & Compliance") {
        return [
          { value: "LEED Consultant", label: "LEED Consultant" },
          { value: "Environmental Impact Assessor", label: "Environmental Impact Assessor" }
        ];
      }
      else if (category === "Additional Expertise") {
        return [
          { value: "Security System Installer", label: "Security System Installer" },
          { value: "Locksmith", label: "Locksmith" },
          { value: "Soundproofing Specialist", label: "Soundproofing Specialist" },
          { value: "Accessibility Expert", label: "Accessibility Expert" }
        ];
      }
      else {
        return [{ value: category, label: category }];
      }
    }
    
    // Design Home Subcategories
    else if (mainCategory === 'Design') {
      if (category === "Architect") {
        return [
          { value: "Concept Development", label: "Concept Development" },
          { value: "Schematic Design", label: "Schematic Design" },
          { value: "Design Development", label: "Design Development" },
          { value: "Construction Documentation", label: "Construction Documentation" },
          { value: "3D Modeling & Visualization", label: "3D Modeling & Visualization" }
        ];
      }
      else if (category === "Structural Engineer") {
        return [
          { value: "Structural Analysis", label: "Structural Analysis" },
          { value: "Material Selection", label: "Material Selection" },
          { value: "Foundation Design", label: "Foundation Design" },
          { value: "Seismic & Wind Analysis", label: "Seismic & Wind Analysis" },
          { value: "Reinforcement Detailing", label: "Reinforcement Detailing" }
        ];
      }
      else if (category === "Interior Designer") {
        return [
          { value: "Space Planning", label: "Space Planning" },
          { value: "Furniture & Fixtures Selection", label: "Furniture & Fixtures Selection" },
          { value: "Material & Finish Selection", label: "Material & Finish Selection" },
          { value: "Lighting Design", label: "Lighting Design" },
          { value: "Acoustical Design", label: "Acoustical Design" }
        ];
      }
      else if (category === "Landscape Architect") {
        return [
          { value: "Site analysis & Master planning", label: "Site analysis & Master planning" },
          { value: "Planting Design", label: "Planting Design" },
          { value: "Hardscape Design", label: "Hardscape Design" },
          { value: "Irrigation & Drainage Systems", label: "Irrigation & Drainage Systems" },
          { value: "Sustainable Landscape Design", label: "Sustainable Landscape Design" }
        ];
      }
      else {
        return [{ value: category, label: category }];
      }
    }
    
    // Finance & Real Estate Subcategories
    else if (mainCategory === 'Finance') {
      if (category === "Credit Repair Specialists") {
        return [
          { value: "Credit Repair Expert", label: "Credit Repair Expert" },
          { value: "Credit Score Analyst", label: "Credit Score Analyst" },
          { value: "Credit Rebuilding Advisor", label: "Credit Rebuilding Advisor" }
        ];
      }
      else if (category === "Debt Management") {
        return [
          { value: "Debt Management Counselor", label: "Debt Management Counselor" },
          { value: "Debt Settlement Negotiator", label: "Debt Settlement Negotiator" },
          { value: "Debt Consolidation Advisor", label: "Debt Consolidation Advisor" }
        ];
      }
      else if (category === "Mortgage & Loan Professionals") {
        return [
          { value: "Mortgage Broker", label: "Mortgage Broker" },
          { value: "Loan Officer", label: "Loan Officer" },
          { value: "Mortgage Banker", label: "Mortgage Banker" },
          { value: "FHA Loan Specialist", label: "FHA Loan Specialist" }
        ];
      }
      else if (category === "Real Estate & Property Professionals") {
        return [
          { value: "Real Estate Agent", label: "Real Estate Agent" },
          { value: "Property Appraiser", label: "Property Appraiser" },
          { value: "Escrow Officer", label: "Escrow Officer" },
          { value: "Real Estate Attorney", label: "Real Estate Attorney" }
        ];
      }
      else if (category === "Financial & Legal Advisors") {
        return [
          { value: "Financial Planner", label: "Financial Planner" },
          { value: "Property Tax Consultant", label: "Property Tax Consultant" },
          { value: "Estate Planning Attorney", label: "Estate Planning Attorney" },
          { value: "Investment Advisor", label: "Investment Advisor" },
          { value: "Tax Specialist", label: "Tax Specialist" }
        ];
      }
      else {
        return [{ value: category, label: category }];
      }
    }
    
    return [];
  };

  // Handle selection confirmation and move to payment
  const handleSelectionConfirm = () => {
    if (!subCategory) {
      toast({
        title: "Service Selection Required",
        description: "Please complete all three selection steps before proceeding",
        variant: "destructive"
      });
      return;
    }

    try {
      // Calculate the new fee with this additional service
      const newServicesList = [...(user?.service_categories || []), subCategory];
      const calculatedFee = `$${29.77 + ((newServicesList.length - 1) * 5)}`;
      setNewFee(calculatedFee);
      
      // Move to payment step
      setStep('payment');
    } catch (error) {
      console.error("Error preparing payment:", error);
      toast({
        title: "Error",
        description: "There was a problem preparing the payment form",
        variant: "destructive"
      });
    }
  };

  // Handle payment form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear errors when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate payment form
  const validatePaymentForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name on card is required';
    }
    
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberDigits.length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
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
    return Object.keys(newErrors).length === 0;
  };

  // Submit payment and add service
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePaymentForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Add the service using the service manager
      const updatedServices = addService(subCategory, user?.username);
      console.log("Service added:", subCategory);
      console.log("Updated services:", updatedServices);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Send data to API
      const paymentData = {
        serviceCategory: subCategory,
        paymentInfo: {
          name: formData.name,
          lastFour: formData.cardNumber.slice(-4),
          billingZip: formData.zipCode
        }
      };
      
      // Call your API endpoint
      await apiRequest("POST", "/api/add-service-category", paymentData);
      
      // Update the fee display
      const updatedFee = calculateMonthlyFee(user?.username);
      setCurrentFee(updatedFee);
      
      // Show success state
      setStep('success');
      
      // Refresh user data
      queryClient.invalidateQueries(["/api/user"]);
      
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "There was a problem processing your payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset the form to start over
  const handleReset = () => {
    setStep('selection');
    setMainCategory('');
    setCategory('');
    setSubCategory('');
    setFormData({
      name: '',
      cardNumber: '',
      expirationDate: '',
      cvc: '',
      zipCode: '',
      agreeToTerms: false
    });
    setErrors({});
  };

  // Function to go back from payment to selection
  const handleBackToSelection = () => {
    setStep('selection');
  };

  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 'selection':
        return (
          <Card className="w-full border-blue-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
              <CardTitle className="text-xl text-blue-700">Add Service</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                {/* Selection Steps with Progress Indicator */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mainCategory ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      1
                    </div>
                    <div className="ml-2 text-sm font-medium">Main Category</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${category ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      2
                    </div>
                    <div className="ml-2 text-sm font-medium">Category</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${subCategory ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      3
                    </div>
                    <div className="ml-2 text-sm font-medium">Specific Service</div>
                  </div>
                </div>

                {/* Step 1: Main Category */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Step 1: Select Main Category</Label>
                  <Select
                    value={mainCategory}
                    onValueChange={setMainCategory}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select main category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mainCategories.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Step 2: Category */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Step 2: Select Category</Label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                    disabled={!mainCategory}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder={mainCategory ? "Select a category" : "Select main category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getCategoryOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Step 3: Subcategory/Service */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Step 3: Select Specific Service</Label>
                  <Select
                    value={subCategory}
                    onValueChange={setSubCategory}
                    disabled={!category}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder={category ? "Select a service" : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategoryOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentFee && (
                  <div className="text-sm text-gray-600 pt-2">
                    Current monthly fee: <span className="font-semibold text-blue-700">{currentFee}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t px-6 py-4">
              <Button 
                onClick={handleSelectionConfirm}
                disabled={!subCategory}
                className="ml-auto bg-blue-600 hover:bg-blue-700"
              >
                Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );

      case 'payment':
        return (
          <Card className="w-full border-blue-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
              <CardTitle className="text-xl text-blue-700">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="mb-5 p-4 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-800">Adding Service: <span className="font-semibold">{subCategory}</span></h3>
                  {currentFee && newFee && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">Current monthly fee: <span className="font-medium">{currentFee}</span></p>
                      <p className="text-sm text-gray-600">New monthly fee: <span className="font-medium text-blue-700">{newFee}</span></p>
                      <p className="text-xs text-gray-500 mt-1">Additional $5.00 per service category</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="name">Name on Card</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    name="cardNumber" 
                    value={formData.cardNumber} 
                    onChange={handleInputChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expirationDate">Expiration</Label>
                    <Input 
                      id="expirationDate" 
                      name="expirationDate" 
                      value={formData.expirationDate} 
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className={errors.expirationDate ? "border-red-500" : ""}
                    />
                    {errors.expirationDate && <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input 
                      id="cvc" 
                      name="cvc" 
                      value={formData.cvc} 
                      onChange={handleInputChange}
                      placeholder="123"
                      className={errors.cvc ? "border-red-500" : ""}
                    />
                    {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Billing Zip</Label>
                    <Input 
                      id="zipCode" 
                      name="zipCode" 
                      value={formData.zipCode} 
                      onChange={handleInputChange}
                      className={errors.zipCode ? "border-red-500" : ""}
                    />
                    {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="agreeToTerms" 
                    name="agreeToTerms" 
                    checked={formData.agreeToTerms} 
                    onCheckedChange={(checked) => {
                      setFormData({...formData, agreeToTerms: checked || false});
                      if (errors.agreeToTerms) {
                        setErrors({...errors, agreeToTerms: ''});
                      }
                    }}
                  />
                  <label 
                    htmlFor="agreeToTerms" 
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${errors.agreeToTerms ? 'text-red-500' : 'text-gray-700'}`}
                  >
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
              </form>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t px-6 py-4 flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBackToSelection}
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button 
                onClick={handlePaymentSubmit}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Complete Payment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        );

      case 'success':
        return (
          <Card className="w-full border-green-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="text-xl text-green-700 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Service Added Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Your new service has been added</h3>
                <p className="mt-2 text-sm text-gray-500">
                  You've successfully added "{subCategory}" to your professional services.
                  The additional $5 fee will be applied to your monthly subscription.
                </p>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-md text-left">
                  <p className="text-sm text-gray-600">Your new monthly fee: <span className="font-medium text-blue-700">{newFee || currentFee}</span></p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t px-6 py-4">
              <Button 
                onClick={handleReset}
                className="mx-auto bg-blue-600 hover:bg-blue-700"
              >
                Add Another Service
              </Button>
            </CardFooter>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return renderStep();
}