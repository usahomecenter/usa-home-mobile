import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from "@/hooks/use-toast";
import { addService, calculateMonthlyFee } from '@/lib/serviceManager';
import { useLocation } from 'wouter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FixedServiceAdder() {
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
  
  // Reset subsequent selections when a higher level changes
  useEffect(() => {
    setCategory('');
    setSubCategory('');
  }, [mainCategory]);
  
  useEffect(() => {
    setSubCategory('');
  }, [category]);
  
  const handleAddService = () => {
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
      // Store the selected service in localStorage for the payment page
      localStorage.setItem('pendingServiceCategory', subCategory);
      
      // Show temporary success notification
      toast({
        title: "Service Selected",
        description: `Proceeding to payment for "${subCategory}"`,
        variant: "default"
      });
      
      // Clear form and show success animation
      setMainCategory('');
      setCategory('');
      setSubCategory('');
      setAdded(true);
      
      // Use proper navigation instead of window.location for better reliability
      setTimeout(() => {
        navigate('/add-service-category');
      }, 1500);
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
        <CardTitle className="text-lg text-blue-700">Add Service (Fixed Version)</CardTitle>
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
                {mainCategory === 'Design' ? (
                  <>
                    <SelectItem value="Architect">Architect</SelectItem>
                    <SelectItem value="Structural Engineer">Structural Engineer</SelectItem>
                    <SelectItem value="Civil Engineer">Civil Engineer</SelectItem>
                    <SelectItem value="Urban Planner">Urban Planner</SelectItem>
                    <SelectItem value="Interior Designer">Interior Designer</SelectItem>
                    <SelectItem value="Landscape Architect">Landscape Architect</SelectItem>
                    <SelectItem value="Sustainability Consultant">Sustainability Consultant</SelectItem>
                  </>
                ) : mainCategory === 'Build' ? (
                  <>
                    <SelectItem value="Construction & Building">Construction & Building</SelectItem>
                    <SelectItem value="MEP (Mechanical, Electrical, Plumbing)">MEP (Mechanical, Electrical, Plumbing)</SelectItem>
                    <SelectItem value="Utilities & Infrastructure">Utilities & Infrastructure</SelectItem>
                    <SelectItem value="Renewable & Solar">Renewable & Solar</SelectItem>
                    <SelectItem value="Energy & Building Systems">Energy & Building Systems</SelectItem>
                    <SelectItem value="Environmental & Compliance">Environmental & Compliance</SelectItem>
                    <SelectItem value="Additional Expertise">Additional Expertise</SelectItem>
                  </>
                ) : mainCategory === 'Finance' ? (
                  <>
                    <SelectItem value="Credit Repair Specialists">Credit Repair Specialists</SelectItem>
                    <SelectItem value="Debt Management">Debt Management</SelectItem>
                    <SelectItem value="Mortgage & Loan Professionals">Mortgage & Loan Professionals</SelectItem>
                    <SelectItem value="Construction Finance Experts">Construction Finance Experts</SelectItem>
                    <SelectItem value="Home Improvement Financing">Home Improvement Financing</SelectItem>
                    <SelectItem value="Equity & Refinance Specialists">Equity & Refinance Specialists</SelectItem>
                    <SelectItem value="First Time Buyer Specialist">First Time Buyer Specialist</SelectItem>
                    <SelectItem value="Real Estate Investment Expert">Real Estate Investment Expert</SelectItem>
                    <SelectItem value="Real Estate & Property Professionals">Real Estate & Property Professionals</SelectItem>
                    <SelectItem value="Financial & Legal Advisors">Financial & Legal Advisors</SelectItem>
                  </>
                ) : null}
              </SelectContent>
            </Select>
          </div>
          
          {/* Step 3: Subcategory/Service - FIXED VERSION */}
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
                {/* Design Home subcategories - explicitly hardcoded */}
                {mainCategory === 'Design' && category === 'Architect' && (
                  <>
                    <SelectItem value="Concept Development">Concept Development</SelectItem>
                    <SelectItem value="Schematic Design">Schematic Design</SelectItem>
                    <SelectItem value="Design Development">Design Development</SelectItem>
                    <SelectItem value="Construction Documentation">Construction Documentation</SelectItem>
                    <SelectItem value="3D Modeling & Visualization">3D Modeling & Visualization</SelectItem>
                  </>
                )}
                
                {mainCategory === 'Design' && category === 'Structural Engineer' && (
                  <>
                    <SelectItem value="Structural Analysis">Structural Analysis</SelectItem>
                    <SelectItem value="Material Selection">Material Selection</SelectItem>
                    <SelectItem value="Foundation Design">Foundation Design</SelectItem>
                    <SelectItem value="Seismic & Wind Analysis">Seismic & Wind Analysis</SelectItem>
                    <SelectItem value="Reinforcement Detailing">Reinforcement Detailing</SelectItem>
                  </>
                )}
                
                {mainCategory === 'Design' && category === 'Civil Engineer' && (
                  <>
                    <SelectItem value="Structural Engineering">Structural Engineering</SelectItem>
                    <SelectItem value="Site Development">Site Development</SelectItem>
                    <SelectItem value="Transportation Engineering">Transportation Engineering</SelectItem>
                    <SelectItem value="Water Resources">Water Resources</SelectItem>
                    <SelectItem value="Geotechnical Engineering">Geotechnical Engineering</SelectItem>
                    <SelectItem value="Utility Planning">Utility Planning</SelectItem>
                  </>
                )}
                
                {mainCategory === 'Design' && category === 'Urban Planner' && (
                  <>
                    <SelectItem value="Land Use Planning">Land Use Planning</SelectItem>
                    <SelectItem value="Zoning Regulations & compliance">Zoning Regulations & compliance</SelectItem>
                    <SelectItem value="Community Development Plans">Community Development Plans</SelectItem>
                    <SelectItem value="Transportation Planning">Transportation Planning</SelectItem>
                    <SelectItem value="Environmental impact assessment">Environmental impact assessment</SelectItem>
                  </>
                )}
                
                {mainCategory === 'Design' && category === 'Interior Designer' && (
                  <>
                    <SelectItem value="Space Planning">Space Planning</SelectItem>
                    <SelectItem value="Furniture & Fixtures Selection">Furniture & Fixtures Selection</SelectItem>
                    <SelectItem value="Material & Finish Selection">Material & Finish Selection</SelectItem>
                    <SelectItem value="Lighting Design">Lighting Design</SelectItem>
                    <SelectItem value="Acoustical Design">Acoustical Design</SelectItem>
                  </>
                )}
                
                {mainCategory === 'Design' && category === 'Landscape Architect' && (
                  <>
                    <SelectItem value="Site Analysis & Master Planning">Site Analysis & Master Planning</SelectItem>
                    <SelectItem value="Planting Design">Planting Design</SelectItem>
                    <SelectItem value="Hardscape Design">Hardscape Design</SelectItem>
                    <SelectItem value="Irrigation & Drainage Systems">Irrigation & Drainage Systems</SelectItem>
                    <SelectItem value="Sustainable Landscape Design">Sustainable Landscape Design</SelectItem>
                  </>
                )}
                
                {mainCategory === 'Design' && category === 'Sustainability Consultant' && (
                  <>
                    <SelectItem value="LEED Certification consulting">LEED Certification consulting</SelectItem>
                    <SelectItem value="Renewable Energy integration">Renewable Energy integration</SelectItem>
                    <SelectItem value="Building Envelope Optimization">Building Envelope Optimization</SelectItem>
                    <SelectItem value="Energy Modeling & Simulations">Energy Modeling & Simulations</SelectItem>
                    <SelectItem value="Green Materials & Construction Practices">Green Materials & Construction Practices</SelectItem>
                  </>
                )}

                {/* Build Home subcategories */}
                {mainCategory === 'Build' && category === 'Construction & Building' && (
                  <>
                    <SelectItem value="General Contractor">General Contractor</SelectItem>
                    <SelectItem value="Foundation Specialist">Foundation Specialist</SelectItem>
                    <SelectItem value="Structural Steel & Framing">Structural Steel & Framing</SelectItem>
                    <SelectItem value="Masonry & Bricklayer">Masonry & Bricklayer</SelectItem>
                    <SelectItem value="Carpentry">Carpentry</SelectItem>
                    <SelectItem value="Welding & Material Fabrication">Welding & Material Fabrication</SelectItem>
                    <SelectItem value="Roofing & Cladding">Roofing & Cladding</SelectItem>
                    <SelectItem value="Window & Door Installer">Window & Door Installer</SelectItem>
                    <SelectItem value="Insulation Contractor">Insulation Contractor</SelectItem>
                    <SelectItem value="Drywall & Plasterer">Drywall & Plasterer</SelectItem>
                    <SelectItem value="Flooring Specialist">Flooring Specialist</SelectItem>
                    <SelectItem value="Painter & Sprayer">Painter & Sprayer</SelectItem>
                    <SelectItem value="Cabinetmaker & Millworker">Cabinetmaker & Millworker</SelectItem>
                    <SelectItem value="Pool Builder">Pool Builder</SelectItem>
                    <SelectItem value="Gardening & Landscaping Expert">Gardening & Landscaping Expert</SelectItem>
                  </>
                )}
                
                {mainCategory === 'Build' && category === 'MEP (Mechanical, Electrical, Plumbing)' && (
                  <>
                    <SelectItem value="HVAC Technician">HVAC Technician</SelectItem>
                    <SelectItem value="Electrician">Electrician</SelectItem>
                    <SelectItem value="Plumber">Plumber</SelectItem>
                  </>
                )}
                
                {/* Add more Build subcategories here */}
                
                {/* Finance & Real Estate subcategories */}
                {mainCategory === 'Finance' && category === 'Credit Repair Specialists' && (
                  <>
                    <SelectItem value="Credit Repair Expert">Credit Repair Expert</SelectItem>
                    <SelectItem value="Credit Score Analyst">Credit Score Analyst</SelectItem>
                    <SelectItem value="Credit Rebuilding Advisor">Credit Rebuilding Advisor</SelectItem>
                  </>
                )}
                
                {mainCategory === 'Finance' && category === 'Debt Management' && (
                  <>
                    <SelectItem value="Debt Management Counselor">Debt Management Counselor</SelectItem>
                    <SelectItem value="Debt Settlement Negotiator">Debt Settlement Negotiator</SelectItem>
                    <SelectItem value="Debt Consolidation Advisor">Debt Consolidation Advisor</SelectItem>
                  </>
                )}
                
                {mainCategory === 'Finance' && category === 'Mortgage & Loan Professionals' && (
                  <>
                    <SelectItem value="Loan Officer">Loan Officer</SelectItem>
                    <SelectItem value="Mortgage Broker">Mortgage Broker</SelectItem>
                    <SelectItem value="Loan Processor">Loan Processor</SelectItem>
                  </>
                )}
                
                {/* Add more Finance subcategories here */}
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