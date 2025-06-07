import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addService, calculateMonthlyFee } from '@/lib/serviceManager';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, CheckCircle } from 'lucide-react';

/**
 * A component for quickly adding a new service without going through the full flow
 */
export default function QuickAddService() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newService, setNewService] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [fee, setFee] = useState('');
  
  const handleAddService = () => {
    if (!newService.trim()) {
      toast({
        title: "Service name required",
        description: "Please enter a service name to add",
        variant: "destructive"
      });
      return;
    }
    
    setIsAdding(true);
    
    // Add the service using our service manager
    try {
      const updatedServices = addService(newService, user?.username);
      console.log("Successfully added service:", newService);
      console.log("Updated service list:", updatedServices);
      
      // Calculate new fee based on updated services
      const updatedFee = calculateMonthlyFee(user?.username);
      setFee(updatedFee);
      
      // Show success confirmation
      toast({
        title: "Service Added",
        description: `Successfully added "${newService}" to your services`,
        variant: "default"
      });
      
      // Clear input and show success state
      setNewService('');
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
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
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-2">
        <CardTitle className="text-lg text-emerald-700">Add a New Service</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter new service name..."
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            className="flex-1 border-emerald-200 focus:border-emerald-400"
          />
          <Button 
            onClick={handleAddService} 
            disabled={isAdding || !newService.trim()}
            className={`bg-emerald-500 hover:bg-emerald-600 text-white ${added ? 'bg-green-600' : ''}`}
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
          <div className="mt-2 text-sm text-gray-600">
            New monthly fee: <span className="font-semibold text-emerald-700">{fee}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}