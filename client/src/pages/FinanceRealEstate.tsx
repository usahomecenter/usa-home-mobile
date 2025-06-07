import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Search,
  DollarSign,
  ChevronLeft,
  RefreshCw,
  CreditCard,
  BarChart,
  FileText,
  TrendingUp
} from "lucide-react";
import { FinanceIcon } from "@/components/FinanceIcon";
import { ColorfulIcon } from "@/components/ColorfulIcon";

type FinanceRealEstateProps = {
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
  navState?: NavigationState; // Make navState optional since it might not be provided
  categoryParam?: string; // Added: parameter from URL for direct category access
};

type FinanceCategory = {
  letter: string;
  name: string;
  translationKey?: string;
  services: FinanceService[];
};

type FinanceService = {
  name: string;
  icon: string;
  description: string;
};

// Comprehensive finance and real estate professionals organized by functional categories
const financeServiceCategories: FinanceCategory[] = [
  {
    letter: "C",
    name: "Credit Repair Specialists",
    translationKey: "credit_repair_specialists",
    services: [
      {
        name: "Credit Repair Expert",
        icon: "RefreshCw", // Using consistent icon names
        description: "Specialized professionals who help restore and improve your credit score through legitimate dispute processes and credit rebuilding strategies."
      },
      {
        name: "Credit Score Analyst",
        icon: "BarChart", // Using consistent icon names
        description: "Professionals who analyze your credit report to identify issues and develop a personalized plan to improve your credit score."
      },
      {
        name: "Credit Rebuilding Advisor",
        icon: "TrendingUp",
        description: "Professionals who help you develop healthy credit habits and implement strategies to rebuild your credit after financial hardship."
      }
    ]
  },
  {
    letter: "D",
    name: "Debt Management",
    translationKey: "debt_management",
    services: [
      {
        name: "Debt Management Counselor",
        icon: "CreditCard", // Using consistent icon names
        description: "Financial professionals who create personalized plans to help you manage and reduce your debt through budgeting, consolidation, and negotiation."
      },
      {
        name: "Debt Settlement Negotiator",
        icon: "Scale",
        description: "Specialists who negotiate with creditors to reduce the total amount of debt owed before developing a repayment plan."
      },
      {
        name: "Debt Consolidation Advisor",
        icon: "FileText",
        description: "Financial professionals who help combine multiple debts into a single, more manageable payment."
      }
    ]
  },
  {
    letter: "1",
    name: "Mortgage & Loan Professionals",
    translationKey: "mortgage_loan_professionals",
    services: [
      {
        name: "Mortgage Broker",
        icon: "Users",
        description: "Expert professionals who connect you with the best mortgage rates and terms for your specific needs."
      },
      {
        name: "Loan Officer",
        icon: "FileText",
        description: "Financial specialists who help you navigate various loan options for home purchases and refinancing."
      },
      {
        name: "Mortgage Banker",
        icon: "Building",
        description: "Banking professionals who directly fund mortgage loans and manage the entire lending process."
      },
      {
        name: "FHA Loan Specialist",
        icon: "Award",
        description: "Experts in government-backed loans designed for first-time homebuyers with lower down payment requirements."
      }
    ]
  },
  {
    letter: "2",
    name: "Construction Finance Experts",
    translationKey: "construction_finance_experts",
    services: [
      {
        name: "Construction Loan Specialist",
        icon: "Building",
        description: "Financial professionals specializing in securing funding for new home construction projects."
      },
      {
        name: "Building Project Financier",
        icon: "DollarSign",
        description: "Experts who help arrange comprehensive financing packages for large construction projects."
      },
      {
        name: "Architectural Finance Consultant",
        icon: "PenTool",
        description: "Specialists who connect architectural firms with appropriate financing options for clients."
      },
      {
        name: "Contractor Finance Advisor",
        icon: "Wrench",
        description: "Financial professionals who help contractors secure project funding and manage payment schedules."
      }
    ]
  },
  {
    letter: "3",
    name: "Home Improvement Financing",
    translationKey: "home_improvement_financing",
    services: [
      {
        name: "Renovation Loan Specialist",
        icon: "Home",
        description: "Experts in securing financing options specifically for home renovation and remodeling projects."
      },
      {
        name: "Home Improvement Financial Advisor",
        icon: "TrendingUp",
        description: "Professionals who help homeowners plan and finance their property improvement projects."
      },
      {
        name: "HELOC Specialist",
        icon: "CreditCard",
        description: "Experts in home equity lines of credit who help homeowners leverage their property value for renovations."
      },
      {
        name: "Green Improvement Financier",
        icon: "Leaf",
        description: "Specialists in obtaining loans and incentives for energy-efficient home improvements."
      }
    ]
  },
  {
    letter: "4",
    name: "Equity & Refinance Specialists",
    translationKey: "equity_refinance_specialists",
    services: [
      {
        name: "Refinance Specialist",
        icon: "RefreshCw",
        description: "Professionals who help homeowners replace existing mortgages with better terms or rates."
      },
      {
        name: "Equity Release Consultant",
        icon: "Unlock",
        description: "Experts who help homeowners access the value in their property without selling."
      },
      {
        name: "Cash-Out Refinance Specialist",
        icon: "DollarSign",
        description: "Experts who help homeowners replace their mortgage with a larger loan to access equity in cash."
      }
    ]
  },
  {
    letter: "5",
    name: "First Time Buyer Specialist",
    translationKey: "first_time_buyer_specialist",
    services: [
      {
        name: "First-Time Homebuyer Counselor",
        icon: "Users",
        description: "Professionals who guide first-time buyers through the entire home purchasing process."
      },
      {
        name: "Down Payment Assistance Specialist",
        icon: "PiggyBank",
        description: "Experts in programs that provide financial aid to help cover the initial down payment on a home purchase."
      },
      {
        name: "Affordable Housing Consultant",
        icon: "Home",
        description: "Specialists who connect buyers with affordable housing options and associated financing programs."
      }
    ]
  },
  {
    letter: "6",
    name: "Real Estate Investment Experts",
    translationKey: "real_estate_investment_experts",
    services: [
      {
        name: "Investment Property Specialist",
        icon: "Building",
        description: "Financial advisors who focus on helping clients purchase and finance income-producing properties."
      },
      {
        name: "REIT Advisor",
        icon: "BarChart",
        description: "Professionals specializing in real estate investment trusts and other property-based securities."
      },
      {
        name: "Property Portfolio Manager",
        icon: "Grid",
        description: "Experts who manage multiple investment properties and their associated financial considerations."
      },
      {
        name: "Real Estate Investment Consultant",
        icon: "TrendingUp",
        description: "Strategic advisors for individuals looking to build wealth through property investments."
      }
    ]
  },
  {
    letter: "7",
    name: "Real Estate & Property Professionals",
    translationKey: "real_estate_property_professionals",
    services: [
      {
        name: "Real Estate Agent",
        icon: "Home",
        description: "Licensed professionals who help buyers and sellers navigate the real estate market."
      },
      {
        name: "Property Appraiser",
        icon: "Search",
        description: "Experts who determine the market value of properties for financing, selling, or tax purposes."
      },
      {
        name: "Escrow Officer",
        icon: "Shield",
        description: "Professionals who manage the transfer of funds and documents during property transactions."
      },
      {
        name: "Real Estate Attorney",
        icon: "FileText",
        description: "Legal professionals specializing in property transactions, contracts, and real estate law."
      }
    ]
  },
  {
    letter: "8",
    name: "Financial & Legal Advisors",
    translationKey: "financial_legal_advisors",
    services: [
      {
        name: "Financial Planner",
        icon: "Calendar",
        description: "Comprehensive financial advisors who help with budgeting, investments, and long-term planning for homeownership."
      },
      {
        name: "Property Tax Consultant",
        icon: "FileText",
        description: "Specialists who help homeowners manage and potentially reduce their property tax obligations."
      },
      {
        name: "Estate Planning Attorney",
        icon: "Book",
        description: "Legal experts who help homeowners plan for the future of their property and assets."
      },
      {
        name: "Investment Advisor",
        icon: "TrendingUp",
        description: "Professionals who provide guidance on investment opportunities related to real estate and property."
      },
      {
        name: "Tax Specialist",
        icon: "DollarSign",
        description: "Experts who help homeowners navigate tax implications and benefits of property ownership."
      }
    ]
  }
];

