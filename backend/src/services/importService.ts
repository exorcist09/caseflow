import prisma from '../prisma/client';
import { caseRowSchema, CaseRow } from '../utils/validation';

export async function processUpload(userId: string, csv: string) {
  // This function can remain mostly unchanged
  const { parse } = await import('csv-parse/sync');
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  const total = records.length;

  const imp = await prisma.import.create({
    data: { userId, totalRows: total, succeeded: 0, failed: 0 },
  });

  await Promise.all(
    records.map(async (row: any) => {
      const parsed = caseRowSchema.safeParse(row);
      if (!parsed.success) {
        await prisma.importJob.create({
          data: {
            importId: imp.id,
            rowData: row,
            status: 'FAILED',
            error: JSON.stringify(parsed.error.flatten()),
          },
        });
        await prisma.import.update({
          where: { id: imp.id },
          data: { failed: { increment: 1 } },
        });
        return;
      }

      await prisma.importJob.create({
        data: { importId: imp.id, rowData: parsed.data, status: 'PENDING' },
      });
    })
  );

  return { importId: imp.id, totalRows: total };
}

export async function createChunk(importId: string, actorId: string, rows: any[]) {
  const successes: string[] = [];
  const failures: { row: any; error: string }[] = [];

  for (const r of rows) {
    const parsed = caseRowSchema.safeParse(r);

    if (!parsed.success) {
      failures.push({ row: r, error: JSON.stringify(parsed.error.flatten()) });
      await prisma.import.update({
        where: { id: importId },
        data: { failed: { increment: 1 } },
      });
      continue;
    }

    const row: CaseRow = parsed.data;

    try {
      // Skip duplicates instead of failing
      const exists = await prisma.case.findUnique({ where: { caseId: row.case_id } });
      if (exists) {
        successes.push(row.case_id); // count duplicate as success for clean CSV
        continue;
      }

      const created = await prisma.case.create({
        data: {
          caseId: row.case_id,
          applicantName: row.applicant_name,
          dob: new Date(row.dob),
          email: row.email || null,
          phone: row.phone || null,
          category: row.category,
          priority: row.priority || 'LOW',
        },
      });

      await prisma.caseHistory.create({
        data: {
          caseId: created.id,
          action: 'IMPORT_CREATED',
          actorId,
          metadata: row,
        },
      });

      successes.push(row.case_id);
      await prisma.import.update({
        where: { id: importId },
        data: { succeeded: { increment: 1 } },
      });
    } catch (err: any) {
      failures.push({ row: r, error: err.message || 'create_failed' });
      await prisma.import.update({
        where: { id: importId },
        data: { failed: { increment: 1 } },
      });
    }
  }

  return { processed: rows.length, successes, failures };
}
