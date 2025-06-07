import { pgTable, serial, integer, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User gamification progress table
export const userGamification = pgTable("user_gamification", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalPoints: integer("total_points").default(0),
  currentLevel: integer("current_level").default(1),
  streakDays: integer("streak_days").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  achievements: jsonb("achievements").default([]),
  badges: jsonb("badges").default([]),
  subscriptionMonths: integer("subscription_months").default(0),
  servicesAdded: integer("services_added").default(0),
  referralsCount: integer("referrals_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Achievement definitions table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // 'subscription', 'services', 'engagement', 'milestone'
  points: integer("points").notNull(),
  requirement: jsonb("requirement").notNull(), // {type: 'streak', value: 7} or {type: 'services', value: 3}
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// User activity log for points calculation
export const userActivity = pgTable("user_activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  activityType: text("activity_type").notNull(), // 'login', 'service_add', 'payment', 'referral'
  points: integer("points").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow()
});

// Level definitions
export const levels = pgTable("levels", {
  id: serial("id").primaryKey(),
  level: integer("level").notNull().unique(),
  name: text("name").notNull(),
  pointsRequired: integer("points_required").notNull(),
  benefits: jsonb("benefits").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull()
});

// Schemas for TypeScript
export const insertUserGamificationSchema = createInsertSchema(userGamification);
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertUserActivitySchema = createInsertSchema(userActivity);
export const insertLevelSchema = createInsertSchema(levels);

export type UserGamification = typeof userGamification.$inferSelect;
export type InsertUserGamification = z.infer<typeof insertUserGamificationSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserActivity = typeof userActivity.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
export type Level = typeof levels.$inferSelect;
export type InsertLevel = z.infer<typeof insertLevelSchema>;