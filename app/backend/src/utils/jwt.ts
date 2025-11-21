import jwt from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from '../config';

export function signAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXP });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXP });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as any;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as any;
}
