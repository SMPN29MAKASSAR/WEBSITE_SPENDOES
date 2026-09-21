/* eslint-disable */
// @ts-nocheck
import { prisma } from "@/lib/prisma";
import * as LucideIcons from "lucide-react";

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

  const KelasCard = ({ title, data, color, bgClass, headerText }: { title: string, data: any[], color: string, bgClass: string, headerText: string }) => (
    <div className={`rounded-3xl border-2 ${bgClass.replace('bg-', 'border-')} overflow-hidden bg-white shadow-xl flex flex-col h-full`}>
      <div className={`${bgClass} py-6 px-4 text-center border-b-2 ${bgClass.replace('bg-', 'border-')}`}>
        <div className="flex justify-center mb-2">
          <LucideIcons.GraduationCap className={`w-10 h-10 ${headerText}`} />
        </div>
        <h2 className={`text-2xl font-bold ${headerText}`}>Kelas {title}</h2>
        <p className={`text-sm mt-1 ${headerText} opacity-80`}>Pilih mata pelajaran di bawah ini</p>
      </div>
      <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow bg-slate-50">
        {data.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8 text-sm">Belum ada jadwal</div>
        ) : (
          data.map((item) => {
            const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Book;
            return (
              <a 
                key={item.id} 
                href={item.linkUjian} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-white ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-700 text-sm group-hover:text-black transition-colors">{item.mataPelajaran}</span>
                </div>
                <LucideIcons.ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
              </a>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-jakarta selection:bg-blue-200">
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-3/5 space-y-6 z-10 text-center md:text-left">
            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase border border-white/30">
              Asesmen Sumatif
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Link Ujian <br/><span className="text-cyan-300">Asesmen Sumatif</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">
              Pilih kelas dan mata pelajaran untuk mengakses link ujian. Kerjakan dengan jujur, disiplin, dan penuh tanggung jawab.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-300"><LucideIcons.CheckCircle2 className="w-5 h-5"/></div>
                <div className="text-left"><p className="font-bold text-sm leading-tight">Jujur</p><p className="text-[10px] text-blue-200">Integritas Utama</p></div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="bg-blue-500/20 p-2 rounded-full text-blue-300"><LucideIcons.BarChart3 className="w-5 h-5"/></div>
                <div className="text-left"><p className="font-bold text-sm leading-tight">Disiplin</p><p className="text-[10px] text-blue-200">Kunci Keberhasilan</p></div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="bg-orange-500/20 p-2 rounded-full text-orange-300"><LucideIcons.Trophy className="w-5 h-5"/></div>
                <div className="text-left"><p className="font-bold text-sm leading-tight">Berusaha</p><p className="text-[10px] text-blue-200">Raih Hasil Terbaik</p></div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="bg-purple-500/20 p-2 rounded-full text-purple-300"><LucideIcons.Users className="w-5 h-5"/></div>
                <div className="text-left"><p className="font-bold text-sm leading-tight">Maju Bersama</p><p className="text-[10px] text-blue-200">Menuju Masa Depan</p></div>
              </div>
            </div>
          </div>
          <div className="hidden md:block md:w-2/5 relative z-10 mt-12 md:mt-0">
             <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl transform rotate-3 shadow-2xl">
               <div className="bg-white p-6 rounded-2xl text-center shadow-inner">
                 <LucideIcons.ClipboardList className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                 <p className="font-handwriting text-2xl text-slate-800 font-bold -rotate-2">Kerjakan Dengan Jujur dan Optimal!</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <KelasCard title="7" data={kelas7} color="bg-blue-500" bgClass="bg-blue-50" headerText="text-blue-700" />
          <KelasCard title="8" data={kelas8} color="bg-emerald-500" bgClass="bg-emerald-50" headerText="text-emerald-700" />
          <KelasCard title="9" data={kelas9} color="bg-amber-500" bgClass="bg-amber-50" headerText="text-amber-700" />
        </div>
        
        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} UPT SPF SMPN 29 Makassar. Dibangun khusus untuk Asesmen Sumatif.</p>
        </div>
      </div>
    </div>
  );
}
