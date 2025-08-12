import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body || {};
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(400).json({ message: 'Identifiants invalides' });
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`);
  res.json({ user: { id: user.id, email: user.email } });
}
