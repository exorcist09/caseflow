import { Request, Response } from 'express';
import * as casesService from '../services/casesService';

export async function listCases(req: Request, res: Response) {
  try {
    const limit = Math.min(100, Number(req.query.limit || 20));
    const cursor = req.query.cursor as string | undefined;
    const filters = {
      category: req.query.category as string | undefined,
      assignee: req.query.assignee as string | undefined,
      from: req.query.from as string | undefined,
      to: req.query.to as string | undefined
    };
    const result = await casesService.listCases(limit, cursor, filters);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function getCase(req: Request, res: Response) {
  try {
    const c = await casesService.getCase(req.params.id);
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
