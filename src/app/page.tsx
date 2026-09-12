import Link from "next/link";
import { Building2, Megaphone, BookOpen, UserCircle, Globe, GraduationCap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PortalLinksClient from "./PortalLinksClient";

export const metadata = {
  title: "Portal Layanan | UPT SPF SMPN 29 Makassar",
};

export const dynamic = 'force-dynamic';

export default async function PortalPage() {
  const settings = await prisma.setting.findMany();
  const getSetting = (key: string, defaultValue: string) => 
    settings.find(s => s.key === key)?.value || defaultValue;

  const bgImage = getSetting('portal_bg', '/school_bg.jpg');
  const slogan = getSetting('portal_slogan', 'Ber-akhlak, Unggul, Mandiri, Peduli Lingkungan, dan Berwawasan Global');
  
  const portalLinks = await prisma.portalLink.findMany({
    orderBy: { order: 'asc' }
  });

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
        <PortalLinksClient links={portalLinks} />

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
