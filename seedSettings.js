const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const settings = [
  { key: 'hero_title', value: 'Generasi Cerdas & Berkarakter' },
  { key: 'hero_subtitle', value: 'UPT SPF SMPN 29 Makassar menghadirkan ekosistem pembelajaran modern yang adaptif, inovatif, dan berbudaya lingkungan.' },
  { key: 'headmaster_name', value: 'Nama Kepala Sekolah, S.Pd., M.Pd.' },
  { key: 'headmaster_quote', value: 'Website ini merupakan jendela informasi dan wujud nyata transformasi digital SMPN 29 Makassar.' },
  { key: 'school_address', value: 'Jl. Pendidikan No. 29, Makassar' },
  { key: 'school_phone', value: '(0411) 123456' },
  { key: 'school_email', value: 'info@smpn29makassar.sch.id' },
];

async function main() {
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value }
    });
  }
  console.log('Settings seeded');
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
