import prisma from '../prisma/client';

export async function listCases(limit: number, cursor?: string, filters?: any) {
  const where: any = {};
  if (filters?.category) where.category = filters.category;
  if (filters?.assignee) where.assigneeId = filters.assignee;
  if (filters?.from || filters?.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) where.createdAt.lte = new Date(filters.to);
  }

  const items = await prisma.case.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: 'desc' }
  });

  const hasNext = items.length > limit;
  if (hasNext) items.pop();
  const nextCursor = hasNext ? items[items.length - 1].id : null;

  return { items, nextCursor };
}

export async function getCase(id: string) {
  return prisma.case.findUnique({ where: { id }, include: { history: true }});
}
