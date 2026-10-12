/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

export default function AdminFasilitas() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ id: "", nama: "", deskripsi: "", imageUrl: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/fasilitas");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Gagal mengambil fasilitas:", err);
    }
  };

  const getSafeImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("i.ibb.co")) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(url.replace("https://", ""))}`;
    }
    return url;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      if (result.url) {
        setForm((prev) => ({ ...prev, imageUrl: result.url }));
      } else if (result.error) {
        alert("Gagal upload: " + result.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat upload gambar ke ImgBB");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/fasilitas/${form.id}` : "/api/fasilitas";
    const method = isEditing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ id: "", nama: "", deskripsi: "", imageUrl: "" });
      setIsEditing(false);
      fetchItems();
    } else {
      alert("Gagal menyimpan data fasilitas");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus fasilitas ini?")) return;
    await fetch(`/api/fasilitas/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-jakarta text-slate-800">Fasilitas Sekolah</h1>
          <p className="text-sm text-slate-500">Kelola daftar sarana dan fasilitas sekolah</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Fasilitas *</label>
            <input
              type="text"
              placeholder="Contoh: Musholla Al-Ikhlas, Lab Komputer, dll"
              required
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Fasilitas</label>
            <textarea
              placeholder="Deskripsi sarana dan kegunaan..."
              rows={3}
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Foto Fasilitas (Upload ke ImgBB atau Link Gambar)</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {form.imageUrl && (
                <img
                  src={getSafeImageUrl(form.imageUrl)}
                  alt="Preview"
                  className="h-20 w-24 object-cover rounded-xl border border-slate-200 shadow-sm"
                />
              )}
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:font-bold"
                />
                <input
                  type="text"
                  placeholder="Atau tempel link URL foto langsung di sini..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full border p-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-slate-600"
                />
              </div>
              {uploading && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengunggah ke ImgBB...</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={uploading}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 text-sm shadow-sm transition disabled:opacity-50"
            >
              {isEditing ? "Update" : "Tambah"} Fasilitas
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setForm({ id: "", nama: "", deskripsi: "", imageUrl: "" });
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-100 font-bold text-sm hover:bg-slate-200 transition"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 flex flex-col justify-between"
          >
            <div>
              {item.imageUrl ? (
                <img
                  src={getSafeImageUrl(item.imageUrl)}
                  alt={item.nama}
                  className="w-full h-48 object-cover bg-slate-50"
                />
              ) : (
                <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-base text-slate-900 mb-1">{item.nama}</h3>
                <p className="text-xs text-slate-600 line-clamp-3">{item.deskripsi}</p>
              </div>
            </div>

            <div className="p-4 pt-0 flex justify-end gap-2 border-t border-slate-50">
              <button
                onClick={() => {
                  setForm(item);
                  setIsEditing(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
