import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { registerSchema, loginSchema } from '../utils/validation';
import { z } from 'zod';

export async function register(req: Request, res: Response) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const result = await authService.register(parsed.data.email, parsed.data.password, parsed.data.role);
    res.status(201).json({ message: 'user_created', userId: result.id, email: result.email });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { accessToken, refreshToken, user } = await authService.login(parsed.data.email, parsed.data.password);
    res.json({ token: accessToken, refresh: refreshToken, user: { id: user.id, email: user.email, role: user.role }});
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const token = req.body.refresh;
    if (!token) return res.status(400).json({ message: 'refresh token required' });
    const tokens = await authService.refresh(token);
    res.json(tokens);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}
