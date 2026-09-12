const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function update() {
  const existing = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { email: 'admin@sekolah.com' }
    });
    console.log('Admin email updated');
  } else {
    await prisma.user.create({
      data: { name: 'Admin Sekolah', email: 'admin@sekolah.com', role: 'ADMIN' }
    });
    console.log('Admin created');
  }
}
update().catch(console.error).finally(() => prisma.$disconnect());
