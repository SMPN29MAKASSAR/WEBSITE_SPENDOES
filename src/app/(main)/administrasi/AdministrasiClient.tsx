"use client";
import { useState } from "react";
import { Search, FileText, Download, Eye, ShieldCheck, Lock } from "lucide-react";

type Administrasi = { 
  id: string; 
  nomor: string | null; 
  nama: string; 
  kategori: string;
  tanggal: string | null;
  ukuran: string | null;
  akses: string;
  fileUrl: string;
};

export default function AdministrasiClient({ initialData }: { initialData: Administrasi[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua Kategori Berkas");

  const categories = ["Semua Kategori Berkas", "Surat Keputusan (SK)", "Tata Tertib", "Surat Edaran", "Kurikulum", "Lainnya"];

  const filteredData = initialData.filter((item) => {
    const matchesSearch = (item.nama + " " + item.nomor).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "Semua Kategori Berkas" || item.kategori === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-slate-900 text-white pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">Administrasi & Dokumen</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Daftar Berkas Dokumen & Surat Keputusan (SK) SMPN 29 Makassar.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <FileText className="w-5 h-5 text-blue-600" />
                Daftar Berkas Dokumen & Surat Keputusan (SK)
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Mode Akses: Guru & Siswa (Hanya Lihat & Unduh Berkas)
                </span>
              </div>
            </div>
            <div className="bg-slate-50 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200">
              {filteredData.length} Berkas Terdaftar
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nomor dokumen atau nama berkas administrasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-64 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4 w-12 text-center">NO</th>
                  <th className="px-6 py-4">NOMOR & NAMA DOKUMEN</th>
                  <th className="px-6 py-4">KATEGORI</th>
                  <th className="px-6 py-4">TANGGAL TERBIT</th>
                  <th className="px-6 py-4">UKURAN</th>
                  <th className="px-6 py-4 text-center">AKSES</th>
                  <th className="px-6 py-4 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-center text-sm text-slate-400 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800 leading-snug">{item.nama}</p>
                      {item.nomor && (
                        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          {item.nomor}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium border border-slate-200 shadow-sm">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {item.tanggal || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {item.ukuran || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.akses === "Publik" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5" /> Publik
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <Lock className="w-3.5 h-3.5" /> Internal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <a 
                          href={item.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 p-2 rounded-full hover:bg-blue-100"
                          title="Lihat Dokumen"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <a 
                          href={item.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-emerald-600 hover:text-emerald-800 transition-colors bg-emerald-50 p-2 rounded-full hover:bg-emerald-100"
                          title="Unduh Dokumen"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 bg-slate-50/50">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="font-medium text-slate-600">Tidak ada dokumen yang ditemukan.</p>
                      <p className="text-sm mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}
