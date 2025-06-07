import { useEffect } from 'react';
import { useNavigate } from '@/hooks/useCustomNavigate';
import { useAuth } from '@/hooks/use-auth';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslate } from '@/hooks/useLanguage';
import { queryClient } from '@/lib/queryClient';

export default function SubscriptionSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const t = useTranslate();

  // Redirect non-professionals
  useEffect(() => {
    if (user && !user.isProfessional) {
      navigate('/');
    }
  }, [user, navigate]);

  // Refresh user data and all related queries
  useEffect(() => {
    if (user) {
      // Get stored profile picture from localStorage if it exists
      const storedProfilePic = localStorage.getItem('tempProfileImage');
      
      const refreshData = async () => {
        // First make sure user account is refreshed
        await queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
        
        // If we have a temporary profile image stored, upload it to ensure it's properly attached to the account
        if (storedProfilePic) {
          try {
            console.log('Found stored profile image, uploading it to account');
            
            // The stored profile image is already a base64 string, can use it directly
            
            // Upload the image as base64
            const uploadResponse = await fetch('/api/profile-image/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageBase64: storedProfilePic }),
              credentials: 'include'
            });
            
            if (uploadResponse.ok) {
              console.log('Profile image successfully uploaded');
              // Clear the stored profile image
              localStorage.removeItem('tempProfileImage');
              
              // Refresh user data again after upload
              queryClient.invalidateQueries({ queryKey: ['/api/user'] });
              // Also invalidate any professionals queries to ensure listings show updated data
              queryClient.invalidateQueries({ queryKey: ['/api/professionals'] });
            } else {
              console.error('Failed to upload profile image:', await uploadResponse.text());
            }
          } catch (error) {
            console.error('Error uploading profile image:', error);
          }
        } else {
          // Just invalidate professionals queries to ensure listings show all updated data
          queryClient.invalidateQueries({ queryKey: ['/api/professionals'] });
        }
      };
      
      refreshData();
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">{t('subscription_success')}</CardTitle>
          <CardDescription className="text-lg mt-2">
            {t('subscription_success_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-6">
            <h3 className="font-medium text-lg mb-3">{t('what_happens_next')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white font-medium flex-shrink-0 mt-0.5">1</div>
                <p className="ml-3">{t('subscription_next_1')}</p>
              </li>
              <li className="flex items-start">
                <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white font-medium flex-shrink-0 mt-0.5">2</div>
                <p className="ml-3">{t('subscription_next_2')}</p>
              </li>
              <li className="flex items-start">
                <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white font-medium flex-shrink-0 mt-0.5">3</div>
                <p className="ml-3">{t('subscription_next_3')}</p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">{t('subscription_benefits_title')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="ml-2">{t('benefit_display_contact_info')}</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="ml-2">{t('benefit_website_links')}</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="ml-2">{t('benefit_social_media')}</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="ml-2">{t('benefit_profile_photo')}</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="ml-2">{t('benefit_priority_listing')}</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row gap-3">
          <Button className="w-full" onClick={() => navigate('/subscription-management')}>
            {t('manage_subscription')}
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/profile')}
          >
            {t('update_profile')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}