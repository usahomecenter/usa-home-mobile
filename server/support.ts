import { db } from "./db";
import { supportTickets, feedback } from "../shared/supportSchema";
import { eq } from "drizzle-orm";
import type { InsertGuestSupportTicket, InsertGuestFeedback } from "../shared/supportSchema";
import { emailService } from "./email";

/**
 * Generates a unique ticket number
 * Format: USH-YYYY-MMDD-XXXX (where XXXX is a random alphanumeric string)
 */
function generateTicketNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Generate a random alphanumeric string (4 characters)
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < 4; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return `USH-${year}-${month}${day}-${randomString}`;
}

/**
 * Support service for handling tickets and feedback
 */
export const supportService = {
  // Create a new support ticket
  async createTicket(ticketData: InsertGuestSupportTicket) {
    try {
      // Generate a unique ticket number
      const ticketNumber = generateTicketNumber();
      
      // Add the ticket number to the ticket data
      const ticketWithNumber = {
        ...ticketData,
        ticketNumber
      };
      
      // Insert ticket into database
      const [newTicket] = await db.insert(supportTickets)
        .values(ticketWithNumber)
        .returning();
      
      console.log(`New support ticket created: ${newTicket.ticketNumber} - ${newTicket.subject}`);
      
      // Send email notification
      await emailService.sendTicketConfirmation(
        newTicket.ticketNumber, 
        newTicket.email, 
        newTicket.subject
      );
      
      return newTicket;
    } catch (error) {
      console.error("Error creating support ticket:", error);
      throw new Error("Failed to create support ticket");
    }
  },
  
  // Submit user feedback
  async submitFeedback(feedbackData: InsertGuestFeedback) {
    try {
      const [newFeedback] = await db.insert(feedback)
        .values(feedbackData)
        .returning();
      
      console.log(`New feedback received: ${newFeedback.id} - ${newFeedback.category}`);
      
      return newFeedback;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw new Error("Failed to submit feedback");
    }
  },
  
  // Get all tickets for admin view
  async getAllTickets() {
    try {
      return await db.select().from(supportTickets)
        .orderBy(supportTickets.createdAt);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw new Error("Failed to fetch tickets");
    }
  },
  
  // Get a specific ticket by ID
  async getTicketById(id: number) {
    try {
      const [ticket] = await db.select().from(supportTickets)
        .where(eq(supportTickets.id, id));
      return ticket;
    } catch (error) {
      console.error(`Error fetching ticket #${id}:`, error);
      throw new Error("Failed to fetch ticket");
    }
  },
  
  // Update a ticket's status
  async updateTicketStatus(id: number, status: string) {
    try {
      const [updatedTicket] = await db.update(supportTickets)
        .set({ 
          status,
          updatedAt: new Date(),
          // If status is 'closed', set closedAt
          ...(status === 'closed' ? { closedAt: new Date() } : {})
        })
        .where(eq(supportTickets.id, id))
        .returning();
      
      return updatedTicket;
    } catch (error) {
      console.error(`Error updating ticket #${id}:`, error);
      throw new Error("Failed to update ticket");
    }
  },
  
  // Get all feedback items for admin view
  async getAllFeedback() {
    try {
      return await db.select().from(feedback)
        .orderBy(feedback.createdAt);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      throw new Error("Failed to fetch feedback");
    }
  }
};