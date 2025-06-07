import { db } from './db';
import { users } from '@shared/schema';
import { eq, lt, gt, and, sql, or, isNull } from 'drizzle-orm';
import { addDays } from 'date-fns';

/**
 * Get professionals with upcoming payments due
 * @param daysThreshold Days ahead to check for upcoming payments
 * @returns Array of professionals with upcoming payments
 */
export async function getProfessionalsWithUpcomingPayments(daysThreshold: number = 7) {
  const now = new Date();
  const thresholdDate = addDays(now, daysThreshold);
  
  // Find professionals who need payment reminders
  const professionals = await db.select()
    .from(users)
    .where(
      and(
        eq(users.isProfessional, true),
        eq(users.isActive, true),
        or(
          // Trial ending soon
          and(
            eq(users.subscriptionStatus, 'trial'),
            lt(users.trialEndDate, thresholdDate),
            gt(users.trialEndDate, now)
          ),
          // Next billing date approaching
          and(
            eq(users.subscriptionStatus, 'active'),
            lt(users.nextBillingDate, thresholdDate),
            gt(users.nextBillingDate, now)
          ),
          // Legacy support
          and(
            isNull(users.subscriptionStatus),
            lt(users.subscriptionExpiresAt, thresholdDate.toISOString()),
            gt(users.subscriptionExpiresAt, now.toISOString())
          )
        )
      )
    );
    
  return professionals;
}

/**
 * Update a user's subscription status based on payment dates
 * @param userId User ID to update
 */
export async function updateSubscriptionStatus(userId: number) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user) return;
  
  const now = new Date();
  let newStatus = user.subscriptionStatus;
  
  // Check if trial has ended
  if (user.subscriptionStatus === 'trial' && user.trialEndDate) {
    const trialEnd = new Date(user.trialEndDate);
    if (now > trialEnd) {
      newStatus = 'past_due';
    }
  }
  
  // Check if payment is overdue
  if (user.subscriptionStatus === 'active' && user.nextBillingDate) {
    const billingDate = new Date(user.nextBillingDate);
    // Add 3 days grace period
    const gracePeriod = new Date(billingDate);
    gracePeriod.setDate(gracePeriod.getDate() + 3);
    
    if (now > gracePeriod) {
      newStatus = 'past_due';
    }
  }
  
  // Check legacy expiration
  if (!user.subscriptionStatus && user.subscriptionExpiresAt) {
    const expiryDate = new Date(user.subscriptionExpiresAt);
    if (now > expiryDate) {
      newStatus = 'past_due';
    }
  }
  
  // Update the status if it changed
  if (newStatus !== user.subscriptionStatus) {
    await db.update(users)
      .set({ 
        subscriptionStatus: newStatus,
        isActive: newStatus === 'active' || newStatus === 'trial'
      })
      .where(eq(users.id, userId));
  }
}

/**
 * Record that a payment reminder was sent
 * @param userId User ID that received a reminder
 */
export async function recordPaymentReminder(userId: number) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (user) {
    await db.update(users)
      .set({ 
        paymentRemindersCount: (user.paymentRemindersCount || 0) + 1 
      })
      .where(eq(users.id, userId));
  }
}

/**
 * Process all subscription statuses to update expired/overdue subscriptions
 */
export async function processAllSubscriptionStatuses() {
  const professionals = await db.select()
    .from(users)
    .where(eq(users.isProfessional, true));
    
  // Only update accounts that actually have expired subscriptions
  // Skip automatic deactivation for now to prevent false positives
  for (const professional of professionals) {
    // Only process if they have a valid Stripe subscription ID or clear expiration date
    if (professional.stripeSubscriptionId || 
        (professional.subscriptionExpiresAt && new Date(professional.subscriptionExpiresAt) < new Date())) {
      await updateSubscriptionStatus(professional.id);
    }
  }
}

/**
 * Send payment reminders to professionals with upcoming due dates
 * This would typically call an email service or notification system
 */
export async function sendPaymentReminders() {
  const professionals = await getProfessionalsWithUpcomingPayments();
  
  for (const professional of professionals) {
    // Here you would implement your notification logic
    // e.g., send email, SMS, or in-app notification
    console.log(`Would send payment reminder to ${professional.email}`);
    
    // Record that we sent a reminder
    await recordPaymentReminder(professional.id);
  }
  
  return professionals.length;
}