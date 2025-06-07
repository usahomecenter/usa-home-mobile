import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { NavigationState } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import categoryData from "@/data/categoryData";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { User, Check, Settings } from "lucide-react";

type ProfessionalQuestionProps = {
  service: string;
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const ProfessionalQuestion = ({ service, navState, setNavState }: ProfessionalQuestionProps) => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // State to track already listed status to show custom UI instead of redirect
  const [alreadyListed, setAlreadyListed] = useState(false);
  const [alreadyListedService, setAlreadyListedService] = useState('');

  const handleConsumerPath = () => {
    setLocation(`/location-select/${encodeURIComponent(service)}`);
  };
  
  const handleProfessionalPath = () => {
    // Check if the user is already logged in and is a professional
    if (user && user.isProfessional) {
      // Check if they already have this service category
      const hasServiceCategory = user.serviceCategories && 
        Array.isArray(user.serviceCategories) && 
        user.serviceCategories.includes(service);
      
      if (hasServiceCategory) {
        // Instead of redirecting immediately, show our custom UI
        setAlreadyListed(true);
        setAlreadyListedService(service);
        
        toast({
          title: "Already Listed",
          description: `You are already listed as a ${service} professional. You can manage your profile from your account page.`,
          variant: "default",
        });
      } else {
        // Redirect to payment page for adding an additional category
        toast({
          title: "Adding Service Category",
          description: `You're already a professional. Let's add ${service} as an additional service category to your existing account.`,
          variant: "default",
        });
        
        // Store the new service category in localStorage for the payment page
        localStorage.setItem('additionalServiceCategory', service);
        
        // Redirect directly to add service category page for existing users
        setLocation('/add-service-category');
      }
    } else {
      // New user or non-professional user - proceed with regular flow
      setLocation(`/professional-listing-question/${encodeURIComponent(service)}`);
    }
  };

  // Helper function to check if a string is a third-level service
  const isThirdLevelService = (serviceName: string): { category: string, subcategory: string } | null => {
    // Check all categories and subcategories to find where this service appears as a third level item
    for (const [categoryKey, categoryObj] of Object.entries(categoryData as Record<string, any>)) {
      // Special case for Finance & Real Estate in Arabic
      const isFinanceCategory = 
        categoryKey === 'Finance & Real Estate' || 
        categoryKey === t('finance_real_estate') ||
        categoryKey === 'التمويل والعقارات';
        
      if (categoryObj.subcategories) {
        for (const [subCatKey, subCatObj] of Object.entries(categoryObj.subcategories as Record<string, any>)) {
          // If this subcategory has third level items and one matches our service
          if (subCatObj.thirdLevel && Object.keys(subCatObj.thirdLevel).includes(serviceName)) {
            // For Finance categories, always use "Finance & Real Estate" as the category key
            return {
              category: isFinanceCategory ? "Finance & Real Estate" : categoryKey,
              subcategory: subCatKey
            };
          }
        }
      }
    }
    return null;
  };

  // Function to handle going back based on breadcrumb
  const handleBackClick = () => {
    console.log("Back button clicked in ProfessionalQuestion. Service:", service, "NavState:", navState);

    // ** SPECIAL CASE: If the service is from the Finance & Real Estate section, go back directly to finance page
    // This is a quick fix for services like "Credit Repair Expert" which are defined in FinanceRealEstate.tsx directly
    const financeServices = [
      "Credit Repair Expert", "Debt Management Counselor", "Credit Score Analyst", 
      "Credit Dispute Specialist", "Credit Rebuilding Advisor", "Mortgage Broker", 
      "Loan Officer", "Mortgage Banker", "FHA Loan Specialist", 
      "Construction Loan Specialist", "Building Project Financier", "Architectural Finance Consultant",
      "Contractor Finance Advisor", "Renovation Loan Specialist", "Home Improvement Financial Advisor",
      "HELOC Specialist", "Green Improvement Financier", "Refinance Specialist",
      "Equity Release Consultant", "Debt Consolidation Advisor", "Debt Settlement Negotiator",
      "Cash-Out Refinance Specialist", "First-Time Homebuyer Counselor", "Down Payment Assistance Specialist",
      "Affordable Housing Consultant", "Investment Property Specialist", "REIT Advisor",
      "Property Portfolio Manager", "Real Estate Investment Consultant", "Real Estate Agent",
      "Property Appraiser", "Escrow Officer", "Real Estate Attorney",
      "Financial Planner", "Property Tax Consultant", "Estate Planning Attorney"
    ];
    
    if (financeServices.includes(service)) {
      console.log("Finance service detected, going back to Finance & Real Estate page");
      setNavState({
        currentView: 'finance',
        breadcrumb: {
          primary: 'Finance & Real Estate',
          secondary: null,
          tertiary: null
        }
      });
      setLocation('/finance');
      return;
    }

    // Check if we came from a third-level page based on navState
    if (navState.breadcrumb.tertiary && 
        navState.breadcrumb.primary !== null && 
        navState.breadcrumb.secondary !== null) {
        
      // We have a tertiary breadcrumb, which means we came from a third-level page
      console.log("Going back to third-level page based on breadcrumb:", navState.breadcrumb);
      
      // For Design Home, we need special handling
      const isDesignSection = 
        navState.breadcrumb.primary === 'Design Home' || 
        navState.breadcrumb.primary === t('design_home');
        
      // Get primary and secondary categories, ensuring they are strings
      const primaryCategory = isDesignSection ? "Design Home" : navState.breadcrumb.primary;
      const secondaryCategory = navState.breadcrumb.secondary;
      
      console.log(`Navigation back to third-level: primary=${primaryCategory}, secondary=${secondaryCategory}`);
      
      // Set navigation state first
      setNavState({
        currentView: 'third-level',
        breadcrumb: {
          primary: primaryCategory,
          secondary: secondaryCategory,
          tertiary: null
        }
      });
      
      // Navigate to the third level page
      setLocation(`/third-level/${encodeURIComponent(primaryCategory)}/${encodeURIComponent(secondaryCategory)}`);
      return;
    }
    
    // For design related navigation - handle all Design Home subcategories consistently
    if (navState.breadcrumb.primary === "Design Home" || 
        navState.breadcrumb.primary === t('design_home')) {
        
      // If we have a subcategory in the breadcrumb, use it for navigation back
      if (navState.breadcrumb.secondary) {
        const subcategory = navState.breadcrumb.secondary;
        console.log(`Going back to Design Home > ${subcategory}`);
        
        // Update navigation state to maintain consistent breadcrumb
        setNavState({
          currentView: 'third-level',
          breadcrumb: {
            primary: "Design Home",
            secondary: subcategory,
            tertiary: null
          }
        });
        
        // Use consistent URL structure for all Design & Planning subcategories
        setLocation(`/third-level/Design%20%26%20Planning/${encodeURIComponent(subcategory)}`);
        return;
      }
    }
    
    // Next, try to find a third-level service based on the current service name
    const thirdLevelInfo = isThirdLevelService(service);
    
    // If this is a third-level service, we should go back to its appropriate third-level page
    if (thirdLevelInfo) {
      console.log(`${service} is a third-level service under category=${thirdLevelInfo.category}, subcategory=${thirdLevelInfo.subcategory}`);
      
      // Handle Design & Planning specially
      const primaryBreadcrumb = thirdLevelInfo.category === "Design & Planning" ? "Design Home" : thirdLevelInfo.category;
      
      // Use a hardcoded URL for Design & Planning navigation to avoid encoding issues
      if (thirdLevelInfo.category === "Design & Planning") {
        setNavState({
          currentView: 'third-level',
          breadcrumb: {
            primary: "Design Home",
            secondary: thirdLevelInfo.subcategory,
            tertiary: service
          }
        });
        
        // Use the exact values expected by the backend
        setLocation(`/third-level/Design%20%26%20Planning/${encodeURIComponent(thirdLevelInfo.subcategory)}`);
        return;
      }
      
      // For non-design categories, use the normal encoding
      const subcategoryEncoded = encodeURIComponent(thirdLevelInfo.subcategory);
      const categoryEncoded = encodeURIComponent(thirdLevelInfo.category);
      
      setNavState({
        currentView: 'third-level',
        breadcrumb: {
          primary: primaryBreadcrumb,
          secondary: thirdLevelInfo.subcategory,
          tertiary: service
        }
      });
      
      // Navigate to the third level page for this service's parent category/subcategory
      setLocation(`/third-level/${categoryEncoded}/${subcategoryEncoded}`);
      return;
    }
    
    // This block is now handled by the first condition at the top of the function
    
    // For services accessed from subcategories pages
    if (navState.breadcrumb.secondary && navState.breadcrumb.secondary !== navState.breadcrumb.primary) {
      const primaryCategory = navState.breadcrumb.primary || "Build Home";
      const secondaryCategory = navState.breadcrumb.secondary;
      
      console.log("Going back to subcategories page:", primaryCategory, secondaryCategory);
      
      // For Design & Planning subcategories, always go back to the Design Home page
      const isDesignRelated = 
        primaryCategory === "Design Home" || 
        primaryCategory === t('design_home') || 
        secondaryCategory === "Design & Planning" ||
        secondaryCategory.includes("Design");
        
      if (isDesignRelated) {
        setNavState({
          currentView: 'design-home',
          breadcrumb: {
            primary: t('design_home'),
            secondary: null,
            tertiary: null
          }
        });
        setLocation('/design-home');
        return;
      }
      
      // For non-design subcategories, go to the appropriate subcategories page
      setNavState({
        currentView: 'subcategories',
        breadcrumb: {
          primary: primaryCategory,
          secondary: secondaryCategory,
          tertiary: null
        }
      });
      setLocation(`/subcategories/${encodeURIComponent(primaryCategory)}`);
      return;
    }
    
    // Handle navigation based on primary breadcrumb for cases not handled above
    if (navState.breadcrumb.primary === 'Finance & Real Estate' || 
        navState.breadcrumb.primary === t('finance_real_estate') ||
        navState.breadcrumb.primary === 'التمويل والعقارات') {
      // Go back to finance page
      console.log("Going back to Finance & Real Estate page");
      setNavState({
        currentView: 'finance',
        breadcrumb: {
          primary: t('finance_real_estate'),
          secondary: null,
          tertiary: null
        }
      });
      setLocation('/finance');
    } else if (navState.breadcrumb.primary === 'Design Home' || 
               navState.breadcrumb.primary === t('design_home')) {
      // Go back to design home
      setNavState({
        currentView: 'design-home',
        breadcrumb: {
          primary: t('design_home'),
          secondary: null,
          tertiary: null
        }
      });
      setLocation('/design-home');
    } else {
      // Default case - go back to build home
      setNavState({
        currentView: 'build-home',
        breadcrumb: {
          primary: t('build_home'),
          secondary: null,
          tertiary: null
        }
      });
      setLocation('/build-home');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardTitle className="font-heading text-2xl">{t('professional_finder')}</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {alreadyListed ? (
            // Custom UI for already listed professionals
            <div className="text-center">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <Check className="w-8 h-8 animate-pulse" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-2">
                  {t('already_listed')}
                </h2>
                <p className="text-neutral-light mb-6 max-w-lg">
                  {t('already_listed_message_1')} <span className="font-semibold">{alreadyListedService}</span> {t('already_listed_message_2')}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Button 
                    className="flex-1 bg-primary text-white hover:bg-primary-dark flex items-center justify-center gap-2"
                    onClick={() => setLocation('/my-account')}
                  >
                    <User className="w-4 h-4" />
                    {t('go_to_my_account')}
                  </Button>
                  <Button 
                    className="flex-1 bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center justify-center gap-2"
                    variant="outline"
                    onClick={handleBackClick}
                  >
                    <Settings className="w-4 h-4" />
                    {t('back_to_services')}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Original UI for other cases
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold mb-4 px-2">
                  {t('are_you_professional')}
                </h2>
                <p className="text-neutral-light mb-4">
                  {t('professional_question_desc')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  onClick={handleProfessionalPath}
                  className="p-6 h-auto flex flex-col items-center border border-green-600 text-green-700 hover:bg-green-600 hover:text-white min-h-[200px]"
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
                    <path d="M2 12a5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5 5 5 0 0 0-5 5z"></path>
                    <path d="M12 7v10" />
                    <path d="M17 22h5v-5" />
                    <path d="M17 13l5 5" />
                    <path d="M17 2h5v5" />
                    <path d="M17 7l5-5" />
                  </svg>
                  <span className="text-xl font-heading font-semibold mb-2 whitespace-normal">{t('yes')}</span>
                  <div className="text-sm text-center w-full px-2 overflow-hidden">
                    <span className="block text-sm">{t('i_am_professional')}</span>
                    <span className="block font-semibold truncate max-w-full">{service}</span>
                    <span className="block text-sm">{t('want_listed')}</span>
                  </div>
                </Button>

                <Button
                  onClick={handleConsumerPath}
                  className="p-6 h-auto flex flex-col items-center border border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white min-h-[200px]"
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12h8"></path>
                    <path d="M12 8v8"></path>
                  </svg>
                  <span className="text-xl font-heading font-semibold mb-2 whitespace-normal">{t('no')}</span>
                  <div className="text-sm text-center w-full px-2 overflow-hidden">
                    <span className="block text-sm">{t('looking_for_professionals')}</span>
                    <span className="block font-semibold truncate max-w-full">{service}</span>
                    <span className="block text-sm">services</span>
                  </div>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <Button
          onClick={handleBackClick}
          variant="outline"
          className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-button transition-colors flex items-center mx-auto"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {t('back')}
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalQuestion;