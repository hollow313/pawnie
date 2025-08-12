import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const mating = await prisma.matingOffer.findMany({ orderBy:{ createdAt:'desc' }, take:10 });
  const alerts = await prisma.petAlert.findMany({ orderBy:{ createdAt:'desc' }, take:10 });
  const listings = await prisma.listing.findMany({ orderBy:{ createdAt:'desc' }, take:10 });
  const items = [
    ...mating.map(m=>({ id:m.id, type:'SAILLIE', title:m.title, description:m.description })),
    ...alerts.map(a=>({ id:a.id, type:'ALERTE', title:a.title, description:a.description })),
    ...listings.map(l=>({ id:l.id, type:'ANNONCE', title:l.title, description:l.description })),
  ].sort(()=> Math.random()-0.5).slice(0,20);
  res.json({ items });
}
