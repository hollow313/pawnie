/* eslint-disable */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
async function main(){
  const hash = await bcrypt.hash('demo1234', 10);
  const u = await prisma.user.upsert({
    where:{email:'demo@pawnie.local'},
    update:{},
    create:{ email:'demo@pawnie.local', passwordHash:hash, isPro:true, proName:'Élevage Demo', proSiret:'12345678900011', kycVerified:true }
  });
  const p = await prisma.pet.create({ data:{ ownerId:u.id, name:'Nala', species:'DOG', sex:'FEMALE' } });
  await prisma.matingOffer.create({ data:{ petId:p.id, title:'Saillie Golden, lignée LOF', price:15000, city:'Toulouse', geoLat:43.6045, geoLng:1.4440 } });
  await prisma.petAlert.create({ data:{ creatorId:u.id, type:'LOST', title:'Chien perdu Rangueil', city:'Toulouse', geoLat:43.5789, geoLng:1.4663 } });
  await prisma.listing.create({ data:{ sellerId:u.id, title:'Chatons British Shorthair', price:90000, isProfessional:true, species:'CAT', city:'Blagnac', geoLat:43.6321, geoLng:1.3933 } });
}
main().finally(()=>prisma.$disconnect());
