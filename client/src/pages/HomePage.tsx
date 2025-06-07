import { useEffect } from "react";
import HouseIllustration from "@/components/HouseIllustration";
import { NavigationState } from "@/App";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

type HomePageProps = {
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const HomePage = ({ setNavState }: HomePageProps) => {
  // Use the global language context
  const { currentLanguage, t } = useLanguage();
  
  // Reset navigation state when landing on homepage
  useEffect(() => {
    setNavState({
      currentView: 'homepage',
      breadcrumb: {
        primary: null,
        secondary: null,
        tertiary: null
      }
    });
  }, [setNavState]);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-neutral mb-6">
        {t('your_dream_home')} <span className="text-primary">{t('starts_here')}</span>
      </h1>

      
      <HouseIllustration setNavState={setNavState} />
      
      {/* Additional information as requested */}
      <div className="mt-12 max-w-4xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Quick Links */}
          <div className="text-left">
            <h3 className="font-bold text-xl mb-4 border-b pb-2 border-gray-200">{t('quick_links')}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-primary hover:underline">{t('home')}</Link></li>
              <li><Link href="/about-us" className="text-gray-700 hover:text-primary">{t('about_us')}</Link></li>
              <li><Link href="/support" className="text-gray-700 hover:text-primary">{t('support')}</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="text-left">
            <h3 className="font-bold text-xl mb-4 border-b pb-2 border-gray-200">{t('service_menu')}</h3>
            <ul className="space-y-2">
              <li><Link href="/build-home" className="text-gray-700 hover:text-primary">{t('home_building')}</Link></li>
              <li><Link href="/design-home" className="text-gray-700 hover:text-primary">{t('home_design')}</Link></li>
              <li><Link href="/finance" className="text-gray-700 hover:text-primary">Finance & Real Estate</Link></li>
            </ul>
          </div>
          
          {/* Connect With Us */}
          <div className="text-left">
            <h3 className="font-bold text-xl mb-4 border-b pb-2 border-gray-200">{t('connect_with_us')}</h3>
            <ul className="space-y-2">
              <li><Link href="/support" className="text-gray-700 hover:text-primary">{t('contact_us')}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
