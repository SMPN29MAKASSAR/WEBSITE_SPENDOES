import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Tent, Calendar, MapPin, User, FileText, ChevronDown } from "lucide-react";

export const metadata = { title: "Ekstrakurikuler | UPT SPF SMPN 29 Makassar" };

export const dynamic = 'force-dynamic';

export default async function EkstrakurikulerPage() {
  const ekstrakurikuler = await prisma.ekstrakurikuler.findMany({ 
    orderBy: { createdAt: "asc" },
    include: { pembina: true } 
  });

  return (
    <div className="flex flex-col items-center w-full pb-20 bg-slate-50">
      <section className="w-full bg-slate-900 text-white pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">Daftar Ekstrakurikuler</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Wadah pengembangan minat, bakat, dan potensi diri siswa di luar jam pelajaran akademik.</p>
        </div>
      </section>
      
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        {ekstrakurikuler.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Belum ada data Ekstrakurikuler. Anda dapat menambahkannya melalui Dashboard Admin.
          </div>
        ) : (
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
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 shrink-0">
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
                    <h3 className="text-xl font-bold font-jakarta text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
                      {eks.nama}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {eks.deskripsi}
                    </p>
                    
                    {/* Menggunakan details HTML untuk accordion ringan tanpa JS Client Component */}
                    <details className="mt-auto group/details open:bg-slate-50 open:p-4 open:-mx-4 open:-mb-4 open:rounded-b-2xl transition-all duration-300">
                      <summary className="text-emerald-600 text-sm font-semibold cursor-pointer list-none hover:text-emerald-700 flex items-center gap-1.5 transition-colors">
                        <span className="group-open/details:hidden">Klik untuk melihat jadwal kegiatan</span>
                        <span className="hidden group-open/details:inline">Tutup detail kegiatan</span>
                        <ChevronDown className="w-4 h-4 group-open/details:rotate-180 transition-transform duration-300" />
                      </summary>
                      
                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 text-sm text-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-start gap-3">
                          <User className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-slate-900">Pembina</p>
                            <p className="text-slate-600">{eks.pembina?.nama || <span className="italic">Belum ada pembina</span>}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Calendar className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-slate-900">Jadwal Latihan</p>
                            <p className="text-slate-600">
                              {eks.hari ? eks.hari : 'Hari belum ditentukan'} 
                              {(eks.waktuMulai && eks.waktuSelesai) && ` (${eks.waktuMulai} - ${eks.waktuSelesai})`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-slate-900">Lokasi/Ruangan</p>
                            <p className="text-slate-600">{eks.lokasi || 'Lokasi belum ditentukan'}</p>
                          </div>
                        </div>

                        {eks.linkAdArt && (
                          <div className="flex items-start gap-3 pt-2">
                            <FileText className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <a 
                              href={eks.linkAdArt} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="font-medium text-orange-600 hover:text-orange-700 hover:underline"
                            >
                              Lihat AD/ART
                            </a>
                          </div>
                        )}
                      </div>
                    </details>
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
