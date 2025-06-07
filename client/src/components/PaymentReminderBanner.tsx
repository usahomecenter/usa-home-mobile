import { User } from "@shared/schema";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { isSubscriptionActive, getSubscriptionDaysRemaining } from "@/utils/subscription";
import { AlertCircle, CreditCard } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface PaymentReminderBannerProps {
  professional: User;
}

export function PaymentReminderBanner({ professional }: PaymentReminderBannerProps) {
  const { t } = useLanguage();
  const isActive = isSubscriptionActive(professional);
  const daysRemaining = getSubscriptionDaysRemaining(professional);
  
  // Don't show banner for non-professionals
  if (!professional.isProfessional) {
    return null;
  }
  
  // If subscription is active with more than 7 days remaining, don't show banner
  if (isActive && (daysRemaining === null || daysRemaining > 7)) {
    return null;
  }
  
  const getAlertVariant = () => {
    if (!isActive) return "destructive";
    if (daysRemaining !== null && daysRemaining <= 3) return "destructive";
    return "default";
  };
  
  const getAlertTitle = () => {
    if (!isActive) return t('subscription_expired');
    return t('payment_due_soon');
  };
  
  const getAlertMessage = () => {
    if (!isActive) {
      return t('subscription_expired_message');
    }
    
    if (daysRemaining === 1) {
      return t('payment_due_tomorrow');
    }
    
    return t('payment_due_in_days').replace('{days}', daysRemaining?.toString() || '0');
  };
  
  return (
    <Alert variant={getAlertVariant()} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{getAlertTitle()}</AlertTitle>
      <AlertDescription className="flex justify-between items-center mt-2">
        <span>{getAlertMessage()}</span>
        <Button 
          size="sm" 
          className="ml-4"
          onClick={() => {
            // You would typically redirect to a payment page
            // This is a placeholder for the actual payment flow
            window.alert(t('payment_flow_placeholder'));
          }}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {isActive ? t('renew_subscription') : t('reactivate_subscription')}
        </Button>
      </AlertDescription>
    </Alert>
  );
}