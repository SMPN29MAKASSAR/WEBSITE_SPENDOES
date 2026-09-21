/* eslint-disable */
// @ts-nocheck
import { prisma } from "@/lib/prisma";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Portal Asesmen Sumatif | SMPN 29 Makassar",
};

export const revalidate = 60; // Cache for 60 seconds

export default async function AsesmenPage() {
  const data = await prisma.asesmen.findMany({
    orderBy: [
      { kelas: 'asc' },
      { order: 'asc' },
      { mataPelajaran: 'asc' }
    ]
  });

  const kelas7 = data.filter(d => d.kelas === "7");
  const kelas8 = data.filter(d => d.kelas === "8");
  const kelas9 = data.filter(d => d.kelas === "9");

  const KelasCard = ({ title, data, gradientFrom, gradientTo, iconColor, textColor }: { title: string, data: any[], gradientFrom: string, gradientTo: string, iconColor: string, textColor: string }) => (
    <div className="relative group flex flex-col h-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
      {/* Card Header */}
      <div className={`relative px-8 pt-10 pb-8 bg-gradient-to-br ${gradientFrom} ${gradientTo} border-b border-white/50 overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
          <LucideIcons.GraduationCap className={`w-32 h-32 ${iconColor}`} />
        </div>
        <div className="relative z-10">
          <div className={`w-14 h-14 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-sm ${iconColor}`}>
            <LucideIcons.GraduationCap className="w-8 h-8" />
          </div>
          <h2 className={`text-3xl font-extrabold ${textColor} tracking-tight`}>Kelas {title}</h2>
          <p className={`text-sm mt-2 font-medium ${textColor} opacity-80`}>Pilih mata pelajaran di bawah ini</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-grow bg-slate-50/50 flex flex-col gap-3">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <LucideIcons.CalendarOff className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">Belum ada jadwal asesmen</p>
          </div>
        ) : (
          data.map((item) => {
            const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Book;
            return (
              <a 
                key={item.id} 
                href={item.linkUjian} 
                target="_blank" 
                rel="noreferrer"
                className="group/btn relative flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 active:scale-[0.98] overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-2.5 rounded-xl text-white ${iconColor.replace('text-', 'bg-').replace('-600', '-500')} shadow-inner`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-700 group-hover/btn:text-slate-900 transition-colors">{item.mataPelajaran}</span>
                </div>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 group-hover/btn:bg-white transition-colors relative z-10 ${textColor}`}>
                  <LucideIcons.ArrowRight className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-jakarta selection:bg-blue-200">
      {/* MODERN HERO SECTION */}
      <div className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-slate-900 rounded-b-[3rem] shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-blue-600/20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-cyan-500/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[20%] right-[20%] w-[20%] h-[30%] rounded-full bg-emerald-500/20 blur-[80px] animate-pulse" style={{ animationDelay: '4s' }}></div>
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/15 transition-colors">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-bold tracking-widest text-cyan-50 uppercase">Portal Ujian Sekolah</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Asesmen <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Sumatif</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              Akses cepat menuju link ujian kelas 7, 8, dan 9. Kerjakan dengan teliti, jujur, dan penuh tanggung jawab.
            </p>

            {/* Value Badges */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400"><LucideIcons.CheckCircle2 className="w-5 h-5"/></div>
                <div className="text-left"><p className="font-bold text-white text-sm leading-none mb-1">Jujur</p><p className="text-[11px] text-slate-400 font-medium">Integritas Utama</p></div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400"><LucideIcons.BarChart3 className="w-5 h-5"/></div>
                <div className="text-left"><p className="font-bold text-white text-sm leading-none mb-1">Disiplin</p><p className="text-[11px] text-slate-400 font-medium">Kunci Keberhasilan</p></div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                <div className="bg-amber-500/20 p-2 rounded-xl text-amber-400"><LucideIcons.Trophy className="w-5 h-5"/></div>
                <div className="text-left"><p className="font-bold text-white text-sm leading-none mb-1">Berusaha</p><p className="text-[11px] text-slate-400 font-medium">Raih Hasil Terbaik</p></div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - CLASS CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 lg:-mt-24 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <KelasCard 
            title="7" 
            data={kelas7} 
            gradientFrom="from-blue-50" 
            gradientTo="to-blue-100" 
            iconColor="text-blue-600"
            textColor="text-blue-900"
          />
          <KelasCard 
            title="8" 
            data={kelas8} 
            gradientFrom="from-emerald-50" 
            gradientTo="to-emerald-100" 
            iconColor="text-emerald-600"
            textColor="text-emerald-900"
          />
          <KelasCard 
            title="9" 
            data={kelas9} 
            gradientFrom="from-amber-50" 
            gradientTo="to-amber-100" 
            iconColor="text-amber-600"
            textColor="text-amber-900"
          />
        </div>
        
        <div className="mt-20 flex flex-col items-center justify-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold text-sm shadow-sm hover:shadow-md hover:bg-slate-50 transition-all active:scale-95">
            <LucideIcons.ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <p className="text-center text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} UPT SPF SMPN 29 Makassar. Dibangun khusus untuk Asesmen Sumatif.
          </p>
        </div>
      </div>
    </div>
  );
}
