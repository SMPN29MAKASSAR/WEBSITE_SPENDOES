/* eslint-disable */
// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { CalendarDays, BookOpen, PartyPopper } from "lucide-react";

export const revalidate = 60;

export default async function KalenderPage() {
  const agendas = await prisma.agenda.findMany({ 
    orderBy: { startDate: "asc" }, 
    where: { startDate: { gte: new Date(new Date().setHours(0,0,0,0)) } } 
  });
  
  const getIcon = (jenis: string) => {
    if (jenis.toLowerCase().includes("libur")) return <PartyPopper className="w-6 h-6 text-rose-500" />;
    if (jenis.toLowerCase().includes("ujian")) return <BookOpen className="w-6 h-6 text-amber-500" />;
    return <CalendarDays className="w-6 h-6 text-blue-500" />;
  };
  
  const getColor = (jenis: string) => {
    if (jenis.toLowerCase().includes("libur")) return "bg-rose-50 border-rose-200 text-rose-800 shadow-rose-100";
    if (jenis.toLowerCase().includes("ujian")) return "bg-amber-50 border-amber-200 text-amber-800 shadow-amber-100";
    return "bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100";
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold font-jakarta text-slate-900 mb-6 drop-shadow-sm">Timeline Kalender Akademik</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Pantau jadwal ujian, hari libur, dan kegiatan penting lainnya di SMPN 29 Makassar.</p>
        </div>
        
        <div className="relative">
          {/* Main Vertical Line (Desktop: Center, Mobile: Left) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 rounded-full"></div>

          {agendas.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm relative z-10 mx-12"><p className="text-slate-500 font-medium">Belum ada agenda terdekat.</p></div>
          ) : (
            <div className="space-y-12">
              {agendas.map((agenda, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={agenda.id} className={`relative flex items-center justify-between md:justify-normal ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                    
                    {/* Center Dot */}
                    <div className="absolute left-8 md:left-1/2 w-12 h-12 -translate-x-1/2 rounded-full bg-white border-4 border-slate-100 shadow-sm flex items-center justify-center z-20">
                      {getIcon(agenda.jenis)}
                    </div>

                    {/* Empty Space for the other side on desktop */}
                    <div className="hidden md:block w-5/12"></div>

                    {/* Content Card */}
                    <div className="w-full md:w-5/12 pl-20 md:pl-0">
                      <div className={`p-8 rounded-3xl border ${getColor(agenda.jenis)} shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-white/70 backdrop-blur-sm rounded-lg text-xs font-bold shadow-sm uppercase tracking-wider">{agenda.jenis}</span>
                        </div>
                        <h3 className="text-2xl font-bold font-jakarta mb-2 text-slate-900">{agenda.title}</h3>
                        
                        <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold text-sm">
                          <CalendarDays className="w-4 h-4 opacity-70" />
                          <span>
                            {new Date(agenda.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            {agenda.endDate && agenda.endDate.getTime() !== agenda.startDate.getTime() ? ` s.d. ${new Date(agenda.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}` : ""}
                          </span>
                        </div>

                        {agenda.deskripsi && (
                          <p className="opacity-90 leading-relaxed text-slate-700 text-sm">{agenda.deskripsi}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
