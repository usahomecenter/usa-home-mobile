import { useEffect, useState } from "react";
import { User } from "@shared/schema";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { AlertTriangle, CreditCard } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/use-auth";
import { isSubscriptionActive } from "@/utils/subscription";
import { useLocation } from "wouter";

export function SubscriptionAlert() {
  // Add safety check for language provider
  let t;
  try {
    const { t: translateFunction } = useLanguage();
    t = translateFunction;
  } catch (error) {
    // Fallback if language provider is not available
    t = (key: string) => {
      const fallbacks: Record<string, string> = {
        'subscription_inactive_title': 'Subscription Inactive',
        'subscription_inactive_login_message': 'Your professional account subscription is inactive. Please update your payment information to reactivate your account.',
        'activate_account': 'Activate Account',
        'dismiss': 'Dismiss'
      };
      return fallbacks[key] || key;
    };
  }
  
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Show alert if user is a professional with inactive subscription
    if (user && user.isProfessional && !isSubscriptionActive(user)) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [user]);

  const handleActivateAccount = () => {
    setLocation("/update-payment");
    setShowAlert(false);
  };

  const handleDismiss = () => {
    setShowAlert(false);
  };

  if (!showAlert || !user) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Alert className="max-w-2xl mx-auto bg-amber-50 border-amber-300 shadow-lg">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800 font-semibold">
          {t('subscription_inactive_title')}
        </AlertTitle>
        <AlertDescription className="text-amber-700 space-y-3">
          <p>{t('subscription_inactive_login_message')}</p>
          <div className="flex space-x-3">
            <Button 
              onClick={handleActivateAccount}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              size="sm"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {t('activate_account')}
            </Button>
            <Button 
              onClick={handleDismiss}
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              {t('dismiss')}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}