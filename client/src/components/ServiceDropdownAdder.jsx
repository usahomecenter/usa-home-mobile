import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from "@/hooks/use-toast";
import { addService, calculateMonthlyFee } from '@/lib/serviceManager';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServiceDropdownAdder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [fee, setFee] = useState('');
  
  // State to track the currently selected main category
  const [mainCategory, setMainCategory] = useState('');
  
  // Main categories that match the app structure
  const mainCategories = [
    { value: "Build", label: "Build Home" },
    { value: "Design", label: "Design Home" },
    { value: "Finance", label: "Finance & Real Estate" }
  ];
  
  // Service options based on main category
  const getServiceOptions = () => {
    if (mainCategory === 'Build') {
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
        { value: "Gardening & Landscaping Expert", label: "Gardening & Landscaping Expert" },
        { value: "HVAC Technician", label: "HVAC Technician" },
        { value: "Electrician", label: "Electrician" },
        { value: "Plumber", label: "Plumber" },
        { value: "Home Automation Specialist", label: "Home Automation Specialist" },
        { value: "Solar Installer", label: "Solar Installer" }
      ];
    } else if (mainCategory === 'Design') {
      return [
        { value: "Architect", label: "Architect" },
        { value: "Structural Engineer", label: "Structural Engineer" },
        { value: "Civil Engineer", label: "Civil Engineer" },
        { value: "Urban Planner", label: "Urban Planner" },
        { value: "Interior Designer", label: "Interior Designer" },
        { value: "Landscape Architect", label: "Landscape Architect" },
        { value: "Sustainability Consultant", label: "Sustainability Consultant" },
        { value: "3D Modeling & Visualization", label: "3D Modeling & Visualization" },
        { value: "Lighting Design", label: "Lighting Design" },
        { value: "Acoustical Design", label: "Acoustical Design" },
        { value: "Space Planning", label: "Space Planning" },
        { value: "Planting Design", label: "Planting Design" },
        { value: "Hardscape Design", label: "Hardscape Design" }
      ];
    } else if (mainCategory === 'Finance') {
      return [
        { value: "Credit Repair Expert", label: "Credit Repair Expert" },
        { value: "Debt Management Counselor", label: "Debt Management Counselor" },
        { value: "Debt Settlement Negotiator", label: "Debt Settlement Negotiator" },
        { value: "Debt Consolidation Advisor", label: "Debt Consolidation Advisor" },
        { value: "Mortgage Broker", label: "Mortgage Broker" },
        { value: "Loan Officer", label: "Loan Officer" },
        { value: "Mortgage Banker", label: "Mortgage Banker" },
        { value: "FHA Loan Specialist", label: "FHA Loan Specialist" },
        { value: "Construction Loan Specialist", label: "Construction Loan Specialist" },
        { value: "Renovation Loan Specialist", label: "Renovation Loan Specialist" },
        { value: "Refinance Specialist", label: "Refinance Specialist" },
        { value: "Property Appraiser", label: "Property Appraiser" },
        { value: "Real Estate Agent", label: "Real Estate Agent" },
        { value: "Real Estate Attorney", label: "Real Estate Attorney" },
        { value: "Financial Planner", label: "Financial Planner" },
        { value: "Tax Specialist", label: "Tax Specialist" }
      ];
    } else {
      return [];
    }
  };
  
  const handleAddService = () => {
    if (!selectedService) {
      toast({
        title: "No service selected",
        description: "Please select a service from the dropdown",
        variant: "destructive"
      });
      return;
    }
    
    setIsAdding(true);
    
    // Add the service using our service manager
    try {
      const updatedServices = addService(selectedService, user?.username);
      console.log("Successfully added service:", selectedService);
      console.log("Updated service list:", updatedServices);
      
      // Calculate new fee based on updated services
      const updatedFee = calculateMonthlyFee(user?.username);
      setFee(updatedFee);
      
      // Show success confirmation
      toast({
        title: "Service Added",
        description: `Successfully added "${selectedService}" to your services`,
        variant: "default"
      });
      
      // Clear selection and show success state
      setSelectedService('');
      setMainCategory('');
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      
      // Refresh page after short delay to ensure UI updates
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error adding service:", error);
      toast({
        title: "Error Adding Service",
        description: "There was a problem adding your service",
        variant: "destructive"
      });
    }
    
    setIsAdding(false);
  };
  
  return (
    <Card className="mb-6 border-blue-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50 pb-2">
        <CardTitle className="text-lg text-blue-700">Quick Add Service</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-500 mb-4">
          Use this for quick service addition, or go to the <a href="/add-service-category" className="text-blue-600 hover:underline">Add Service page</a> for more options.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Step 1: Select Category</label>
            <Select
              value={mainCategory}
              onValueChange={(value) => {
                setMainCategory(value);
                setSelectedService('');
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Step 2: Select Service</label>
            <Select
              value={selectedService}
              onValueChange={setSelectedService}
              disabled={!mainCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={mainCategory ? "Select a service" : "Select category first"} />
              </SelectTrigger>
              <SelectContent>
                {getServiceOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddService} 
            disabled={isAdding || !selectedService}
            className={`bg-blue-500 hover:bg-blue-600 text-white ${added ? 'bg-green-600' : ''}`}
          >
            {isAdding ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : added ? (
              <span className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4" />
                Added!
              </span>
            ) : (
              <span className="flex items-center">
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Service
              </span>
            )}
          </Button>
        </div>
        
        {fee && (
          <div className="mt-4 text-sm text-gray-600 border-t pt-2">
            New monthly fee: <span className="font-semibold text-blue-700">{fee}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}