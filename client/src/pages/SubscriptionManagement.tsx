import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertCircle, CheckCircle, Clock, ArrowRightCircle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useNavigate } from "@/hooks/useCustomNavigate";
import { useTranslate } from "@/hooks/useLanguage";

type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'paused' | 'none';

interface SubscriptionState {
  status: SubscriptionStatus;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  expiresAt?: string;
}

export default function SubscriptionManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const t = useTranslate();
  const [showCheckout, setShowCheckout] = useState(false);

  // Redirect if not a professional
  useEffect(() => {
    if (user && !user.isProfessional) {
      navigate('/');
    }
  }, [user, navigate]);

  // Get current subscription status
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery<SubscriptionState>({
    queryKey: ['/api/subscription-status'],
    enabled: !!user?.isProfessional,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Handle subscription creation or management
  const createSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/get-or-create-subscription');
      return res.json();
    },
    onSuccess: (data) => {
      // If we have a clientSecret, we need to show the checkout form
      if (data.clientSecret) {
        setShowCheckout(true);
        // Here we would navigate to a checkout page or open a modal
        navigate('/checkout', { replace: true });
      } else {
        // If no clientSecret, subscription is already set up
        queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
      }
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle subscription cancellation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/cancel-subscription');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
      toast({
        title: t('subscription_canceled'),
        description: t('subscription_canceled_description'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle subscription reactivation
  const reactivateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/reactivate-subscription');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
      toast({
        title: t('subscription_reactivated'),
        description: t('subscription_reactivated_description'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle subscription
  const handleSubscriptionAction = () => {
    if (!subscription || subscription.status === 'none') {
      // Create new subscription
      createSubscriptionMutation.mutate();
    } else if (subscription.cancelAtPeriodEnd) {
      // Reactivate canceled subscription
      reactivateSubscriptionMutation.mutate();
    } else if (subscription.status === 'active' || subscription.status === 'trialing') {
      // Cancel active subscription
      cancelSubscriptionMutation.mutate();
    } else {
      // Handle other statuses (past_due, etc.)
      createSubscriptionMutation.mutate();
    }
  };

  // Loading state
  if (isLoadingSubscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">{t('loading_subscription')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('subscription_management')}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('subscription_status')}</CardTitle>
            <CardDescription>{t('subscription_status_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <StatusIcon status={subscription?.status} />
                <div className="ml-3">
                  <p className="font-medium">{getStatusText(subscription?.status, t)}</p>
                  <p className="text-sm text-muted-foreground">
                    {getStatusDescription(subscription, t)}
                  </p>
                </div>
              </div>

              {subscription?.currentPeriodEnd && (
                <div className="rounded-lg bg-muted p-4 mt-4">
                  <h3 className="font-medium mb-2">{t('next_billing_date')}</h3>
                  <p>{format(new Date(subscription.currentPeriodEnd), 'PPP')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(subscription.currentPeriodEnd), { addSuffix: true })}
                  </p>
                </div>
              )}

              {subscription?.expiresAt && (
                <div className="rounded-lg bg-muted p-4 mt-4">
                  <h3 className="font-medium mb-2">{t('subscription_expires')}</h3>
                  <p>{format(new Date(subscription.expiresAt), 'PPP')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(subscription.expiresAt), { addSuffix: true })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubscriptionAction}
              disabled={
                createSubscriptionMutation.isPending || 
                cancelSubscriptionMutation.isPending || 
                reactivateSubscriptionMutation.isPending
              }
              className="w-full"
            >
              {getActionButtonText(subscription, t)}
              {(createSubscriptionMutation.isPending || 
                cancelSubscriptionMutation.isPending || 
                reactivateSubscriptionMutation.isPending) && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('subscription_benefits')}</CardTitle>
            <CardDescription>{t('subscription_benefits_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="ml-3">{t('benefit_display_contact_info')}</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="ml-3">{t('benefit_website_links')}</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="ml-3">{t('benefit_social_media')}</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="ml-3">{t('benefit_profile_photo')}</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="ml-3">{t('benefit_priority_listing')}</p>
            </div>

            <Separator className="my-4" />

            <div className="rounded-lg bg-primary/10 p-4">
              <h3 className="font-medium mb-2">{t('standard_plan')}</h3>
              <p className="text-2xl font-bold">$29.99 <span className="text-sm font-normal text-muted-foreground">{t('per_month')}</span></p>
              <p className="text-sm text-muted-foreground mt-2">{t('cancel_anytime')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">{t('subscription_faq')}</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{t('faq_what_happens_title')}</h3>
            <p className="text-muted-foreground">{t('faq_what_happens_content')}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">{t('faq_cancel_title')}</h3>
            <p className="text-muted-foreground">{t('faq_cancel_content')}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">{t('faq_reactivate_title')}</h3>
            <p className="text-muted-foreground">{t('faq_reactivate_content')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components and functions
function StatusIcon({ status }: { status?: SubscriptionStatus }) {
  switch (status) {
    case 'active':
    case 'trialing':
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    case 'past_due':
    case 'unpaid':
      return <AlertCircle className="h-6 w-6 text-amber-500" />;
    case 'canceled':
    case 'incomplete':
    case 'incomplete_expired':
      return <AlertCircle className="h-6 w-6 text-red-500" />;
    case 'paused':
      return <Clock className="h-6 w-6 text-blue-500" />;
    default:
      return <ArrowRightCircle className="h-6 w-6 text-primary" />;
  }
}

function getStatusText(status: SubscriptionStatus | undefined, t: (key: string) => string): string {
  switch (status) {
    case 'active':
      return t('subscription_active');
    case 'trialing':
      return t('subscription_trialing');
    case 'past_due':
      return t('subscription_past_due');
    case 'unpaid':
      return t('subscription_unpaid');
    case 'canceled':
      return t('subscription_canceled');
    case 'incomplete':
      return t('subscription_incomplete');
    case 'incomplete_expired':
      return t('subscription_incomplete_expired');
    case 'paused':
      return t('subscription_paused');
    default:
      return t('subscription_none');
  }
}

function getStatusDescription(subscription: SubscriptionState | undefined, t: (key: string) => string): string {
  if (!subscription) return t('subscription_none_description');

  switch (subscription.status) {
    case 'active':
      return subscription.cancelAtPeriodEnd 
        ? t('subscription_active_but_canceled') 
        : t('subscription_active_description');
    case 'trialing':
      return t('subscription_trialing_description');
    case 'past_due':
      return t('subscription_past_due_description');
    case 'unpaid':
      return t('subscription_unpaid_description');
    case 'canceled':
      return t('subscription_canceled_description');
    case 'incomplete':
      return t('subscription_incomplete_description');
    case 'incomplete_expired':
      return t('subscription_incomplete_expired_description');
    case 'paused':
      return t('subscription_paused_description');
    default:
      return t('subscription_none_description');
  }
}

function getActionButtonText(subscription: SubscriptionState | undefined, t: (key: string) => string): string {
  if (!subscription || subscription.status === 'none') {
    return t('subscribe_now');
  }

  if (subscription.cancelAtPeriodEnd) {
    return t('reactivate_subscription');
  }

  switch (subscription.status) {
    case 'active':
    case 'trialing':
      return t('cancel_subscription');
    case 'past_due':
    case 'unpaid':
      return t('update_payment_method');
    case 'canceled':
    case 'incomplete':
    case 'incomplete_expired':
    case 'paused':
      return t('subscribe_again');
    default:
      return t('subscribe_now');
  }
}