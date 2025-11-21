export const schemaFields = [
  'case_id',
  'applicant_name',
  'dob',
  'email',
  'phone',
  'category',
  'priority',
];

export function inferMapping(headers: string[], fields: string[]) {
  const map: Record<string, string> = {};
  const normalized = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  const normHeaders = headers.map((h) => ({ raw: h, n: normalized(h) }));

  for (const f of fields) {
    const nf = normalized(f);
    const match = normHeaders.find(h => h.n === nf) || normHeaders.find(h => h.n.includes(nf)) || normHeaders.find(h => nf.includes(h.n));
    if (match) map[f] = match.raw;
  }
  return map;
}

/** validators */
export function isValidEmail(s?: string) {
  if (!s) return true; // optional
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(s);
}

export function isValidISODate(s?: string) {
  if (!s) return false;
  const t = Date.parse(s);
  return !isNaN(t);
}

/** naive phone normalization; replace with libphonenumber in prod */
export function normalizePhone(s?: string) {
  if (!s) return '';
  const digits = s.replace(/[^\d+]/g, '');
  if (digits.startsWith('0') && digits.length === 11) return '+' + digits.slice(1);
  if (digits.length === 10) return '+91' + digits; // heuristic for Indian numbers
  return digits.startsWith('+') ? digits : '+' + digits;
}

/** Fix all helpers */
export function titleCase(name: string) {
  if (!name) return '';
  return name.split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function fixAllHelpers(row: Record<string, any>) {
  const out = { ...row };
  if (out.applicant_name) out.applicant_name = titleCase(String(out.applicant_name));
  if (out.phone) out.phone = normalizePhone(String(out.phone));
  if (out.case_id) out.case_id = String(out.case_id).trim();
  if (!out.priority) out.priority = 'LOW';
  return out;
}
