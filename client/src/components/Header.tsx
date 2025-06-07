import { Link, useLocation } from "wouter";
import { NavigationState } from '@/App';
import { Globe, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";
import { languageOptions } from "@/data/languageData";
import { useEffect, useContext } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LanguageContext } from "@/hooks/useLanguage";
import { NotificationBell } from "@/components/NotificationBell";

type HeaderProps = {
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const Header = ({ navState, setNavState }: HeaderProps) => {
  const [location, setLocation] = useLocation();
  const showBackButton = location !== "/";
  const { user, isLoading } = useAuth();
  
  // Create fallback functions for language handling
  let currentLanguage = languageOptions[0];
  let setLanguage = (lang: any) => console.log("Language set:", lang);
  let t = (key: string) => key;
  
  // Try to use the language context, but don't crash if not available
  const langContext = useContext(LanguageContext);
  if (langContext) {
    currentLanguage = langContext.currentLanguage;
    setLanguage = langContext.setLanguage;
    t = langContext.t;
  }
  
  // Handler for going back to previous page
  const handleBackClick = () => {
    // For URL-based routes, use both window.history and setLocation
    if (location.startsWith("/professional") || 
        location.startsWith("/location") || 
        location.startsWith("/support")) {
      
      // Use more reliable path-based navigation
      if (location.includes("/professional-listing-question/")) {
        const service = location.split("/").pop();
        setLocation(`/find-professionals/${service}`);
      }
      else if (location.includes("/professional-signup/")) {
        const service = location.split("/").pop();
        setLocation(`/professional-listing-question/${service}`);
      }
      else if (location.includes("/location-select/")) {
        const service = location.split("/").pop();
        setLocation(`/find-professionals/${service}`);
      }
      else if (location.includes("/professionals/")) {
        const pathParts = location.split("/");
        if (pathParts.length >= 4) {
          const service = pathParts[2];
          setLocation(`/location-select/${service}`);
        } else {
          window.history.back();
        }
      }
      else {
        // Fallback to browser history
        window.history.back();
      }
      return;
    }
    
    // For state-based navigation
    if (navState.breadcrumb.tertiary) {
      // If we're at tertiary level, go back to secondary level
      const isDesignPath = navState.breadcrumb.primary === t('design_home') || 
                         location.includes('design-home');
      
      // Check if we should preserve the subcategory view or go directly to design/build home
      if (isDesignPath && location.includes('/third-level/Design')) {
        setNavState({
          ...navState,
          currentView: 'design-home',
          breadcrumb: {
            primary: t('design_home'),
            secondary: null,
            tertiary: null
          }
        });
        setLocation('/design-home');
      } else {
        setNavState({
          ...navState,
          currentView: 'subcategories',
          breadcrumb: {
            ...navState.breadcrumb,
            tertiary: null
          }
        });
        // Also update the URL for better history
        // Get the actual category value from the URL path or use a fallback
        const pathParts = location.split('/');
        const category = pathParts.length >= 3 ? pathParts[2] : "";
        setLocation(`/subcategories/${category}`);
      }
    } else if (navState.breadcrumb.secondary) {
      // If we're at secondary level, go back to primary level
      
      // First, determine which section we're in - Design, Build, or Finance
      const isDesignPath = navState.breadcrumb.primary === t('design_home') || 
                          navState.breadcrumb.primary === 'Design Home' || 
                          location.includes('design');
      
      const isFinancePath = navState.breadcrumb.primary === t('finance_real_estate') || 
                            navState.breadcrumb.primary === 'Finance & Real Estate' || 
                            location.includes('finance');
      
      // Handle navigation based on the section
      if (isDesignPath) {
        // Always go back to Design Home from any Design subcategories
        setNavState({
          currentView: 'design-home',
          breadcrumb: {
            primary: t('design_home'),
            secondary: null,
            tertiary: null
          }
        });
        setLocation("/design-home");
      } else if (isFinancePath) {
        // Go back to Finance Home from any Finance subcategories
        setNavState({
          currentView: 'finance',
          breadcrumb: {
            primary: t('finance_real_estate'),
            secondary: null,
            tertiary: null
          }
        });
        setLocation("/finance");
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
        setLocation("/build-home");
      }
    } else if (navState.breadcrumb.primary) {
      // If we're at primary level, go back to homepage
      setNavState({
        currentView: 'homepage',
        breadcrumb: {
          primary: null,
          secondary: null,
          tertiary: null
        }
      });
      setLocation("/");
    } else {
      // Fallback to home
      setLocation("/");
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-4xl">
              🇺🇸
            </div>
            <span className="text-primary text-2xl font-bold font-heading">USA <span className="text-red-600">Home</span></span>
          </Link>
          
          {/* Back Button - Only shown when not on homepage */}
          {showBackButton && (
            <button 
              onClick={handleBackClick}
              className="ml-4 flex items-center p-2 text-blue-800 hover:text-blue-600 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              <span className="font-medium">{t('back')}</span>
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/support" className="font-button text-neutral-dark hover:text-primary transition-colors py-2 font-medium">{t('support')}</Link>
            
            {!isLoading && user ? (
              <>
                <NotificationBell />
                <Link href="/my-profile" className={`flex items-center gap-2 font-button transition-colors py-2 font-medium ${
                  location === '/my-profile' ? 'text-primary' : 'text-neutral-dark hover:text-primary'
                }`}>
                  <User className="h-4 w-4" />
                  {t('my_profile')}
                </Link>
                <Link href="/my-account" className={`font-button transition-colors py-2 font-medium ${
                  location === '/my-account' ? 'text-primary' : 'text-neutral-dark hover:text-primary'
                }`}>
                  {t('my_account')}
                </Link>
                <Link href="/update-payment" className={`font-button transition-colors py-2 font-medium ${
                  location === '/update-payment' ? 'text-primary' : 'text-neutral-dark hover:text-primary'
                }`}>
                  {t('update_payment')}
                </Link>
              </>
            ) : (
              <>
                <Link href="/provider-login" className="font-button text-neutral-dark hover:text-primary transition-colors py-2 font-medium">{t('login')}</Link>
              </>
            )}
          </nav>
          
          {/* Language Selector - Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="hidden md:flex items-center gap-1 text-neutral-dark hover:text-primary transition-colors"
                aria-label="Change language"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{currentLanguage.abbr}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {languageOptions.map((language) => (
                <DropdownMenuItem 
                  key={language.code}
                  onClick={() => setLanguage(language)}
                  className={language.code === currentLanguage.code ? "bg-muted" : ""}
                >
                  <span className="w-12 inline-block">{language.abbr}</span>
                  <span>{language.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Language Selector - Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="md:hidden text-neutral-dark hover:text-primary transition-colors"
                aria-label="Change language"
              >
                <Globe className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {languageOptions.map((language) => (
                <DropdownMenuItem 
                  key={language.code}
                  onClick={() => setLanguage(language)}
                  className={language.code === currentLanguage.code ? "bg-muted" : ""}
                >
                  <span className="w-12 inline-block">{language.abbr}</span>
                  <span>{language.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Main Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="text-neutral-dark hover:text-primary transition-colors"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setLocation("/support")}>
                {t('support')}
              </DropdownMenuItem>
              
              {!isLoading && user ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/my-profile")} className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('my_profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/my-account")}>
                    {t('my_account')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/update-payment")}>
                    {t('update_payment')}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/provider-login")}>
                    {t('login')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/forgot-password")}>
                    {t('forgot_password')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