const FinanceRealEstate = ({ 
  setNavState, 
  navState = { currentView: 'finance', breadcrumb: { primary: null, secondary: null, tertiary: null } },
  categoryParam 
}: FinanceRealEstateProps) => {
  const [_, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FinanceCategory | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(true);
  
  // Using the useLanguage hook properly
  const { t } = useLanguage();

  // Update navigation state when landing on this page directly
  useEffect(() => {
    console.log("=== FINANCE PAGE LOADED ===");
    console.log("Setting navigation state in FinanceRealEstate component");
    
    // Check if we have a category parameter from the URL
    if (categoryParam) {
      console.log("Category parameter from URL:", categoryParam);
      
      // Find the matching category in our data
      const matchingCategory = financeServiceCategories.find(
        cat => cat.name === categoryParam
      );
      
      console.log("Found matching category for URL param?", !!matchingCategory);
      
      if (matchingCategory) {
        // Set navigation state to show we're viewing this category
        setNavState({
          currentView: 'subcategories',
          breadcrumb: {
            primary: t('finance_real_estate'),
            secondary: matchingCategory.name,
            tertiary: null
          }
        });
        
        // Show the services for this category
        setSelectedCategory(matchingCategory);
        setShowAllCategories(false);
        
        // Store the selected category for back navigation
        try {
          let categoryToStore = {
            name: matchingCategory.name,
            letter: matchingCategory.letter,
            translationKey: matchingCategory.translationKey || null
          };
          
          sessionStorage.setItem('financeSelectedCategory', JSON.stringify(categoryToStore));
          console.log("Stored category in session storage:", matchingCategory.name);
        } catch (e) {
          console.error("Failed to store category in session storage:", e);
        }
        
        // Skip the rest of the effect since we've already set up the view
        return;
      }
    }

    // If no category parameter or no matching category, check for stored category 
    // or show the default view
    
    // Check if we have a stored selected category from a previous visit
    try {
      const storedCategoryJson = sessionStorage.getItem('financeSelectedCategory');
      console.log("Found stored category in session storage?", !!storedCategoryJson);
      
      if (storedCategoryJson) {
        const storedCategory = JSON.parse(storedCategoryJson);
        console.log("Stored finance category:", storedCategory.name);
        
        // Find the matching category in our data
        const matchingCategory = financeServiceCategories.find(
          cat => cat.name === storedCategory.name
        );
        
        console.log("Found matching category in data?", !!matchingCategory);
        
        if (matchingCategory) {
          console.log("On main finance page, showing all categories by default");
          // We're showing all categories initially, but the stored data is there
          // if the user returns from another page
        } else {
          console.log("Stored category not found in current finance categories. Clearing stored value.");
          // If we found the stored category but couldn't match it, clear it
          sessionStorage.removeItem('financeSelectedCategory');
        }
      }
    } catch (e) {
      console.error("Error restoring finance category:", e);
    }
    
    // Default navigation state setting (no category param or stored category)
    // We're showing all categories
    setShowAllCategories(true);
    setSelectedCategory(null);
    console.log("Setting default navigation state");
    setNavState({
      currentView: 'finance',
      breadcrumb: {
        primary: t('finance_real_estate'),
        secondary: null,
        tertiary: null
      }
    });
    
  }, [categoryParam, setNavState, t, financeServiceCategories]);

  const handleBackClick = () => {
    if (selectedCategory) {
      // Go back to the category list if a category is selected
      setSelectedCategory(null);
      setShowAllCategories(true);
      
      // Update navigation state to remove secondary breadcrumb
      setNavState({
        currentView: 'finance',
        breadcrumb: {
          primary: t('finance_real_estate'),
          secondary: null,
          tertiary: null
        }
      });
      
      // Navigate back to the main finance page
      console.log("Navigating back to finance main page");
      setLocation('/finance');
    } else {
      // Go back to the homepage with house illustration (not directly to /)
      setNavState({
        currentView: 'homepage',
        breadcrumb: {
          primary: null,
          secondary: null,
          tertiary: null
        }
      });
      
      // Clear stored category when leaving finance section
      try {
        sessionStorage.removeItem('financeSelectedCategory');
      } catch (e) {
        console.error("Failed to clear stored category:", e);
      }
      
      // This is the main page with the house illustration
      console.log("Navigating back to homepage");
      setLocation('/');
    }
  };

  const handleCategoryClick = (category: FinanceCategory) => {
    console.log("Category clicked:", category.name);
    
    // Set the selected category
    setSelectedCategory(category);
    setShowAllCategories(false);
    
    // Update the navigation state
    setNavState({
      currentView: 'subcategories',
      breadcrumb: {
        primary: t('finance_real_estate'),
        secondary: category.name,
        tertiary: null
      }
    });
    
    // Store the selected category in session storage
    try {
      let categoryToStore = {
        name: category.name,
        letter: category.letter,
        translationKey: category.translationKey || null
      };
      
      sessionStorage.setItem('financeSelectedCategory', JSON.stringify(categoryToStore));
      console.log("Stored finance category in session storage:", category.name);
    } catch (e) {
      console.error("Failed to store category in session storage:", e);
    }
    
    // Update the URL to include the category (allows for direct linking and back button support)
    const encodedCategory = encodeURIComponent(category.name);
    setLocation(`/finance/category/${encodedCategory}`);
  };

  const navigateToProfessionalListing = (service: FinanceService, categoryName: string) => {
    console.log("Navigating to professional listing for service:", service.name);
    console.log("From category:", categoryName);
    
    // Update the navigation state to include the third level (service/professional type)
    setNavState({
      currentView: 'third-level',
      breadcrumb: {
        primary: t('finance_real_estate'),
        secondary: categoryName, 
        tertiary: service.name
      }
    });
    
    // Navigate to the professionals page for this service
    const encodedService = encodeURIComponent(service.name);
    const encodedCategory = encodeURIComponent(categoryName);
    setLocation(`/finance/category/${encodedCategory}/${encodedService}`);
  };

  // Filter all categories based on search query
  const filteredCategories = searchQuery.trim() === "" 
    ? financeServiceCategories 
    : financeServiceCategories.filter(category => {
    // Check if category name matches
    if (category.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true;
    }
    
    // Check if any service in this category matches
    const matchingServices = category.services.filter(service => {
      return service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             service.description.toLowerCase().includes(searchQuery.toLowerCase());
    });
    
    return matchingServices.length > 0;
  });

  // Using direct SVG rendering for icons instead of components to ensure visibility

  return (
    <div className="py-8 px-4 md:px-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-neutral mb-4">Finance & Real Estate</h2>
        <div className="mb-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder={`${t('search')}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('finance_description')}
        </p>
      </div>

      {/* Show search results as a list of cards if search is active */}
      {searchQuery.trim() !== "" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('search_results')}</h2>
          <div className="grid grid-cols-1 gap-4">
            {filteredCategories.map(category => (
              <div key={category.letter}>
                {category.services
                  .filter(service => 
                    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    service.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(service => (
                    <Card 
                      key={service.name}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigateToProfessionalListing(service, category.name)}
                    >
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <ColorfulIcon size="sm" variant="finance">
                          <FinanceIcon serviceName={service.name} />
                        </ColorfulIcon>
                        <CardTitle className="text-xl font-medium">
                          {service.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{service.description}</p>
                        <div className="mt-2">
                          <Badge variant="outline" className="mr-2">{category.name}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show all categories if not searching and showAllCategories is true */}
      {searchQuery.trim() === "" && showAllCategories && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card 
              key={category.letter}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCategoryClick(category)}
            >
              <CardHeader className="flex items-start gap-4 pb-2">
                <ColorfulIcon size="sm" variant="finance">
                  <DollarSign />
                </ColorfulIcon>
                <div>
                  <CardTitle className="text-xl font-medium">
                    {category.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.services.length} {t('service_types')}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {category.services.slice(0, 3).map((service) => (
                    <div key={service.name} className="flex items-center gap-2">
                      <Badge variant="outline" className="h-1.5 w-1.5 p-0 rounded-full" />
                      <span className="text-sm">{service.name}</span>
                    </div>
                  ))}
                  {category.services.length > 3 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      + {category.services.length - 3} {t('more')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Show services for the selected category */}
      {searchQuery.trim() === "" && !showAllCategories && selectedCategory && (
        <div>
          <div className="mb-6">
            <p className="text-muted-foreground">
              {t('select_service_type')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCategory.services.map((service) => (
              <Card 
                key={service.name}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigateToProfessionalListing(service, selectedCategory.name)}
              >
                <CardHeader className="flex flex-col items-center text-center pb-2">
                  <ColorfulIcon size="lg" className="mb-3" variant="finance">
                    <FinanceIcon serviceName={service.name} size={10} />
                  </ColorfulIcon>
                  <CardTitle className="text-xl font-medium">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex justify-center mt-2">
                    <Badge 
                      className="bg-primary text-white hover:bg-primary-dark border-primary transition-colors cursor-pointer px-4 py-2 text-sm font-medium"
                      onClick={() => {
                        setLocation(`/find-professionals/${encodeURIComponent(service.name)}`);
                      }}
                    >
                      {t('find_professionals') || "Find Professionals"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Show message if no results found when searching */}
      {searchQuery.trim() !== "" && filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">{t('no_results_found')}</h2>
          <p className="text-muted-foreground">{t('try_different_search')}</p>
        </div>
      )}
    </div>
  );
};

export default FinanceRealEstate;