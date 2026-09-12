import Link from "next/link";
import { ArrowRight, BookOpen, Users, Leaf, Trophy, ArrowUpRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Newspaper, Calendar } from "lucide-react";

export const dynamic = 'force-dynamic';

async function ProgramKamiList() {
  const programs = await prisma.program.findMany({ orderBy: { createdAt: "asc" } });
  if (programs.length === 0) return <div className="text-center text-slate-500 py-10 w-full col-span-full">Belum ada program yang ditambahkan dari admin.</div>;
  const colors = [{ bg: "bg-emerald-50", text: "text-emerald-600", hover: "hover:border-emerald-100" }, { bg: "bg-teal-50", text: "text-teal-600", hover: "hover:border-teal-100" }, { bg: "bg-green-50", text: "text-green-600", hover: "hover:border-green-100" }];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {programs.map((prog: any, idx: number) => {
        const color = colors[idx % colors.length];
        const isEmoji = prog.icon && prog.icon.length <= 4;
        
        const CardContent = (
          <>
            <div className={`${color.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0`}>
              {isEmoji ? (
                <span className="text-2xl">{prog.icon}</span>
              ) : (
                <LucideIcons.BookOpen className={`w-7 h-7 ${color.text}`} />
              )}
            </div>
            <h4 className="text-xl font-bold font-jakarta text-slate-900 mb-3">{prog.nama}</h4>
            <p className="text-slate-600 mb-6 flex-grow">{prog.deskripsi}</p>
            {prog.linkUrl && (
              <div className="mt-auto flex items-center text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                Lihat Detail <LucideIcons.ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </>
        );

        const cardClasses = `group flex flex-col h-full bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-200/60 transition-all duration-300 ${color.hover} hover:-translate-y-1`;

        if (prog.linkUrl) {
          return (
            <Link key={prog.id} href={prog.linkUrl} className={cardClasses}>
              {CardContent}
            </Link>
          );
        }

        return (
          <div key={prog.id} className={cardClasses}>
            {CardContent}
          </div>
        );
      })}
    </div>
  );
}

async function BeritaTerbaruSection() {
  const posts = await prisma.post.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <p className="text-slate-500">Belum ada berita yang dipublikasikan saat ini.</p>
      </div>
    );
  }

  const featuredPosts = posts.slice(0, 2);
  const sidebarPosts = posts.slice(2, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Featured News Cards (Left, 2 columns on desktop) */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {featuredPosts.map((post) => (
          <Link 
            key={post.id} 
            href={`/berita/${post.id}`} 
            className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
              {post.imageUrl ? (
                <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <Newspaper className="w-12 h-12 text-white/30" />
                </div>
              )}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-md">
                  Berita Umum
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span>{format(new Date(post.createdAt), "dd MMM yyyy", { locale: id })}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-jakarta text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug mb-2.5">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed flex-grow">
                {post.content}
              </p>
              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-emerald-600 group-hover:text-orange-600 transition-colors">
                <span>Baca</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-200 inline-block font-bold">
                  &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent News Sidebar (Right) */}
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
            <h3 className="font-bold font-jakarta text-slate-900 text-base">Berita Terkini</h3>
          </div>
          <Link href="/berita" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
            Lihat Semua
          </Link>
        </div>
        <div className="space-y-4 divide-y divide-slate-100">
          {(sidebarPosts.length > 0 ? sidebarPosts : featuredPosts).map((item, idx) => (
            <Link
              key={item.id}
              href={`/berita/${item.id}`}
              className={`group flex items-start gap-3.5 ${idx > 0 ? "pt-4" : ""}`}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 overflow-hidden relative group-hover:border-emerald-300 transition-all">
                <Newspaper className="w-6 h-6 text-emerald-600/70 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5 font-medium">
                  <Calendar className="w-3 h-3 text-orange-500" />
                  <span>{format(new Date(item.createdAt), "dd MMM yyyy", { locale: id })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const settings = await prisma.setting.findMany();
  const getSetting = (key: string, defaultValue: string) => 
    settings.find(s => s.key === key)?.value || defaultValue;

  const guruCount = await prisma.pegawai.count();
  const ekskulCount = await prisma.ekstrakurikuler.count();
  const prestasiCount = await prisma.prestasi.count();

  const siswaK7L = parseInt(getSetting('siswa_k7_l', '0'), 10);
  const siswaK7P = parseInt(getSetting('siswa_k7_p', '0'), 10);
  const siswaK8L = parseInt(getSetting('siswa_k8_l', '0'), 10);
  const siswaK8P = parseInt(getSetting('siswa_k8_p', '0'), 10);
  const siswaK9L = parseInt(getSetting('siswa_k9_l', '0'), 10);
  const siswaK9P = parseInt(getSetting('siswa_k9_p', '0'), 10);
  const totalSiswa = siswaK7L + siswaK7P + siswaK8L + siswaK8P + siswaK9L + siswaK9P;

  const heroBg = getSetting('hero_bg', '');

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Modern Hero Section */}
      <section 
        className="relative w-full overflow-hidden bg-slate-50 pt-16 pb-32 lg:pt-32 lg:pb-40 bg-cover bg-center"
        style={heroBg ? { backgroundImage: `url('${heroBg}')` } : {}}
      >
        {/* Overlays */}
        {heroBg ? (
          <div className="absolute inset-0 bg-white/60 z-0"></div>
        ) : (
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-24 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-24 left-20 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        )}

        <div className="container relative z-10 mx-auto px-6 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-medium text-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600"></span>
            {getSetting("hero_banner_text", "Penerimaan Peserta Didik Baru (PPDB) 2026/2027 Telah Dibuka")}
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold font-jakarta text-slate-900 tracking-tight leading-[1.1] mb-8">
            Membangun Masa Depan <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              {getSetting('hero_title', 'Generasi Cerdas & Berkarakter')}
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            {getSetting('hero_subtitle', 'UPT SPF SMPN 29 Makassar menghadirkan ekosistem pembelajaran modern yang adaptif, inovatif, dan berbudaya lingkungan.')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href={getSetting("hero_cta1_link", "/profil")} 
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              {getSetting("hero_cta1_text", "Kenali Lebih Dekat")} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href={getSetting("hero_cta2_link", "/ppdb")} 
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-full font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              {getSetting("hero_cta2_text", "Info Pendaftaran")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Highlight Strip */}
      <section className="w-full -mt-16 z-20 relative px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 lg:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
              <div className="text-center px-4">
                <p className="text-4xl font-bold font-jakarta text-emerald-600 mb-2">{totalSiswa || 'A'}</p>
                <p className="text-sm text-slate-500 font-medium">{totalSiswa ? 'Siswa Aktif' : 'Akreditasi Sekolah'}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl font-bold font-jakarta text-slate-900 mb-2">{guruCount}+</p>
                <p className="text-sm text-slate-500 font-medium">Guru Profesional</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl font-bold font-jakarta text-slate-900 mb-2">{ekskulCount}</p>
                <p className="text-sm text-slate-500 font-medium">Ekstrakurikuler</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl font-bold font-jakarta text-slate-900 mb-2">{prestasiCount}</p>
                <p className="text-sm text-slate-500 font-medium">Prestasi Diraih</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah - Split Layout */}
      <section className="container mx-auto px-6 py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/5] rounded-3xl bg-slate-200 overflow-hidden relative shadow-2xl">
              {getSetting('headmaster_photo', '') ? (
                <Image src={getSetting('headmaster_photo', '')} alt="Kepala Sekolah" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 to-slate-100 flex items-center justify-center">
                  <Users className="w-32 h-32 text-slate-400 opacity-20" />
                  <span className="absolute text-slate-500 font-medium">Foto Kepala Sekolah</span>
                </div>
              )}
            </div>
            {/* Decorative Card */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
              <div className="flex gap-4 items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Sekolah Adiwiyata</p>
                  <p className="text-xs text-slate-500">Berbudaya Lingkungan</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-jakarta text-slate-900 tracking-tight mb-6">
              Sambutan Kepala Sekolah
            </h2>
            <div className="w-20 h-1.5 bg-emerald-500 rounded-full mb-8"></div>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 italic relative">
              <span className="absolute -top-4 -left-4 text-6xl text-emerald-100 font-serif leading-none">&quot;</span>
              {getSetting('headmaster_quote', 'Website ini merupakan jendela informasi dan komunikasi antara sekolah, siswa, orang tua, dan masyarakat. Kami terus berupaya meningkatkan kualitas layanan pendidikan yang inovatif dan berwawasan lingkungan.')}
              <span className="absolute -bottom-8 -right-4 text-6xl text-emerald-100 font-serif leading-none">&quot;</span>
            </p>
            <div>
              <p className="text-lg font-bold text-slate-900">{getSetting('headmaster_name', 'Nama Kepala Sekolah')}</p>
              <p className="text-slate-500">Kepala UPT SPF SMPN 29 Makassar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Unggulan - Card Grid */}
      <section className="w-full bg-slate-50 py-24 lg:py-32 border-t border-slate-200/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-3">Program Kami</h2>
            <h3 className="text-3xl lg:text-4xl font-bold font-jakarta text-slate-900 mb-4">Pilar Pendidikan SMPN 29</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">Pendekatan holistik kami memastikan setiap siswa mendapatkan kesempatan terbaik untuk berkembang sesuai potensi mereka.</p>
          </div>
          <ProgramKamiList />
        </div>
      </section>

      {/* Berita Terbaru Section */}
      <section className="py-24 bg-slate-50/70 w-full border-t border-slate-200/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
                <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
                Warta &amp; Informasi Terkini
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold font-jakarta text-slate-900 tracking-tight mb-3">
                Berita Terbaru
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                Ikuti kabar terkini, prestasi, inovasi guru, dan kegiatan sekolah dari SMPN 29 Makassar.
              </p>
            </div>
            <Link 
              href="/berita" 
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-sm hover:shadow transition-all group shrink-0 gap-2 text-sm"
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid Layout: Main Featured Cards + Recent News Sidebar */}
          <BeritaTerbaruSection />
        </div>
      </section>
    </div>
  );
}
