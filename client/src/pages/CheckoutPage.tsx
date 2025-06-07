import { useEffect, useState } from 'react';
import { useStripe, useElements, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from '@/hooks/useCustomNavigate';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslate } from '@/hooks/useLanguage';

// Load the Stripe.js library
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const t = useTranslate();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is a professional
  useEffect(() => {
    if (user && !user.isProfessional) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch the client secret to initialize the payment form
  useEffect(() => {
    const getSubscription = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest('POST', '/api/get-or-create-subscription');
        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          // If no client secret is returned, redirect to subscription management
          navigate('/subscription-management');
          toast({
            title: t('subscription_ready'),
            description: t('subscription_already_setup'),
          });
        }
      } catch (error: any) {
        console.error('Error getting subscription:', error);
        setError(error.message || t('subscription_error'));
        toast({
          title: t('error'),
          description: error.message || t('subscription_error'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.isProfessional) {
      getSubscription();
    }
  }, [user, navigate, toast, t]);

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">{t('loading_payment')}</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-center">{t('payment_error')}</CardTitle>
            <CardDescription className="text-center">{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/subscription-management')}>
              {t('go_back')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If we have a client secret, show the payment form
  if (clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    );
  }

  return null;
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const t = useTranslate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    // Confirm payment
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscription-success`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      // Show error
      setPaymentError(result.error.message || t('payment_failed'));
      toast({
        title: t('payment_failed'),
        description: result.error.message,
        variant: 'destructive',
      });
      setIsProcessing(false);
    } else if (result.paymentIntent?.status === 'succeeded') {
      // Payment succeeded
      setSucceeded(true);
      toast({
        title: t('payment_successful'),
        description: t('subscription_activated'),
      });
      
      // Redirect to success page after a short delay
      setTimeout(() => {
        navigate('/subscription-success');
      }, 1500);
    } else {
      // Payment requires additional actions or has another status
      setIsProcessing(false);
    }
  };

  // Success state
  if (succeeded) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-center">{t('payment_successful')}</CardTitle>
            <CardDescription className="text-center">{t('subscription_activated')}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/subscription-management')}>
              {t('manage_subscription')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('complete_subscription')}</h1>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t('payment_information')}</CardTitle>
          <CardDescription>{t('payment_information_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="rounded-lg bg-muted p-4 mb-6">
              <h3 className="font-medium mb-2">{t('standard_plan')}</h3>
              <p className="text-2xl font-bold">$29.99 <span className="text-sm font-normal text-muted-foreground">{t('per_month')}</span></p>
              <p className="text-sm text-muted-foreground mt-2">{t('cancel_anytime')}</p>
            </div>
            
            <form id="payment-form" onSubmit={handleSubmit}>
              <PaymentElement id="payment-element" />
              
              {paymentError && (
                <div className="text-red-500 text-sm mt-4 bg-red-50 p-3 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
                    <p>{paymentError}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={handleSubmit}
            disabled={isProcessing || !stripe || !elements} 
            className="w-full"
          >
            {isProcessing ? (
              <>
                {t('processing')}
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              t('pay_now')
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/subscription-management')}
            disabled={isProcessing}
            className="w-full"
          >
            {t('go_back')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}