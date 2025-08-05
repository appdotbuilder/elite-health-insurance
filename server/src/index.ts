
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createInquiryInputSchema,
  createConsultationInputSchema,
  updateInquiryStatusInputSchema,
  updateConsultationInputSchema
} from './schema';

// Import handlers
import { getInsurancePlans } from './handlers/get_insurance_plans';
import { getFeaturedPlans } from './handlers/get_featured_plans';
import { getPlanById } from './handlers/get_plan_by_id';
import { createInquiry } from './handlers/create_inquiry';
import { getInquiries } from './handlers/get_inquiries';
import { updateInquiryStatus } from './handlers/update_inquiry_status';
import { createConsultation } from './handlers/create_consultation';
import { getConsultations } from './handlers/get_consultations';
import { updateConsultation } from './handlers/update_consultation';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Insurance Plans routes
  getInsurancePlans: publicProcedure
    .query(() => getInsurancePlans()),
  
  getFeaturedPlans: publicProcedure
    .query(() => getFeaturedPlans()),
  
  getPlanById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getPlanById(input.id)),

  // Client Inquiry routes
  createInquiry: publicProcedure
    .input(createInquiryInputSchema)
    .mutation(({ input }) => createInquiry(input)),
  
  getInquiries: publicProcedure
    .query(() => getInquiries()),
  
  updateInquiryStatus: publicProcedure
    .input(updateInquiryStatusInputSchema)
    .mutation(({ input }) => updateInquiryStatus(input)),

  // Consultation routes
  createConsultation: publicProcedure
    .input(createConsultationInputSchema)
    .mutation(({ input }) => createConsultation(input)),
  
  getConsultations: publicProcedure
    .query(() => getConsultations()),
  
  updateConsultation: publicProcedure
    .input(updateConsultationInputSchema)
    .mutation(({ input }) => updateConsultation(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Health Insurance TRPC server listening at port: ${port}`);
}

start();
