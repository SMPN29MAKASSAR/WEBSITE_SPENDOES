const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.portalLink.count();
  if (count === 0) {
    await prisma.portalLink.createMany({
      data: [
        { title: 'Layanan PTSP', description: 'Layanan Terpadu Satu Pintu', url: '/layanan-ptsp', icon: 'Building2', color: 'emerald', order: 1 },
        { title: 'Layanan Pengaduan', description: 'Sistem Pengaduan Masyarakat', url: '/pengaduan/buat', icon: 'Megaphone', color: 'amber', order: 2 },
        { title: 'Akademik', description: 'Informasi Akademik Siswa', url: 'https://portal.smpn29makassar.com', icon: 'BookOpen', color: 'emerald', order: 3 },
        { title: 'Ekstrakurikuler', description: 'Pengembangan Bakat & Minat Siswa', url: '/ekstrakurikuler', icon: 'Users', color: 'blue', order: 4 },
        { title: 'Berita & Artikel', description: 'Informasi & Pengumuman Terbaru', url: '/berita', icon: 'Globe', color: 'slate', order: 5 },
      ]
    });
    console.log('Seeded initial portal links!');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
