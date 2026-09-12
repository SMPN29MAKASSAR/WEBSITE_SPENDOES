import { prisma } from "@/lib/prisma";
import Image from "next/image";
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ekstrakurikuler.map((eks, idx) => {
              const colors = [
                "from-emerald-500 to-teal-600",
                "from-teal-500 to-emerald-600",
                "from-green-500 to-emerald-600",
                "from-emerald-600 to-green-600"
              ];
              const gradient = colors[idx % colors.length];
              
              return (
                <div key={eks.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col group overflow-hidden hover:-translate-y-1">
                  {/* Bagian Gambar / Header Kotak */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    {eks.imageUrl ? (
                      <Image 
                        src={eks.imageUrl} 
                        alt={eks.nama} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <Tent className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    {/* Efek gradient bawah agar menyatu dengan konten */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Bagian Informasi Text */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold font-jakarta text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {eks.nama}
                      </h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                      {eks.deskripsi}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
