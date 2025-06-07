import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  phone: text("phone"),
  
  // Professional details
  isProfessional: boolean("is_professional").default(false),
  businessName: text("business_name"),
  // Multiple service categories support
  serviceCategory: text("service_category"), // Main service category (legacy field)
  serviceCategories: text("service_categories").array(), // Array for multiple service categories
  // Arrays for multiple states and languages
  statesServiced: text("states_serviced").array(), // Store as array of state codes
  languagesSpoken: text("languages_spoken").array(), // Store as array of language codes
  // Keep legacy fields for backward compatibility
  stateLocation: text("state_location"),
  
  // Enhanced professional profile
  yearsExperience: integer("years_experience"),
  certifications: text("certifications"),
  serviceAreas: text("service_areas"),
  businessDescription: text("business_description"),
  
  // Professional website and image
  profileImageUrl: text("profile_image_url"),
  websiteUrl: text("website_url"),
  
  // Social media profiles
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  tiktokUrl: text("tiktok_url"),
  
  // Subscription details
  isActive: boolean("is_active").default(true),
  subscriptionExpiresAt: text("subscription_expires_at"),
  
  // Enhanced subscription tracking
  subscriptionStatus: text("subscription_status").default("trial"), // 'trial', 'active', 'past_due', 'canceled'
  subscriptionStartDate: timestamp("subscription_start_date"),
  trialEndDate: timestamp("trial_end_date"),
  nextBillingDate: timestamp("next_billing_date"),
  lastPaymentDate: timestamp("last_payment_date"),
  lastPaymentAmount: integer("last_payment_amount"),
  lastPaymentStatus: text("last_payment_status"),
  paymentRemindersCount: integer("payment_reminders_count").default(0),
  
  // Stripe-related fields
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  
  // Billing and payment tracking
  totalMonthlyFee: text("total_monthly_fee"),
  
  // Password reset tokens
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true })
  .pick({
    username: true,
    password: true,
    email: true,
    fullName: true,
    phone: true,
    isProfessional: true,
    businessName: true,
    serviceCategory: true,
    serviceCategories: true, // Multiple service categories
    statesServiced: true, // Array of states served
    languagesSpoken: true, // Array of languages spoken
    stateLocation: true,  // Keep for backwards compatibility
    yearsExperience: true,
    certifications: true,
    serviceAreas: true,
    businessDescription: true,
    profileImageUrl: true,
    websiteUrl: true,
    facebookUrl: true,
    instagramUrl: true,
    tiktokUrl: true
  });

// Category table for main service categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  description: text("description").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  description: true,
});

// Subcategory table for nested service categories
export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description").notNull(),
});

export const insertSubcategorySchema = createInsertSchema(subcategories).pick({
  categoryId: true,
  name: true,
  icon: true,
  description: true,
});

// Third level services
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  subcategoryId: integer("subcategory_id").notNull(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description").notNull(),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  subcategoryId: true,
  name: true,
  icon: true,
  description: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;
export type Subcategory = typeof subcategories.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Reviews table for professional ratings and comments
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  professionalId: integer("professional_id").notNull(), // The professional being reviewed
  reviewerId: integer("reviewer_id"),                  // For authenticated users, or null for guest reviews
  rating: integer("rating").notNull(),                 // Rating from 1-5 stars
  comment: text("comment"),                            // Optional review text
  createdAt: timestamp("created_at").defaultNow().notNull(),
  verified: boolean("verified").default(false),        // Verified reviews are from authenticated users
  
  // Guest review fields
  guestName: text("guest_name"),                      // Name for guest reviewers
  guestEmail: text("guest_email"),                    // Email for guest reviewers
  
  // Professional response field
  professionalResponse: text("professional_response"),  // The professional's response to the review
});

export const insertReviewSchema = createInsertSchema(reviews)
  .omit({ id: true, createdAt: true })
  .extend({
    rating: z.number().min(1).max(5) // Ensure rating is between 1-5
  });

// Guest review schema without requiring reviewer ID
export const insertGuestReviewSchema = insertReviewSchema
  .omit({ reviewerId: true })
  .extend({
    guestName: z.string().min(2).max(100),
    guestEmail: z.string().email().optional(),
  });

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertGuestReview = z.infer<typeof insertGuestReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Account deletion requests table
export const deletionRequests = pgTable("deletion_requests", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  reason: text("reason"),
  status: text("status").default("pending"), // 'pending', 'processing', 'completed'
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  userId: integer("user_id"), // Reference to user if they're logged in
});

export const insertDeletionRequestSchema = createInsertSchema(deletionRequests).pick({
  email: true,
  reason: true,
  userId: true,
});

export type InsertDeletionRequest = z.infer<typeof insertDeletionRequestSchema>;
export type DeletionRequest = typeof deletionRequests.$inferSelect;
