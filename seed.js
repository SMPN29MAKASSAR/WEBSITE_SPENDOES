const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.user.create({
    data: {
      name: 'Admin SMPN 29',
      email: 'admin@smpn29makassar.sch.id',
      role: 'ADMIN'
    }
  });
  console.log('Admin user created');
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
