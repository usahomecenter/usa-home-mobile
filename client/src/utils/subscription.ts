import { User } from "@shared/schema";
import { differenceInDays } from "date-fns";

/**
 * Check if a professional's subscription is active
 * @param professional - The professional user to check
 * @returns boolean indicating if subscription is active
 */
export function isSubscriptionActive(professional: User): boolean {
  // Non-professionals always return true (no subscription needed)
  if (!professional.isProfessional) {
    return true;
  }
  
  // Check if explicitly marked as inactive due to payment failure
  if (typeof professional.isActive === 'boolean' && professional.isActive === false) {
    return false;
  }
  
  // Check for specific inactive subscription statuses
  if (professional.subscriptionStatus) {
    const inactiveStatuses = ['past_due', 'canceled', 'suspended', 'inactive'];
    if (inactiveStatuses.includes(professional.subscriptionStatus)) {
      return false;
    }
  }
  
  // Legacy support for subscription expiration date
  if (professional.subscriptionExpiresAt) {
    const expiryDate = new Date(professional.subscriptionExpiresAt);
    if (expiryDate <= new Date()) {
      return false;
    }
  }
  
  // Default to active - only deactivate on explicit payment failure
  return true;
}

/**
 * Calculate days remaining in trial or until next billing date
 * @param professional - The professional user
 * @returns number of days remaining, or null if not applicable
 */
export function getSubscriptionDaysRemaining(professional: User): number | null {
  if (!professional.isProfessional) {
    return null;
  }
  
  const now = new Date();
  
  // Check trial end date
  if (professional.subscriptionStatus === 'trial' && professional.trialEndDate) {
    const trialEnd = new Date(professional.trialEndDate);
    if (trialEnd > now) {
      return differenceInDays(trialEnd, now);
    }
    return 0;
  }
  
  // Check next billing date
  if (professional.subscriptionStatus === 'active' && professional.nextBillingDate) {
    const billingDate = new Date(professional.nextBillingDate);
    if (billingDate > now) {
      return differenceInDays(billingDate, now);
    }
    return 0;
  }
  
  // Legacy support
  if (professional.subscriptionExpiresAt) {
    const expiryDate = new Date(professional.subscriptionExpiresAt);
    if (expiryDate > now) {
      return differenceInDays(expiryDate, now);
    }
    return 0;
  }
  
  return null;
}