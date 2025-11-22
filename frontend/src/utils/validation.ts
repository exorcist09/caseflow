import { z } from 'zod';

export const caseRowSchema = z.object({
  case_id: z.string().min(1, 'case_id is required'),
  applicant_name: z.string().min(1, 'applicant_name is required'),
  dob: z.string().refine(v => !isNaN(Date.parse(v)), { message: 'dob must be a valid ISO date' }),
  email: z.string().email('invalid email').optional().or(z.literal('')).optional(),
  phone: z.string().optional().or(z.literal('')).optional(),
  category: z.enum(['TAX','LICENSE','PERMIT'], { errorMap: () => ({ message: 'category must be TAX, LICENSE or PERMIT' }) }),
  priority: z.enum(['LOW','MEDIUM','HIGH']).optional()
});

export type CaseRow = z.infer<typeof caseRowSchema>;

export function validateRow(row: Record<string, any>) {
  const parsed = caseRowSchema.safeParse(row);
  if (parsed.success) return { ok: true, errors: {} as Record<string,string[]> };
  const errors: Record<string, string[]> = {};
  parsed.error.issues.forEach((iss) => {
    const key = iss.path[0] as string || '_row';
    errors[key] = errors[key] || [];
    errors[key].push(iss.message);
  });
  return { ok: false, errors };
}

/** Simple helpers used by the quick-fix features */
export function titleCase(s?: string) {
  if (!s) return '';
  return s.split(/\s+/).map(w => w ? (w[0].toUpperCase() + w.slice(1).toLowerCase()) : '').join(' ');
}

export function normalizePhoneSimple(s?: string) {
  if (!s) return '';
  let d = String(s).replace(/[^\d+]/g, '');
  // heuristic: if 10 digits assume +91
  const digits = d.replace(/\D/g, '');
  if (digits.length === 10) return '+91' + digits;
  if (d.startsWith('+')) return d;
  return '+' + digits;
}

export function trimString(s?: string) {
  if (!s) return '';
  return String(s).trim();
}
