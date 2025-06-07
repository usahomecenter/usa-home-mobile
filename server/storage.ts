import { 
  users, categories, subcategories, services, reviews, deletionRequests,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Subcategory, type InsertSubcategory,
  type Service, type InsertService,
  type Review, type InsertReview, type InsertGuestReview,
  type DeletionRequest, type InsertDeletionRequest
} from "@shared/schema";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import session from "express-session";
import connectPg from "connect-pg-simple";
import { eq, desc } from 'drizzle-orm';
import { Pool } from 'pg';
import { db } from './db';

// Enhanced interface with CRUD methods for user and content management
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStripeCustomerId(customerId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<Omit<InsertUser, 'password'>>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getAllProfessionals(serviceCategory?: string, stateLocation?: string, language?: string): Promise<User[]>;
  
  // Stripe Integration
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateStripeSubscriptionId(userId: number, subscriptionId: string): Promise<User>;
  updateSubscriptionStatus(userId: number, status: string): Promise<User>;
  updateNextBillingDate(userId: number, date: Date): Promise<User>;
  recordPayment(userId: number, amount: number, status: string): Promise<User>;
  
  // Payment Methods
  savePaymentMethod(userId: number, paymentData: {
    type: string;
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    zipCode: string;
  }): Promise<void>;
  updatePaymentMethod(userId: number, paymentData: {
    cardNumber: string;
    cardName: string;
    expiryMonth: string;
    expiryYear: string;
    zipCode: string;
    cardType: 'primary' | 'backup';
  }): Promise<User>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Subcategories
  getAllSubcategories(): Promise<Subcategory[]>;
  getSubcategoriesByCategoryId(categoryId: number): Promise<Subcategory[]>;
  getSubcategoryById(id: number): Promise<Subcategory | undefined>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;
  
  // Services (third level)
  getAllServices(): Promise<Service[]>;
  getServicesBySubcategoryId(subcategoryId: number): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Reviews
  getReviewsForProfessional(professionalId: number): Promise<Review[]>;
  getProfessionalWithReviews(professionalId: number): Promise<{ professional: User, reviews: Review[] } | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  createGuestReview(review: InsertGuestReview): Promise<Review>;
  userCanReviewProfessional(reviewerId: number, professionalId: number): Promise<boolean>;
  getReviewById(id: number): Promise<Review | undefined>;
  updateReviewResponse(reviewId: number, response: string): Promise<Review>;
  
  // Deletion requests
  createDeletionRequest(request: { email: string; reason?: string | null; userId?: number | null }): Promise<{ id: number; email: string; reason: string | null; status: string; requestedAt: Date; userId: number | null }>;
  getAllDeletionRequests(): Promise<Array<{ id: number; email: string; reason: string | null; status: string; requestedAt: Date; processedAt: Date | null; userId: number | null }>>;
  
  // Notifications
  getUnreadNotificationCount(userId: number): Promise<number>;
  getNotifications(userId: number): Promise<any[]>;
  markNotificationAsRead(notificationId: number, userId: number): Promise<void>;
  
  // Password reset tokens
  storeResetToken(email: string, token: string): Promise<void>;
  verifyResetToken(token: string): Promise<boolean>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  updateUserPassword(userId: number, newPassword: string): Promise<void>;
  clearResetToken(token: string): Promise<void>;
  
  // Session store
  sessionStore: ReturnType<typeof connectPg>;
}

// PostgreSQL Session Store Setup
const PostgresSessionStore = connectPg(session);

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Connection for drizzle ORM
const queryClient = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }, // Enable SSL with self-signed certificates
});
const db = drizzle(queryClient);

// Connection details for session store
const pgConfig = {
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false // Enable SSL with self-signed certificates
  }
};

// Create a connection pool for raw SQL queries
const pool = new Pool(pgConfig);

