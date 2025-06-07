import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Support Ticket table
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: text("ticket_number").notNull().unique(),
  userId: integer("user_id"), // Optional for guests
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open"),
  priority: text("priority").default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  assignedTo: integer("assigned_to"),
});

// Feedback table
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // Optional for guests
  email: text("email").notNull(),
  message: text("message").notNull(),
  category: text("category").default("general"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas using drizzle-zod
export const insertSupportTicketSchema = createInsertSchema(supportTickets)
  .omit({ id: true, createdAt: true, updatedAt: true, closedAt: true })
  .extend({
    priority: z.enum(['low', 'medium', 'high']).optional(),
  });

export const insertFeedbackSchema = createInsertSchema(feedback)
  .omit({ id: true, createdAt: true })
  .extend({
    rating: z.number().min(1).max(5).optional(),
    category: z.enum(['general', 'bug', 'feature', 'complaint', 'praise']).optional(),
  });

// Create guest schemas without requiring userId
export const insertGuestSupportTicketSchema = insertSupportTicketSchema
  .omit({ userId: true, assignedTo: true, ticketNumber: true });

export const insertGuestFeedbackSchema = insertFeedbackSchema
  .omit({ userId: true });

// Types using zod
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type InsertGuestSupportTicket = z.infer<typeof insertGuestSupportTicketSchema>;
export type InsertGuestFeedback = z.infer<typeof insertGuestFeedbackSchema>;

// Types using drizzle
export type SupportTicket = typeof supportTickets.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;