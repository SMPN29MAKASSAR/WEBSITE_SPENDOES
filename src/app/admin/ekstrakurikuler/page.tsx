/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Image as ImageIcon } from "lucide-react";

type Ekstrakurikuler = {
  id: string;
  nama: string;
  deskripsi: string | null;
  imageUrl: string | null;
  pembinaId: string | null;
  hari: string | null;
  waktuMulai: string | null;
  waktuSelesai: string | null;
  lokasi: string | null;
  linkAdArt: string | null;
  pembina?: { nama: string };
};

type Pegawai = {
  id: string;
  nama: string;
};

export default function EkstrakurikulerAdminPage() {
  const [data, setData] = useState<Ekstrakurikuler[]>([]);
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialForm = {
    nama: "", deskripsi: "", imageUrl: "", pembinaId: "", hari: [] as string[],
    waktuMulai: "", waktuSelesai: "", lokasi: "", linkAdArt: ""
  };
  const [formData, setFormData] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const HARI_OPTIONS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  useEffect(() => {
    fetchData();
    fetchPegawai();
  }, []);

  const fetchData = async () => {
    const res = await fetch("/api/ekstrakurikuler");
    setData(await res.json());
    setIsLoading(false);
  };

  const fetchPegawai = async () => {
    const res = await fetch("/api/pegawai");
    if (res.ok) setPegawaiList(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    let uploadedUrl = formData.imageUrl;
    
    if (file) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      if (res.ok) {
        uploadedUrl = (await res.json()).url;
      } else {
        alert("Gagal mengunggah foto.");
        setIsUploading(false);
        return;
      }
    }
    
    const submitData = {
      ...formData,
      imageUrl: uploadedUrl,
      hari: formData.hari.length > 0 ? formData.hari.join(",") : null,
      pembinaId: formData.pembinaId || null,
      waktuMulai: formData.waktuMulai || null,
      waktuSelesai: formData.waktuSelesai || null,
      lokasi: formData.lokasi || null,
      linkAdArt: formData.linkAdArt || null
    };

    if (editingId) {
      await fetch(`/api/ekstrakurikuler/${editingId}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(submitData) 
      });
    } else {
      await fetch("/api/ekstrakurikuler", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(submitData) 
      });
    }
    
    setIsModalOpen(false);
    resetForm();
    fetchData();
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    await fetch(`/api/ekstrakurikuler/${id}`, { method: "DELETE" });
    fetchData();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setFile(null);
  };

  const openEdit = (item: Ekstrakurikuler) => {
    setEditingId(item.id);
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi || "",
      imageUrl: item.imageUrl || "",
      pembinaId: item.pembinaId || "",
      hari: item.hari ? item.hari.split(",") : [],
      waktuMulai: item.waktuMulai || "",
      waktuSelesai: item.waktuSelesai || "",
      lokasi: item.lokasi || "",
      linkAdArt: item.linkAdArt || ""
    });
    setIsModalOpen(true);
  };

  const handleHariToggle = (h: string) => {
    setFormData(prev => {
      const current = new Set(prev.hari);
      if (current.has(h)) current.delete(h);
      else current.add(h);
      return { ...prev, hari: Array.from(current) };
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Ekstrakurikuler</h2>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
          <Plus className="w-4 h-4"/> Tambah Data
        </button>
      </div>

      {isLoading ? (
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                <th className="px-4 py-3 w-20">Foto</th>
                <th className="px-4 py-3 w-48">Nama & Pembina</th>
                <th className="px-4 py-3 w-48">Jadwal & Lokasi</th>
                <th className="px-4 py-3">Deskripsi</th>
                <th className="px-4 py-3 text-right w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} className="w-12 h-12 object-cover rounded-md border" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 flex items-center justify-center rounded-md border">
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold">{item.nama}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pembina: {item.pembina?.nama || <span className="italic">Belum diatur</span>}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <p><span className="font-medium text-slate-700">Hari:</span> {item.hari || '-'}</p>
                    <p><span className="font-medium text-slate-700">Waktu:</span> {item.waktuMulai ? `${item.waktuMulai} - ${item.waktuSelesai}` : '-'}</p>
                    <p><span className="font-medium text-slate-700">Lokasi:</span> {item.lokasi || '-'}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{item.deskripsi}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-xl my-8">
            <h3 className="text-lg font-bold mb-4 border-b pb-3">{editingId ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Ekstrakurikuler</label>
                  <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pembina Terdaftar</label>
                  <select value={formData.pembinaId} onChange={e => setFormData({...formData, pembinaId: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    <option value="">-- Pilih Pembina (Data Pegawai) --</option>
                    {pegawaiList.map(p => (
                      <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Jadwal Latihan (Hari)</label>
                <div className="flex flex-wrap gap-2">
                  {HARI_OPTIONS.map(h => (
                    <label key={h} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" checked={formData.hari.includes(h)} onChange={() => handleHariToggle(h)} className="text-emerald-600 focus:ring-emerald-500 rounded" />
                      <span className="text-sm">{h}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Mulai</label>
                  <input type="time" value={formData.waktuMulai} onChange={e => setFormData({...formData, waktuMulai: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Selesai</label>
                  <input type="time" value={formData.waktuSelesai} onChange={e => setFormData({...formData, waktuSelesai: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi/Ruang Latihan</label>
                  <input type="text" placeholder="Cth: Lapangan Basket" value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link AD/ART</label>
                  <input type="url" placeholder="https://..." value={formData.linkAdArt} onChange={e => setFormData({...formData, linkAdArt: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Foto Sampul</label>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                {formData.imageUrl && !file && <img src={formData.imageUrl} className="mt-2 w-20 h-20 object-cover rounded-md" />}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" rows={3} />
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition">Batal</button>
                <button type="submit" disabled={isUploading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
                  {isUploading ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
