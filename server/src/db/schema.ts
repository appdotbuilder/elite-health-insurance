
import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const planCategoryEnum = pgEnum('plan_category', ['premium', 'platinum', 'executive', 'elite']);
export const incomeRangeEnum = pgEnum('income_range', ['100k-250k', '250k-500k', '500k-1m', '1m-5m', '5m+']);
export const contactMethodEnum = pgEnum('contact_method', ['email', 'phone', 'video_call']);
export const inquiryStatusEnum = pgEnum('inquiry_status', ['new', 'contacted', 'qualified', 'proposal_sent', 'closed', 'not_interested']);
export const consultationTypeEnum = pgEnum('consultation_type', ['phone', 'video', 'in_person']);
export const consultationOutcomeEnum = pgEnum('consultation_outcome', ['scheduled', 'completed', 'rescheduled', 'cancelled', 'no_show']);

// Insurance Plans Table
export const insurancePlansTable = pgTable('insurance_plans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: planCategoryEnum('category').notNull(),
  annual_premium: numeric('annual_premium', { precision: 10, scale: 2 }).notNull(),
  deductible: numeric('deductible', { precision: 10, scale: 2 }).notNull(),
  max_coverage: numeric('max_coverage', { precision: 12, scale: 2 }).notNull(),
  coverage_details: text('coverage_details').notNull(),
  benefits: text('benefits').array().notNull(),
  network_hospitals: integer('network_hospitals').notNull(),
  worldwide_coverage: boolean('worldwide_coverage').notNull().default(false),
  concierge_services: boolean('concierge_services').notNull().default(false),
  emergency_evacuation: boolean('emergency_evacuation').notNull().default(false),
  dental_coverage: boolean('dental_coverage').notNull().default(false),
  vision_coverage: boolean('vision_coverage').notNull().default(false),
  wellness_programs: boolean('wellness_programs').notNull().default(false),
  is_featured: boolean('is_featured').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Client Inquiries Table
export const clientInquiriesTable = pgTable('client_inquiries', {
  id: serial('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  annual_income_range: incomeRangeEnum('annual_income_range'),
  family_size: integer('family_size'),
  current_coverage: text('current_coverage'),
  coverage_interests: text('coverage_interests').array().notNull(),
  preferred_contact_method: contactMethodEnum('preferred_contact_method').notNull(),
  message: text('message'),
  consultation_requested: boolean('consultation_requested').notNull().default(false),
  status: inquiryStatusEnum('status').notNull().default('new'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Consultations Table
export const consultationsTable = pgTable('consultations', {
  id: serial('id').primaryKey(),
  inquiry_id: integer('inquiry_id').notNull().references(() => clientInquiriesTable.id),
  scheduled_date: timestamp('scheduled_date').notNull(),
  duration_minutes: integer('duration_minutes').notNull(),
  consultation_type: consultationTypeEnum('consultation_type').notNull(),
  advisor_name: text('advisor_name').notNull(),
  notes: text('notes'),
  outcome: consultationOutcomeEnum('outcome'),
  follow_up_required: boolean('follow_up_required').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const clientInquiriesRelations = relations(clientInquiriesTable, ({ many }) => ({
  consultations: many(consultationsTable),
}));

export const consultationsRelations = relations(consultationsTable, ({ one }) => ({
  inquiry: one(clientInquiriesTable, {
    fields: [consultationsTable.inquiry_id],
    references: [clientInquiriesTable.id],
  }),
}));

// TypeScript types for the table schemas
export type InsurancePlan = typeof insurancePlansTable.$inferSelect;
export type NewInsurancePlan = typeof insurancePlansTable.$inferInsert;
export type ClientInquiry = typeof clientInquiriesTable.$inferSelect;
export type NewClientInquiry = typeof clientInquiriesTable.$inferInsert;
export type Consultation = typeof consultationsTable.$inferSelect;
export type NewConsultation = typeof consultationsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  insurancePlans: insurancePlansTable,
  clientInquiries: clientInquiriesTable,
  consultations: consultationsTable,
};
