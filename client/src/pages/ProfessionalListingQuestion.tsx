import { useLocation } from "wouter";
import { useEffect } from "react";
import { NavigationState } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

type ProfessionalListingQuestionProps = {
  service: string;
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const ProfessionalListingQuestion = ({ service, navState, setNavState }: ProfessionalListingQuestionProps) => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleListingYes = async () => {
    // Check if the user is already logged in and is a professional
    if (user && user.isProfessional) {
      // First fetch the latest user data to ensure we have the most current service list
      try {
        const response = await fetch('/api/user', { 
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch updated user data');
        }
        
        const userData = await response.json();
        console.log("Fetched latest user data in ProfessionalListingQuestion:", userData);
        
        // Save the latest user data to session storage for other components to use
        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        // Get the most up-to-date service categories
        const currentServices = userData.user_service_categories || [];
        
        // Update localStorage with the current services
        localStorage.setItem('userServiceCategories', JSON.stringify(currentServices));
        
        // Now check if they already have this service category with the updated data
        const hasServiceCategory = currentServices.includes(service);
        
        if (hasServiceCategory) {
          toast({
            title: "Already Listed",
            description: `You are already listed as a ${service} professional. You can manage your profile from your account page.`,
            variant: "default",
          });
          // Redirect to their profile or account page
          setLocation('/my-account');
        } else {
          // Redirect to payment page for adding an additional category
          toast({
            title: "Adding Service Category",
            description: `You're already a professional. Let's add ${service} as an additional service category to your existing account.`,
            variant: "default",
          });
          
          // Store the new service category in localStorage for the payment page
          localStorage.setItem('additionalServiceCategory', service);
          // Also store the pending service
          localStorage.setItem('pendingServiceCategory', service);
          
          // Redirect directly to the payment page to add an additional category
          setLocation(`/professional-payment/${encodeURIComponent(service)}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Could not verify your current services. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      // New user - proceed with regular signup flow
      setLocation(`/professional-signup/${encodeURIComponent(service)}`);
    }
  };

  const handleListingNo = () => {
    setLocation(`/professionals/${encodeURIComponent(service)}/California/English`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardTitle className="font-heading text-2xl">{t('professional_directory')}</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold mb-4">
              {t('want_to_be_listed')}
            </h2>
            <p className="text-neutral-light mb-4 px-2">
              {t('get_discovered')} <span className="font-medium inline-block">{service}</span> {t('professionals')}. 
              {t('premium_listings')}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 mx-auto max-w-md">
              <p className="text-green-800 text-sm font-medium mb-1">{t('professional_listing_price')}</p>
              <p className="text-green-700 text-xs">{t('free_trial_info')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Button
              onClick={handleListingYes}
              className="p-6 h-auto flex flex-col items-center text-white bg-primary hover:bg-primary-dark min-h-[200px]"
            >
              <svg
                className="w-16 h-16 mb-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                <path d="M6 11h.01"></path>
                <path d="M10 11h.01"></path>
                <path d="M14 11h.01"></path>
                <path d="M18 11h.01"></path>
                <path d="M8 15h.01"></path>
                <path d="M12 15h.01"></path>
                <path d="M16 15h.01"></path>
              </svg>
              <span className="text-xl font-heading font-semibold mb-2 whitespace-normal">{t('yes')}</span>
              <div className="text-sm text-center w-full px-2 overflow-hidden">
                <span className="block">{t('want_to_be_listed_yes')}</span>
                <span className="block font-semibold truncate max-w-full">{t('for')} {service}</span>
              </div>
            </Button>

            <Button
              onClick={handleListingNo}
              className="p-6 h-auto flex flex-col items-center border border-red-600 text-red-700 hover:bg-red-600 hover:text-white min-h-[200px]"
              variant="outline"
            >
              <svg
                className="w-16 h-16 mb-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18"></path>
                <path d="m9 9 3 3"></path>
                <path d="m12 12 4-2"></path>
                <path d="m21 21-6-6"></path>
                <path d="M3 14h3c1.1 0 2-.9 2-2v0c0-1.1-.9-2-2-2H3"></path>
                <path d="M9 12v7"></path>
              </svg>
              <span className="text-xl font-heading font-semibold mb-2 whitespace-normal">{t('no')}</span>
              <div className="text-sm text-center w-full px-2 overflow-hidden">
                <span className="block">{t('want_to_browse')}</span>
                <span className="block font-semibold truncate max-w-full">{t('for')} {service} {t('professionals')}</span>
              </div>
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleListingNo}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
              variant="outline"
            >
              {t('continue_without_listing')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalListingQuestion;