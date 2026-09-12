"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, LayoutGrid, Save, Globe, BookOpen, Building2, Megaphone, Users, Trophy, GraduationCap, Video, FileText, Image as ImageIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

const AVAILABLE_ICONS = [
  "Building2", "Megaphone", "BookOpen", "UserCircle", "Globe", "GraduationCap",
  "Trophy", "Video", "FileText", "ImageIcon", "Users", "Briefcase", "Heart", "Link"
];

const AVAILABLE_COLORS = [
  { value: "emerald", label: "Hijau Emerald" },
  { value: "amber", label: "Oranye Amber" },
  { value: "blue", label: "Biru" },
  { value: "rose", label: "Merah Rose" },
  { value: "purple", label: "Ungu" },
  { value: "slate", label: "Abu-abu Gelap" }
];

export default function ManajemenPortal() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: "", title: "", description: "", url: "", icon: "Link", color: "emerald", order: 0 });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/portal-link");
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
    if (!formData.title) return alert("Judul kotak wajib diisi!");

    const url = isEditing ? `/api/portal-link/${formData.id}` : "/api/portal-link";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Berhasil menyimpan kotak portal!");
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
    if (!confirm("Yakin ingin menghapus kotak ini?")) return;
    try {
      const res = await fetch(`/api/portal-link/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ id: "", title: "", description: "", url: "", icon: "Link", color: "emerald", order: 0 });
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-jakarta text-slate-800 flex items-center gap-3">
          <LayoutGrid className="w-8 h-8 text-emerald-600" /> Kelola Kotak Portal
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              {isEditing ? <Edit2 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-emerald-600" />}
              {isEditing ? "Edit Kotak" : "Tambah Kotak Baru"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Layanan</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Misal: Layanan PTSP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sub-judul / Deskripsi Singkat</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Misal: Layanan Terpadu Satu Pintu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tautan / Link Tujuan</label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Misal: /layanan-ptsp atau https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Ikon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    {AVAILABLE_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Warna Tema</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    {AVAILABLE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Urutan Tampil (Angka)</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 flex justify-center items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Simpan Kotak
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
              <Globe className="w-5 h-5 text-slate-600" />
              Daftar Kotak Saat Ini
            </h2>

            {loading ? (
              <div className="py-10 text-center text-slate-500">Memuat data...</div>
            ) : items.length === 0 ? (
              <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                Belum ada kotak layanan. Silakan tambahkan.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => {
                  const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Link;
                  const bgColors: any = {
                    emerald: "bg-emerald-600",
                    amber: "bg-amber-600",
                    blue: "bg-blue-600",
                    rose: "bg-rose-600",
                    purple: "bg-purple-600",
                    slate: "bg-slate-700",
                  };
                  return (
                    <div key={item.id} className={`p-5 border border-slate-200 rounded-xl hover:shadow-md transition-all group relative bg-white`}>
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setFormData(item); setIsEditing(true); }} className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-md">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${bgColors[item.color] || "bg-emerald-600"}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg leading-tight">{item.title}</h3>
                          <p className="text-xs text-slate-500 font-medium">Urutan: {item.order}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{item.description}</p>
                      <p className="text-xs text-blue-600 break-all">{item.url}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
