/* eslint-disable */
// @ts-nocheck
"use client";
import { useState } from "react";
import Image from "next/image";
import { Tent, Calendar, MapPin, User, FileText, ChevronDown, Search, CalendarDays } from "lucide-react";

export default function EkstrakurikulerClient({ initialData }: { initialData: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState("Semua");

  const days = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  const filteredData = initialData.filter((eks) => {
    const matchesSearch = 
      eks.nama.toLowerCase().includes(search.toLowerCase()) || 
      (eks.pembina?.nama || "").toLowerCase().includes(search.toLowerCase()) ||
      (eks.lokasi || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesDay = selectedDay === "Semua" || (eks.hari || "").includes(selectedDay);

    return matchesSearch && matchesDay;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      {/* Sidebar Kiri: Jadwal & Filter */}
      <div className="w-full lg:w-1/3 xl:w-1/4 lg:sticky lg:top-28 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-emerald-700 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <CalendarDays className="w-5 h-5" />
              <h2 className="font-bold font-jakarta text-lg">Jadwal Ekskul</h2>
            </div>
            <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {filteredData.length} Kegiatan
            </span>
          </div>
          
          <div className="p-5 space-y-5">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari ekskul, pembina, ruangan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Filter Hari */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Filter Hari:</p>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      selectedDay === day 
                        ? "bg-emerald-700 text-white shadow-sm" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Kanan: Daftar Ekstrakurikuler */}
      <div className="w-full lg:w-2/3 xl:w-3/4">
        {filteredData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <Tent className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Tidak ada ekstrakurikuler yang sesuai pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredData.map((eks, idx) => {
              const colors = [
                "from-emerald-500 to-teal-600",
                "from-teal-500 to-emerald-600",
                "from-green-500 to-emerald-600",
                "from-emerald-600 to-green-600"
              ];
              const gradient = colors[idx % colors.length];
              
              // Proxy image from ImgBB to Weserv if needed
              const imageUrl = eks.imageUrl;
              const proxiedImageUrl = imageUrl?.includes('i.ibb.co') 
                ? `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl.replace('https://', ''))}`
                : imageUrl;
              
              return (
                <div key={eks.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col group overflow-hidden hover:-translate-y-1">
                  {/* Header Kotak */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 shrink-0">
                    {proxiedImageUrl ? (
                      <img 
                        src={proxiedImageUrl} 
                        alt={eks.nama} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <Tent className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Konten Kotak */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold font-jakarta text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
                      {eks.nama}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {eks.deskripsi}
                    </p>
                    
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
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-slate-600">{eks.pembina?.nama || <span className="italic">Belum ada pembina</span>}</p>
                              {eks.pembina?.nomorWa && (
                                <a 
                                  href={`https://wa.me/${eks.pembina.nomorWa.replace(/\D/g, '').replace(/^0/, '62')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-[10px] font-bold rounded transition-colors"
                                >
                                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                  Chat WA
                                </a>
                              )}
                            </div>
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
      </div>
    </div>
  );
}
