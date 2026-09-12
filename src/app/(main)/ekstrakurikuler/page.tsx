import { prisma } from "@/lib/prisma";
import { Tent } from "lucide-react";

export const metadata = { title: "Ekstrakurikuler | UPT SPF SMPN 29 Makassar" };

export const dynamic = 'force-dynamic';

export default async function EkstrakurikulerPage() {
  const ekstrakurikuler = await prisma.ekstrakurikuler.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="flex flex-col items-center w-full pb-20 bg-slate-50">
      <section className="w-full bg-slate-900 text-white pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">Daftar Ekstrakurikuler</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Wadah pengembangan minat, bakat, dan potensi diri siswa di luar jam pelajaran akademik.</p>
        </div>
      </section>
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        {ekstrakurikuler.length === 0 ? <div className="text-center py-12 text-slate-500">Belum ada data Ekstrakurikuler. Anda dapat menambahkannya melalui Dashboard Admin.</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ekstrakurikuler.map((eks, idx) => {
              const colors = ["bg-emerald-50", "bg-teal-50", "bg-green-50"];
              const color = colors[idx % colors.length];
              return (
                <div key={eks.id} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 transition-all flex flex-col group">
                  <div className="flex items-center gap-4 mb-4">
                    {eks.imageUrl ? <img src={eks.imageUrl} alt={eks.nama} className="w-14 h-14 rounded-2xl object-cover shrink-0 group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" /> : <div className={`${color} shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center`}><Tent className="w-8 h-8 opacity-60" /></div>}
                    <h3 className="text-lg font-bold font-jakarta text-slate-900">{eks.nama}</h3>
                  </div>
                  <p className="text-slate-600 text-sm flex-grow">{eks.deskripsi}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
