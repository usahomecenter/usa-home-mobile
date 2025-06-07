import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, Instagram, Globe, Phone, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/ui/star-rating";
import { ReviewList } from "@/components/ReviewList";
import { ReviewForm } from "@/components/ReviewForm";
import { GuestReviewForm } from "@/components/GuestReviewForm";
import { ReviewSummary } from "@/components/ReviewSummary";
import { EnhancedProfessionalProfile } from "@/components/EnhancedProfessionalProfile";
import { User, Review } from "@shared/schema";
import { translations } from "@/hooks/useLanguage";
import { languageOptions, worldLanguages } from "@/data/languageData";
import { useAuth } from "@/hooks/use-auth";
import { isSubscriptionActive } from "@/utils/subscription";

type ProfessionalListingProps = {
  service: string;
  state: string;
  language: string;
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

// Function to get initials from a name
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Function to calculate average rating
const calculateAverageRating = (reviews: Review[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return sum / reviews.length;
};

// Component to display the rating with reviews data
interface ProfessionalRatingProps {
  professionalId: number;
  service: string;
  t: (key: string) => string;
}

function ProfessionalRating({ professionalId, service, t }: ProfessionalRatingProps) {
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/professionals", professionalId, "reviews"],
    queryFn: async () => {
      const response = await fetch(`/api/professionals/${professionalId}/reviews`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return response.json();
    },
  });
  
  const averageRating = reviews ? calculateAverageRating(reviews) : 0;
  const reviewCount = reviews?.length || 0;
  
  return (
    <div className="flex flex-wrap items-center mb-4">
      <div className="flex items-center mr-4 mb-2">
        {isLoading ? (
          <div className="animate-pulse flex items-center">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            <StarRating rating={averageRating} size={16} />
            <span className="text-neutral-light ml-1">
              ({reviewCount} {t('reviews')})
            </span>
          </>
        )}
      </div>
    </div>
  );
}

const ProfessionalListing = ({ service, state, language, navState, setNavState }: ProfessionalListingProps) => {
  const [, setLocation] = useLocation();
  const [expandedProfessional, setExpandedProfessional] = useState<number | null>(null);
  
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
  
  // Fetch professionals from the API
  const { data: professionals, isLoading } = useQuery<User[]>({
    queryKey: ["/api/professionals", service, state, language],
    queryFn: async () => {
      try {
        console.log(`Fetching professionals for service: "${service}", state: "${state}", language: "${language}"`);
        
        // Build API URL with all parameters
        // The backend now searches in both serviceCategory field and serviceCategories array
        let queryUrl = `/api/professionals?serviceCategory=${encodeURIComponent(service)}`;
        
        // Add state parameter - the backend handles both single state and array of states
        if (state && state !== "any") {
          queryUrl += `&stateLocation=${encodeURIComponent(state)}`;
        }
        
        // Add language parameter to API call - the backend handles both single language and array of languages
        if (language && language !== "any") {
          // Determine if we need to convert language code to name
          let languageParam = language;
          
          // If it's a code (e.g., "es"), get the name ("Spanish")
          const languageObj = languageOptions.find(lang => lang.code === language);
          if (languageObj) {
            languageParam = languageObj.name;
          }
          
          // Add to URL
          queryUrl += `&language=${encodeURIComponent(languageParam)}`;
        }
        
        console.log(`API request URL: ${queryUrl}`);
        
        const response = await fetch(queryUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch professionals");
        }
        
        const data = await response.json();
        console.log(`API returned ${data.length} professionals:`, data);
        
        return data;
      } catch (err) {
        console.error("Error fetching professionals:", err);
        return [];
      }
    },
  });

  // Use the data directly from the API
  const displayProfessionals = professionals || [];
  console.log("Final displayProfessionals:", displayProfessionals);

  // Get the current authenticated user for permission checking
  const { user } = useAuth();
  
  // Track if we've shown the loading indicator to avoid flashing "No professionals found"
  const [hasShownLoading, setHasShownLoading] = useState(false);
  
  // Mark as having shown loading when isLoading becomes true
  useEffect(() => {
    if (isLoading) {
      setHasShownLoading(true);
    }
  }, [isLoading]);
  
  // Toggle expanded professional
  const toggleExpanded = (id: number) => {
    setExpandedProfessional(expandedProfessional === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg mb-6">
        <CardHeader className="bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardTitle className="font-heading text-2xl">
            {service} {t('professionals_in')} {state}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <p className="text-neutral-light">
              {t('showing')} {displayProfessionals.length} {t('professionals_who_speak')} {
                (() => {
                  // First try to find by code (e.g., "es")
                  const langByCode = languageOptions.find(lang => lang.code === language);
                  if (langByCode) {
                    console.log(`Displaying language name: ${langByCode.name} (from code: ${language})`);
                    return langByCode.name;
                  }
                  
                  // Then try to find by name (e.g., "Spanish")
                  const langByName = languageOptions.find(lang => 
                    lang.name.toLowerCase() === language.toLowerCase()
                  );
                  if (langByName) {
                    console.log(`Displaying language name: ${langByName.name} (from name match: ${language})`);
                    return langByName.name;
                  }
                  
                  // Finally, try world languages as a fallback
                  const worldLang = worldLanguages.find(lang => 
                    lang.toLowerCase() === language.toLowerCase()
                  );
                  console.log(`Displaying language name: ${worldLang || language} (from fallback)`);
                  return worldLang || language;
                })()
              } {t('in')} {state}
            </p>
            {displayProfessionals.length === 0 && !isLoading && hasShownLoading && (
              <div className="mt-4 p-4 bg-amber-50 text-amber-700 rounded-md">
                <p className="font-semibold">{t('no_professionals_found')}</p>
                <p className="mt-1">{t('try_different_criteria')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        // Loading state
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-md mb-6 overflow-hidden animate-pulse">
              <div className="flex flex-col md:flex-row">
                <div className="flex justify-center items-center p-6 bg-gray-50 md:w-1/4">
                  <div className="h-32 w-32 rounded-full bg-gray-200" />
                </div>
                <div className="p-6 md:w-3/4">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Display professionals
        displayProfessionals.map((pro: User) => (
          <Card key={pro.id} className="shadow-md mb-6 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="flex justify-center items-center p-6 bg-gray-50 md:w-1/4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    {pro.profileImageUrl ? (
                      <AvatarImage 
                        src={pro.profileImageUrl} 
                        alt={`${pro.fullName || pro.username}'s profile`} 
                        className={!isSubscriptionActive(pro) ? "blur-sm" : ""}
                      />
                    ) : (
                      <AvatarFallback className={`text-4xl bg-primary/10 text-primary ${!isSubscriptionActive(pro) ? "blur-sm" : ""}`}>
                        {pro.fullName ? pro.fullName.split(' ').map((n: string) => n[0]).join('') : pro.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {/* Subscription expired overlay for Part 1 */}
                  {!isSubscriptionActive(pro) && (
                    <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold text-center px-2">
                        Subscription<br />Expired
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 md:w-3/4">
                <h3 className="font-heading font-bold text-xl mb-1">
                  {pro.fullName || pro.username}
                </h3>
                
                {/* Business name with primary service */}
                <p className="text-neutral-light mb-2">
                  {pro.businessName ? 
                    `${pro.serviceCategory || service} ${t('at')} ${pro.businessName}` : 
                    pro.serviceCategory || service
                  }
                </p>
                
                {/* Display all service categories */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <div className="flex items-center mb-1.5">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                      {pro.serviceCategory || service}
                    </span>
                  </div>
                  
                  {/* Additional service categories */}
                  {pro.serviceCategories && Array.isArray(pro.serviceCategories) && 
                   pro.serviceCategories.filter(cat => cat !== pro.serviceCategory).map((category, index) => (
                    <div key={index} className="flex items-center mb-1.5">
                      <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                        {category}
                      </span>
                    </div>
                  ))}
                </div>
                
                <ProfessionalRating professionalId={pro.id} service={service} t={t} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {pro.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-neutral-light" />
                      <a 
                        href={isSubscriptionActive(pro) ? `tel:${pro.phone}` : "#"} 
                        className={`text-primary hover:underline ${!isSubscriptionActive(pro) ? 'blur-sm pointer-events-none' : ''}`}
                      >
                        {pro.phone}
                      </a>
                    </div>
                  )}
                  
                  {/* Display the professional's website if available */}
                  {pro.websiteUrl ? (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-neutral-light flex-shrink-0" />
                      <a 
                        href={isSubscriptionActive(pro) ? (pro.websiteUrl.startsWith('http') ? pro.websiteUrl : `https://${pro.websiteUrl}`) : "#"}
                        target={isSubscriptionActive(pro) ? "_blank" : "_self"}
                        rel="noopener noreferrer" 
                        className={`text-primary hover:underline truncate ${!isSubscriptionActive(pro) ? 'blur-sm pointer-events-none' : ''}`}
                      >
                        {pro.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  ) : null}
                  
                  {/* Show email link as a separate entry if no website */}
                  {pro.email && !pro.websiteUrl && (
                    <div className="flex items-center">
                      <svg 
                        className="w-5 h-5 mr-2 text-neutral-light flex-shrink-0" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <a 
                        href={isSubscriptionActive(pro) ? `mailto:${pro.email}` : "#"} 
                        className={`text-primary hover:underline truncate ${!isSubscriptionActive(pro) ? 'blur-sm pointer-events-none' : ''}`}
                      >
                        {pro.email}
                      </a>
                    </div>
                  )}
                </div>
                
                {/* Grid has been removed to avoid duplicating the website URL */}
                
                {/* Social Media Links */}
                <div className="flex mt-3 mb-4 space-x-2">
                  {/* Facebook icon */}
                  <a 
                    href={pro.facebookUrl && isSubscriptionActive(pro) ? (pro.facebookUrl.startsWith('http') ? pro.facebookUrl : `https://${pro.facebookUrl}`) : "#"}
                    target={pro.facebookUrl && isSubscriptionActive(pro) ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`${!pro.facebookUrl ? "opacity-30 pointer-events-none" : ""} ${!isSubscriptionActive(pro) ? "blur-sm pointer-events-none" : ""}`}
                    title="Facebook"
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white">
                      <Facebook className="w-5 h-5" />
                    </div>
                  </a>
                  
                  {/* Instagram icon */}
                  <a 
                    href={pro.instagramUrl && isSubscriptionActive(pro) ? (pro.instagramUrl.startsWith('http') ? pro.instagramUrl : `https://${pro.instagramUrl}`) : "#"}
                    target={pro.instagramUrl && isSubscriptionActive(pro) ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`${!pro.instagramUrl ? "opacity-30 pointer-events-none" : ""} ${!isSubscriptionActive(pro) ? "blur-sm pointer-events-none" : ""}`}
                    title="Instagram"
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white">
                      <Instagram className="w-5 h-5" />
                    </div>
                  </a>
                  
                  {/* TikTok icon */}
                  <a 
                    href={pro.tiktokUrl && isSubscriptionActive(pro) ? (pro.tiktokUrl.startsWith('http') ? pro.tiktokUrl : `https://${pro.tiktokUrl}`) : "#"}
                    target={pro.tiktokUrl && isSubscriptionActive(pro) ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`${!pro.tiktokUrl ? "opacity-30 pointer-events-none" : ""} ${!isSubscriptionActive(pro) ? "blur-sm pointer-events-none" : ""}`}
                    title="TikTok"
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
                      </svg>
                    </div>
                  </a>
                </div>
                
                {/* Languages spoken */}
                {Array.isArray(pro.languagesSpoken) && pro.languagesSpoken.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>{t('languages_spoken')}:</strong> {pro.languagesSpoken.join(', ')}
                    </p>
                  </div>
                )}
                
                {/* States serviced */}
                {Array.isArray(pro.statesServiced) && pro.statesServiced.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>{t('states_serviced')}:</strong> {pro.statesServiced.join(', ')}
                    </p>
                  </div>
                )}
                
                {/* Classic languages spoken (for backward compatibility) */}
                {!Array.isArray(pro.languagesSpoken) && pro.languagesSpoken && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>{t('languages_spoken')}:</strong> {pro.languagesSpoken}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-wrap space-x-2">
                  <Button
                    onClick={() => toggleExpanded(pro.id)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <span>{expandedProfessional === pro.id ? t('less_info') : t('more_info')}</span>
                    {expandedProfessional === pro.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Expanded content */}
            {expandedProfessional === pro.id && (
              <div className="border-t border-gray-200 p-6">
                <Tabs defaultValue="profile">
                  <TabsList>
                    <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
                    <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
                    {user && user.id !== pro.id && (
                      <TabsTrigger value="write_review">{t('write_review')}</TabsTrigger>
                    )}
                    {!user && (
                      <TabsTrigger value="guest_review">{t('guest_review')}</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="profile">
                    <EnhancedProfessionalProfile 
                      professional={pro} 
                      t={t}
                    />
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="space-y-6">
                    <ReviewSummary professionalId={pro.id} t={t} />
                    <ReviewList professionalId={pro.id} t={t} />
                  </TabsContent>
                  
                  {user && user.id !== pro.id && (
                    <TabsContent value="write_review">
                      <ReviewForm 
                        professionalId={pro.id} 
                        reviewerId={user.id} 
                        t={t}
                      />
                    </TabsContent>
                  )}
                  
                  {!user && (
                    <TabsContent value="guest_review">
                      <GuestReviewForm 
                        professionalId={pro.id}
                        t={t}
                      />
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            )}
          </Card>
        ))
      )}
      
      <div className="flex justify-center my-8">
        <Button 
          variant="outline"
          onClick={() => {
            // Go back to previous page based on navigation state
            const targetPath = navState.secondLevelPath || 
                              navState.currentPath || 
                              '/';
            setLocation(targetPath);
          }}
        >
          {t('back_to')} {navState.secondLevelName || service}
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalListing;