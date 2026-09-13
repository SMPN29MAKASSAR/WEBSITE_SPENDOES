"use client";

import { useState, useEffect } from "react";
import { Users, Search, RefreshCw, Calendar, Clock, Download } from "lucide-react";

export default function AdminBukuTamu() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/buku-tamu");
      const data = await res.json();
      setGuests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.agency.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    if (guests.length === 0) return;
    const csvHeader = "TANGGAL,JAM,NAMA,INSTANSI,BERTEMU,KEPERLUAN,KONTAK\n";
    const csvContent = guests.map(g => {
      const date = new Date(g.createdAt).toLocaleDateString('id-ID');
      const time = new Date(g.createdAt).toLocaleTimeString('id-ID', { hour12: false });
      // Escape quotes and commas
      const name = `"${g.name.replace(/"/g, '""')}"`;
      const agency = `"${g.agency.replace(/"/g, '""')}"`;
      const meet = `"${g.meetWith.replace(/"/g, '""')}"`;
      const purpose = `"${g.purpose.replace(/"/g, '""')}"`;
      const contact = `"${g.contact.replace(/"/g, '""')}"`;
      return `${date},${time},${name},${agency},${meet},${purpose},${contact}`;
    }).join("\n");

    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `buku-tamu-smpn29-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-jakarta text-slate-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-600" /> Buku Tamu Digital
          </h1>
          <p className="text-slate-500 mt-1">Rekapitulasi daftar pengunjung dan tamu sekolah.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 flex items-center gap-2 font-semibold">
            <Download className="w-4 h-4" /> Unduh CSV
          </button>
          <button onClick={fetchData} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-2 font-medium">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Cari nama atau instansi..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total: {filteredGuests.length} Pengunjung
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">WAKTU KUNJUNGAN</th>
                <th className="px-6 py-4 font-semibold">NAMA & INSTANSI</th>
                <th className="px-6 py-4 font-semibold">BERTEMU</th>
                <th className="px-6 py-4 font-semibold">KEPERLUAN</th>
                <th className="px-6 py-4 font-semibold">KONTAK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">Memuat data...</td>
                </tr>
              ) : filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">Tidak ada data tamu.</td>
                </tr>
              ) : (
                filteredGuests.map(guest => (
                  <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold mb-1">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        {new Date(guest.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium ml-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(guest.createdAt).toLocaleTimeString('id-ID', { hour12: false })} WITA
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-base">{guest.name}</p>
                      <p className="text-sm text-emerald-600 font-semibold">{guest.agency}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm">
                        <Users className="w-4 h-4" /> {guest.meetWith}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 max-w-xs">{guest.purpose}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-slate-600">{guest.contact}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
