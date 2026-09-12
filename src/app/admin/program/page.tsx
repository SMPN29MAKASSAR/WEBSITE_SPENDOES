"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Link as LinkIcon, Save, X, LayoutTemplate } from "lucide-react";

export default function KelolaProgram() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: "", nama: "", deskripsi: "", icon: "", linkUrl: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/program");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return alert("Nama program wajib diisi!");

    const url = isEditing ? `/api/program/${formData.id}` : "/api/program";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Berhasil menyimpan program!");
        resetForm();
        fetchData();
      } else {
        alert("Gagal menyimpan.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus program ini?")) return;
    try {
      const res = await fetch(`/api/program/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ id: "", nama: "", deskripsi: "", icon: "", linkUrl: "" });
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-jakarta text-slate-800">Manajemen Program Kami</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              {isEditing ? <Edit2 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-emerald-600" />}
              {isEditing ? "Edit Program" : "Tambah Program Baru"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Program</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Misal: Sekolah Adiwiyata"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={formData.deskripsi || ""}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  placeholder="Penjelasan singkat program..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ikon / Emoji (Opsional)</label>
                <input
                  type="text"
                  value={formData.icon || ""}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Misal: 🌟 atau 📚"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tautan / Link (Opsional)</label>
                <input
                  type="url"
                  value={formData.linkUrl || ""}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="https://contoh.com/program"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 flex justify-center items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Simpan
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-semibold flex items-center justify-center transition-colors"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-slate-600" />
              Daftar Program
            </h2>

            {loading ? (
              <div className="py-10 text-center text-slate-500">Memuat data...</div>
            ) : items.length === 0 ? (
              <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                Belum ada program yang ditambahkan.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="p-5 border border-slate-200 rounded-xl hover:border-emerald-200 hover:shadow-md transition-all group relative bg-white">
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setFormData({ ...item, linkUrl: item.linkUrl || "" });
                          setIsEditing(true);
                        }}
                        className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-md"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-start gap-4">
                      {item.icon ? (
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-2xl shrink-0">
                          {item.icon}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                          <LayoutTemplate className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{item.nama}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-3">{item.deskripsi}</p>
                        
                        {item.linkUrl && (
                          <a 
                            href={item.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md"
                          >
                            <LinkIcon className="w-3 h-3" />
                            Kunjungi Tautan
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
