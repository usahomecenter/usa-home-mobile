import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import { useLanguage } from "@/hooks/useLanguage";

type BreadcrumbProps = {
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const Breadcrumb = ({ navState, setNavState }: BreadcrumbProps) => {
  const [_, setLocation] = useLocation();
  const { t } = useLanguage();
  
  const goHome = () => {
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
  
  const goToPrimary = () => {
    if (navState.breadcrumb.primary === 'Build Home') {
      setNavState({
        currentView: 'build-home',
        breadcrumb: { 
          primary: 'Build Home', 
          secondary: null, 
          tertiary: null 
        }
      });
      setLocation('/build-home');
    } else if (navState.breadcrumb.primary === 'Design Home') {
      setNavState({
        currentView: 'design-home',
        breadcrumb: { 
          primary: 'Design Home', 
          secondary: null, 
          tertiary: null 
        }
      });
      setLocation('/design-home');
    } else if (navState.breadcrumb.primary === 'Finance & Real Estate') {
      setNavState({
        currentView: 'finance',
        breadcrumb: { 
          primary: 'Finance & Real Estate', 
          secondary: null, 
          tertiary: null 
        }
      });
      setLocation('/finance');
    }
  };
  
  const goToSecondary = () => {
    if (navState.breadcrumb.secondary) {
      setNavState({
        currentView: 'subcategories',
        breadcrumb: { 
          primary: navState.breadcrumb.primary, 
          secondary: navState.breadcrumb.secondary, 
          tertiary: null 
        }
      });
      setLocation(`/subcategories/${encodeURIComponent(navState.breadcrumb.secondary)}`);
    }
  };
  
  return (
    <nav className="flex animate-fade-in" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <button 
            onClick={goHome}
            className="inline-flex items-center text-sm font-medium text-neutral hover:text-primary"
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
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            {t('home')}
          </button>
        </li>
        
        {navState.breadcrumb.primary && navState.breadcrumb.primary !== 'Build Home' && (
          <li>
            <div className="flex items-center">
              <svg 
                className="w-4 h-4 text-neutral mx-1" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              <button 
                onClick={goToPrimary}
                className="ml-1 text-sm font-medium text-neutral hover:text-primary animate-fade-in"
              >
                {navState.breadcrumb.primary}
              </button>
            </div>
          </li>
        )}
        
        {navState.breadcrumb.secondary && (
          <li>
            <div className="flex items-center">
              <svg 
                className="w-4 h-4 text-neutral mx-1" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              <button 
                onClick={goToSecondary}
                className="ml-1 text-sm font-medium text-neutral hover:text-primary animate-fade-in"
              >
                {navState.breadcrumb.secondary}
              </button>
            </div>
          </li>
        )}
        
        {navState.breadcrumb.tertiary && (
          <li>
            <div className="flex items-center">
              <svg 
                className="w-4 h-4 text-neutral mx-1" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              <span className="ml-1 text-sm font-medium text-accent animate-fade-in">
                {navState.breadcrumb.tertiary}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
