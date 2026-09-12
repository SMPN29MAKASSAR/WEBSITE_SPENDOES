"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Image as ImageIcon } from "lucide-react";

type Galeri = {
  id: string;
  judul: string;
  deskripsi: string | null;
  imageUrl: string;
  tanggal: string | null;
  createdAt: string;
};

export default function GaleriAdminPage() {
  const [data, setData] = useState<Galeri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    imageUrl: "",
    tanggal: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/galeri");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let uploadedUrl = formData.imageUrl;
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: uploadData });
        if (res.ok) {
          const { url } = await res.json();
          uploadedUrl = url;
        } else {
          alert("Gagal mengunggah foto.");
          setIsUploading(false);
          return;
        }
      }

      if (!uploadedUrl) {
        alert("Pilih foto terlebih dahulu!");
        setIsUploading(false);
        return;
      }

      const submitData = { ...formData, imageUrl: uploadedUrl };

      if (editingId) {
        await fetch(`/api/galeri/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
      } else {
        await fetch("/api/galeri", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving data", error);
    }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus foto ini?")) return;
    try {
      await fetch(`/api/galeri/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  const openEdit = (item: Galeri) => {
    setEditingId(item.id);
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi || "",
      imageUrl: item.imageUrl,
      tanggal: item.tanggal || "",
    });
    setFile(null);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ judul: "", deskripsi: "", imageUrl: "", tanggal: "" });
    setFile(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Galeri & Foto</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola dokumentasi dan foto kegiatan sekolah</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Tambah Foto
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                <th className="px-4 py-3 font-medium w-24">Preview</th>
                <th className="px-4 py-3 font-medium">Judul Foto</th>
                <th className="px-4 py-3 font-medium">Tanggal Pelaksanaan</th>
                <th className="px-4 py-3 font-medium">Deskripsi</th>
                <th className="px-4 py-3 font-medium text-right w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <img src={item.imageUrl} alt={item.judul} className="w-16 h-12 object-cover rounded-md shadow-sm border border-slate-200" />
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">{item.judul}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.tanggal || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">{item.deskripsi || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                    <div className="flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-500 text-sm">Belum ada foto dalam galeri.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Foto" : "Tambah Foto Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Foto</label>
                <input
                  required
                  type="text"
                  placeholder="Misal: Kegiatan Porseni 2024"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Gambar (Laptop/HP)</label>
                {formData.imageUrl && !file && (
                  <div className="mb-2 text-xs text-slate-500">
                    Foto saat ini: <img src={formData.imageUrl} alt="Foto" className="h-10 object-cover inline-block ml-2 rounded" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Opsional..."
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
