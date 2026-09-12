"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, Loader2, Image as ImageIcon } from "lucide-react";

type Prestasi = {
  id: string;
  nama: string;
  tingkat: string | null;
  tahun: string;
  deskripsi: string | null;
  imageUrl: string | null;
};

export default function AdminPrestasiPage() {
  const [prestasiList, setPrestasiList] = useState<Prestasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    tingkat: "",
    tahun: "",
    deskripsi: "",
    imageUrl: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPrestasi();
  }, []);

  const fetchPrestasi = async () => {
    try {
      const res = await fetch("/api/prestasi");
      const data = await res.json();
      setPrestasiList(data);
    } catch (error) {
      console.error("Error fetching prestasi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEdit ? `/api/prestasi/${formData.id}` : "/api/prestasi";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchPrestasi();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving prestasi:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await fetch(`/api/prestasi/${id}`, { method: "DELETE" });
      fetchPrestasi();
    } catch (error) {
      console.error("Error deleting prestasi:", error);
    }
  };

  const resetForm = () => {
    setFormData({ id: "", nama: "", tingkat: "", tahun: "", deskripsi: "", imageUrl: "" });
    setIsEdit(false);
  };

  const openEditModal = (prestasi: Prestasi) => {
    setFormData({
      id: prestasi.id,
      nama: prestasi.nama,
      tingkat: prestasi.tingkat || "",
      tahun: prestasi.tahun,
      deskripsi: prestasi.deskripsi || "",
      imageUrl: prestasi.imageUrl || "",
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-emerald-600 w-8 h-8" /></div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="text-xl font-bold text-slate-800">Manajemen Prestasi</h2></div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Prestasi
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="px-4 py-3 font-medium w-24">Gambar</th>
              <th className="px-4 py-3 font-medium">Nama Prestasi</th>
              <th className="px-4 py-3 font-medium">Tingkat</th>
              <th className="px-4 py-3 font-medium">Tahun</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {prestasiList.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.nama} className="w-12 h-12 rounded object-cover border border-slate-200" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-400 border border-slate-200"><ImageIcon className="w-5 h-5"/></div>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-sm text-slate-800">{p.nama}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{p.tingkat || "-"}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{p.tahun}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-2 items-center mt-2">
                  <button onClick={() => openEditModal(p)} className="p-1.5 text-emerald-600 hover:text-emerald-800 bg-emerald-50 rounded"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {prestasiList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                  Belum ada data prestasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-slate-800">{isEdit ? "Edit Prestasi" : "Tambah Prestasi"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Nama Prestasi <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-emerald-500 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Tingkat</label>
                  <input type="text" placeholder="Mis: Nasional" value={formData.tingkat} onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Tahun <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="2024" value={formData.tahun} onChange={(e) => setFormData({ ...formData, tahun: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-emerald-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Deskripsi Singkat</label>
                <textarea rows={3} value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-emerald-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Upload Gambar</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-slate-50 px-4 py-2 rounded-md border border-slate-300 flex items-center gap-2 hover:bg-slate-100 transition text-sm">
                    <Upload size={16} /> Pilih File (HP/Laptop)
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                  {uploading && <Loader2 size={16} className="animate-spin text-emerald-600" />}
                </div>
                {formData.imageUrl && (
                  <div className="mt-3">
                    <img src={formData.imageUrl} alt="Preview" className="rounded-md object-cover border border-slate-200 h-24 w-24" />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium">Batal</button>
                <button type="submit" disabled={uploading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition text-sm font-medium">
                  {isEdit ? "Simpan Perubahan" : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
