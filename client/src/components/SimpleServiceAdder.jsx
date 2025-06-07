import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';
import { useToast } from "@/hooks/use-toast";
import { addService } from '@/lib/serviceManager';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SimpleServiceAdder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [category, setCategory] = useState('');
  
  // All services in a simple single dropdown
  const allServices = [
    // Finance & Real Estate
    { value: "Credit Repair Expert", label: "Credit Repair Expert" },
    { value: "Credit Score Analyst", label: "Credit Score Analyst" },
    { value: "Credit Rebuilding Advisor", label: "Credit Rebuilding Advisor" },
    { value: "Debt Management Counselor", label: "Debt Management Counselor" },
    { value: "Debt Settlement Negotiator", label: "Debt Settlement Negotiator" },
    { value: "Debt Consolidation Advisor", label: "Debt Consolidation Advisor" },
    { value: "Mortgage Broker", label: "Mortgage Broker" },
    { value: "Loan Officer", label: "Loan Officer" },
    { value: "Mortgage Banker", label: "Mortgage Banker" },
    { value: "FHA Loan Specialist", label: "FHA Loan Specialist" },
    { value: "Real Estate Agent", label: "Real Estate Agent" },
    { value: "Property Appraiser", label: "Property Appraiser" },
    { value: "Escrow Officer", label: "Escrow Officer" },
    { value: "Real Estate Attorney", label: "Real Estate Attorney" },
    { value: "Financial Planner", label: "Financial Planner" },
    
    // Build Home
    { value: "General Contractor", label: "General Contractor" },
    { value: "Foundation Specialist", label: "Foundation Specialist" },
    { value: "Carpentry", label: "Carpentry" },
    { value: "Electrician", label: "Electrician" },
    { value: "Plumber", label: "Plumber" },
    { value: "HVAC Technician", label: "HVAC Technician" },
    { value: "Roofing & Cladding", label: "Roofing & Cladding" },
    { value: "Flooring Specialist", label: "Flooring Specialist" },
    { value: "Painter & Sprayer", label: "Painter & Sprayer" },
    { value: "Solar Installer", label: "Solar Installer" },
    
    // Design Home
    { value: "Architect", label: "Architect" },
    { value: "Structural Engineer", label: "Structural Engineer" },
    { value: "Interior Designer", label: "Interior Designer" },
    { value: "Landscape Architect", label: "Landscape Architect" },
    { value: "Space Planning", label: "Space Planning" },
    { value: "Lighting Design", label: "Lighting Design" }
  ];
  
  const handleAddService = async () => {
    if (!category) {
      toast({
        title: "No service selected",
        description: "Please select a service category",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add the service
      const updatedServices = addService(category, user?.username);
      console.log("Adding service:", category);
      console.log("Updated services:", updatedServices);
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Service Added",
        description: `Successfully added ${category}. You will be charged an additional $5/month.`,
        variant: "default"
      });
      
      // Reset selection
      setCategory('');
      
      // Force reload after short delay to refresh page data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error("Error adding service:", error);
      toast({
        title: "Error",
        description: "There was a problem adding your service",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="mb-6 shadow-sm border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
        <CardTitle className="text-lg text-blue-700">Add New Service</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-500 mb-4">
          Select a service to add to your profile. Each additional service costs $5/month.
        </p>
        
        <div className="space-y-3">
          <div>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select service to add" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {allServices.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAddService}
            disabled={isSubmitting || !category || success}
            className={`w-full mt-2 ${success ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : success ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Service Added!
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Service ($5/month)
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}