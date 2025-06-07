import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import { translations } from "@/hooks/useLanguage";
import { languageOptions } from "@/data/languageData";
import { useEffect, useState } from "react";

type HouseIllustrationProps = {
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const HouseIllustration = ({ setNavState }: HouseIllustrationProps) => {
  const [_, setLocation] = useLocation();
  
  // Temporary direct implementation to replace useLanguage hook
  const [currentLanguage, setCurrentLanguage] = useState(languageOptions[0]);
  
  // Load saved language from localStorage if available
  useEffect(() => {
    const savedLanguageCode = localStorage.getItem('languageCode');
    if (savedLanguageCode) {
      const savedLanguage = languageOptions.find(lang => lang.code === savedLanguageCode);
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
      }
    }
  }, []);
  
  // Translation function
  const t = (key: string): string => {
    // If translation exists for current language, return it
    if (translations[currentLanguage.code] && translations[currentLanguage.code][key]) {
      return translations[currentLanguage.code][key];
    }
    
    // Fallback to English
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    
    // If no translation is found, return the key itself
    return key;
  };

  const handleBuildHome = () => {
    setNavState({
      currentView: 'build-home',
      breadcrumb: { 
        primary: t('build_home'), 
        secondary: null, 
        tertiary: null 
      }
    });
    setLocation('/build-home');
  };

  const handleDesignHome = () => {
    setNavState({
      currentView: 'design-home',
      breadcrumb: { 
        primary: t('design_home'), 
        secondary: null, 
        tertiary: null 
      }
    });
    setLocation('/design-home');
  };

  const handleFinance = () => {
    // Ensure we explicitly log what's happening
    console.log("=== FINANCE BUTTON CLICKED ===");
    console.log("Navigating to Finance & Real Estate page");
    
    setNavState({
      currentView: 'finance',
      breadcrumb: { 
        primary: t('finance_real_estate'), 
        secondary: null, 
        tertiary: null 
      }
    });
    
    // Clear any previous finance category from session storage
    try {
      sessionStorage.removeItem('financeSelectedCategory');
      console.log("Cleared finance category from session storage");
    } catch (e) {
      console.error("Failed to clear finance category from session storage:", e);
    }
    
    // Navigate to the finance page
    setLocation('/finance');
  };
  
  // Handler for Business Loan button (chimney)
  const handleBusinessLoan = () => {
    console.log("=== BUSINESS LOAN BUTTON CLICKED ===");
    console.log("Navigating to Business Loan page");
    
    setNavState({
      currentView: 'finance',
      breadcrumb: { 
        primary: 'Business Financing', 
        secondary: null, 
        tertiary: null 
      }
    });
    
    // Navigate to the business loan page
    setLocation('/business-loan');
  };

  // Create array of 13 elements for authentic US flag stripes
  const stripes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // Create array of 50 elements for authentic US flag stars (representing all 50 states)
  const stars = Array.from({ length: 50 }, (_, i) => i);
  // Create array of 3 elements for small flags
  const smallStripes = [0, 1, 2];

  return (
    <div className="home-illustration w-full max-w-4xl mx-auto mb-8 p-4">
      {/* Modern House Illustration with USA flag elements */}
      <div className="mx-auto max-w-3xl mb-6 relative" style={{ height: "600px" }}>
        {/* House container */}
        <div className="absolute w-full h-[80%] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          
          {/* Classic American House Design */}
          <div className="absolute top-[50px] left-0 w-full h-[300px] overflow-visible">
            {/* Main House Structure */}
            <div className="relative w-full h-full">
              {/* Triangle Roof with USA Flag Design */}
              <div className="absolute top-0 left-[5%] right-[5%] h-[150px]" style={{ 
                clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)', 
                borderLeft: '2px solid #202060',
                borderRight: '2px solid #202060',
                borderBottom: '2px solid #202060',
                overflow: 'hidden',
                zIndex: 10,
                background: 'linear-gradient(to right, #3A3B95 40%, transparent 40%)'
              }}>
                {/* Left Side - Blue with Stars */}
                <div className="absolute top-0 left-0 w-[40%] h-full" style={{ backgroundColor: '#3A3B95' }}>
                  <div className="relative h-full w-full">
                    {[...Array(70)].map((_, i) => {
                      // Create balanced grid (7 rows × 10 columns)
                      const row = Math.floor(i / 10);
                      const col = i % 10;
                      const x = (col + 0.5) * (96 / 10) + 1; // Maximum coverage with minimal margins
                      const y = (row + 0.5) * (96 / 7) + 1; // Adjust for 7 rows
                      return (
                        <div 
                          key={i} 
                          className="absolute"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)', // Center the star on the position
                          }}
                        >
                          <div style={{ 
                            width: '14px',
                            height: '14px',
                            backgroundColor: 'white',
                            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                            boxShadow: '0 0 3px rgba(255,255,255,1)'
                          }}></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Right Side - Red and White Stripes */}
                <div className="absolute top-0 right-0 w-[60%] h-full">
                  {stripes.map((i) => (
                    <div 
                      key={i} 
                      style={{ 
                        height: `${100/13}%`,
                        backgroundColor: i % 2 === 0 ? '#EE3024' : '#FFFFFF',
                        border: 'none'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Chimney - Business Loan Button - With 3D Stacked Letters */}
              <div 
                className="absolute top-[20px] right-[25%] w-[35px] h-[90px] bg-gradient-to-b from-[#B22222] to-[#8B4513] cursor-pointer hover:bg-gradient-to-b hover:from-[#DC143C] hover:to-[#A52A2A] transition-all duration-300 group shadow-md hover:shadow-lg transform hover:scale-105"
                onClick={handleBusinessLoan}
              >
                <div className="absolute top-0 left-0 right-0 h-[8px] bg-[#432818] shadow-inner"></div>
                <div className="absolute -top-[3px] left-[2px] right-[2px] h-[2px] bg-white opacity-20 rounded-full"></div>
                
                {/* Business Loan Tooltip (shown on hover) */}
                <div className="hidden group-hover:block absolute -top-[55px] -left-[60px] w-[150px] bg-white p-3 rounded-lg shadow-xl text-center z-20 border-2 border-blue-200">
                  <span className="text-[12px] font-bold text-blue-800 block mb-1">Business Loan</span>
                  <span className="text-[10px] text-gray-700">Click for options</span>
                  
                  {/* Tooltip Arrow */}
                  <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-blue-200 rotate-45"></div>
                </div>
                
                {/* Rotated 90 degrees "Loan $$" text positioned below the top line */}
                <div className="absolute top-[6px] left-0 right-0 flex items-start justify-center">
                  <div 
                    className="text-white font-bold tracking-wide text-[13px]"
                    style={{
                      transform: 'rotate(90deg)',
                      textShadow: '1px 1px 2px black, 0 0 5px rgba(0,0,0,0.5)',
                      letterSpacing: '1px',
                      marginTop: '0'
                    }}
                  >
                    Loan $$
                  </div>
                </div>
                
                {/* Smoke animation for visual interest */}
                <div className="absolute -top-[15px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-80 transition-opacity">
                  <div className="w-[3px] h-[3px] bg-gray-200 rounded-full animate-ping"></div>
                </div>
                <div className="absolute -top-[20px] left-[30%] opacity-0 group-hover:opacity-60 transition-opacity delay-100">
                  <div className="w-[4px] h-[4px] bg-gray-300 rounded-full animate-ping"></div>
                </div>
              </div>
              
              {/* House Body - Two-Story Structure */}
              <div className="absolute top-[150px] left-[15%] right-[15%] h-[150px] bg-white border-2 border-gray-300 rounded-sm shadow-lg">
                {/* Front Wall with Siding */}
                <div className="absolute inset-0" style={{ 
                  backgroundImage: 'repeating-linear-gradient(180deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 11px)',
                  backgroundSize: '100% 11px'
                }}></div>
                
                {/* Front Door with Finance Button */}
                <div 
                  className="absolute bottom-0 left-[50%] transform -translate-x-1/2 w-[70px] h-[90px] bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-gray-700 cursor-pointer hover:from-amber-600 hover:to-amber-800 transition-colors"
                  onClick={handleFinance}
                >
                  {/* Door Knob */}
                  <div className="absolute right-[10px] top-[45px] w-[6px] h-[6px] rounded-full bg-yellow-600"></div>
                  
                  {/* Finance Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center w-full p-1">
                      <div className="flex items-center justify-center mb-1">
                        <svg className="w-5 h-5 text-amber-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="8" width="18" height="12" rx="2" ry="2"></rect>
                          <path d="M19 8V6c0-1.1-.9-2-2-2H7a2 2 0 0 0-2 2v2"></path>
                          <path d="M12 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                        </svg>
                      </div>
                      <div className="text-[10px] font-bold text-amber-200 leading-tight">{t('finance')}</div>
                      <div className="text-[7px] text-amber-200 mt-0.5 leading-tight">{t('real_estate_short')}</div>
                    </div>
                  </div>
                </div>
                
                {/* Build Home Button - Left Window */}
                <div 
                  className="absolute top-[20px] left-[10%] w-[25%] h-[70px] bg-blue-100 border-2 border-blue-700 rounded-md cursor-pointer hover:bg-blue-200 transition-colors flex items-center justify-center"
                  onClick={handleBuildHome}
                >
                  <div className="text-center w-full p-1">
                    <div className="flex items-center justify-center mb-1">
                      <svg className="w-4 h-4 text-blue-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="6" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="18"></line>
                      </svg>
                    </div>
                    <div className="text-[10px] font-bold text-blue-800 leading-tight">{t('build')}</div>
                    <div className="text-[7px] text-blue-900 mt-0.5 leading-tight">{t('find_pros')}</div>
                  </div>
                </div>
                
                {/* Design Home Button - Right Window */}
                <div 
                  className="absolute top-[20px] right-[10%] w-[25%] h-[70px] bg-blue-100 border-2 border-blue-700 rounded-md cursor-pointer hover:bg-blue-200 transition-colors flex items-center justify-center"
                  onClick={handleDesignHome}
                >
                  <div className="text-center w-full p-1">
                    <div className="flex items-center justify-center mb-1">
                      <svg className="w-4 h-4 text-blue-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                        <path d="M2 2l7.586 7.586"></path>
                        <circle cx="11" cy="11" r="2"></circle>
                      </svg>
                    </div>
                    <div className="text-[10px] font-bold text-blue-800 leading-tight">{t('design')}</div>
                    <div className="text-[7px] text-blue-900 mt-0.5 leading-tight">{t('interior')}</div>
                  </div>
                </div>
                
                {/* Steps */}
                <div className="absolute -bottom-[2px] left-[50%] transform -translate-x-1/2 w-[60px] flex flex-col items-center">
                  <div className="w-full h-[4px] bg-gray-400"></div>
                  <div className="w-[80%] h-[4px] bg-gray-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="absolute top-[350px] left-0 w-full bg-gradient-to-b from-gray-50 to-white p-4 text-center">
            <h3 className="text-lg font-medium text-gray-800">{t('house_illustration_title')}</h3>
            <p className="text-sm text-gray-600">{t('click_to_explore')}</p>
          </div>
          
          {/* USA Flag Driveway - More stripes to match roof */}
          <div className="absolute -bottom-[10px] left-1/2 transform -translate-x-1/2 w-[40%] h-[10px]">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="flex flex-col h-full">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-[#EE3024]' : 'bg-white'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-8 -mt-16">
        <h3 className="text-xl font-bold mb-4" style={{ color: '#EE3024' }}>{t('modern_home_solutions')}</h3>
        <p className="text-lg max-w-2xl font-medium text-neutral-dark mx-auto">{t('transform_vision')}</p>
      </div>
    </div>
  );
};

export default HouseIllustration;
