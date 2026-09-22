/* eslint-disable */
// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { X, Loader2, MessageSquare, CheckCircle, Clock, Paperclip, Trash2, Edit } from "lucide-react";

export default function AdminPengaduanPage() {
  const [pengaduans, setPengaduans] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/pengaduan");
      const data = await res.json();
      setPengaduans(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsUpdating(true);
    
    try {
      const res = await fetch(`/api/pengaduan/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        alert("Data berhasil diperbarui!");
        setSelected(null);
        fetchData();
      } else {
        alert("Gagal memperbarui data.");
      }
    } catch (e) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus aduan ini?")) return;
    try {
      const res = await fetch(`/api/pengaduan/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Aduan berhasil dihapus!");
        fetchData();
      }
    } catch (error) {
      alert("Gagal menghapus aduan.");
    }
  };

  const openModal = (p: any) => {
    setSelected(p);
    setFormData({
      nama: p.nama,
      email: p.email || "",
      kategori: p.kategori,
      isiAduan: p.isiAduan,
      status: p.status || "MENUNGGU",
      tanggapan: p.tanggapan || ""
    });
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "SELESAI": return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle className="w-3 h-3"/> Selesai</span>;
      case "DIPROSES": return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"><Loader2 className="w-3 h-3 animate-spin"/> Diproses</span>;
      case "DITOLAK": return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><X className="w-3 h-3"/> Ditolak</span>;
      default: return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3"/> Menunggu</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Pengaduan & Aspirasi</h2>
          <p className="text-sm text-slate-500 mt-1">Daftar aduan masyarakat dan siswa yang masuk ke sistem.</p>
        </div>
      </div>
      
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="px-4 py-3 font-medium">Tiket ID</th>
              <th className="px-4 py-3 font-medium">Nama Pelapor</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pengaduans.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm font-semibold text-slate-800">{p.tiketId}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {p.nama}
                  <span className="block text-xs text-slate-400">{p.email}</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{p.kategori}</td>
                <td className="px-4 py-3 text-sm">{getStatusBadge(p.status)}</td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openModal(p)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" /> Edit / Buka
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pengaduans.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                  Belum ada data pengaduan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Detail & Edit Aduan #{selected.tiketId}</h3>
                <p className="text-sm text-slate-500">Dibuat pada {new Date(selected.createdAt).toLocaleString('id-ID')}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-700">Nama Pelapor</label>
                  <input type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-700">Email Pelapor</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-700">Kategori Aduan</label>
                <input type="text" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-700">Isi Aduan</label>
                <textarea value={formData.isiAduan} onChange={e => setFormData({...formData, isiAduan: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" rows={3}></textarea>
              </div>

              {selected.lampiran && (
                <div className="mb-4">
                  <label className="block mb-1 text-xs font-semibold text-slate-700">Lampiran</label>
                  <a href={selected.lampiran} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
                    <Paperclip className="w-4 h-4" /> Lihat Lampiran
                  </a>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 mt-2">
                <label className="block mb-1 text-sm font-semibold text-slate-700">Perbarui Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="MENUNGGU">Menunggu</option>
                  <option value="DIPROSES">Diproses</option>
                  <option value="SELESAI">Selesai</option>
                  <option value="DITOLAK">Ditolak</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700">Tanggapan Resmi</label>
                <textarea value={formData.tanggapan} onChange={(e) => setFormData({...formData, tanggapan: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" rows={3} placeholder="Ketik tanggapan untuk pelapor di sini..." />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setSelected(null)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Tutup</button>
                <button type="submit" disabled={isUpdating} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                  {isUpdating ? <><Loader2 className="w-4 h-4 animate-spin"/> Menyimpan...</> : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
