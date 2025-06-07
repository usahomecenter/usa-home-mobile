import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/useLanguage";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ProfessionalAdditionalServiceSuccess() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [addedService, setAddedService] = useState<string | null>(null);
  
  // Extract the added service from localStorage
  useEffect(() => {
    const storedService = localStorage.getItem('additionalServiceCategory');
    if (storedService) {
      setAddedService(storedService);
      // Clean up the localStorage
      localStorage.removeItem('additionalServiceCategory');
    }
  }, []);
  
  if (!user || !user.isProfessional) {
    setLocation("/");
    return null;
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto text-center">
        <CardHeader className="pb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {t('service_added_successfully')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-xl">
            {addedService ? (
              <p>
                {t('your_profile_now_appears_in')} <span className="font-semibold">{addedService}</span> {t('category')}
              </p>
            ) : (
              <p>{t('additional_service_added')}</p>
            )}
          </div>
          
          <p className="text-muted-foreground">
            {t('clients_can_find_you_all_categories')}
          </p>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-blue-800 text-left">
            <h4 className="font-medium text-blue-800 mb-2">Updated Subscription Information:</h4>
            <p className="text-sm mb-2">
              • Your subscription now includes {user.serviceCategories?.length || 1} service categories
            </p>
            <p className="text-sm mb-2">
              • Updated monthly fee: ${(29.77 + ((user.serviceCategories?.length || 1) - 1) * 5).toFixed(2)}
            </p>
            <p className="text-sm">
              • Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid gap-4 md:grid-cols-2">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2" 
              onClick={() => setLocation("/my-account")}
            >
              <ArrowRight className="h-4 w-4" />
              {t('go_to_my_account')}
            </Button>
            
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2" 
              onClick={() => setLocation("/")}
            >
              <Home className="h-4 w-4" />
              {t('return_to_home')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}