// Initialize database tables
async function initializeDatabase() {
  try {
    console.log("🔧 Initializing database tables...");
    await queryClient`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        full_name TEXT,
        phone TEXT,
        is_professional BOOLEAN DEFAULT FALSE,
        business_name TEXT,
        service_category TEXT,
        state_location TEXT,
        languages_spoken TEXT,
        profile_image_url TEXT,
        website_url TEXT,
        facebook_url TEXT,
        instagram_url TEXT,
        tiktok_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        subscription_expires_at TEXT
      )
    `;
    
    await queryClient`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        icon TEXT NOT NULL,
        description TEXT NOT NULL
      )
    `;
    
    await queryClient`
      CREATE TABLE IF NOT EXISTS subcategories (
        id SERIAL PRIMARY KEY,
        category_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL
      )
    `;
    
    await queryClient`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        subcategory_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL
      )
    `;
    
    await queryClient`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        professional_id INTEGER NOT NULL,
        reviewer_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        verified BOOLEAN DEFAULT TRUE
      )
    `;
    
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
}

// Initialize database on startup
initializeDatabase().catch(console.error);

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: ReturnType<typeof connectPg>;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      conObject: pgConfig, 
      createTableIfMissing: true 
    });
  }

  // User management methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      // Use raw SQL to ensure we get all fields, especially the array fields
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      
      if (rows.length === 0) {
        return undefined;
      }
      
      // Convert snake_case column names to camelCase for consistency
      return {
        id: rows[0].id,
        username: rows[0].username,
        password: rows[0].password,
        email: rows[0].email,
        fullName: rows[0].full_name,
        phone: rows[0].phone,
        isProfessional: rows[0].is_professional,
        businessName: rows[0].business_name,
        serviceCategory: rows[0].service_category,
        // Array fields for multiple service categories, states and languages
        serviceCategories: rows[0].service_categories || [],
        statesServiced: rows[0].states_serviced || [],
        languagesSpoken: rows[0].languages_spoken || [],
        // Legacy fields
        stateLocation: rows[0].state_location,
        // Other fields
        profileImageUrl: rows[0].profile_image_url,
        websiteUrl: rows[0].website_url,
        facebookUrl: rows[0].facebook_url,
        instagramUrl: rows[0].instagram_url,
        tiktokUrl: rows[0].tiktok_url,
        isActive: rows[0].is_active,
        subscriptionExpiresAt: rows[0].subscription_expires_at,
        yearsExperience: rows[0].years_experience || null,
        certifications: rows[0].certifications || null,
        serviceAreas: rows[0].service_areas || null,
        businessDescription: rows[0].business_description || null,
        stripeCustomerId: rows[0].stripe_customer_id || null,
        stripeSubscriptionId: rows[0].stripe_subscription_id || null,
        subscriptionStatus: rows[0].subscription_status || null,
        subscriptionStartDate: rows[0].subscription_start_date || null,
        trialEndDate: rows[0].trial_end_date || null,
        nextBillingDate: rows[0].next_billing_date || null,
        lastPaymentDate: rows[0].last_payment_date || null,
        lastPaymentAmount: rows[0].last_payment_amount || null,
        lastPaymentStatus: rows[0].last_payment_status || null,
        paymentFailureCount: rows[0].payment_failure_count || 0,
        paymentRemindersCount: rows[0].payment_reminders_count || 0,
        // Payment method fields
        primaryCardNumber: rows[0].primary_card_number || null,
        primaryCardName: rows[0].primary_card_name || null,
        primaryExpiryMonth: rows[0].primary_expiry_month || null,
        primaryExpiryYear: rows[0].primary_expiry_year || null,
        primaryZipCode: rows[0].primary_zip_code || null,
        backupCardNumber: rows[0].backup_card_number || null,
        backupCardName: rows[0].backup_card_name || null,
        backupExpiryMonth: rows[0].backup_expiry_month || null,
        backupExpiryYear: rows[0].backup_expiry_year || null,
        backupZipCode: rows[0].backup_zip_code || null,
      };
      
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // Use raw SQL to do a case-insensitive search with ILIKE
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE username ILIKE $1',
        [username]
      );
      
      if (rows.length === 0) {
        return undefined;
      }
      
      // Convert snake_case column names to camelCase for consistency
      const user = {
        id: rows[0].id,
        username: rows[0].username,
        password: rows[0].password,
        email: rows[0].email,
        fullName: rows[0].full_name,
        phone: rows[0].phone,
        isProfessional: rows[0].is_professional,
        businessName: rows[0].business_name,
        serviceCategory: rows[0].service_category,
        // Array fields for multiple service categories, states and languages
        serviceCategories: rows[0].service_categories || [],
        statesServiced: rows[0].states_serviced || [],
        languagesSpoken: rows[0].languages_spoken || [],
        // Legacy fields
        stateLocation: rows[0].state_location,
        // Other fields
        profileImageUrl: rows[0].profile_image_url,
        websiteUrl: rows[0].website_url,
        facebookUrl: rows[0].facebook_url,
        instagramUrl: rows[0].instagram_url,
        tiktokUrl: rows[0].tiktok_url,
        isActive: rows[0].is_active,
        subscriptionExpiresAt: rows[0].subscription_expires_at,
        yearsExperience: rows[0].years_experience || null,
        certifications: rows[0].certifications || null,
        serviceAreas: rows[0].service_areas || null,
        businessDescription: rows[0].business_description || null,
        stripeCustomerId: rows[0].stripe_customer_id || null,
        stripeSubscriptionId: rows[0].stripe_subscription_id || null,
        subscriptionStatus: rows[0].subscription_status || null,
        subscriptionStartDate: rows[0].subscription_start_date || null,
        trialEndDate: rows[0].trial_end_date || null,
        nextBillingDate: rows[0].next_billing_date || null,
        lastPaymentDate: rows[0].last_payment_date || null,
        lastPaymentAmount: rows[0].last_payment_amount || null,
        lastPaymentStatus: rows[0].last_payment_status || null,
        paymentFailureCount: rows[0].payment_failure_count || 0,
        paymentRemindersCount: rows[0].payment_reminders_count || 0,
        // Payment method fields
        primaryCardNumber: rows[0].primary_card_number || null,
        primaryCardName: rows[0].primary_card_name || null,
        primaryExpiryMonth: rows[0].primary_expiry_month || null,
        primaryExpiryYear: rows[0].primary_expiry_year || null,
        primaryZipCode: rows[0].primary_zip_code || null,
        backupCardNumber: rows[0].backup_card_number || null,
        backupCardName: rows[0].backup_card_name || null,
        backupExpiryMonth: rows[0].backup_expiry_month || null,
        backupExpiryYear: rows[0].backup_expiry_year || null,
        backupZipCode: rows[0].backup_zip_code || null,
      };
      
      console.log('Fetched user with service categories:', user.serviceCategories);
      
      return user;
    } catch (error) {
      console.error('Error in getUserByUsername:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      // Use raw SQL to do a case-insensitive search with ILIKE
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE email ILIKE $1',
        [email]
      );
      
      if (rows.length === 0) {
        return undefined;
      }
      
      // Convert snake_case column names to camelCase for consistency
      const user = {
        id: rows[0].id,
        username: rows[0].username,
        password: rows[0].password,
        email: rows[0].email,
        fullName: rows[0].full_name,
        phone: rows[0].phone,
        isProfessional: rows[0].is_professional,
        businessName: rows[0].business_name,
        serviceCategory: rows[0].service_category,
        // Array fields for multiple service categories, states and languages
        serviceCategories: rows[0].service_categories || [],
        statesServiced: rows[0].states_serviced || [],
        languagesSpoken: rows[0].languages_spoken || [],
        // Legacy fields
        stateLocation: rows[0].state_location,
        // Other fields
        profileImageUrl: rows[0].profile_image_url,
        websiteUrl: rows[0].website_url,
        facebookUrl: rows[0].facebook_url,
        instagramUrl: rows[0].instagram_url,
        tiktokUrl: rows[0].tiktok_url,
        isActive: rows[0].is_active,
        subscriptionExpiresAt: rows[0].subscription_expires_at,
        yearsExperience: rows[0].years_experience || null,
        certifications: rows[0].certifications || null,
        serviceAreas: rows[0].service_areas || null,
        businessDescription: rows[0].business_description || null,
        stripeCustomerId: rows[0].stripe_customer_id || null,
        stripeSubscriptionId: rows[0].stripe_subscription_id || null,
        subscriptionStatus: rows[0].subscription_status || null,
        subscriptionStartDate: rows[0].subscription_start_date || null,
        trialEndDate: rows[0].trial_end_date || null,
        nextBillingDate: rows[0].next_billing_date || null,
        lastPaymentDate: rows[0].last_payment_date || null,
        lastPaymentAmount: rows[0].last_payment_amount || null,
        lastPaymentStatus: rows[0].last_payment_status || null,
        paymentFailureCount: rows[0].payment_failure_count || 0,
        paymentRemindersCount: rows[0].payment_reminders_count || 0,
      };
      
      return user;
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      return undefined;
    }
  }
  
  async getAllUsers(): Promise<User[]> {
    try {
      const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
      
      return rows.map(row => ({
        id: row.id,
        username: row.username,
        password: row.password,
        email: row.email,
        fullName: row.full_name,
        phone: row.phone,
        isProfessional: row.is_professional,
        businessName: row.business_name,
        serviceCategory: row.service_category,
        serviceCategories: row.service_categories || [],
        statesServiced: row.states_serviced || [],
        languagesSpoken: row.languages_spoken || [],
        stateLocation: row.state_location,
        profileImageUrl: row.profile_image_url,
        websiteUrl: row.website_url,
        facebookUrl: row.facebook_url,
        instagramUrl: row.instagram_url,
        tiktokUrl: row.tiktok_url,
        isActive: row.is_active,
        subscriptionExpiresAt: row.subscription_expires_at,
        yearsExperience: row.years_experience || null,
        licenseNumber: row.license_number || null,
        insuranceInfo: row.insurance_info || null,
        certifications: row.certifications || null,
        serviceAreas: row.service_areas || null,
        businessDescription: row.business_description || null,
        stripeCustomerId: row.stripe_customer_id || null,
        stripeSubscriptionId: row.stripe_subscription_id || null,
        subscriptionStatus: row.subscription_status || null,
        subscriptionStartDate: row.subscription_start_date || null,
        trialEndDate: row.trial_end_date || null,
        nextBillingDate: row.next_billing_date || null,
        lastPaymentDate: row.last_payment_date || null,
        lastPaymentAmount: row.last_payment_amount || null,
        lastPaymentStatus: row.last_payment_status || null,
        paymentFailureCount: row.payment_failure_count || 0,
        paymentRemindersCount: row.payment_reminders_count || 0,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return [];
    }
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE stripe_customer_id = $1',
        [customerId]
      );
      
      if (rows.length === 0) {
        return undefined;
      }
      
      // Convert snake_case column names to camelCase for consistency
      const user = {
        id: rows[0].id,
        username: rows[0].username,
        password: rows[0].password,
        email: rows[0].email,
        fullName: rows[0].full_name,
        phone: rows[0].phone,
        isProfessional: rows[0].is_professional,
        businessName: rows[0].business_name,
        serviceCategory: rows[0].service_category,
        // Array fields for multiple service categories, states and languages
        serviceCategories: rows[0].service_categories || [],
        statesServiced: rows[0].states_serviced || [],
        languagesSpoken: rows[0].languages_spoken || [],
        // Legacy fields
        stateLocation: rows[0].state_location,
        profileImageUrl: rows[0].profile_image_url,
        websiteUrl: rows[0].website_url,
        facebookUrl: rows[0].facebook_url,
        instagramUrl: rows[0].instagram_url,
        tiktokUrl: rows[0].tiktok_url,
        isActive: rows[0].is_active,
        subscriptionExpiresAt: rows[0].subscription_expires_at,
        yearsExperience: rows[0].years_experience || null,
        certifications: rows[0].certifications || null,
        serviceAreas: rows[0].service_areas || null,
        businessDescription: rows[0].business_description || null,
        stripeCustomerId: rows[0].stripe_customer_id || null,
        stripeSubscriptionId: rows[0].stripe_subscription_id || null,
        subscriptionStatus: rows[0].subscription_status || null,
        subscriptionStartDate: rows[0].subscription_start_date || null,
        trialEndDate: rows[0].trial_end_date || null,
        nextBillingDate: rows[0].next_billing_date || null,
        lastPaymentDate: rows[0].last_payment_date || null,
        lastPaymentAmount: rows[0].last_payment_amount || null,
        lastPaymentStatus: rows[0].last_payment_status || null,
        paymentFailureCount: rows[0].payment_failure_count || 0,
        paymentRemindersCount: rows[0].payment_reminders_count || 0,
      };
      
      return user;
    } catch (error) {
      console.error('Error in getUserByStripeCustomerId:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Process the input data to ensure arrays are properly formatted
      const processedUser = { ...insertUser };
      
      // Handle array conversions for service categories
      if (processedUser.serviceCategories && !Array.isArray(processedUser.serviceCategories)) {
        if (typeof processedUser.serviceCategories === 'string') {
          // Convert comma-separated string to array
          if (processedUser.serviceCategories.includes(',')) {
            processedUser.serviceCategories = processedUser.serviceCategories.split(',').map(cat => cat.trim());
          } else {
            // Single value string to array
            processedUser.serviceCategories = [processedUser.serviceCategories];
          }
        } else {
          // If it's neither an array nor a string, set to empty array
          processedUser.serviceCategories = [];
        }
      }
      
      // For backwards compatibility, if serviceCategory is provided but serviceCategories is not
      if (processedUser.serviceCategory && !processedUser.serviceCategories) {
        processedUser.serviceCategories = [processedUser.serviceCategory];
      }
      
      // Handle array conversions for states
      if (processedUser.statesServiced && !Array.isArray(processedUser.statesServiced)) {
        if (typeof processedUser.statesServiced === 'string') {
          // Convert comma-separated string to array
          if (processedUser.statesServiced.includes(',')) {
            processedUser.statesServiced = processedUser.statesServiced.split(',').map(state => state.trim());
          } else {
            // Single value string to array
            processedUser.statesServiced = [processedUser.statesServiced];
          }
        } else {
          // If it's neither an array nor a string, set to empty array
          processedUser.statesServiced = [];
        }
      }
      
      // For backwards compatibility, if stateLocation is provided but statesServiced is not
      if (processedUser.stateLocation && !processedUser.statesServiced) {
        processedUser.statesServiced = [processedUser.stateLocation];
      }
      
      // Handle array conversions for languages
      if (processedUser.languagesSpoken && !Array.isArray(processedUser.languagesSpoken)) {
        if (typeof processedUser.languagesSpoken === 'string') {
          // Convert comma-separated string to array
          if (processedUser.languagesSpoken.includes(',')) {
            processedUser.languagesSpoken = processedUser.languagesSpoken.split(',').map(lang => lang.trim());
          } else {
            // Single value string to array
            processedUser.languagesSpoken = [processedUser.languagesSpoken];
          }
        } else {
          // If it's neither an array nor a string, set to empty array
          processedUser.languagesSpoken = [];
        }
      }
      
      console.log("Creating user with processed data:", processedUser);
      
      const result = await db.insert(users).values(processedUser).returning().execute();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async updateUser(id: number, userData: Partial<Omit<InsertUser, 'password'>>): Promise<User | undefined> {
    try {
      // Pre-process the data before updating
      const processedData = { ...userData };
      
      // Handle array conversions for languages
      if (processedData.languagesSpoken && !Array.isArray(processedData.languagesSpoken)) {
        if (typeof processedData.languagesSpoken === 'string') {
          // Convert comma-separated string to array
          if (processedData.languagesSpoken.includes(',')) {
            processedData.languagesSpoken = processedData.languagesSpoken.split(',').map(lang => lang.trim());
          } else {
            // Single value string to array
            processedData.languagesSpoken = [processedData.languagesSpoken];
          }
        } else {
          // If it's neither an array nor a string, set to empty array
          processedData.languagesSpoken = [];
        }
      }

      // Handle languagesSpoken processing
      if (processedData.languagesSpoken !== undefined) {
        // Make sure languagesSpoken is always an array
        if (Array.isArray(processedData.languagesSpoken)) {
          // Filter out any falsy values
          processedData.languagesSpoken = processedData.languagesSpoken.filter(lang => 
            lang && lang !== 'undefined' && lang !== ''
          );
        } else if (typeof processedData.languagesSpoken === 'string') {
          if (processedData.languagesSpoken.includes(',')) {
            // Split comma-separated string into array
            processedData.languagesSpoken = processedData.languagesSpoken
              .split(',')
              .map(lang => lang.trim())
              .filter(lang => lang && lang !== 'undefined' && lang !== '');
          } else if (processedData.languagesSpoken.trim()) {
            // Single language string
            processedData.languagesSpoken = [processedData.languagesSpoken.trim()];
          } else {
            // Empty string
            processedData.languagesSpoken = [];
          }
        } else {
          // If it's undefined or null, set to empty array
          processedData.languagesSpoken = [];
        }
      }
      
      // Handle array conversions for service categories
      if (processedData.serviceCategories && !Array.isArray(processedData.serviceCategories)) {
        if (typeof processedData.serviceCategories === 'string') {
          // Convert comma-separated string to array
          if (processedData.serviceCategories.includes(',')) {
            processedData.serviceCategories = processedData.serviceCategories.split(',').map(cat => cat.trim());
          } else {
            // Single value string to array
            processedData.serviceCategories = [processedData.serviceCategories];
          }
        } else {
          // If it's neither an array nor a string, set to empty array
          processedData.serviceCategories = [];
        }
      }
      
      // For backwards compatibility, if serviceCategory is provided but serviceCategories is not
      if (processedData.serviceCategory && !processedData.serviceCategories) {
        processedData.serviceCategories = [processedData.serviceCategory];
      }
      
      // Special handling for states 
      if (processedData.statesServiced !== undefined) {
        // Make sure statesServiced is always an array
        if (Array.isArray(processedData.statesServiced)) {
          // Filter out any falsy values
          processedData.statesServiced = processedData.statesServiced.filter(state => 
            state && state !== 'undefined' && state !== ''
          );
        } else if (typeof processedData.statesServiced === 'string') {
          if (processedData.statesServiced.includes(',')) {
            // Split comma-separated string into array
            processedData.statesServiced = processedData.statesServiced
              .split(',')
              .map(state => state.trim())
              .filter(state => state && state !== 'undefined' && state !== '');
          } else if (processedData.statesServiced.trim()) {
            // Single state string
            processedData.statesServiced = [processedData.statesServiced.trim()];
          } else {
            // Empty string
            processedData.statesServiced = [];
          }
        } else {
          // If it's undefined or null, set to empty array
          processedData.statesServiced = [];
        }
      }
      
      // For backwards compatibility, if stateLocation is provided but statesServiced is not set
      if (processedData.stateLocation && 
          (!processedData.statesServiced || 
           (Array.isArray(processedData.statesServiced) && processedData.statesServiced.length === 0))) {
        processedData.statesServiced = [processedData.stateLocation];
      }
      
      console.log("Processed data for update:", processedData);
      
      const result = await db.update(users)
        .set(processedData)
        .where(eq(users.id, id))
        .returning()
        .execute();
      
      return result[0];
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
  
  async getAllProfessionals(serviceCategory?: string, stateLocation?: string, language?: string): Promise<User[]> {
    try {
      console.log("\nReceived request for professionals with: \n\tserviceCategory: " + 
                  (serviceCategory || "none") + ", \n\tstateLocation: " + 
                  (stateLocation || "none") + ", \n\tlanguage: " + 
                  (language || "none"));
      
      // Start with base query - all professionals
      let querySQL = `
        SELECT * FROM users 
        WHERE is_professional = true
      `;
      
      const params: any[] = [];
      
      // Add filters if provided - search in both legacy field and array field
      if (serviceCategory && serviceCategory.trim() !== '') {
        console.log(`Looking for professionals with serviceCategory: ${serviceCategory}`);
        
        // More robust matching that handles variations in naming
        // This will find matches whether the search term is part of a category 
        // or a category contains the search term
        querySQL += ` AND (
          lower(service_category) LIKE $${params.length + 1}
          OR EXISTS (
            SELECT 1 FROM unnest(service_categories) cat 
            WHERE lower(cat) LIKE $${params.length + 2}
            OR $${params.length + 3} LIKE lower(CONCAT('%', cat, '%'))
          )
        )`;
        
        // For search term contained within category
        params.push(`%${serviceCategory.trim().toLowerCase()}%`);
        
        // For category contained within search term
        params.push(`%${serviceCategory.trim().toLowerCase()}%`);
        
        // For reversed matches (search term is contained within the category name)
        params.push(serviceCategory.trim().toLowerCase());
      }
      
      // Handle both legacy state_location and new states_serviced array
      if (stateLocation && stateLocation.trim() !== '') {
        console.log(`Looking for professionals in state: ${stateLocation}`);
        // Check if the state is in the states_serviced array OR in the legacy field
        querySQL += ` AND (
          $${params.length + 1} = ANY(states_serviced) 
          OR state_location ILIKE $${params.length + 2}
        )`;
        params.push(stateLocation.trim());
        params.push(`%${stateLocation}%`);
      }
      
      // Add filter for language if provided
      if (language && language.trim() !== '') {
        console.log(`Looking for professionals speaking language: ${language}`);
        // Check if the language is in the languages_spoken array
        querySQL += ` AND $${params.length + 1} = ANY(languages_spoken)`;
        params.push(language.trim());
      }
      
      console.log("Executing SQL:", querySQL, "with params:", params);
      
      // Before executing the query, check for all professionals to debug the database
      const allProfessionalsResult = await pool.query(
        "SELECT id, username, is_professional, service_category, service_categories, states_serviced, languages_spoken FROM users WHERE is_professional = true"
      );
      console.log("All professionals in database:", allProfessionalsResult.rows);
      
      // Debug specific search terms to ensure matches work properly
      if (serviceCategory) {
        console.log(`Specifically checking for "${serviceCategory}" matches in professionals:`);
        allProfessionalsResult.rows.forEach(prof => {
          const primaryMatches = prof.service_category && 
            prof.service_category.toLowerCase().includes(serviceCategory.toLowerCase());
          
          const arrayMatches = prof.service_categories && Array.isArray(prof.service_categories) && 
            prof.service_categories.some(cat => 
              cat.toLowerCase().includes(serviceCategory.toLowerCase()) || 
              serviceCategory.toLowerCase().includes(cat.toLowerCase())
            );
            
          if (primaryMatches || arrayMatches) {
            console.log(`   - Match found for user ${prof.id} (${prof.username}): 
              Primary category: ${prof.service_category || 'none'}
              Service categories: ${JSON.stringify(prof.service_categories || [])}
            `);
          }
        });
      }
      
      // Execute the raw query with placeholders for params
      let { rows } = await pool.query(querySQL, params);
      
      // No more fallback search - only show exact matches for serviceCategory
      
      console.log(`Found ${rows.length} professionals matching criteria`);
      
      // Show debugging information for matched professionals
      if (rows.length > 0) {
        console.log("Matched professionals:", 
          rows.map((r: any) => ({ 
            id: r.id, 
            serviceCategory: r.service_category,
            serviceCategories: r.service_categories || [], 
            statesServiced: r.states_serviced || [],
            languagesSpoken: r.languages_spoken || []
          }))
        );
      }
      
      // Convert snake_case column names to camelCase for consistency
      return rows.map((row: any) => ({
        id: row.id,
        username: row.username,
        password: row.password,
        email: row.email,
        fullName: row.full_name,
        phone: row.phone,
        isProfessional: row.is_professional,
        businessName: row.business_name,
        serviceCategory: row.service_category,
        // Array fields for multiple service categories, states and languages
        serviceCategories: row.service_categories || [],
        statesServiced: row.states_serviced || [],
        languagesSpoken: row.languages_spoken || [],
        // Keep legacy fields for backward compatibility
        stateLocation: row.state_location,
        languagesSpokenText: row.languages_spoken_text,
        // Other fields
        profileImageUrl: row.profile_image_url,
        websiteUrl: row.website_url,
        facebookUrl: row.facebook_url,
        instagramUrl: row.instagram_url,
        tiktokUrl: row.tiktok_url,
        isActive: row.is_active,
        subscriptionExpiresAt: row.subscription_expires_at,
        yearsExperience: row.years_experience || null,
        certifications: row.certifications || null,
        serviceAreas: row.service_areas || null,
        businessDescription: row.business_description || null,
        stripeCustomerId: row.stripe_customer_id || null,
        stripeSubscriptionId: row.stripe_subscription_id || null,
        subscriptionStatus: row.subscription_status || null,
        subscriptionStartDate: row.subscription_start_date || null,
        trialEndDate: row.trial_end_date || null,
        nextBillingDate: row.next_billing_date || null,
        lastPaymentDate: row.last_payment_date || null,
        lastPaymentAmount: row.last_payment_amount || null,
        lastPaymentStatus: row.last_payment_status || null,
        paymentRemindersCount: row.payment_reminders_count || 0,
      }));
    } catch (error) {
      console.error("Error in getAllProfessionals:", error);
      return [];
    }
  }
  
  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).execute();
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).execute();
    return result[0];
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning().execute();
    return result[0];
  }
  
  // Subcategory methods
  async getAllSubcategories(): Promise<Subcategory[]> {
    return await db.select().from(subcategories).execute();
  }
  
  async getSubcategoriesByCategoryId(categoryId: number): Promise<Subcategory[]> {
    return await db.select().from(subcategories)
      .where(eq(subcategories.categoryId, categoryId))
      .execute();
  }
  
  async getSubcategoryById(id: number): Promise<Subcategory | undefined> {
    const result = await db.select().from(subcategories)
      .where(eq(subcategories.id, id))
      .execute();
    return result[0];
  }
  
  async createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory> {
    const result = await db.insert(subcategories)
      .values(subcategory)
      .returning()
      .execute();
    return result[0];
  }
  
  // Service methods
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services).execute();
  }
  
  async getServicesBySubcategoryId(subcategoryId: number): Promise<Service[]> {
    return await db.select().from(services)
      .where(eq(services.subcategoryId, subcategoryId))
      .execute();
  }
  
  async getServiceById(id: number): Promise<Service | undefined> {
    const result = await db.select().from(services)
      .where(eq(services.id, id))
      .execute();
    return result[0];
  }
  
  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(services)
      .values(service)
      .returning()
      .execute();
    return result[0];
  }
  
  // Review methods
  async getReviewsForProfessional(professionalId: number): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.professionalId, professionalId))
      .execute();
  }
  
  async getProfessionalWithReviews(professionalId: number): Promise<{ professional: User, reviews: Review[] } | undefined> {
    const professional = await this.getUser(professionalId);
    
    if (!professional || !professional.isProfessional) {
      return undefined;
    }
    
    const professionalReviews = await this.getReviewsForProfessional(professionalId);
    
    return {
      professional,
      reviews: professionalReviews
    };
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    // For authenticated users, ensure only one review per user per professional
    if (review.reviewerId) {
      const existingReviews = await db.select()
        .from(reviews)
        .where(eq(reviews.reviewerId, review.reviewerId))
        .where(eq(reviews.professionalId, review.professionalId))
        .execute();
      
      if (existingReviews.length > 0) {
        throw new Error('You have already reviewed this professional');
      }
      
      // Set verified to true for authenticated users
      review.verified = true;
    }
    
    const result = await db.insert(reviews)
      .values(review)
      .returning()
      .execute();
      
    return result[0];
  }
  
  async createGuestReview(review: InsertGuestReview): Promise<Review> {
    // For guest users, we don't have a reviewer ID to check
    // Set verified to false for guest reviews
    console.log("Creating guest review with data:", review);
    
    // Explicitly set reviewerId to null for guest reviews
    const result = await db.insert(reviews)
      .values({
        ...review,
        reviewerId: null, // Must be explicitly set to null
        verified: false
      })
      .returning()
      .execute();
      
    return result[0];
  }
  
  async userCanReviewProfessional(reviewerId: number, professionalId: number): Promise<boolean> {
    // Prevent users from reviewing themselves
    if (reviewerId === professionalId) {
      return false;
    }
    
    // Ensure the professional exists and is actually marked as a professional
    const professional = await this.getUser(professionalId);
    if (!professional || !professional.isProfessional) {
      return false;
    }
    
    // Check if the user has already left a review
    const existingReviews = await db.select()
      .from(reviews)
      .where(eq(reviews.reviewerId, reviewerId))
      .where(eq(reviews.professionalId, professionalId))
      .execute();
    
    // User can review if they haven't already
    return existingReviews.length === 0;
  }
  
  async getReviewById(id: number): Promise<Review | undefined> {
    const result = await db.select().from(reviews)
      .where(eq(reviews.id, id))
      .execute();
    return result[0];
  }
  
  async updateReviewResponse(reviewId: number, response: string): Promise<Review> {
    try {
      // Update the review with the professional's response
      const result = await db.update(reviews)
        .set({ 
          professionalResponse: response 
        })
        .where(eq(reviews.id, reviewId))
        .returning()
        .execute();
      
      return result[0];
    } catch (error) {
      console.error('Error in updateReviewResponse:', error);
      throw new Error('Failed to update review with professional response');
    }
  }
  
  // Stripe integration methods
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    try {
      // Update the user with the Stripe customer ID
      const result = await pool.query(
        `UPDATE users SET stripe_customer_id = $1 WHERE id = $2 RETURNING *`,
        [customerId, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Return the updated user
      const row = result.rows[0];
      return {
        id: row.id,
        username: row.username,
        password: row.password,
        email: row.email,
        fullName: row.full_name,
        phone: row.phone,
        isProfessional: row.is_professional,
        businessName: row.business_name,
        serviceCategory: row.service_category,
        stateLocation: row.state_location,
        languagesSpoken: row.languages_spoken,
        profileImageUrl: row.profile_image_url,
        websiteUrl: row.website_url,
        facebookUrl: row.facebook_url,
        instagramUrl: row.instagram_url,
        tiktokUrl: row.tiktok_url,
        isActive: row.is_active,
        subscriptionExpiresAt: row.subscription_expires_at,
        yearsExperience: row.years_experience || null,
        certifications: row.certifications || null,
        serviceAreas: row.service_areas || null,
        businessDescription: row.business_description || null,
        stripeCustomerId: row.stripe_customer_id || null,
        stripeSubscriptionId: row.stripe_subscription_id || null,
        subscriptionStatus: row.subscription_status || null,
        subscriptionStartDate: row.subscription_start_date || null,
        trialEndDate: row.trial_end_date || null,
        nextBillingDate: row.next_billing_date || null,
        lastPaymentDate: row.last_payment_date || null,
        lastPaymentAmount: row.last_payment_amount || null,
        lastPaymentStatus: row.last_payment_status || null,
        paymentRemindersCount: row.payment_reminders_count || 0,
      };
    } catch (error) {
      console.error('Error in updateStripeCustomerId:', error);
      throw new Error(`Failed to update Stripe customer ID for user ${userId}`);
    }
  }

  async updateStripeSubscriptionId(userId: number, subscriptionId: string): Promise<User> {
    try {
      // Update the user with the Stripe subscription ID
      const result = await pool.query(
        `UPDATE users SET 
          stripe_subscription_id = $1,
          subscription_status = 'active'
        WHERE id = $2 RETURNING *`,
        [subscriptionId, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Return the updated user with the same mapping as above
      const row = result.rows[0];
      return {
        id: row.id,
        username: row.username,
        password: row.password,
        email: row.email,
        fullName: row.full_name,
        phone: row.phone,
        isProfessional: row.is_professional,
        businessName: row.business_name,
        serviceCategory: row.service_category,
        stateLocation: row.state_location,
        languagesSpoken: row.languages_spoken,
        profileImageUrl: row.profile_image_url,
        websiteUrl: row.website_url,
        facebookUrl: row.facebook_url,
        instagramUrl: row.instagram_url,
        tiktokUrl: row.tiktok_url,
        isActive: row.is_active,
        subscriptionExpiresAt: row.subscription_expires_at,
        yearsExperience: row.years_experience || null,
        certifications: row.certifications || null,
        serviceAreas: row.service_areas || null,
        businessDescription: row.business_description || null,
        stripeCustomerId: row.stripe_customer_id || null,
        stripeSubscriptionId: row.stripe_subscription_id || null,
        subscriptionStatus: row.subscription_status || null,
        subscriptionStartDate: row.subscription_start_date || null,
        trialEndDate: row.trial_end_date || null,
        nextBillingDate: row.next_billing_date || null,
        lastPaymentDate: row.last_payment_date || null,
        lastPaymentAmount: row.last_payment_amount || null,
        lastPaymentStatus: row.last_payment_status || null,
        paymentRemindersCount: row.payment_reminders_count || 0,
      };
    } catch (error) {
      console.error('Error in updateStripeSubscriptionId:', error);
      throw new Error(`Failed to update Stripe subscription ID for user ${userId}`);
    }
  }

  async savePaymentMethod(userId: number, paymentData: {
    type: string;
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    zipCode: string;
  }): Promise<void> {
    try {
      const { type, cardNumber, cardholderName, expiryMonth, expiryYear, zipCode } = paymentData;
      
      // Mask the card number for security (keep last 4 digits)
      const maskedCardNumber = `**** **** **** ${cardNumber.slice(-4)}`;
      
      if (type === 'primary') {
        await pool.query(
          `UPDATE users SET 
           primary_card_number = $1,
           primary_card_name = $2,
           primary_expiry_month = $3,
           primary_expiry_year = $4,
           primary_zip_code = $5
           WHERE id = $6`,
          [maskedCardNumber, cardholderName, expiryMonth, expiryYear, zipCode, userId]
        );
      } else if (type === 'backup') {
        await pool.query(
          `UPDATE users SET 
           backup_card_number = $1,
           backup_card_name = $2,
           backup_expiry_month = $3,
           backup_expiry_year = $4,
           backup_zip_code = $5
           WHERE id = $6`,
          [maskedCardNumber, cardholderName, expiryMonth, expiryYear, zipCode, userId]
        );
      }
      
      console.log(`💳 ${type} payment method saved for user ${userId}`);
    } catch (error) {
      console.error('Error saving payment method:', error);
      throw new Error(`Failed to save ${paymentData.type} payment method for user ${userId}`);
    }
  }

  async updateSubscriptionStatus(userId: number, status: string): Promise<User> {
    try {
      // Update the user's subscription status
      const result = await pool.query(
        `UPDATE users SET subscription_status = $1 WHERE id = $2 RETURNING *`,
        [status, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Return the updated user
      const row = result.rows[0];
      return {
        id: row.id,
        username: row.username,
        password: row.password,
        email: row.email,
        fullName: row.full_name,
        phone: row.phone,
        isProfessional: row.is_professional,
        businessName: row.business_name,
        serviceCategory: row.service_category,
        stateLocation: row.state_location,
        languagesSpoken: row.languages_spoken,
        profileImageUrl: row.profile_image_url,
        websiteUrl: row.website_url,
        facebookUrl: row.facebook_url,
        instagramUrl: row.instagram_url,
        tiktokUrl: row.tiktok_url,
        isActive: row.is_active,
        subscriptionExpiresAt: row.subscription_expires_at,
        yearsExperience: row.years_experience || null,
        certifications: row.certifications || null,
        serviceAreas: row.service_areas || null,
        businessDescription: row.business_description || null,
        stripeCustomerId: row.stripe_customer_id || null,
        stripeSubscriptionId: row.stripe_subscription_id || null,
        subscriptionStatus: row.subscription_status || null,
        subscriptionStartDate: row.subscription_start_date || null,
        trialEndDate: row.trial_end_date || null,
        nextBillingDate: row.next_billing_date || null,
        lastPaymentDate: row.last_payment_date || null,
        lastPaymentAmount: row.last_payment_amount || null,
        lastPaymentStatus: row.last_payment_status || null,
        paymentRemindersCount: row.payment_reminders_count || 0,
      };
    } catch (error) {
      console.error('Error in updateSubscriptionStatus:', error);
      throw new Error(`Failed to update subscription status for user ${userId}`);
    }
  }

  async updateNextBillingDate(userId: number, date: Date): Promise<User> {
    try {
      // Update the user's next billing date
      const result = await pool.query(
        `UPDATE users SET 
          next_billing_date = $1,
          subscription_expires_at = $1
        WHERE id = $2 RETURNING *`,
        [date.toISOString(), userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Return the updated user
      const row = result.rows[0];
      return {
        id: row.id,
        username: row.username,
        password: row.password,
        email: row.email,
        fullName: row.full_name,
        phone: row.phone,
        isProfessional: row.is_professional,
        businessName: row.business_name,
        serviceCategory: row.service_category,
        stateLocation: row.state_location,
        languagesSpoken: row.languages_spoken,
        profileImageUrl: row.profile_image_url,
        websiteUrl: row.website_url,
        facebookUrl: row.facebook_url,
        instagramUrl: row.instagram_url,
        tiktokUrl: row.tiktok_url,
        isActive: row.is_active,
        subscriptionExpiresAt: row.subscription_expires_at,
        yearsExperience: row.years_experience || null,
        certifications: row.certifications || null,
        serviceAreas: row.service_areas || null,
        businessDescription: row.business_description || null,
        stripeCustomerId: row.stripe_customer_id || null,
        stripeSubscriptionId: row.stripe_subscription_id || null,
        subscriptionStatus: row.subscription_status || null,
        subscriptionStartDate: row.subscription_start_date || null,
        trialEndDate: row.trial_end_date || null,
        nextBillingDate: row.next_billing_date || null,
        lastPaymentDate: row.last_payment_date || null,
        lastPaymentAmount: row.last_payment_amount || null,
        lastPaymentStatus: row.last_payment_status || null,
        paymentRemindersCount: row.payment_reminders_count || 0,
      };
    } catch (error) {
      console.error('Error in updateNextBillingDate:', error);
      throw new Error(`Failed to update next billing date for user ${userId}`);
    }
  }

  async recordPayment(userId: number, amount: number, status: string): Promise<User> {
    try {
      // Record a payment for the user
      const result = await pool.query(
        `UPDATE users SET 
          last_payment_date = NOW(),
          last_payment_amount = $1,
          last_payment_status = $2
        WHERE id = $3 RETURNING *`,
        [amount, status, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Return the updated user
      const row = result.rows[0];
      return {
        id: row.id,
        username: row.username,
        password: row.password,
        email: row.email,
        fullName: row.full_name,
        phone: row.phone,
        isProfessional: row.is_professional,
        businessName: row.business_name,
        serviceCategory: row.service_category,
        stateLocation: row.state_location,
        languagesSpoken: row.languages_spoken,
        profileImageUrl: row.profile_image_url,
        websiteUrl: row.website_url,
        facebookUrl: row.facebook_url,
        instagramUrl: row.instagram_url,
        tiktokUrl: row.tiktok_url,
        isActive: row.is_active,
        subscriptionExpiresAt: row.subscription_expires_at,
        yearsExperience: row.years_experience || null,
        certifications: row.certifications || null,
        serviceAreas: row.service_areas || null,
        businessDescription: row.business_description || null,
        stripeCustomerId: row.stripe_customer_id || null,
        stripeSubscriptionId: row.stripe_subscription_id || null,
        subscriptionStatus: row.subscription_status || null,
        subscriptionStartDate: row.subscription_start_date || null,
        trialEndDate: row.trial_end_date || null,
        nextBillingDate: row.next_billing_date || null,
        lastPaymentDate: row.last_payment_date || null,
        lastPaymentAmount: row.last_payment_amount || null,
        lastPaymentStatus: row.last_payment_status || null,
        paymentRemindersCount: row.payment_reminders_count || 0,
      };
    } catch (error) {
      console.error('Error in recordPayment:', error);
      throw new Error(`Failed to record payment for user ${userId}`);
    }
  }

  async updatePaymentMethod(userId: number, paymentData: {
    cardNumber: string;
    cardName: string;
    expiryMonth: string;
    expiryYear: string;
    zipCode: string;
    cardType: 'primary' | 'backup';
  }): Promise<User> {
    try {
      // Mask the card number for storage (only keep last 4 digits)
      const maskedCardNumber = '**** **** **** ' + paymentData.cardNumber.replace(/\s/g, '').slice(-4);
      
      // Determine which payment fields to update based on card type
      const updateFields = paymentData.cardType === 'primary' 
        ? {
            primary_card_number: maskedCardNumber,
            primary_card_name: paymentData.cardName,
            primary_expiry_month: paymentData.expiryMonth,
            primary_expiry_year: paymentData.expiryYear,
            primary_zip_code: paymentData.zipCode
          }
        : {
            backup_card_number: maskedCardNumber,
            backup_card_name: paymentData.cardName,
            backup_expiry_month: paymentData.expiryMonth,
            backup_expiry_year: paymentData.expiryYear,
            backup_zip_code: paymentData.zipCode
          };

      // Create SQL update query dynamically
      const fieldNames = Object.keys(updateFields);
      const setClause = fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ');
      const values = Object.values(updateFields);
      
      const result = await pool.query(
        `UPDATE users SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Return the updated user
      const row = result.rows[0];
      return {
        id: row.id,
        username: row.username,
        password: row.password,
        email: row.email,
        fullName: row.full_name,
        phone: row.phone,
        isProfessional: row.is_professional,
        businessName: row.business_name,
        serviceCategory: row.service_category,
        stateLocation: row.state_location,
        languagesSpoken: row.languages_spoken,
        profileImageUrl: row.profile_image_url,
        websiteUrl: row.website_url,
        facebookUrl: row.facebook_url,
        instagramUrl: row.instagram_url,
        tiktokUrl: row.tiktok_url,
        isActive: row.is_active,
        subscriptionExpiresAt: row.subscription_expires_at,
        yearsExperience: row.years_experience || null,
        certifications: row.certifications || null,
        serviceAreas: row.service_areas || null,
        businessDescription: row.business_description || null,
        stripeCustomerId: row.stripe_customer_id || null,
        stripeSubscriptionId: row.stripe_subscription_id || null,
        subscriptionStatus: row.subscription_status || null,
        subscriptionStartDate: row.subscription_start_date || null,
        trialEndDate: row.trial_end_date || null,
        nextBillingDate: row.next_billing_date || null,
        lastPaymentDate: row.last_payment_date || null,
        lastPaymentAmount: row.last_payment_amount || null,
        lastPaymentStatus: row.last_payment_status || null,
        paymentRemindersCount: row.payment_reminders_count || 0,
        // Payment method fields
        primaryCardNumber: row.primary_card_number || null,
        primaryCardName: row.primary_card_name || null,
        primaryExpiryMonth: row.primary_expiry_month || null,
        primaryExpiryYear: row.primary_expiry_year || null,
        primaryZipCode: row.primary_zip_code || null,
        backupCardNumber: row.backup_card_number || null,
        backupCardName: row.backup_card_name || null,
        backupExpiryMonth: row.backup_expiry_month || null,
        backupExpiryYear: row.backup_expiry_year || null,
        backupZipCode: row.backup_zip_code || null,
      };
    } catch (error) {
      console.error('Error in updatePaymentMethod:', error);
      throw new Error(`Failed to update payment method for user ${userId}`);
    }
  }

  // Notification methods
  async getUnreadNotificationCount(userId: number): Promise<number> {
    try {
      const client = postgres(process.env.DATABASE_URL!);
      const result = await client`
        SELECT COUNT(*) as count 
        FROM notifications 
        WHERE professional_id = ${userId} AND read_at IS NULL
      `;
      await client.end();
      return parseInt(result[0]?.count || '0');
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      return 0;
    }
  }

  async getNotifications(userId: number): Promise<any[]> {
    try {
      const client = postgres(process.env.DATABASE_URL!);
      const result = await client`
        SELECT id, type, title, message, action_required, metadata, created_at, read_at 
        FROM notifications 
        WHERE professional_id = ${userId} 
        ORDER BY created_at DESC 
        LIMIT 50
      `;
      await client.end();
      return result.map(row => ({
        id: row.id,
        type: row.type,
        title: row.title,
        message: row.message,
        actionRequired: row.action_required,
        metadata: row.metadata,
        createdAt: row.created_at,
        readAt: row.read_at,
        isRead: !!row.read_at
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: number, userId: number): Promise<void> {
    try {
      await db.update(notifications)
        .set({ readAt: new Date() })
        .where(eq(notifications.id, notificationId) && eq(notifications.professionalId, userId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async createDeletionRequest(request: { email: string; reason?: string | null; userId?: number | null }): Promise<{ id: number; email: string; reason: string | null; status: string; requestedAt: Date; userId: number | null }> {
    try {
      const [result] = await db.insert(deletionRequests).values({
        email: request.email,
        reason: request.reason || null,
        userId: request.userId || null,
        status: 'pending',
        requestedAt: new Date()
      }).returning();
      
      return {
        id: result.id,
        email: result.email,
        reason: result.reason,
        status: result.status,
        requestedAt: result.requestedAt,
        userId: result.userId
      };
    } catch (error) {
      console.error('Error creating deletion request:', error);
      throw error;
    }
  }

  async getAllDeletionRequests(): Promise<Array<{ id: number; email: string; reason: string | null; status: string; requestedAt: Date; processedAt: Date | null; userId: number | null }>> {
    try {
      const results = await db.select().from(deletionRequests).orderBy(desc(deletionRequests.requestedAt));
      
      return results.map(row => ({
        id: row.id,
        email: row.email,
        reason: row.reason,
        status: row.status,
        requestedAt: row.requestedAt,
        processedAt: row.processedAt,
        userId: row.userId
      }));
    } catch (error) {
      console.error('Error getting deletion requests:', error);
      throw error;
    }
  }

  async updateDeletionRequest(id: number, updates: { status?: string; processedAt?: Date }): Promise<void> {
    try {
      await db.update(deletionRequests)
        .set(updates)
        .where(eq(deletionRequests.id, id));
    } catch (error) {
      console.error('Error updating deletion request:', error);
      throw error;
    }
  }

  // Password reset token methods
  async storeResetToken(email: string, token: string): Promise<void> {
    try {
      const user = await this.getUserByEmail(email);
      if (user) {
        // Store token with 1 hour expiration
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        await db.update(users)
          .set({ 
            resetToken: token,
            resetTokenExpires: expiresAt
          })
          .where(eq(users.id, user.id));
      }
    } catch (error) {
      console.error('Error storing reset token:', error);
      throw error;
    }
  }

  async verifyResetToken(token: string): Promise<boolean> {
    try {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.resetToken, token));
      
      if (!user || !user.resetTokenExpires) {
        return false;
      }
      
      // Check if token is expired
      return new Date() < user.resetTokenExpires;
    } catch (error) {
      console.error('Error verifying reset token:', error);
      return false;
    }
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    try {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.resetToken, token));
      
      if (!user || !user.resetTokenExpires) {
        return undefined;
      }
      
      // Check if token is expired
      if (new Date() >= user.resetTokenExpires) {
        return undefined;
      }
      
      return user;
    } catch (error) {
      console.error('Error getting user by reset token:', error);
      return undefined;
    }
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    try {
      // Hash the password before storing (using the same method as auth.ts)
      const { scrypt, randomBytes } = await import('crypto');
      const { promisify } = await import('util');
      const scryptAsync = promisify(scrypt);
      
      const salt = randomBytes(16).toString('hex');
      const buf = (await scryptAsync(newPassword, salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString('hex')}.${salt}`;
      
      await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error;
    }
  }

  async clearResetToken(token: string): Promise<void> {
    try {
      await db.update(users)
        .set({ 
          resetToken: null,
          resetTokenExpires: null 
        })
        .where(eq(users.resetToken, token));
    } catch (error) {
      console.error('Error clearing reset token:', error);
      throw error;
    }
  }
}

// Create and export storage instance
export const storage = new DatabaseStorage();
