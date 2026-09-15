/* eslint-disable */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Users, Search, RefreshCw, Calendar, Clock, Download, Trash2, Edit, X } from "lucide-react";

export default function AdminBukuTamu() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/buku-tamu");
      const data = await res.json();
      setGuests(data);
      setSelectedIds([]); // reset selection
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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredGuests.map(g => g.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteBulk = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Yakin ingin menghapus ${selectedIds.length} data terpilih?`)) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch("/api/buku-tamu", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        alert("Gagal menghapus data");
      }
    } catch (error) {
      alert("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      const res = await fetch(`/api/buku-tamu/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchData();
      } else {
        alert("Gagal menghapus data");
      }
    } catch (error) {
      alert("Terjadi kesalahan");
    }
  };

  const handleEdit = (guest: any) => {
    setEditData(guest);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/buku-tamu/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setEditModalOpen(false);
        await fetchData();
      } else {
        alert("Gagal menyimpan perubahan");
      }
    } catch (error) {
      alert("Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 relative">
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
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md min-w-[200px]">
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
          
          <div className="flex items-center gap-4">
            {selectedIds.length > 0 && (
              <button 
                onClick={handleDeleteBulk}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 flex items-center gap-2 font-semibold text-sm"
              >
                <Trash2 className="w-4 h-4" /> Hapus Terpilih ({selectedIds.length})
              </button>
            )}
            <div className="text-sm text-slate-500 font-medium">
              Total: {filteredGuests.length} Pengunjung
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-4 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedIds.length > 0 && selectedIds.length === filteredGuests.length}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="px-6 py-4 font-semibold">WAKTU KUNJUNGAN</th>
                <th className="px-6 py-4 font-semibold">NAMA & INSTANSI</th>
                <th className="px-6 py-4 font-semibold">BERTEMU</th>
                <th className="px-6 py-4 font-semibold">KEPERLUAN</th>
                <th className="px-6 py-4 font-semibold text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">Memuat data...</td>
                </tr>
              ) : filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">Tidak ada data tamu.</td>
                </tr>
              ) : (
                filteredGuests.map(guest => (
                  <tr key={guest.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.includes(guest.id) ? 'bg-emerald-50/30' : ''}`}>
                    <td className="px-4 py-4 text-center">
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(guest.id)}
                        onChange={() => handleSelectOne(guest.id)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
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
                      <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-1">{guest.contact}</p>
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
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(guest)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(guest.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && editData && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Edit Buku Tamu</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama</label>
                <input type="text" required value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Instansi</label>
                <input type="text" required value={editData.agency} onChange={e => setEditData({...editData, agency: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Bertemu</label>
                <input type="text" required value={editData.meetWith} onChange={e => setEditData({...editData, meetWith: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Keperluan</label>
                <textarea required value={editData.purpose} onChange={e => setEditData({...editData, purpose: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kontak (WA)</label>
                <input type="text" required value={editData.contact} onChange={e => setEditData({...editData, contact: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors">
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
