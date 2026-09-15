import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PenTool } from "lucide-react";

export const revalidate = 60;

export default async function MadingPage() {
  const works = await prisma.karyaSiswa.findMany({ 
    where: { status: "DISETUJUI" },
    orderBy: { createdAt: "desc" } 
  });
  
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold font-jakarta text-slate-900 mb-6">Mading Digital</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">Wadah kreativitas dan literasi siswa-siswi SMPN 29 Makassar. Jelajahi berbagai karya inspiratif dari para penerus bangsa.</p>
          <Link href="/kesiswaan/mading/buat" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1">
            <PenTool className="w-5 h-5" />
            Kirim Karya Kamu
          </Link>
        </div>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {works.map(item => (
            <div key={item.id} className="break-inside-avoid bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 group">
              {item.imageUrl && (
                <div className="relative overflow-hidden">
                  <img src={item.imageUrl} alt={item.judul} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-indigo-100">{item.kategori}</span>
                  {item.kelas && <span className="text-xs text-slate-400 font-medium">Kelas {item.kelas}</span>}
                </div>
                <h3 className="text-2xl font-bold font-jakarta text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{item.judul}</h3>
                <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">??</span>
                  Oleh: {item.namaPenulis}
                </p>
                {item.content && (
                  <div className="prose prose-sm text-slate-600 prose-p:leading-relaxed">
                    <p className="whitespace-pre-wrap">{item.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {works.length === 0 && <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-100">Belum ada karya siswa yang dipublikasikan.</div>}
      </div>
    </div>
  );
}
