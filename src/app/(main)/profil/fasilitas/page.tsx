/* eslint-disable */
// @ts-nocheck
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function FasilitasPage() {
  const fasilitas = await prisma.fasilitas.findMany({ orderBy: { createdAt: "desc" } });
  
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold font-jakarta text-slate-900 mb-4">Etalase Fasilitas Sekolah</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Sarana dan prasarana penunjang yang kami sediakan untuk memberikan pengalaman belajar yang optimal bagi seluruh siswa.</p>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {fasilitas.map(item => (
            <div key={item.id} className="break-inside-avoid bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.nama} className="w-full h-auto object-cover" />
              ) : (
                <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400">Tidak ada gambar</div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold font-jakarta text-slate-800 mb-2">{item.nama}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

