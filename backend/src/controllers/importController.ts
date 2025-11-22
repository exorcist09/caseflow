import { Request, Response } from 'express';
import { processUpload, createChunk } from '../services/importService';
import { AuthRequest } from '../middleware/auth';

export async function handleUpload(req: AuthRequest, res: Response) {
  try {
    if (!req.file) return res.status(400).json({ message: 'file required' });
    const csv = req.file.buffer.toString('utf8');
    const result = await processUpload(req.user.sub, csv);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function handleChunkCreate(req: AuthRequest, res: Response) {
  try {
    const importId = req.params.importId;
    const { rows } = req.body;
    if (!Array.isArray(rows)) return res.status(400).json({ message: 'rows must be array' });

    const result = await createChunk(importId, req.user.sub, rows);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
