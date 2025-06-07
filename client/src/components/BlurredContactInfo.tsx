import { useState } from "react";
import { User } from "@shared/schema";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LinkIcon, Mail, Phone, Facebook, Instagram, AtSign } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/use-auth";
import { isSubscriptionActive } from "@/utils/subscription";

interface BlurredContactInfoProps {
  professional: User;
  blurred: boolean;
}

export function BlurredContactInfo({ professional, blurred }: BlurredContactInfoProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Create masked versions of contact info
  const maskEmail = professional.email ? 
    `${professional.email.substring(0, 2)}•••@•••${professional.email.substring(professional.email.lastIndexOf('.'))}` : 
    '';
    
  const maskPhone = professional.phone ? 
    `${professional.phone.substring(0, 3)}•••${professional.phone.substring(professional.phone.length - 3)}` : 
    '';
    
  const maskUrl = (url: string | null) => {
    if (!url) return '';
    try {
      const domain = new URL(url).hostname;
      return `${domain.substring(0, 4)}•••`;
    } catch {
      return '•••.com';
    }
  };

  // Handle the case when there's no contact info
  const hasContactInfo = professional.phone || professional.email || professional.websiteUrl || 
                          professional.facebookUrl || professional.instagramUrl || professional.tiktokUrl;
                            
  if (!hasContactInfo) {
    return null;
  }

  // Check if user is viewing their own profile
  const isOwnProfile = user && user.id === professional.id;
  const subscriptionActive = isSubscriptionActive(professional);
  
  // If viewing own profile, don't blur contact info but still show subscription message if inactive
  const shouldBlurContactInfo = isOwnProfile ? false : blurred;
  const shouldShowSubscriptionMessage = isOwnProfile ? !subscriptionActive : blurred;
  
  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-2">
        <CardTitle>{t('contact_information')}</CardTitle>
        {shouldBlurContactInfo && (
          <CardDescription className="text-amber-500">
            {t('contact_info_blurred')}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {professional.email && (
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-primary" />
            <div>
              <p className="text-sm font-medium">{t('email')}:</p>
              <p className={shouldBlurContactInfo ? "text-sm blur-sm hover:blur-none transition-all duration-300" : "text-sm"}>
                {professional.email}
              </p>
              {shouldBlurContactInfo && <p className="text-sm">{maskEmail}</p>}
            </div>
          </div>
        )}
        
        {professional.phone && (
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-primary" />
            <div>
              <p className="text-sm font-medium">{t('phone')}:</p>
              <p className={shouldBlurContactInfo ? "text-sm blur-sm hover:blur-none transition-all duration-300" : "text-sm"}>
                {professional.phone}
              </p>
              {shouldBlurContactInfo && <p className="text-sm">{maskPhone}</p>}
            </div>
          </div>
        )}
        
        {professional.websiteUrl && (
          <div className="flex items-center">
            <LinkIcon className="h-5 w-5 mr-3 text-primary" />
            <div>
              <p className="text-sm font-medium">{t('website')}:</p>
              <a 
                href={shouldBlurContactInfo ? "#" : (professional.websiteUrl.startsWith('http') ? professional.websiteUrl : `https://${professional.websiteUrl}`)} 
                target={shouldBlurContactInfo ? "_self" : "_blank"} 
                rel="noopener noreferrer"
                className={`text-sm text-blue-600 hover:underline ${shouldBlurContactInfo ? "blur-sm hover:blur-none transition-all duration-300 pointer-events-none" : ""}`}
              >
                {professional.websiteUrl}
              </a>
              {shouldBlurContactInfo && <p className="text-sm">{maskUrl(professional.websiteUrl)}</p>}
            </div>
          </div>
        )}
        
        {/* Social media section with icons only */}
        {(professional.facebookUrl || professional.instagramUrl || professional.tiktokUrl) && (
          <div>
            <div className="flex items-center">
              <p className="text-sm font-medium mr-2">{t('social_media')}:</p>
              
              <div className="flex space-x-3">
                <a 
                  href={professional.facebookUrl && !shouldBlurContactInfo ? professional.facebookUrl : "#"} 
                  target={professional.facebookUrl && !shouldBlurContactInfo ? "_blank" : "_self"} 
                  rel="noopener noreferrer"
                  className={`${!professional.facebookUrl || shouldBlurContactInfo ? "pointer-events-none opacity-30" : ""}`}
                  title="Facebook"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
                    </svg>
                  </div>
                </a>
                
                <a 
                  href={professional.instagramUrl && !shouldBlurContactInfo ? professional.instagramUrl : "#"} 
                  target={professional.instagramUrl && !shouldBlurContactInfo ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className={`${!professional.instagramUrl || shouldBlurContactInfo ? "pointer-events-none opacity-30" : ""}`}
                  title="Instagram"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.054-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.986-.01 4.04-.058.975-.045 1.504-.207 1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.054.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                    </svg>
                  </div>
                </a>
                
                <a 
                  href={professional.tiktokUrl && !shouldBlurContactInfo ? professional.tiktokUrl : "#"} 
                  target={professional.tiktokUrl && !shouldBlurContactInfo ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className={`${!professional.tiktokUrl || shouldBlurContactInfo ? "pointer-events-none opacity-30" : ""}`}
                  title="TikTok"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
        
        {shouldShowSubscriptionMessage && (
          <div className="mt-4 p-3 text-sm bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            <p>{t('subscription_inactive_message')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}