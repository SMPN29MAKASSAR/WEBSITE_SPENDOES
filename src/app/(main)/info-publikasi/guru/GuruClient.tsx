"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, LayoutGrid, GraduationCap, User, Search, Briefcase } from "lucide-react";

export default function GuruClient({ initialPegawai }: { initialPegawai: any[] }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Semua");

  const filteredPegawai = initialPegawai.filter((pegawai) => {
    const matchesSearch = 
      pegawai.nama.toLowerCase().includes(search.toLowerCase()) || 
      pegawai.jabatan.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    const isGuru = pegawai.jabatan.toLowerCase().includes("guru");
    if (filterType === "Guru" && !isGuru) return false;
    if (filterType === "Tendik" && isGuru) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header Card */}
      <div className="bg-gradient-to-r from-[#2f8c5b] to-emerald-500 rounded-[2rem] p-8 md:p-10 mb-8 relative overflow-hidden shadow-xl shadow-emerald-900/10">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-32 w-40 h-40 bg-white/10 rounded-full translate-y-1/3"></div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div className="text-white">
            <p className="text-emerald-100 font-medium mb-1">Total Pegawai</p>
            <h1 className="text-6xl font-bold font-jakarta mb-2">{initialPegawai.length}</h1>
            <p className="text-emerald-50 text-sm">Tenaga pendidik & kependidikan aktif</p>
          </div>
          <div className="hidden sm:flex w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl items-center justify-center rotate-3">
            <Users className="w-12 h-12 text-white -rotate-3" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button 
            onClick={() => setFilterType("Semua")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${filterType === "Semua" ? "bg-[#339b65] text-white shadow-md shadow-emerald-500/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
          >
            <LayoutGrid className="w-4 h-4" /> Semua
          </button>
          <button 
            onClick={() => setFilterType("Guru")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${filterType === "Guru" ? "bg-[#339b65] text-white shadow-md shadow-emerald-500/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
          >
            <GraduationCap className="w-4 h-4" /> Guru
          </button>
          <button 
            onClick={() => setFilterType("Tendik")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${filterType === "Tendik" ? "bg-[#339b65] text-white shadow-md shadow-emerald-500/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
          >
            <User className="w-4 h-4" /> Tendik
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Cari nama atau jabatan..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredPegawai.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Tidak ada data yang cocok dengan pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPegawai.map((pegawai) => (
            <div key={pegawai.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden flex flex-col items-center pt-8 pb-8 px-6 hover:shadow-xl transition-shadow duration-300 group">
              
              {/* Top accent line */}
              <div className="absolute top-0 w-3/4 h-1.5 bg-[#2f8c5b] rounded-b-xl opacity-90"></div>
              
              {/* Decorative faint circles */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/60 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-50/60 rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

              {/* Profile Image Wrapper */}
              <div className="relative w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-[#c99557] via-amber-200 to-[#c99557] shadow-md mb-5 group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full bg-white rounded-full p-[3px]">
                  <div className="relative w-full h-full bg-slate-100 rounded-full overflow-hidden">
                    {pegawai.foto ? (
                      <Image
                        src={pegawai.foto}
                        alt={pegawai.nama}
                        fill
                        className="object-cover"
                        unoptimized={false}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-slate-200 text-slate-400">
                        <User className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Text content */}
              <h3 className="text-base font-bold text-slate-800 text-center uppercase tracking-wide mb-1 leading-snug line-clamp-2">
                {pegawai.nama}
              </h3>
              
              <p className="text-[11px] text-slate-400 font-mono mb-4">
                # {pegawai.nip || Math.random().toString().slice(2, 20)}
              </p>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#eaf4ef] text-[#2f8c5b] rounded-full text-xs font-semibold mb-3 border border-[#d6eae1]">
                <Briefcase className="w-3.5 h-3.5" /> 
                {pegawai.jabatan}
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold mt-auto">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Aktif
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
