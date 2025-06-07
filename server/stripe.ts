import Stripe from 'stripe';
import { storage } from './storage';
import { User } from '@shared/schema';

// Make sure STRIPE_SECRET_KEY is set
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// The price ID for the standard monthly subscription
export const SUBSCRIPTION_PRICE = process.env.STRIPE_PRICE_ID || 'price_monthly_standard';

/**
 * Create a Stripe customer for a user
 * @param user The user to create a customer for
 * @returns The created customer
 */
export async function createStripeCustomer(user: User): Promise<Stripe.Customer> {
  try {
    // Check if user already has a Stripe customer ID
    if (user.stripeCustomerId) {
      // Retrieve the existing customer
      return await stripe.customers.retrieve(user.stripeCustomerId) as Stripe.Customer;
    }
    
    // Otherwise, create a new customer
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      name: user.fullName || user.username,
      metadata: {
        userId: user.id.toString(),
      },
    });
    
    // Update the user with the Stripe customer ID
    await storage.updateStripeCustomerId(user.id, customer.id);
    
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create Stripe customer');
  }
}

/**
 * Get or create a subscription for a user
 * @param userId The ID of the user
 * @returns The subscription and client secret
 */
export async function getOrCreateSubscription(userId: number): Promise<{
  subscriptionId: string;
  clientSecret: string | null;
}> {
  try {
    const user = await storage.getUser(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // If user already has a subscription, return it
    if (user.stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
        expand: ['latest_invoice.payment_intent'],
      });
      
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      
      return {
        subscriptionId: subscription.id,
        clientSecret: invoice.payment_intent?.client_secret || null,
      };
    }
    
    // Make sure the user has a Stripe customer ID
    const customer = await createStripeCustomer(user);
    
    // Create a new subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: SUBSCRIPTION_PRICE,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: userId.toString(),
      },
    });
    
    // Update the user with the Stripe subscription ID
    await storage.updateStripeSubscriptionId(user.id, subscription.id);
    
    // Get the latest invoice with the payment intent
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    
    return {
      subscriptionId: subscription.id,
      clientSecret: invoice.payment_intent?.client_secret || null,
    };
  } catch (error) {
    console.error('Error getting or creating subscription:', error);
    throw error;
  }
}

/**
 * Handle a webhook event from Stripe
 * @param event The event from Stripe
 */
export async function handleStripeWebhook(event: Stripe.Event): Promise<void> {
  try {
    console.log(`Received Stripe webhook event: ${event.type}`);
    
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await handleSuccessfulPayment(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handleFailedPayment(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      // Add more event handlers as needed
    }
  } catch (error) {
    console.error('Error handling Stripe webhook event:', error);
    throw error;
  }
}

/**
 * Handle a successful payment
 * @param invoice The invoice from Stripe
 */
async function handleSuccessfulPayment(invoice: Stripe.Invoice): Promise<void> {
  try {
    if (!invoice.customer || !invoice.subscription) {
      console.error('Invoice missing customer or subscription:', invoice.id);
      return;
    }
    
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer.id;
    const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
    
    // Get the user by Stripe customer ID
    const user = await storage.getUserByStripeCustomerId(customerId);
    
    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }
    
    // Record the successful payment
    await storage.recordPayment(user.id, invoice.amount_paid / 100, 'succeeded');
    
    // Update the user's subscription status
    await storage.updateSubscriptionStatus(user.id, 'active');
    
    // Fetch the subscription to get the current period end date
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Update the user's next billing date
    await storage.updateNextBillingDate(
      user.id,
      new Date(subscription.current_period_end * 1000)
    );
    
    console.log(`Payment succeeded for user ${user.id}, subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

/**
 * Handle a failed payment
 * @param invoice The invoice from Stripe
 */
async function handleFailedPayment(invoice: Stripe.Invoice): Promise<void> {
  try {
    if (!invoice.customer || !invoice.subscription) {
      console.error('Invoice missing customer or subscription:', invoice.id);
      return;
    }
    
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer.id;
    
    // Get the user by Stripe customer ID
    const user = await storage.getUserByStripeCustomerId(customerId);
    
    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }
    
    // Record the failed payment
    await storage.recordPayment(user.id, invoice.amount_due / 100, 'failed');
    
    // Update the user's subscription status
    await storage.updateSubscriptionStatus(user.id, 'past_due');
    
    console.log(`Payment failed for user ${user.id}, invoice ${invoice.id}`);
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

/**
 * Handle a subscription update
 * @param subscription The subscription from Stripe
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  try {
    const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
    
    // Get the user by Stripe customer ID
    const user = await storage.getUserByStripeCustomerId(customerId);
    
    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }
    
    // Update the user's subscription status
    await storage.updateSubscriptionStatus(user.id, subscription.status);
    
    // Update the user's next billing date
    await storage.updateNextBillingDate(
      user.id,
      new Date(subscription.current_period_end * 1000)
    );
    
    console.log(`Subscription updated for user ${user.id}, status: ${subscription.status}`);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

/**
 * Handle a subscription deletion
 * @param subscription The subscription from Stripe
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  try {
    const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
    
    // Get the user by Stripe customer ID
    const user = await storage.getUserByStripeCustomerId(customerId);
    
    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }
    
    // Update the user's subscription status
    await storage.updateSubscriptionStatus(user.id, 'canceled');
    
    console.log(`Subscription canceled for user ${user.id}`);
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}