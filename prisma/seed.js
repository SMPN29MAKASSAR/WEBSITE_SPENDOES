const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Buat admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@sekolah.com" },
    update: {},
    create: {
      email: "admin@sekolah.com",
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin.email);

  // Buat default settings
  const defaultSettings = [
    { key: "hero_title", value: "Generasi Cerdas & Berkarakter" },
    { key: "hero_subtitle", value: "UPT SPF SMPN 29 Makassar menghadirkan ekosistem pembelajaran modern yang adaptif, inovatif, dan berbudaya lingkungan." },
    { key: "hero_banner_text", value: "Penerimaan Peserta Didik Baru (PPDB) 2026/2027 Telah Dibuka" },
    { key: "hero_cta1_text", value: "Kenali Lebih Dekat" },
    { key: "hero_cta1_link", value: "/profil" },
    { key: "hero_cta2_text", value: "Info Pendaftaran" },
    { key: "hero_cta2_link", value: "/ppdb" },
    { key: "headmaster_name", value: "Nama Kepala Sekolah" },
    { key: "headmaster_quote", value: "Website ini merupakan jendela informasi dan komunikasi antara sekolah, siswa, orang tua, dan masyarakat." },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log("Default settings created.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
