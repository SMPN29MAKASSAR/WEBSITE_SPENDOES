/* eslint-disable */
// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { CalendarDays, BookOpen, PartyPopper, CalendarClock, Info } from "lucide-react";

export const revalidate = 60;

export default async function KalenderPage() {
  const agendas = await prisma.agenda.findMany({ 
    orderBy: { startDate: "asc" }, 
  });
  
  // Pisahkan berdasarkan semester
  // Ganjil: Juli (7) - Desember (12)
  // Genap: Januari (1) - Juni (6)
  const semesterGanjil = agendas.filter(a => {
    const month = new Date(a.startDate).getMonth() + 1;
    return month >= 7 && month <= 12;
  });

  const semesterGenap = agendas.filter(a => {
    const month = new Date(a.startDate).getMonth() + 1;
    return month >= 1 && month <= 6;
  });
  
  const getJenisBadge = (jenis: string) => {
    if (jenis.toLowerCase().includes("libur")) return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wide"><PartyPopper className="w-3.5 h-3.5"/> Libur</span>;
    if (jenis.toLowerCase().includes("ujian")) return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wide"><BookOpen className="w-3.5 h-3.5"/> Ujian</span>;
    return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide"><CalendarDays className="w-3.5 h-3.5"/> Kegiatan</span>;
  };

  const formatDate = (start: Date, end?: Date | null) => {
    const d1 = new Date(start).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    if (end && new Date(start).getTime() !== new Date(end).getTime()) {
      const d2 = new Date(end).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
      return `${d1} - ${d2}`;
    }
    return d1;
  };

  const renderTable = (data: any[], title: string, subtitle: string) => (
    <div className="mb-16">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-jakarta text-slate-900 flex items-center gap-3">
          <CalendarClock className="w-7 h-7 text-emerald-600" />
          {title}
        </h2>
        <p className="text-slate-500">{subtitle}</p>
      </div>

      {data.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-500">Belum ada agenda untuk semester ini.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
              <thead className="bg-emerald-50 text-emerald-900 font-jakarta border-b border-emerald-100">
                <tr>
                  <th className="px-6 py-4 font-bold w-1/4">TANGGAL</th>
                  <th className="px-6 py-4 font-bold w-1/3">NAMA KEGIATAN</th>
                  <th className="px-6 py-4 font-bold w-1/6">JENIS</th>
                  <th className="px-6 py-4 font-bold">KETERANGAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.map((agenda) => (
                  <tr key={agenda.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-slate-900">
                      {formatDate(agenda.startDate, agenda.endDate)}
                    </td>
                    <td className="px-6 py-5 font-medium">
                      {agenda.title}
                    </td>
                    <td className="px-6 py-5">
                      {getJenisBadge(agenda.jenis)}
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-sm">
                      {agenda.deskripsi ? agenda.deskripsi : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-4 font-sans relative">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-80 bg-emerald-900 overflow-hidden pointer-events-none">
        <div className="absolute opacity-10 right-0 top-0 translate-x-1/3 -translate-y-1/4">
          <CalendarClock className="w-96 h-96 text-white" />
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16 pt-8 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold font-jakarta mb-4">Kalender Akademik</h1>
          <p className="text-lg text-emerald-100 max-w-2xl">
            Jadwal lengkap kegiatan, hari libur, dan ujian SMPN 29 Makassar. Disusun berdasarkan semester untuk memudahkan pencarian agenda.
          </p>
        </div>
        
        {renderTable(semesterGanjil, "Semester Ganjil", "Bulan Juli s.d. Desember")}
        {renderTable(semesterGenap, "Semester Genap", "Bulan Januari s.d. Juni")}

      </div>
    </div>
  );
}
