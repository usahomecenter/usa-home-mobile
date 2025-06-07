import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

type ProfessionalSuccessProps = {
  service: string;
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const ProfessionalSuccess = ({ service, navState, setNavState }: ProfessionalSuccessProps) => {
  const [, setLocation] = useLocation();
  const [selectedState, setSelectedState] = useState<string>("Arizona");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Albanian");
  
  // Retrieve stored information from localStorage if available
  useEffect(() => {
    const storedState = localStorage.getItem("selectedState");
    const storedLanguage = localStorage.getItem("selectedLanguage");
    
    if (storedState) {
      setSelectedState(storedState);
    }
    
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
  }, []);

  const handleViewListing = () => {
    setLocation(`/professionals/${encodeURIComponent(service)}/${encodeURIComponent(selectedState)}/${encodeURIComponent(selectedLanguage)}`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardTitle className="font-heading text-2xl">Congratulations!</CardTitle>
          <CardDescription className="text-white/90">
            Your professional profile has been created
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-14 h-14 text-green-500" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-heading font-bold mb-4">
            Your profile has been listed among our {service} professional agents!
          </h2>
          
          <div className="max-w-lg mx-auto">
            <p className="text-neutral-light mb-8">
              Thank you for joining our network of professionals! Your profile is now live and 
              available to homeowners looking for {service} services. Remember, you can update 
              your profile information at any time through your account dashboard.
            </p>

            <div className="bg-primary/10 rounded-lg p-6 mb-8">
              <h3 className="font-heading font-semibold text-lg mb-2">Your Free Trial Has Started</h3>
              <p className="text-neutral-light">
                Your 30-day free trial has begun. You won't be charged until the trial period ends
                ({new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}), 
                and you can cancel anytime. After the trial, your subscription will automatically 
                continue at $29.77/month.
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleViewListing}
                className="bg-primary text-white hover:bg-primary-dark py-6 px-8 text-lg font-medium"
              >
                View Your Listing
                <svg 
                  className="w-5 h-5 ml-2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalSuccess;