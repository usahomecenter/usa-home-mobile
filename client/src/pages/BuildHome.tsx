import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import categoryData from "@/data/categoryData";
import { Input } from "@/components/ui/input";
import { Search, Building, Home, Wrench, Activity, Shield, Sun, Zap, Settings, Paintbrush } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { ColorfulIcon } from "@/components/ColorfulIcon";

type BuildHomeProps = {
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

// Helper function to map category names to translation keys
const getCategoryTranslationKey = (category: string): string => {
  const categoryKeyMap: Record<string, string> = {
    "Construction & Building": "construction_building",
    "MEP (Mechanical, Electrical, Plumbing)": "mep",
    "Utilities & Infrastructure": "utilities_infrastructure",
    "Renewable & Solar": "renewable_solar",
    "Energy & Building Systems": "energy_building_systems",
    "Environmental & Compliance": "environmental_compliance",
    "Additional Expertise": "additional_expertise"
  };
  
  return categoryKeyMap[category] || category;
};

// Helper function to get translated category name
const getCategoryTranslation = (category: string, t: (key: string) => string): string => {
  const translationKey = getCategoryTranslationKey(category);
  return t(translationKey);
};

// Helper function to get translated category description
const getCategoryDescriptionTranslation = (
  category: string, 
  t: (key: string) => string,
  fallbackDescription: string
): string => {
  const translationKey = `${getCategoryTranslationKey(category)}_desc`;
  return t(translationKey);
};

const BuildHome = ({ navState, setNavState }: BuildHomeProps) => {
  const [_, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use centralized language hook
  const { t } = useLanguage();

  // Update navigation state when landing on this page directly
  useEffect(() => {
    if (navState.currentView !== 'build-home') {
      setNavState({
        currentView: 'build-home',
        breadcrumb: {
          primary: t('build_home'),
          secondary: null,
          tertiary: null
        }
      });
    }
  }, [navState.currentView, setNavState, t]);

  const handleCategoryClick = (category: string) => {
    // Always use "Build Home" as the primary breadcrumb for consistency
    setNavState({
      currentView: 'subcategories',
      breadcrumb: {
        primary: t('build_home'),
        secondary: category,
        tertiary: null
      }
    });
    
    // For navigation, we'll use a consistent format
    // Always navigate to /subcategories/Build%20Home 
    // instead of using the actual categoryData key
    setLocation(`/subcategories/Build%20Home`);
    
    // Store the clicked category in session storage
    // so we can access it from the Subcategories page
    sessionStorage.setItem('buildSelectedCategory', category);
  };

  // Filter categories and subcategories based on search query
  const filteredCategories = Object.entries(categoryData)
    .filter(([category]) => category !== "Design & Planning") // Exclude Design & Planning
    .filter(([category, data]) => {
      if (!searchQuery.trim()) return true;
      
      // Search in category name
      if (category.toLowerCase().includes(searchQuery.toLowerCase())) return true;
      
      // Search in subcategories
      const matchingSubcategories = Object.keys(data.subcategories).filter(subcategory => 
        subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return matchingSubcategories.length > 0;
    });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-neutral mb-4 text-center">Build Your Dream Home</h2>
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder={t('search_services_placeholder')}
            className="pl-10 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map(([category, data]) => (
          <div 
            key={category}
            className="category-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <ColorfulIcon size="sm" variant="building">
                  {data.icon === "building" && <Building />}
                  {data.icon === "foundation" && <Home />}
                  {data.icon === "home" && <Home />}
                  {data.icon === "brush" && <Paintbrush />}
                  {data.icon === "settings" && <Settings />}
                  {data.icon === "activity" && <Activity />}
                  {data.icon === "sun" && <Sun />}
                  {data.icon === "zap" && <Zap />}
                  {data.icon === "shield" && <Shield />}
                  {data.icon === "tool" && <Wrench />}
                </ColorfulIcon>
              </div>
              <h3 className="font-heading font-bold text-xl">
                {getCategoryTranslation(category, t)}
              </h3>
            </div>
            <p className="text-neutral-light mb-4">
              {getCategoryDescriptionTranslation(category, t, data.description)}
            </p>
            <div className="flex justify-end">
              <button className="text-accent font-button font-medium flex items-center">
                <span>{t('view_services')}</span>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuildHome;
