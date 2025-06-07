import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from "@/hooks/use-toast";
import { addService, calculateMonthlyFee } from '@/lib/serviceManager';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subcategoryDefinitions } from "@/lib/subcategoryDefinitions";
import designSubcategories from "@/lib/designSubcategories";

export default function ThreeStepServiceAdder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [fee, setFee] = useState('');
  const [, navigate] = useLocation();
  
  // 3-step selection state
  const [mainCategory, setMainCategory] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  
  // Main categories that match the app structure
  const mainCategories = [
    { value: "Build", label: "Build Home" },
    { value: "Design", label: "Design Home" },
    { value: "Finance", label: "Finance & Real Estate" }
  ];
  
  // Categories based on main selection - Exactly as provided in the text file
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
        { value: "First Time Buyer Specialist", label: "First Time Buyer Specialist" },
        { value: "Real Estate Investment Expert", label: "Real Estate Investment Expert" },
        { value: "Real Estate & Property Professionals", label: "Real Estate & Property Professionals" },
        { value: "Financial & Legal Advisors", label: "Financial & Legal Advisors" }
      ];
    } 
    else {
      return [];
    }
  };
  
  // Subcategories based on category selection - HARDCODED APPROACH
  const getSubcategoryOptions = () => {
    if (!category) return [];
    
    // For Design Home categories - directly hardcoded
    if (mainCategory === 'Design') {
      console.log("DEBUG - Getting Design subcategories for:", category);
      
      // Hardcoded subcategories for each Design category
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
      else if (category === "Civil Engineer") {
        return [
          { value: "Structural Engineering", label: "Structural Engineering" },
          { value: "Site Development", label: "Site Development" },
          { value: "Transportation Engineering", label: "Transportation Engineering" },
          { value: "Water Resources", label: "Water Resources" },
          { value: "Geotechnical Engineering", label: "Geotechnical Engineering" },
          { value: "Utility Planning", label: "Utility Planning" }
        ];
      }
      else if (category === "Urban Planner") {
        return [
          { value: "Land Use Planning", label: "Land Use Planning" },
          { value: "Zoning Regulations & compliance", label: "Zoning Regulations & compliance" },
          { value: "Community Development Plans", label: "Community Development Plans" },
          { value: "Transportation Planning", label: "Transportation Planning" },
          { value: "Environmental impact assessment", label: "Environmental impact assessment" }
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
          { value: "Site Analysis & Master Planning", label: "Site Analysis & Master Planning" },
          { value: "Planting Design", label: "Planting Design" },
          { value: "Hardscape Design", label: "Hardscape Design" },
          { value: "Irrigation & Drainage Systems", label: "Irrigation & Drainage Systems" },
          { value: "Sustainable Landscape Design", label: "Sustainable Landscape Design" }
        ];
      }
      else if (category === "Sustainability Consultant") {
        return [
          { value: "LEED Certification consulting", label: "LEED Certification consulting" },
          { value: "Renewable Energy integration", label: "Renewable Energy integration" },
          { value: "Building Envelope Optimization", label: "Building Envelope Optimization" },
          { value: "Energy Modeling & Simulations", label: "Energy Modeling & Simulations" },
          { value: "Green Materials & Construction Practices", label: "Green Materials & Construction Practices" }
        ];
      }
    }
    
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
          { value: "Accessibility Expert", label: "Accessibility Expert" },
          { value: "Pest Control Professional", label: "Pest Control Professional" },
          { value: "Waste Management & Recycling Coordinator", label: "Waste Management & Recycling Coordinator" },
          { value: "Metal Work & Welding Specialist", label: "Metal Work & Welding Specialist" }
        ];
      }
      else {
        return [{ value: category, label: category }];
      }
    }
    
    // Design Home Subcategories - use centralized definitions for all categories
    else if (mainCategory === 'Design') {
      console.log("DEBUG - Design subcategories for category:", category);
      // Use centralized definitions for all Design Home categories
      const designSubcategories = getSubcategoriesByCategory(category);
      console.log("DEBUG - Found centralized subcategories:", designSubcategories);
      
      // Return centralized subcategories or fallback to default
      return designSubcategories.length > 0 
        ? designSubcategories 
        : [{ value: category, label: category }];
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
          { value: "Loan Officer", label: "Loan Officer" },
          { value: "Mortgage Broker", label: "Mortgage Broker" },
          { value: "Loan Processor", label: "Loan Processor" }
        ];
      }
      else if (category === "Sustainability Consultant") {
        return [
          { value: "LEED Certification consulting", label: "LEED Certification consulting" },
          { value: "Renewable Energy integration", label: "Renewable Energy integration" },
          { value: "Building Envelope Optimization", label: "Building Envelope Optimization" },
          { value: "Energy Modeling & Simulations", label: "Energy Modeling & Simulations" },
          { value: "Green Materials & Construction Practices", label: "Green Materials & Construction Practices" }
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
      else if (category === "Construction Finance Experts") {
        return [
          { value: "Construction Loan Specialist", label: "Construction Loan Specialist" },
          { value: "Building Project Financier", label: "Building Project Financier" },
          { value: "Architectural Finance Consultant", label: "Architectural Finance Consultant" },
          { value: "Constructor Finance Advisor", label: "Constructor Finance Advisor" }
        ];
      }
      else if (category === "Home Improvement Financing") {
        return [
          { value: "Renovation Loan Specialist", label: "Renovation Loan Specialist" },
          { value: "Home Improvement Financial Advisor", label: "Home Improvement Financial Advisor" },
          { value: "HELOC Specialist", label: "HELOC Specialist" },
          { value: "Green Improvement Financier", label: "Green Improvement Financier" }
        ];
      }
      else if (category === "Equity & Refinance Specialists") {
        return [
          { value: "Refinance Specialist", label: "Refinance Specialist" },
          { value: "Equity Release Consultant", label: "Equity Release Consultant" },
          { value: "Cash-out Refinance Specialist", label: "Cash-out Refinance Specialist" }
        ];
      }
      else if (category === "First Time Buyer Specialist") {
        return [
          { value: "First-time Homebuyer Counselor", label: "First-time Homebuyer Counselor" },
          { value: "Down Payment Assistance Specialist", label: "Down Payment Assistance Specialist" },
          { value: "Affordable Housing Consultant", label: "Affordable Housing Consultant" }
        ];
      }
      else if (category === "Real Estate Investment Expert") {
        return [
          { value: "Investment Property Specialist", label: "Investment Property Specialist" },
          { value: "REIT Advisor", label: "REIT Advisor" },
          { value: "Property Portfolio Manager", label: "Property Portfolio Manager" },
          { value: "Real Estate Investment Consultant", label: "Real Estate Investment Consultant" }
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
  
  // Reset subsequent selections when a higher level changes
  useEffect(() => {
    setCategory('');
    setSubCategory('');
  }, [mainCategory]);
  
  useEffect(() => {
    setSubCategory('');
  }, [category]);
  
  const handleAddService = async () => {
    if (!subCategory) {
      toast({
        title: "No service selected",
        description: "Please complete all three selection steps",
        variant: "destructive"
      });
      return;
    }
    
    setIsAdding(true);
    
    try {
      // Validate the selection - ensure we have a valid subcategory
      if (!subCategory || subCategory === "undefined" || subCategory === "null") {
        toast({
          title: "Invalid Selection",
          description: "Please select a valid service subcategory",
          variant: "destructive"
        });
        setIsAdding(false);
        return;
      }
      
      console.log("ADDING SERVICE WITH AUTOMATIC PAYMENT:", subCategory);
      
      // Use the new automatic payment API
      const response = await apiRequest('POST', '/api/add-service-with-payment', {
        serviceCategory: subCategory
      });

      if (response.ok) {
        const result = await response.json();
        
        // Show success notification
        toast({
          title: "Service Added Successfully!",
          description: `"${subCategory}" has been added. $${result.paymentAmount} charged automatically.`,
          variant: "default"
        });

        // Update local service manager
        addService(subCategory, user?.username);

        // Update fee display
        setFee(`$${result.totalMonthlyFee}/month`);
        
        // Clear form and show success animation
        setMainCategory('');
        setCategory('');
        setSubCategory('');
        setAdded(true);
        
        // Auto-refresh after success
        setTimeout(() => {
          setAdded(false);
          window.location.reload();
        }, 2000);

      } else {
        const error = await response.json();
        throw new Error(error.message || 'Payment failed');
      }
    } catch (error) {
      console.error("Error processing service selection:", error);
      toast({
        title: "Error Processing Selection",
        description: "There was a problem with your service selection. Please try again.",
        variant: "destructive"
      });
      setIsAdding(false);
    }
  };
  
  return (
    <Card className="mb-6 border-blue-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50 pb-2">
        <CardTitle className="text-lg text-blue-700">Add Service (3-Step Selection)</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-500 mb-4">
          Use this for quick service addition, or go to the <a href="/add-service-category" className="text-blue-600 hover:underline">Add Service page</a> for more options.
        </p>
        
        <div className="space-y-4">
          {/* Step 1: Main Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Step 1: Select Main Category</label>
            <Select
              value={mainCategory}
              onValueChange={(value) => {
                setMainCategory(value);
              }}
            >
              <SelectTrigger className="w-full">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Step 2: Select Category</label>
            <Select
              value={category}
              onValueChange={setCategory}
              disabled={!mainCategory}
            >
              <SelectTrigger className="w-full">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Step 3: Select Service</label>
            <Select
              value={subCategory}
              onValueChange={setSubCategory}
              disabled={!category}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={category ? "Select a service" : "Select category first"} />
              </SelectTrigger>
              <SelectContent>
                {mainCategory === 'Design' && category === 'Civil Engineer' ? (
                  <>
                    <SelectItem value="Structural Engineering">Structural Engineering</SelectItem>
                    <SelectItem value="Site Development">Site Development</SelectItem>
                    <SelectItem value="Transportation Engineering">Transportation Engineering</SelectItem>
                    <SelectItem value="Water Resources">Water Resources</SelectItem>
                    <SelectItem value="Geotechnical Engineering">Geotechnical Engineering</SelectItem>
                    <SelectItem value="Utility Planning">Utility Planning</SelectItem>
                  </>
                ) : mainCategory === 'Design' && category === 'Urban Planner' ? (
                  <>
                    <SelectItem value="Land Use Planning">Land Use Planning</SelectItem>
                    <SelectItem value="Zoning Regulations & compliance">Zoning Regulations & compliance</SelectItem>
                    <SelectItem value="Community Development Plans">Community Development Plans</SelectItem>
                    <SelectItem value="Transportation Planning">Transportation Planning</SelectItem>
                    <SelectItem value="Environmental impact assessment">Environmental impact assessment</SelectItem>
                  </>
                ) : mainCategory === 'Design' && category === 'Landscape Architect' ? (
                  <>
                    <SelectItem value="Site Analysis & Master Planning">Site Analysis & Master Planning</SelectItem>
                    <SelectItem value="Planting Design">Planting Design</SelectItem>
                    <SelectItem value="Hardscape Design">Hardscape Design</SelectItem>
                    <SelectItem value="Irrigation & Drainage Systems">Irrigation & Drainage Systems</SelectItem>
                    <SelectItem value="Sustainable Landscape Design">Sustainable Landscape Design</SelectItem>
                  </>
                ) : mainCategory === 'Design' && category === 'Sustainability Consultant' ? (
                  <>
                    <SelectItem value="LEED Certification consulting">LEED Certification consulting</SelectItem>
                    <SelectItem value="Renewable Energy integration">Renewable Energy integration</SelectItem>
                    <SelectItem value="Building Envelope Optimization">Building Envelope Optimization</SelectItem>
                    <SelectItem value="Energy Modeling & Simulations">Energy Modeling & Simulations</SelectItem>
                    <SelectItem value="Green Materials & Construction Practices">Green Materials & Construction Practices</SelectItem>
                  </>
                ) : (
                  getSubcategoryOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleAddService} 
            disabled={isAdding || !subCategory}
            className={`bg-blue-500 hover:bg-blue-600 text-white ${added ? 'bg-green-600' : ''}`}
          >
            {isAdding ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : added ? (
              <span className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4" />
                Added Successfully
              </span>
            ) : (
              <span className="flex items-center">
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Service
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}