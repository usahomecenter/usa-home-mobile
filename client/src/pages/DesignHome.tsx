import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import categoryData from "@/data/categoryData";
import { LucideIcon, Search } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

type DesignHomeProps = {
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

// Helper function to map subcategory names to translation keys for Design section
const getDesignSubcategoryTranslationKey = (subcategory: string): string => {
  const subcategoryKeyMap: Record<string, string> = {
    "Architect": "design_architect",
    "Structural Engineer": "design_structural_engineer",
    "Civil Engineer": "design_civil_engineer",
    "Urban Planner": "design_urban_planner",
    "Interior Designer": "design_interior_designer",
    "Landscape Architect": "design_landscape_architect",
    "Sustainability Consultant": "design_sustainability_consultant"
  };
  
  return subcategoryKeyMap[subcategory] || `design_${subcategory.toLowerCase().replace(/\s+/g, '_')}`;
};

// Helper function to get translated subcategory name
const getDesignSubcategoryTranslation = (subcategory: string, t: (key: string) => string): string => {
  // Check if the subcategory has a translationKey in its data
  const designCategory = categoryData["Design & Planning"];
  if (designCategory && designCategory.subcategories && designCategory.subcategories[subcategory]) {
    const subcategoryData = designCategory.subcategories[subcategory];
    if (subcategoryData.translationKey) {
      return t(subcategoryData.translationKey);
    }
  }
  
  // Fallback to generating a translation key
  const translationKey = getDesignSubcategoryTranslationKey(subcategory);
  const translation = t(translationKey);
  
  // If translation is the same as the key, it means no translation exists
  // Return the original subcategory name in that case
  return translation === translationKey ? subcategory : translation;
};

// Helper function to get translated description
const getDesignDescriptionTranslation = (
  subcategory: string, 
  t: (key: string) => string,
  fallbackDescription: string
): string => {
  const designCategory = categoryData["Design & Planning"];
  if (designCategory && designCategory.subcategories && designCategory.subcategories[subcategory]) {
    const subcategoryData = designCategory.subcategories[subcategory];
    if (subcategoryData.translationKey) {
      const descKey = `${subcategoryData.translationKey}_desc`;
      const translation = t(descKey);
      if (translation !== descKey) {
        return translation;
      }
    }
  }
  
  // Fallback to generating a translation key
  const translationKey = `${getDesignSubcategoryTranslationKey(subcategory)}_desc`;
  const translation = t(translationKey);
  
  // If translation is the same as the key, it means no translation exists
  return translation === translationKey ? fallbackDescription : translation;
};

const DesignHome = ({ setNavState }: DesignHomeProps) => {
  const [_, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const designCategory = categoryData["Design & Planning"];
  
  // Use the useLanguage hook for translations
  const { t } = useLanguage();

  // Update navigation state when landing on this page directly
  useEffect(() => {
    setNavState({
      currentView: 'design-home',
      breadcrumb: {
        primary: t('design_home'),
        secondary: null,
        tertiary: null
      }
    });
  }, [setNavState, t]);

  const handleBackClick = () => {
    setNavState({
      currentView: 'homepage',
      breadcrumb: {
        primary: null,
        secondary: null,
        tertiary: null
      }
    });
    setLocation('/');
  };

  const handleServiceClick = (subcategory: string) => {
    // Set consistent navigation state for all design subcategories
    setNavState({
      currentView: 'third-level',
      breadcrumb: {
        primary: t('design_home'),
        secondary: subcategory,
        tertiary: null
      }
    });
    
    // Use consistent URL structure with hardcoded category to avoid encoding issues
    console.log(`Navigating to Design Home > ${subcategory}`);
    
    // Make sure to use URL-safe encoding for all subcategories
    const encodedSubcategory = encodeURIComponent(subcategory);
    setLocation(`/third-level/Design%20%26%20Planning/${encodedSubcategory}`);
  };

  const getIcon = (iconName: string): LucideIcon => {
    const Icon = (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    return Icon || LucideIcons.HelpCircle;
  };

  // Filter subcategories based on search query
  const filteredSubcategories = designCategory && designCategory.subcategories ? 
    Object.entries(designCategory.subcategories).filter(([name, subcategory]) => {
      if (!searchQuery.trim()) return true;
      
      // Search in subcategory name
      if (name.toLowerCase().includes(searchQuery.toLowerCase())) return true;
      
      // Search in third level services if they exist
      if (subcategory.thirdLevel) {
        const matchingThirdLevel = Object.keys(subcategory.thirdLevel).filter(service => 
          service.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchingThirdLevel.length > 0;
      }
      
      return false;
    }) : [];

  return (
    <div className="py-8 px-4 md:px-6">
      <div className="text-center mb-8">
        <svg 
          className="w-16 h-16 text-primary mb-4 mx-auto" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
          <circle cx="11" cy="11" r="2"></circle>
        </svg>
        <h2 className="text-2xl font-heading font-bold text-neutral mb-4">{t('design_your_dream_home')}</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          {t('connect_with_design_professionals')}
        </p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder={t('search_design_services')}
            className="pl-10 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredSubcategories.map(([name, subcategory]) => {
          const Icon = getIcon(subcategory.icon);
          return (
            <Card 
              key={name} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleServiceClick(name)}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-medium">
                  {getDesignSubcategoryTranslation(name, t)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-light">
                  {getDesignDescriptionTranslation(name, t, subcategory.description)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSubcategories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-neutral-light">{t('no_design_services_found')}</p>
        </div>
      )}

      <div className="mt-12 text-center">
        <Button
          onClick={handleBackClick}
          className="bg-primary text-white hover:bg-primary-dark font-button py-2 px-6 rounded-lg transition-colors flex items-center mx-auto"
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
          {t('back_to_home')}
        </Button>
      </div>
    </div>
  );
};

export default DesignHome;
