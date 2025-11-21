import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.union([z.literal('ADMIN'), z.literal('OPERATOR')]).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Case CSV schema (for server validation)
export const caseRowSchema = z.object({
  case_id: z.string().min(1),
  applicant_name: z.string().min(1),
  dob: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  category: z.enum(['TAX','LICENSE','PERMIT']),
  priority: z.enum(['LOW','MEDIUM','HIGH']).optional()
});

export type CaseRow = z.infer<typeof caseRowSchema>;
