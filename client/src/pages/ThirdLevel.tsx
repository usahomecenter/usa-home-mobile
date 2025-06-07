import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import categoryData from "@/data/categoryData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  isFinanceService, 
  isFinanceCategory, 
  hasFinanceKeyword, 
  isFinanceRelated 
} from "@/data/financeData";
import { ColorfulIcon } from "@/components/ColorfulIcon";
import { 
  Globe, 
  Hammer, 
  Layout, 
  PenTool, 
  Ruler, 
  Home,
  Building, 
  Compass,
  PaintBucket,
  ScanSearch,
  FileText,
  AreaChart,
  Map,
  Users,
  DollarSign,
  TrendingUp,
  CreditCard,
  RefreshCw,
  BarChart,
  Award,
  BadgePercent,
  PiggyBank,
  Banknote,
  Scale,
  HelpCircle,
  Wrench,
  Leaf,
  Unlock,
  Grid,
  Shield,
  Book,
  Calendar,
  Lightbulb,
  Search,
  LandPlot,
  Layers,
  Box,
  Package,
  Activity,
  Edit,

  MapPin,
  CheckSquare,
  Truck,
  Thermometer,
  Paintbrush,
  BarChart2,
  Droplet
} from "lucide-react";

type ThirdLevelProps = {
  category: string;
  subcategory: string;
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const ThirdLevel = ({ category, subcategory, navState, setNavState }: ThirdLevelProps) => {
  const [_, setLocation] = useLocation();
  
  // Use the centralized language hook
  const { t } = useLanguage();
  
  // Handle Design Home category specially since we have both "Design Home" and "Design & Planning"
  // Handle Build Home category which maps to "Construction & Building"
  const designHandledCategory = category === "Design Home" ? "Design & Planning" : 
                               category === "Build Home" ? "Construction & Building" : 
                               category;
  
  // Helper functions for design third-level item translations
  const getDesignThirdLevelItemTranslation = (title: string, data: any) => {
    const key = title.toLowerCase().replace(/\s+/g, '_');
    const translation = t(key);
    return translation !== key ? translation : title;
  };
  
  const getDesignThirdLevelDescriptionTranslation = (title: string, data: any) => {
    const key = `${title.toLowerCase().replace(/\s+/g, '_')}_desc`;
    const translation = t(key);
    return translation !== key ? translation : data.description;
  };

  // Update navigation state when landing on this page directly
  useEffect(() => {
    // Update navigation state when:
    // 1. Current view isn't 'third-level'
    // 2. Secondary breadcrumb doesn't match subcategory
    // 3. We're coming from a different view
    
    console.log("ThirdLevel received parameters:", { 
      category, 
      subcategory, 
      currentView: navState.currentView,
      breadcrumb: navState.breadcrumb
    });
    
    // Create a flag indicating if we need to update the navigation state
    const needsNavUpdate = 
      navState.currentView !== 'third-level' || 
      navState.breadcrumb.secondary !== subcategory;
      
    if (needsNavUpdate) {
      console.log("Updating navigation state in ThirdLevel");
      
      // Using our finance utility functions to check if this is finance-related
      const isFinanceRelatedCheck = 
        isFinanceRelated(category) || 
        isFinanceRelated(subcategory);
      
      // Handle navigation state differently for Design categories
      const isDesignCategory = 
        category === 'Design & Planning' || 
        category === 'Design Home' ||
        category === t('design_home');
      
      // Determine the primary breadcrumb based on category
      let primaryBreadcrumb;
      if (isDesignCategory) {
        primaryBreadcrumb = t('design_home');
      } else if (isFinanceRelatedCheck) {
        primaryBreadcrumb = t('finance_real_estate');
      } else {
        primaryBreadcrumb = t('build_home');
      }
      
      setNavState({
        currentView: 'third-level',
        breadcrumb: {
          primary: primaryBreadcrumb,
          secondary: subcategory,
          tertiary: null
        }
      });
    }
  }, [category, subcategory, navState.currentView, navState.breadcrumb.secondary, setNavState, t]);

  const handleBackClick = () => {
    // Get the design category key that may be specified in a parent component
    const designCategoryKey = designHandledCategory || '';
    
    console.log("Back button clicked in ThirdLevel", {
      category, 
      subcategory,
      designCategoryKey,
      navState
    });
    
    // Check if we're coming from a professional profile page
    // Look for key identifiers in the URL path that would indicate this
    const currentPath = window.location.pathname;
    console.log("Current path for navigation:", currentPath);
    const isProfessionalPage = currentPath.includes('/find-professionals/');
    
    // Handle back navigation differently for Design categories
    const isDesignCategory = designCategoryKey === 'Design & Planning' || 
                             category === 'Design Home' || 
                             navState.breadcrumb.primary === 'Design Home' ||
                             navState.breadcrumb.primary === t('design_home');
    
    // Enhanced detection for finance-related pages
    // First, explicitly check if the current service is a finance service
    const currentServiceIsFinance = isFinanceService(subcategory) || 
                                   isFinanceService(category) || 
                                   (navState.breadcrumb.secondary && isFinanceService(navState.breadcrumb.secondary));
    
    // Using our centralized finance data utils to determine if we're in a finance section
    const isFinanceCategoryCheck = isFinanceCategory(category) || 
                                  isFinanceCategory(navState.breadcrumb.primary) ||
                                  category === t('finance_real_estate') ||
                                  navState.breadcrumb.primary === t('finance_real_estate') ||
                                  navState.breadcrumb.primary === 'Finance & Real Estate';
                                  
    const isFinanceServiceCheck = isFinanceService(category) || 
                                isFinanceService(subcategory) ||
                                isFinanceService(navState.breadcrumb.secondary) ||
                                (navState.breadcrumb.tertiary && isFinanceService(navState.breadcrumb.tertiary));
                                
    const hasFinanceKeywordCheck = hasFinanceKeyword(category || '') || 
                                 hasFinanceKeyword(subcategory || '') ||
                                 hasFinanceKeyword(navState.breadcrumb.primary || '') ||
                                 hasFinanceKeyword(navState.breadcrumb.secondary || '') ||
                                 (navState.breadcrumb.tertiary && hasFinanceKeyword(navState.breadcrumb.tertiary));
    
    // Comprehensive check for all finance-related content
    const isFinanceRelatedCheck = isFinanceRelated(category || '') || 
                               isFinanceRelated(subcategory || '') || 
                               isFinanceRelated(navState.breadcrumb.primary || '') ||
                               isFinanceRelated(navState.breadcrumb.secondary || '') ||
                               (navState.breadcrumb.tertiary && isFinanceRelated(navState.breadcrumb.tertiary));
    
    // Check if any part of the URL path has finance-related terms
    const pathHasFinanceKeywords = 
      currentPath.toLowerCase().includes('finance') || 
      currentPath.toLowerCase().includes('credit') ||
      currentPath.toLowerCase().includes('loan') ||
      currentPath.toLowerCase().includes('mortgage') ||
      currentPath.toLowerCase().includes('real-estate');

    // Additional check for finance section based on URL path
    const urlIndicatesFinance = currentPath.includes('/finance') || pathHasFinanceKeywords;
    
    // Debug log for better category checking
    console.log("ThirdLevel navigation debugging:", {
      category,
      subcategory,
      navState,
      currentPath,
      isProfessionalPage,
      currentServiceIsFinance,
      primaryBreadcrumb: navState.breadcrumb.primary,
      designCategoryKey,
      isDesignCategory,
      isFinanceCategoryCheck,
      isFinanceServiceCheck,
      hasFinanceKeywordCheck,
      isFinanceRelatedCheck,
      urlIndicatesFinance,
      financeAndRealEstate: t('finance_real_estate')
    });
    
    // Final decision on whether this is a finance page (any of the checks passing)
    const isFinanceSection = isFinanceCategoryCheck || 
                           isFinanceServiceCheck || 
                           hasFinanceKeywordCheck || 
                           isFinanceRelatedCheck ||
                           currentServiceIsFinance ||
                           urlIndicatesFinance;
    
    console.log("Navigation decision:", { 
      isDesignCategory, 
      isFinanceSection,
      isFinanceCategoryCheck,
      isFinanceServiceCheck,
      currentServiceIsFinance,
      urlIndicatesFinance
    });
    
    // For Finance-related sections, always go back to finance page
    if (isFinanceSection || currentServiceIsFinance || urlIndicatesFinance) {
      console.log("PRIORITY: Finance section detected, going back to finance page");
      setNavState({
        currentView: 'finance',
        breadcrumb: {
          primary: t('finance_real_estate'),
          secondary: null,
          tertiary: null
        }
      });
      setLocation('/finance');
    } else if (isDesignCategory) {
      // Always go back to Design Home from any Design third-level pages
      console.log("Navigating back to design home");
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
      // Go back to subcategories page for Build section
      console.log("Navigating back to build subcategories");
      setNavState({
        currentView: 'subcategories',
        breadcrumb: {
          primary: t('build_home'),
          secondary: category,
          tertiary: null
        }
      });
      setLocation(`/subcategories/${encodeURIComponent(category)}`);
    }
  };

  // For all Design Home related subcategories, we need general handling 
  // using the actual data structure from categoryData["Design & Planning"]
  if ((category === "Design Home" || category === "Design & Planning") && 
      subcategory && 
      categoryData["Design & Planning"].subcategories[subcategory]) {
      
    console.log(`Special handler for Design Home > ${subcategory}`);
    
    // Get subcategory data from our structure
    const subcategoryData = categoryData["Design & Planning"].subcategories[subcategory];
    
    // Update navigation state to reflect we're on this page
    // This ensures breadcrumbs and back navigation work correctly
    useEffect(() => {
      if (navState.breadcrumb.secondary !== subcategory) {
        console.log("Updating navigation state in ThirdLevel for design subcategory:", subcategory);
        setNavState({
          currentView: 'third-level',
          breadcrumb: {
            primary: "Design Home",
            secondary: subcategory,
            tertiary: null
          }
        });
      }
    }, [subcategory, navState.breadcrumb.secondary, setNavState]);
    
    // Get translated subcategory name and description if it's a design category
    const getDesignSubcategoryTranslation = (subcategory: string) => {
      const subcategoryKeyMap: Record<string, string> = {
        "Architect": "design_architect",
        "Structural Engineer": "design_structural_engineer",
        "Civil Engineer": "design_civil_engineer",
        "Urban Planner": "design_urban_planner",
        "Interior Designer": "design_interior_designer",
        "Landscape Architect": "design_landscape_architect",
        "Sustainability Consultant": "design_sustainability_consultant"
      };
      
      const key = subcategoryKeyMap[subcategory] || `design_${subcategory.toLowerCase().replace(/\s+/g, '_')}`;
      const translation = t(key);
      return translation !== key ? translation : subcategory;
    };
    
    const getDesignDescriptionTranslation = (subcategory: string) => {
      const key = `design_${subcategory.toLowerCase().replace(/\s+/g, '_')}_desc`;
      const translation = t(key);
      return translation !== key ? translation : subcategoryData.description;
    };
    
    const translatedSubcategory = getDesignSubcategoryTranslation(subcategory);
    const translatedDescription = getDesignDescriptionTranslation(subcategory);
    
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(subcategoryData.thirdLevel || {}).map(([title, data]) => (
            <div 
              key={title}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <ColorfulIcon 
                    size="sm" 
                    variant={
                      navState.breadcrumb.primary === "Design Home" ? "design" : 
                      isFinanceRelated(category || '') ? "finance" : "building"
                    }
                  >
                    {data.icon === "globe" && <Globe />}
                    {data.icon === "hammer" && <Hammer />}
                    {data.icon === "layout" && <Layout />}
                    {data.icon === "pen-tool" && <PenTool />}
                    {data.icon === "ruler" && <Ruler />}
                    {data.icon === "home" && <Home />}
                    {data.icon === "building" && <Building />}
                    {data.icon === "compass" && <Compass />}
                    {!data.icon && <Layout />}
                  </ColorfulIcon>
                </div>
                <h3 className="font-heading font-bold text-lg">
                  {getDesignThirdLevelItemTranslation(title, data)}
                </h3>
              </div>
              <p className="text-neutral-light mb-4">
                {getDesignThirdLevelDescriptionTranslation(title, data)}
              </p>
              {navState.breadcrumb.primary === "Build Home" ? (
                <div className="flex justify-center mt-2">
                  <Badge 
                    className="bg-primary text-white hover:bg-primary-dark border-primary transition-colors cursor-pointer px-4 py-2 text-sm font-medium text-center leading-tight"
                    onClick={() => {
                      setNavState({
                        ...navState,
                        currentView: 'third-level',
                        breadcrumb: {
                          primary: navState.breadcrumb.primary,
                          secondary: subcategory,
                          tertiary: title
                        }
                      });
                      setLocation(`/find-professionals/${encodeURIComponent(title)}`);
                    }}
                  >
                    Find professionals for your home<br />project
                  </Badge>
                </div>
              ) : (
                <div className="flex justify-center mt-2">
                  <Badge 
                    className="bg-primary text-white hover:bg-primary-dark border-primary transition-colors cursor-pointer px-4 py-2 text-sm font-medium text-center leading-tight"
                    onClick={() => {
                      setNavState({
                        ...navState,
                        currentView: 'third-level',
                        breadcrumb: {
                          primary: navState.breadcrumb.primary,
                          secondary: subcategory,
                          tertiary: title
                        }
                      });
                      setLocation(`/find-professionals/${encodeURIComponent(title)}`);
                    }}
                  >
                    Find professionals for your home<br />project
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
        

      </div>
    );
  }
  
  // Check if category and subcategory exist in our data
  if (!categoryData[designHandledCategory] || 
      !categoryData[designHandledCategory].subcategories[subcategory] || 
      !categoryData[designHandledCategory].subcategories[subcategory].thirdLevel) {
      
    console.error(`Category lookup failed. Looking for: category=${designHandledCategory}, subcategory=${subcategory}`);
    console.error('Available categories:', Object.keys(categoryData));
    if (categoryData[designHandledCategory]) {
      console.error('Available subcategories:', Object.keys(categoryData[designHandledCategory].subcategories));
    }
    
    // Enhanced navigation logic based on where we're coming from
    let backPath = '/';
    let backText = "Back to Home";
    
    // Handle finance-related categories
    if (isFinanceCategory(category) || 
        isFinanceService(subcategory) || 
        hasFinanceKeyword(category) || 
        hasFinanceKeyword(subcategory) ||
        isFinanceRelated(category) ||
        isFinanceRelated(subcategory)) {
      backPath = '/finance';
      backText = "Back to Finance & Real Estate";
    } 
    // Handle design categories
    else if (designHandledCategory === 'Design & Planning' || 
             category === 'Design Home' || 
             navState.breadcrumb.primary === 'Design Home') {
      backPath = '/design-home';
      backText = t('back_to_design');
    } 
    // Handle build categories
    else if (category === 'Build Home' || 
             navState.breadcrumb.primary === 'Build Home' ||
             navState.breadcrumb.primary === t('build_home')) {
      backPath = '/build-home';
      backText = t('back_to_categories');
    }
    
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-heading font-bold text-neutral mb-4">Category Not Found</h2>
        <p className="text-neutral-light mb-6">
          We couldn't find the category you were looking for. Please go back and try again.
        </p>
        <Button 
          onClick={() => setLocation(backPath)}
          className="mt-4 bg-primary text-white hover:bg-primary-dark"
        >
          {backText}
        </Button>
      </div>
    );
  }

  // Get the appropriate icon component with colorful styling
  const getIcon = (iconName: string) => {
    // Determine the icon variant based on category
    const designCategory = 
      navState.breadcrumb.primary === "Design Home" || 
      category === "Design Home" || 
      category === "Design & Planning";
      
    const financeCategory = 
      isFinanceRelated(category || '') || 
      isFinanceRelated(navState.breadcrumb.primary || '') || 
      navState.breadcrumb.primary === "Finance & Real Estate";
    
    // The icon to display based on the name
    const getIconElement = () => {
      switch (iconName?.toLowerCase()) {
        case "globe": return <Globe />;
        case "hammer": return <Hammer />;
        case "layout": return <Layout />;
        case "pentool": case "pen-tool": case "pen": return <PenTool />;
        case "ruler": return <Ruler />;
        case "home": return <Home />;
        case "building": return <Building />;
        case "compass": return <Compass />;
        case "paintbucket": case "paint-bucket": case "paint": return <PaintBucket />;
        case "scansearch": case "scan-search": return <ScanSearch />;
        case "filetext": case "file-text": case "file": return <FileText />;
        case "areachart": case "area-chart": case "chart": return <AreaChart />;
        case "map": return <Map />;
        case "users": case "people": return <Users />;
        case "dollarsign": case "dollar-sign": case "dollar": return <DollarSign />;
        case "trendingup": case "trending-up": case "trending": return <TrendingUp />;
        case "creditcard": case "credit-card": case "card": return <CreditCard />;
        case "refreshcw": case "refresh-cw": case "refresh": return <RefreshCw />;
        case "barchart": case "bar-chart": case "bars": return <BarChart />;
        case "barchart2": case "bar-chart-2": return <BarChart2 />;
        case "award": return <Award />;
        case "badgepercent": case "badge-percent": case "badge": return <BadgePercent />;
        case "piggybank": case "piggy-bank": case "piggy": return <PiggyBank />;
        case "banknote": case "note": return <Banknote />;
        case "scale": return <Scale />;
        case "helpcircle": case "help-circle": case "help": return <HelpCircle />;
        case "wrench": case "tool": return <Wrench />;
        case "leaf": return <Leaf />;
        case "unlock": return <Unlock />;
        case "grid": return <Grid />;
        case "shield": return <Shield />;
        case "book": return <Book />;
        case "calendar": return <Calendar />;
        case "lightbulb": case "light": return <Lightbulb />;
        case "search": return <Search />;
        case "landplot": case "land-plot": case "land": return <LandPlot />;
        case "layers": return <Layers />;
        case "box": return <Box />;
        case "package": return <Package />;
        case "activity": return <Activity />;
        case "edit": return <Edit />;
        case "mappin": case "map-pin": return <MapPin />;
        case "checksquare": case "check-square": case "check": return <CheckSquare />;
        case "truck": return <Truck />;
        case "thermometer": return <Thermometer />;
        case "paintbrush": return <Paintbrush />;
        case "droplet": return <Droplet />;
        default: return <Globe />;
      }
    };
    
    return (
      <ColorfulIcon 
        size="sm" 
        variant={designCategory ? "design" : financeCategory ? "finance" : "building"}
      >
        {getIconElement()}
      </ColorfulIcon>
    );
  };

  const subcategoryData = categoryData[designHandledCategory].subcategories[subcategory];
  const thirdLevelItems = subcategoryData.thirdLevel || {};

  return (
    <div>
      
      <h2 className="text-3xl font-heading font-bold text-neutral mb-2">
        {t(subcategoryData.translationKey || subcategory)}
      </h2>
      <p className="text-lg text-neutral-light mb-8">
        {t(`${subcategoryData.translationKey}_desc`) || subcategoryData.description}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(thirdLevelItems).map(([title, data]) => {
          const translationKey = data.translationKey || title.toLowerCase().replace(/\s+/g, '_');
          return (
            <Card 
              key={`card-${title}`}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-col items-center text-center pb-2">
                <div className="mb-3">
                  {getIcon(data.icon || '')}
                </div>
                <CardTitle className="text-xl font-medium mb-0">
                  {t(translationKey) || title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  {t(`${translationKey}_desc`) || data.description}
                </p>

              </CardContent>
            </Card>
        );
      })}
      </div>
      

    </div>
  );
};

export default ThirdLevel;