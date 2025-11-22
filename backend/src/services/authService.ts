import prisma from '../prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export async function register(email: string, password: string, role: string | undefined) {
  const existing = await prisma.user.findUnique({ where: { email }});
  if (existing) throw new Error('User already exists');

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, role: role === 'ADMIN' ? 'ADMIN' : 'OPERATOR' }
  });
  return user;
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) throw new Error('Invalid credentials');
  const ok = await comparePassword(password, user.password);
  if (!ok) throw new Error('Invalid credentials');

  const payload = { sub: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ sub: user.id });

  return { user, accessToken, refreshToken };
}

export async function refresh(token: string) {
  try {
    const payload = verifyRefreshToken(token) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.sub }});
    if (!user) throw new Error('User not found');
    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id });
    return { token: accessToken, refresh: refreshToken };
  } catch (err: any) {
    throw new Error('Invalid refresh token');
  }
}
