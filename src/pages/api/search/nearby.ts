import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/db';

function haversine(lat1:number, lon1:number, lat2:number, lon2:number) {
  const R = 6371e3;
  const toRad = (d:number)=>d*Math.PI/180;
  const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const lat = Number(req.query.lat); const lng = Number(req.query.lng);
  const radius = Number(req.query.radius || 5000);
  const type = String(req.query.type || 'mating');
  const table = type==='alerts'? prisma.petAlert : type==='listings'? prisma.listing : prisma.matingOffer;
  const rows:any[] = await table.findMany({ where: { geoLat: { not: null }, geoLng: { not: null } } });
  const filtered = rows.filter((r:any)=> haversine(lat, lng, r.geoLat!, r.geoLng!) <= radius);
  res.json(filtered);
}
