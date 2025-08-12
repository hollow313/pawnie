import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { prisma } from '@/src/lib/db';

export async function getUserFromReq(req: NextApiRequest, res: NextApiResponse){
  const cookies = req.headers.cookie || '';
  const token = parse(cookies)['token'];
  if(!token){ res.status(401).json({message:'unauthorized'}); return null; }
  try{
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if(!user) { res.status(401).json({message:'unauthorized'}); return null; }
    return user;
  }catch(e){ res.status(401).json({message:'unauthorized'}); return null; }
}
