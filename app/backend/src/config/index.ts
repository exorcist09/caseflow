import dotenv from 'dotenv';
dotenv.config();

export const PORT = Number(process.env.PORT || 4000);
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev_refresh';
export const ACCESS_TOKEN_EXP = '15m';
export const REFRESH_TOKEN_EXP = '7d';
export const SENTRY_DSN = process.env.SENTRY_DSN || '';
