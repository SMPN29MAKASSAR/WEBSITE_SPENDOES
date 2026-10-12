/* eslint-disable */
// @ts-nocheck
"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  LayoutGrid, 
  Save, 
  Globe, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Power, 
  Loader2,
  Filter
} from "lucide-react";
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
  const [formData, setFormData] = useState({ 
    id: "", 
    title: "", 
    description: "", 
    url: "", 
    icon: "Link", 
    color: "emerald", 
    order: 0,
    isActive: true 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filterMode, setFilterMode] = useState<"SEMUA" | "AKTIF" | "NONAKTIF">("SEMUA");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/portal-link");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const activeCount = useMemo(() => items.filter((i) => i.isActive).length, [items]);
  const inactiveCount = useMemo(() => items.filter((i) => !i.isActive).length, [items]);

  const displayedItems = useMemo(() => {
    if (filterMode === "AKTIF") return items.filter((i) => i.isActive);
    if (filterMode === "NONAKTIF") return items.filter((i) => !i.isActive);
    return items;
  }, [items, filterMode]);

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
        alert(isEditing ? "Berhasil memperbarui kotak portal!" : "Berhasil menambahkan kotak portal baru!");
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

  // Quick 1-click Toggle Aktif / Nonaktif
  const handleToggleActive = async (item: any) => {
    setTogglingId(item.id);
    const newStatus = !item.isActive;

    try {
      const res = await fetch(`/api/portal-link/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (res.ok) {
        // Optimistic update
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: newStatus } : i));
      } else {
        alert("Gagal mengubah status aktif kotak.");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kotak ini? Jika Anda hanya ingin menyembunyikannya dari pengunjung tanpa menghapus, cukup klik tombol 'Nonaktifkan'.")) return;
    try {
      const res = await fetch(`/api/portal-link/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (item: any) => {
    setFormData({
      id: item.id,
      title: item.title,
      description: item.description,
      url: item.url,
      icon: item.icon || "Link",
      color: item.color || "emerald",
      order: item.order || 0,
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({ 
      id: "", 
      title: "", 
      description: "", 
      url: "", 
      icon: "Link", 
      color: "emerald", 
      order: items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 1,
      isActive: true 
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold font-jakarta text-slate-800 flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-emerald-600" /> Kelola Kotak Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Atur kotak layanan yang tampil pada halaman pembuka website. Aktifkan atau nonaktifkan kotak tanpa perlu menghapusnya.
          </p>
        </div>

        {/* Counter Info Badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            Total: {items.length} Kotak
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> {activeCount} Aktif (Tampil)
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 flex items-center gap-1.5">
            <EyeOff className="w-3.5 h-3.5" /> {inactiveCount} Disembunyikan
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Panel (Col 1) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              {isEditing ? <Edit2 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-emerald-600" />}
              {isEditing ? "Edit Kotak Portal" : "Tambah Kotak Baru"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Layanan</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Misal: Layanan PTSP"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sub-judul / Deskripsi Singkat</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Misal: Layanan Terpadu Satu Pintu"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tautan / Link Tujuan</label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Misal: /layanan-ptsp atau iframe:https://..."
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Tips: Awali dengan <strong>iframe:</strong> jika ingin membuka link dalam jendela modal sembulan tanpa berpindah halaman.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Ikon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    {AVAILABLE_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Warna Tema</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    {AVAILABLE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Urutan Tampil (Angka)</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Status Tampil Toggle (FITUR REQUEST: BISA DINONAKTIFKAN TANPA DIHAPUS) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">Status Tampil</label>
                    <p className="text-[11px] text-slate-500">
                      {formData.isActive ? "Kotak ini tampil kepada pengunjung" : "Disembunyikan (hanya ada di admin)"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.isActive ? "bg-emerald-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-bold hover:bg-emerald-700 flex justify-center items-center gap-2 transition shadow-md shadow-emerald-600/20 text-sm"
                >
                  <Save className="w-4 h-4" />
                  {isEditing ? "Perbarui Kotak" : "Simpan Kotak"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-bold text-sm transition"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List of Current Portals (Col 2 & 3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Globe className="w-5 h-5 text-emerald-600" />
                Daftar Kotak Saat Ini ({displayedItems.length})
              </h2>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                <button
                  onClick={() => setFilterMode("SEMUA")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterMode === "SEMUA" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
                  }`}
                >
                  Semua ({items.length})
                </button>
                <button
                  onClick={() => setFilterMode("AKTIF")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterMode === "AKTIF" ? "bg-emerald-600 text-white shadow-xs" : "hover:text-slate-900"
                  }`}
                >
                  Aktif ({activeCount})
                </button>
                <button
                  onClick={() => setFilterMode("NONAKTIF")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    filterMode === "NONAKTIF" ? "bg-amber-600 text-white shadow-xs" : "hover:text-slate-900"
                  }`}
                >
                  Nonaktif ({inactiveCount})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                Memuat data kotak portal...
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                Belum ada kotak layanan. Silakan tambahkan melalui form di samping.
              </div>
            ) : displayedItems.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                Tidak ada kotak dengan status ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayedItems.map((item) => {
                  const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Link;
                  const bgColors: any = {
                    emerald: "bg-emerald-600",
                    amber: "bg-amber-600",
                    blue: "bg-blue-600",
                    rose: "bg-rose-600",
                    purple: "bg-purple-600",
                    slate: "bg-slate-700",
                  };

                  const isToggling = togglingId === item.id;

                  return (
                    <div 
                      key={item.id} 
                      className={`p-5 rounded-2xl transition-all relative flex flex-col justify-between ${
                        item.isActive 
                          ? "bg-white border border-slate-200/90 shadow-xs hover:shadow-md" 
                          : "bg-slate-50/70 border-2 border-dashed border-slate-300 opacity-80 hover:opacity-100"
                      }`}
                    >
                      {/* Top Action Toolbar */}
                      <div className="flex items-center justify-between mb-3">
                        {/* Status Badge */}
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Eye className="w-3 h-3" /> Aktif di Publik
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <EyeOff className="w-3 h-3" /> Disembunyikan
                          </span>
                        )}

                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => startEdit(item)} 
                            className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                            title="Edit Data Kotak"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                            title="Hapus Kotak"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-3.5 mb-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${bgColors[item.color] || "bg-emerald-600"}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-800 text-base leading-tight truncate">{item.title}</h3>
                            <p className="text-[11px] text-slate-500 font-medium">Urutan Tampil: #{item.order}</p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 mb-2 line-clamp-2 leading-relaxed">
                          {item.description || "Tidak ada deskripsi"}
                        </p>
                        <p className="text-[11px] text-blue-600 break-all font-mono bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          {item.url}
                        </p>
                      </div>

                      {/* Bottom Toggle Bar (1-Click Switch) */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          {item.isActive ? "Terlihat oleh pengunjung" : "Hanya tersimpan di admin"}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          disabled={isToggling}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition ${
                            item.isActive
                              ? "bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800"
                              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                          }`}
                        >
                          {isToggling ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : item.isActive ? (
                            <>
                              <Power className="w-3 h-3 text-amber-600" /> Nonaktifkan
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3" /> Aktifkan Sekarang
                            </>
                          )}
                        </button>
                      </div>
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
