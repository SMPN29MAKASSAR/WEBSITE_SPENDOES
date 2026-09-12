import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Trophy } from "lucide-react";

export const revalidate = 0;

export const metadata = {
  title: "Galeri Prestasi | SMPN 29 Makassar",
};

export default async function GaleriPrestasiPage() {
  const prestasiList = await prisma.prestasi.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-jakarta text-slate-900 mb-4 tracking-tight">
            Galeri Prestasi Siswa
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Berbagai pencapaian dan prestasi gemilang yang berhasil diraih oleh siswa-siswi kebanggaan SMPN 29 Makassar.
          </p>
        </div>
        
        {prestasiList.length === 0 ? (
          <div className="text-center text-slate-500 py-16 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p>Belum ada data prestasi yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {prestasiList.map((prestasi) => (
              <div key={prestasi.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="relative h-60 w-full bg-slate-100 overflow-hidden">
                  {prestasi.imageUrl ? (
                    <img
                      src={prestasi.imageUrl}
                      alt={prestasi.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
                      <Trophy className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  {prestasi.tingkat && (
                    <div className="absolute top-4 left-4 bg-emerald-600/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      Tingkat {prestasi.tingkat}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    Tahun {prestasi.tahun}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{prestasi.nama}</h3>
                  {prestasi.deskripsi && (
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {prestasi.deskripsi}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
