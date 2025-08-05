
import { z } from 'zod';

// Insurance Plan schema
export const insurancePlanSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.enum(['premium', 'platinum', 'executive', 'elite']),
  annual_premium: z.number(),
  deductible: z.number(),
  max_coverage: z.number(),
  coverage_details: z.string(),
  benefits: z.array(z.string()),
  network_hospitals: z.number().int(),
  worldwide_coverage: z.boolean(),
  concierge_services: z.boolean(),
  emergency_evacuation: z.boolean(),
  dental_coverage: z.boolean(),
  vision_coverage: z.boolean(),
  wellness_programs: z.boolean(),
  is_featured: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type InsurancePlan = z.infer<typeof insurancePlanSchema>;

// Client Inquiry schema
export const clientInquirySchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  company: z.string().nullable(),
  annual_income_range: z.enum(['100k-250k', '250k-500k', '500k-1m', '1m-5m', '5m+']).nullable(),
  family_size: z.number().int().nullable(),
  current_coverage: z.string().nullable(),
  coverage_interests: z.array(z.string()),
  preferred_contact_method: z.enum(['email', 'phone', 'video_call']),
  message: z.string().nullable(),
  consultation_requested: z.boolean(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal_sent', 'closed', 'not_interested']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ClientInquiry = z.infer<typeof clientInquirySchema>;

// Consultation schema
export const consultationSchema = z.object({
  id: z.number(),
  inquiry_id: z.number(),
  scheduled_date: z.coerce.date(),
  duration_minutes: z.number().int(),
  consultation_type: z.enum(['phone', 'video', 'in_person']),
  advisor_name: z.string(),
  notes: z.string().nullable(),
  outcome: z.enum(['scheduled', 'completed', 'rescheduled', 'cancelled', 'no_show']).nullable(),
  follow_up_required: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Consultation = z.infer<typeof consultationSchema>;

// Input schemas for creating records
export const createInquiryInputSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullable(),
  company: z.string().nullable(),
  annual_income_range: z.enum(['100k-250k', '250k-500k', '500k-1m', '1m-5m', '5m+']).nullable(),
  family_size: z.number().int().positive().nullable(),
  current_coverage: z.string().nullable(),
  coverage_interests: z.array(z.string()),
  preferred_contact_method: z.enum(['email', 'phone', 'video_call']),
  message: z.string().nullable(),
  consultation_requested: z.boolean()
});

export type CreateInquiryInput = z.infer<typeof createInquiryInputSchema>;

export const createConsultationInputSchema = z.object({
  inquiry_id: z.number(),
  scheduled_date: z.coerce.date(),
  duration_minutes: z.number().int().positive(),
  consultation_type: z.enum(['phone', 'video', 'in_person']),
  advisor_name: z.string().min(1)
});

export type CreateConsultationInput = z.infer<typeof createConsultationInputSchema>;

export const updateInquiryStatusInputSchema = z.object({
  id: z.number(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal_sent', 'closed', 'not_interested'])
});

export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusInputSchema>;

export const updateConsultationInputSchema = z.object({
  id: z.number(),
  notes: z.string().nullable().optional(),
  outcome: z.enum(['scheduled', 'completed', 'rescheduled', 'cancelled', 'no_show']).nullable().optional(),
  follow_up_required: z.boolean().optional()
});

export type UpdateConsultationInput = z.infer<typeof updateConsultationInputSchema>;
