import { useEffect } from "react";
import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import categoryData from "@/data/categoryData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { financeServices, isFinanceService } from "@/data/financeData";
import { ColorfulIcon } from "@/components/ColorfulIcon";
import { 
  Users, 
  Calendar, 
  Hammer, 
  Layout, 
  Layers, 
  Scissors, 
  Home, 
  LayoutGrid,
  DoorOpen, 
  Thermometer,
  PenTool,
  PaintBucket,
  Ruler,
  FileText,
  Lightbulb,
  Wind,
  Flower2,
  Droplet,
  TrendingUp,
  Cable,
  Warehouse,
  Wrench,
  Activity,
  Shield
} from "lucide-react";

type SubcategoriesProps = {
  category: string;
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const Subcategories = ({ category, navState, setNavState }: SubcategoriesProps) => {
  const [_, setLocation] = useLocation();
  
  // Use centralized language hook with safety check
  let t;
  try {
    const { t: translateFunction } = useLanguage();
    t = translateFunction;
  } catch (error) {
    // Fallback if language provider is not available
    t = (key: string) => key;
  }
  
  // Define a useEffect for redirections
  useEffect(() => {
    // Special case for Build Home category to handle the mapping to actual category data
    if (category === "Build Home") {
      try {
        // Check if we have a stored build category in session storage
        const storedCategory = sessionStorage.getItem('buildSelectedCategory');
        
        if (storedCategory) {
          console.log(`Found stored build category: ${storedCategory}`);
          
          // Use the actual stored category for rendering
          setNavState({
            currentView: 'subcategories',
            breadcrumb: {
              primary: t('build_home'),
              secondary: storedCategory,
              tertiary: null
            }
          });
        }
      } catch (e) {
        console.error("Error checking stored build category:", e);
      }
    }
  
    // Special case for finance services that are incorrectly accessed as /subcategories/ServiceName
    // These services should redirect back to Finance & Real Estate main page
    
    // Using imported financeServices from centralized finance data
    if (isFinanceService(category)) {
      console.log(`Special case: Redirecting from finance service /subcategories/${category} to /finance`);
      
      setNavState({
        currentView: 'finance',
        breadcrumb: {
          primary: t('finance_real_estate'),
          secondary: null,
          tertiary: null
        }
      });
      
      // Redirect back to finance main page
      setLocation('/finance');
      return;
    }
    
    // First, handle the specific case of direct navigation to /subcategories/Architect
    if (category === "Architect") {
      console.log("Special case: Redirecting from /subcategories/Architect to /third-level/Design%20%26%20Planning/Architect");
      
      // Update navigation state to reflect we're on a third-level page
      setNavState({
        currentView: 'third-level',
        breadcrumb: {
          primary: 'Design Home',
          secondary: 'Architect',
          tertiary: null
        }
      });
      
      // Redirect to the correct third-level page
      setLocation('/third-level/Design%20%26%20Planning/Architect');
      return;
    }
    
    // IMPORTANT: Redirect away from /subcategories/Design%20&%20Planning to /design-home
    // This is a critical fix to prevent the invalid subcategories page from showing up
    if (category === "Design & Planning" || category === "Design Home") {
      console.log("Redirecting Design category to design-home");
      
      // Only execute this redirect once on component mount
      setNavState({
        currentView: 'design-home',
        breadcrumb: {
          primary: t('design_home'), // Using t() function for translated value
          secondary: null,
          tertiary: null
        }
      });
      
      // Redirect to design-home immediately
      setLocation('/design-home');
    }
  }, [category, setNavState, setLocation, t]);
  
  // Helper function to map subcategory titles to translation keys
  const getSubcategoryTranslationKey = (subcategory: string): string => {
    // Create a standardized format for translation keys based on subcategory name
    // Replace spaces with underscores and convert to lowercase
    return `subcategory_${subcategory.toLowerCase().replace(/\s+/g, '_').replace(/&/g, 'and')}`;
  };
  
  // Helper function to get translated subcategory title
  const getSubcategoryTranslation = (subcategory: string, subData?: any): string => {
    // First, check if the subcategory has a custom translationKey in the data
    if (subData && subData.translationKey) {
      const translatedText = t(subData.translationKey);
      // If translation exists, use it, otherwise fallback to the standard mechanism
      if (translatedText !== subData.translationKey) {
        return translatedText;
      }
    }
    
    // Standard mechanism as fallback
    const translationKey = getSubcategoryTranslationKey(subcategory);
    const translatedText = t(translationKey);
    
    // If the translation key is returned unchanged, it means no translation was found
    // In that case, return the original subcategory title
    return translationKey === translatedText ? subcategory : translatedText;
  };
  
  // Helper function to get translated category name
  const getCategoryTranslation = (categoryName: string): string => {
    // Map category names to translation keys
    const categoryKeyMap: Record<string, string> = {
      "Construction & Building": "construction_building",
      "MEP (Mechanical, Electrical, Plumbing)": "mep",
      "Utilities & Infrastructure": "utilities_infrastructure",
      "Renewable & Solar": "renewable_solar",
      "Energy & Building Systems": "energy_building_systems",
      "Environmental & Compliance": "environmental_compliance",
      "Additional Expertise": "additional_expertise",
      "Design & Planning": "design_planning"
    };
    
    const translationKey = categoryKeyMap[categoryName] || categoryName;
    const translatedText = t(translationKey);
    
    return translationKey === translatedText ? categoryName : translatedText;
  };

  // Map external category names to internal data structure names
  const getCategoryDataKey = (categoryName: string): string => {
    // This handles the case where URLs use "Design Home" but our data uses "Design & Planning"
    if (categoryName === "Design Home") {
      return "Design & Planning";
    }
    
    // This handles the case where URLs use "Build Home" but our data has a different format
    if (categoryName === "Build Home") {
      // The actual key in our data structure is "Construction & Building"
      console.log(`Mapping 'Build Home' to 'Construction & Building'`);
      return "Construction & Building";
    }
    
    return categoryName;
  };

  // Function to check if a string is a valid third-level item
  const isThirdLevelItem = (item: string): boolean => {
    // Check if this is a third-level service under any category
    for (const [categoryKey, categoryObj] of Object.entries(categoryData)) {
      for (const [subCatKey, subCatObj] of Object.entries(categoryObj.subcategories || {})) {
        // If it has thirdLevel property
        if (subCatObj.thirdLevel && Object.keys(subCatObj.thirdLevel).includes(item)) {
          return true;
        }
      }
    }
    return false;
  };

  // For handling third-level services like "Schematic Design"
  // Find the parent category and subcategory for a third-level item
  const findParentForThirdLevelItem = () => {
    if (!isThirdLevelItem(category)) return null;
    
    let foundParentCategory = "";
    let foundSubcategory = "";
    
    // Search through all categories to find where this third-level item belongs
    for (const [categoryKey, categoryObj] of Object.entries(categoryData)) {
      for (const [subCatKey, subCatObj] of Object.entries(categoryObj.subcategories || {})) {
        if (subCatObj.thirdLevel && Object.keys(subCatObj.thirdLevel).includes(category)) {
          foundParentCategory = categoryKey;
          foundSubcategory = subCatKey;
          break;
        }
      }
      if (foundParentCategory) break;
    }
    
    if (foundParentCategory && foundSubcategory) {
      return { foundParentCategory, foundSubcategory };
    }
    
    return null;
  };
  
  // Create an effect to handle third-level item redirects
  useEffect(() => {
    const thirdLevelParentInfo = findParentForThirdLevelItem();
    
    if (thirdLevelParentInfo) {
      const { foundParentCategory, foundSubcategory } = thirdLevelParentInfo;
      // Set breadcrumb to include the proper hierarchy
      const displayParentCategory = foundParentCategory === "Design & Planning" ? "Design Home" : foundParentCategory;
      
      setNavState({
        currentView: 'third-level',
        breadcrumb: {
          primary: displayParentCategory,
          secondary: foundSubcategory,
          tertiary: category
        }
      });
      
      // Navigate to the appropriate subcategory
      setLocation(`/subcategories/${encodeURIComponent(foundSubcategory)}`);
    }
  }, [category, setNavState, setLocation]);

  // More robust function to check if category exists
  const findMatchingCategory = (categoryToCheck: string): string | null => {
    const normalizedCategory = categoryToCheck.toLowerCase().trim();
    
    // First check for exact match
    if (Object.keys(categoryData).includes(categoryToCheck)) {
      return categoryToCheck;
    }
    
    // Try the mapped key
    const mappedKey = getCategoryDataKey(categoryToCheck);
    if (Object.keys(categoryData).includes(mappedKey)) {
      return mappedKey;
    }
    
    // Try case-insensitive match
    const matchingKey = Object.keys(categoryData).find(key => 
      key.toLowerCase().trim() === normalizedCategory
    );
    
    if (matchingKey) {
      return matchingKey;
    }
    
    // Special cases for build/design
    if (normalizedCategory === "build home") {
      return "Construction & Building";
    }
    
    if (normalizedCategory === "design home") {
      return "Design & Planning";
    }
    
    return null;
  };
  
  // Check if the category exists in our data structure, using our robust matcher
  const matchedCategory = findMatchingCategory(category);
  const isCategoryValid = !!matchedCategory || isFinanceService(category);
  
  // Get the actual category key for use with our data structure - use the matched category if found
  const categoryDataKey = matchedCategory || getCategoryDataKey(category);
  
  // Determine if this is a design category
  const isDesignCategory = 
    category === "Design Home" || 
    category === "Design & Planning" || 
    categoryDataKey === "Design & Planning";
  
  // Determine if this is a finance category
  const isFinanceCategory = 
    category === "Finance & Real Estate" || 
    category === "Finance" || 
    category.toLowerCase().includes("finance");

  // Define handleBackClick function
  const handleBackClick = () => {
    console.log("Back button clicked in Subcategories", {
      category, 
      isDesignCategory, 
      isFinanceCategory,
      navState
    });
    
    // Special case for finance services
    if (isFinanceService(category)) {
      // Always go back to Finance page for finance services
      setNavState({
        currentView: 'finance',
        breadcrumb: {
          primary: t('finance_real_estate'),
          secondary: null,
          tertiary: null
        }
      });
      setLocation('/finance');
      return;
    }
    
    // Determine the appropriate navigation based on category
    if (isDesignCategory || navState.breadcrumb.primary === t('design_home')) {
      // Always go back to Design Home from Design subcategories
      setNavState({
        currentView: 'design-home',
        breadcrumb: {
          primary: t('design_home'),
          secondary: null,
          tertiary: null
        }
      });
      setLocation('/design-home');
    } else if (isFinanceCategory || navState.breadcrumb.primary === t('finance_real_estate')) {
      // Always go back to Finance page from Finance subcategories
      setNavState({
        currentView: 'finance',
        breadcrumb: {
          primary: t('finance_real_estate'),
          secondary: null,
          tertiary: null
        }
      });
      setLocation('/finance');
    } else {
      // For Build section, go back to Build Home
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

  // If category doesn't exist, show error and provide fallback
  if (!isCategoryValid) {
    console.error(`Category not found in data: ${category}`);
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-heading font-bold text-neutral mb-4">{t('category_not_found')}</h2>
        <Button 
          onClick={handleBackClick} 
          className="bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          {t('back_to_categories')}
        </Button>
      </div>
    );
  }

  // Update navigation state when landing on this page directly
  useEffect(() => {
    if (navState.currentView !== 'subcategories' || navState.breadcrumb.secondary !== category) {
      // Determine primary breadcrumb based on category type
      let primaryBreadcrumb;
      if (isDesignCategory) {
        primaryBreadcrumb = t('design_home');
      } else if (isFinanceCategory) {
        primaryBreadcrumb = t('finance_real_estate');
      } else {
        primaryBreadcrumb = t('build_home');
      }
      
      setNavState({
        currentView: 'subcategories',
        breadcrumb: {
          primary: primaryBreadcrumb,
          secondary: getCategoryTranslation(category),
          tertiary: null
        }
      });
    }
  }, [category, navState.currentView, navState.breadcrumb.secondary, setNavState, t, isDesignCategory, isFinanceCategory]);

  const handleSubcategoryClick = (subcategory: string) => {
    // Check if this subcategory has third level items
    const subcategoryData = categoryData[categoryDataKey]?.subcategories[subcategory];
    const hasThirdLevel = subcategoryData?.thirdLevel;
    
    if (hasThirdLevel) {
      // Determine primary breadcrumb based on category type
      let primaryBreadcrumb;
      if (isDesignCategory) {
        primaryBreadcrumb = t('design_home');
      } else if (isFinanceCategory) {
        primaryBreadcrumb = t('finance_real_estate');
      } else {
        primaryBreadcrumb = t('build_home');
      }
      
      setNavState({
        currentView: 'third-level',
        breadcrumb: {
          primary: primaryBreadcrumb,
          secondary: getCategoryTranslation(category),
          tertiary: getSubcategoryTranslation(subcategory, subcategoryData)
        }
      });
      setLocation(`/third-level/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`);
    }
    // If no third level, we could handle it differently here
  };

  // Make sure we have a valid category before trying to access subcategories
  let subcategories: Record<string, any> = {};
  
  // Special handling for "Build Home" category - try to use stored category
  if (category === "Build Home") {
    try {
      const storedCategory = sessionStorage.getItem('buildSelectedCategory');
      
      if (storedCategory && categoryData[storedCategory] && categoryData[storedCategory].subcategories) {
        console.log(`Using stored build category subcategories: ${storedCategory}`);
        subcategories = categoryData[storedCategory].subcategories;
      } else if (categoryData["Construction & Building"] && categoryData["Construction & Building"].subcategories) {
        // Fallback to Construction & Building
        console.log(`Fallback to Construction & Building subcategories`);
        subcategories = categoryData["Construction & Building"].subcategories;
      }
    } catch (e) {
      console.error("Error accessing stored build category:", e);
    }
  } else if (categoryData[categoryDataKey] && categoryData[categoryDataKey].subcategories) {
    // Normal category access
    subcategories = categoryData[categoryDataKey].subcategories;
  } else {
    console.error(`Invalid category structure for: ${categoryDataKey}`);
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(subcategories).length === 0 ? (
          <div className="col-span-full text-center py-8">
            <svg
              className="w-12 h-12 text-neutral-light mb-4 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p className="text-lg text-neutral-light">{t('coming_soon')}</p>
          </div>
        ) : (
          Object.entries(subcategories).map(([subTitle, subData]) => {
            const hasThirdLevel = subData.thirdLevel && Object.keys(subData.thirdLevel).length > 0;
            
            return (
              <div 
                key={subTitle}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${hasThirdLevel ? 'cursor-pointer' : ''}`}
                onClick={() => hasThirdLevel && handleSubcategoryClick(subTitle)}
              >
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    <ColorfulIcon size="sm" variant={isDesignCategory ? "design" : isFinanceCategory ? "finance" : "building"}>
                      {subData.icon === "users" && <Users />}
                      {subData.icon === "calendar-check" && <Calendar />}
                      {subData.icon === "hammer" && <Hammer />}
                      {subData.icon === "layout" && <Layout />}
                      {subData.icon === "layers" && <Layers />}
                      {subData.icon === "scissors" && <Scissors />}
                      {subData.icon === "home" && <Home />}
                      {subData.icon === "layout-right" && <LayoutGrid />}
                      {subData.icon === "door-open" && <DoorOpen />}
                      {subData.icon === "thermometer" && <Thermometer />}
                      {subData.icon === "layout-bottom" && <Layout />}
                      {subData.icon === "grid" && <LayoutGrid />}
                      {subData.icon === "paintbrush" && <PaintBucket />}
                      {subData.icon === "box" && <Warehouse />}
                      {subData.icon === "zap" && <TrendingUp />}
                      {subData.icon === "lightbulb" && <Lightbulb />}
                      {subData.icon === "cpu" && <Activity />}
                      {subData.icon === "battery-charging" && <Activity />}
                      {subData.icon === "droplet" && <Droplet />}
                      {subData.icon === "git-branch" && <Cable />}
                      {subData.icon === "flame" && <Activity />}
                      {subData.icon === "wind" && <Wind />}
                      {subData.icon === "wifi" && <Activity />}
                      {subData.icon === "compass" && <Layout />}
                      {subData.icon === "battery" && <Activity />}
                      {subData.icon === "file-text" && <FileText />}
                      {subData.icon === "sliders" && <Activity />}
                      {subData.icon === "smartphone" && <Activity />}
                      {subData.icon === "award" && <Activity />}
                      {subData.icon === "bar-chart" && <TrendingUp />}
                      {subData.icon === "check-square" && <Shield />}
                      {subData.icon === "alert-triangle" && <Shield />}
                      {subData.icon === "lock" && <Shield />}
                      {subData.icon === "volume-2" && <Activity />}
                      {subData.icon === "shield" && <Shield />}
                      {subData.icon === "trash" && <Wrench />}
                      {!subData.icon && <Home />}
                    </ColorfulIcon>
                  </div>
                  <h3 className="font-heading font-bold text-lg">{getSubcategoryTranslation(subTitle, subData)}</h3>
                </div>
                <p className="text-neutral-light mb-4">
                  {subData.translationKey && t(`${subData.translationKey}_desc`) !== `${subData.translationKey}_desc` 
                    ? t(`${subData.translationKey}_desc`) 
                    : t(`${getSubcategoryTranslationKey(subTitle)}_desc`) !== `${getSubcategoryTranslationKey(subTitle)}_desc` 
                      ? t(`${getSubcategoryTranslationKey(subTitle)}_desc`)
                      : subData.description}
                </p>
                <div className={category.includes('Build') ? "flex justify-center" : "flex justify-end"}>
                  <div className="flex flex-col space-y-2">
                    {!category.includes('Build') && (
                      <button className="text-accent font-button font-medium flex items-center">
                        <span>{hasThirdLevel ? t('view_options') : t('learn_more')}</span>
                        <svg 
                          className="w-4 h-4 ml-1" 
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
                      </button>
                    )}
                    {category.includes('Build') ? (
                      <Badge 
                        className="bg-primary text-white hover:bg-primary-dark border-primary transition-colors cursor-pointer px-4 py-2 text-sm font-medium text-center leading-tight"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/find-professionals/${encodeURIComponent(subTitle)}`);
                        }}
                      >
                        Find professionals for your home<br />project
                      </Badge>
                    ) : (
                      <Badge 
                        className="bg-primary text-white hover:bg-primary-dark border-primary transition-colors cursor-pointer px-4 py-2 text-sm font-medium text-center leading-tight"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/find-professionals/${encodeURIComponent(subTitle)}`);
                        }}
                      >
                        Find professionals for your home<br />project
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="mt-8">
        <Button 
          onClick={handleBackClick}
          variant="outline"
          className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-button transition-colors flex items-center"
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
          {t('back_to_categories')}
        </Button>
      </div>
    </div>
  );
};

export default Subcategories;