import Link from "next/link";
import { Building2, Megaphone, BookOpen, UserCircle, Globe, GraduationCap } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Portal Layanan | UPT SPF SMPN 29 Makassar",
};

export default async function PortalPage() {
  const settings = await prisma.setting.findMany();
  const getSetting = (key: string, defaultValue: string) => 
    settings.find(s => s.key === key)?.value || defaultValue;

  const bgImage = getSetting('portal_bg', '/school_bg.jpg');
  const slogan = getSetting('portal_slogan', 'Ber-akhlak, Unggul, Mandiri, Peduli Lingkungan, dan Berwawasan Global');

  return (
    <div 
      className="min-h-screen relative flex flex-col items-center justify-center p-6 font-jakarta overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(4, 47, 46, 0.9), rgba(6, 78, 59, 0.8)), url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-[30rem] h-[30rem] bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center text-center">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-white p-4 rounded-full shadow-2xl mb-6">
            <GraduationCap className="w-16 h-16 text-emerald-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
            UPT SPF SMPN 29 Makassar
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl font-medium tracking-wide">
            {slogan}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 w-full">
            <div className="h-px bg-emerald-400/50 flex-1 max-w-[100px]"></div>
            <span className="text-emerald-300 font-semibold uppercase tracking-widest text-sm">Portal Layanan Digital</span>
            <div className="h-px bg-emerald-400/50 flex-1 max-w-[100px]"></div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="flex flex-wrap justify-center gap-6 w-full mb-12">
          {/* Card 1 */}
          <Link href="/layanan-ptsp" className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] group relative bg-emerald-900/40 backdrop-blur-md border border-emerald-500/30 p-6 rounded-2xl overflow-hidden hover:bg-emerald-800/60 transition-all duration-300 shadow-xl hover:-translate-y-1">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 flex flex-col text-left h-full">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl mb-1">Layanan PTSP</h3>
              <p className="text-emerald-200 text-sm mb-6 flex-grow">Layanan Terpadu Satu Pintu</p>
              <div className="flex items-center justify-between text-white/70 text-sm mt-auto">
                <span>Klik untuk melihat layanan</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="transform rotate-0">&rarr;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/pengaduan" className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] group relative bg-amber-600/90 backdrop-blur-md border border-amber-500/30 p-6 rounded-2xl overflow-hidden hover:bg-amber-600 transition-all duration-300 shadow-xl hover:-translate-y-1">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <Megaphone className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 flex flex-col text-left h-full">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl mb-1">Aduan & Informasi</h3>
              <p className="text-amber-100 text-sm mb-6 flex-grow">Sistem Pengaduan Masyarakat</p>
              <div className="flex items-center justify-between text-white/70 text-sm mt-auto">
                <span>Klik untuk melihat layanan</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="transform rotate-0">&rarr;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="https://portal.smpn29makassar.com" target="_blank" rel="noopener noreferrer" className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] group relative bg-emerald-900/40 backdrop-blur-md border border-emerald-500/30 p-6 rounded-2xl overflow-hidden hover:bg-emerald-800/60 transition-all duration-300 shadow-xl hover:-translate-y-1">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 flex flex-col text-left h-full">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl mb-1">Akademik</h3>
              <p className="text-emerald-200 text-sm mb-6 flex-grow">Informasi Akademik Siswa</p>
              <div className="flex items-center justify-between text-white/70 text-sm mt-auto">
                <span>Klik untuk melihat layanan</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="transform rotate-0">&rarr;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 4 */}
          <Link href="/ekstrakurikuler" className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] group relative bg-indigo-900/40 backdrop-blur-md border border-indigo-500/30 p-6 rounded-2xl overflow-hidden hover:bg-indigo-800/60 transition-all duration-300 shadow-xl hover:-translate-y-1">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <UserCircle className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 flex flex-col text-left h-full">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <UserCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl mb-1">Ekstrakurikuler</h3>
              <p className="text-indigo-200 text-sm mb-6 flex-grow">Pengembangan Bakat & Minat Siswa</p>
              <div className="flex items-center justify-between text-white/70 text-sm mt-auto">
                <span>Klik untuk melihat layanan</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="transform rotate-0">&rarr;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 5 */}
          <Link href="/berita" className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] group relative bg-cyan-900/40 backdrop-blur-md border border-cyan-500/30 p-6 rounded-2xl overflow-hidden hover:bg-cyan-800/60 transition-all duration-300 shadow-xl hover:-translate-y-1">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <Globe className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 flex flex-col text-left h-full">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl mb-1">Berita & Artikel</h3>
              <p className="text-cyan-200 text-sm mb-6 flex-grow">Informasi & Pengumuman Terbaru</p>
              <div className="flex items-center justify-between text-white/70 text-sm mt-auto">
                <span>Klik untuk melihat layanan</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="transform rotate-0">&rarr;</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-4">
          <Link href="/beranda" className="flex items-center justify-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium rounded-lg border border-white/20 transition-colors">
            <Globe className="w-5 h-5" />
            Ke Tampilan Website
          </Link>
          <Link href="/kontak" className="flex items-center justify-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-lg transition-colors">
            <UserCircle className="w-5 h-5" />
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  );
}
