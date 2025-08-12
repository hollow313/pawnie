import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/db';
import { getUserFromReq } from '@/src/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method !== 'POST') return res.status(405).end();
  const me = await getUserFromReq(req, res); if (!me) return;
  const { to, content } = req.body || {};
  if (!to || !content) return res.status(400).json({ message:'to and content are required' });
  const msg = await prisma.message.create({ data: { senderId: me.id, receiverId: to, content } });
  (global as any).io?.to(`user:${to}`).emit('message:new', { ...msg });
  (global as any).io?.to(`user:${me.id}`).emit('message:sent', { ...msg });
  res.json(msg);
}
