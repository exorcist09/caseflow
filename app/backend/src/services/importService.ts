import prisma from '../prisma/client';
import { parse } from 'csv-parse/sync';
import { caseRowSchema, CaseRow } from '../utils/validation';

export async function processUpload(userId: string, csv: string) {
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  const total = records.length;
  const imp = await prisma.import.create({
    data: { userId, totalRows: total, succeeded: 0, failed: 0 }
  });

  // Create ImportJob entries per row - mark PENDING or FAILED if validation fails
  const jobs = await Promise.all(records.map(async (row: any) => {
    const parsed = caseRowSchema.safeParse(row);
    if (!parsed.success) {
      return prisma.importJob.create({
        data: { importId: imp.id, rowData: row, status: 'FAILED', error: JSON.stringify(parsed.error.flatten()) }
      });
    }
    return prisma.importJob.create({
      data: { importId: imp.id, rowData: parsed.data, status: 'PENDING' }
    });
  }));

  return { importId: imp.id, totalRows: total };
}

/**
 * createChunk performs server-side re-validation, creates cases,
 * updates Import.succeeded/failed, and creates CaseHistory entries.
 */
export async function createChunk(importId: string, actorId: string, rows: any[]) {
  const successes: string[] = [];
  const failures: { row: any; error: string }[] = [];

  for (const r of rows) {
    const parsed = caseRowSchema.safeParse(r);
    if (!parsed.success) {
      failures.push({ row: r, error: JSON.stringify(parsed.error.flatten()) });
      await prisma.import.update({ where: { id: importId }, data: { failed: { increment: 1 } }});
      continue;
    }
    const row: CaseRow = parsed.data;
    try {
      // ensure unique case_id
      const exists = await prisma.case.findUnique({ where: { caseId: row.case_id }});
      if (exists) throw new Error('duplicate_case_id');

      const created = await prisma.case.create({
        data: {
          caseId: row.case_id,
          applicantName: row.applicant_name,
          dob: new Date(row.dob),
          email: row.email || null,
          phone: row.phone || null,
          category: row.category,
          priority: row.priority || 'LOW'
        }
      });

      await prisma.caseHistory.create({
        data: {
          caseId: created.id,
          action: 'IMPORT_CREATED',
          actorId,
          metadata: row
        }
      });

      successes.push(row.case_id);
      await prisma.import.update({ where: { id: importId }, data: { succeeded: { increment: 1 } }});
    } catch (err: any) {
      failures.push({ row: r, error: err.message || 'create_failed' });
      await prisma.import.update({ where: { id: importId }, data: { failed: { increment: 1 } }});
    }
  }

  return { processed: rows.length, successes, failures };
}
