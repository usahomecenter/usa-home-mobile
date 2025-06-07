import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/use-auth";
import { Check } from "lucide-react";

export default function AlreadyListed() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [alreadyListedService, setAlreadyListedService] = useState('');
  
  useEffect(() => {
    // Check if we have a stored service category
    const storedCategory = localStorage.getItem('alreadyListedCategory');
    if (storedCategory) {
      setAlreadyListedService(storedCategory);
      // Clean up localStorage
      localStorage.removeItem('alreadyListedCategory');
    }
  }, []);
  
  // Redirect if not logged in or not a professional
  if (!user || !user.isProfessional) {
    setLocation("/");
    return null;
  }
  
  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardTitle className="font-heading text-2xl">{t('already_listed')}</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <Check className="w-8 h-8 animate-pulse" />
              </div>
              
              <p className="text-neutral-light mb-6 max-w-lg">
                {t('already_listed_message_1')} <span className="font-semibold">{alreadyListedService}</span> {t('already_listed_message_2')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button 
                  className="flex-1 bg-primary text-white hover:bg-primary-dark flex items-center justify-center gap-2"
                  onClick={() => setLocation('/my-account')}
                >
                  {t('go_to_my_account')}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1 border-primary text-primary hover:bg-primary/10"
                  onClick={() => setLocation('/add-service-category')}
                >
                  {t('back_to_services')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}