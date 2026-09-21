/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminAsesmen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    mataPelajaran: "",
    kelas: "7",
    linkUjian: "",
    icon: "Book",
    order: "0",
  });

  const availableIcons = [
    "Book", "BookOpen", "Calculator", "FlaskConical", "Globe", "PencilRuler",
    "Monitor", "Music", "Palette", "Dumbbell", "Languages", "FileText", "Library", "PenTool", "CheckSquare", "ClipboardList"
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/asesmen");
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (error) {
      toast.error("Gagal mengambil data asesmen");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const url = editingId ? `/api/asesmen/${editingId}` : "/api/asesmen";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingId ? "Berhasil diperbarui" : "Berhasil ditambahkan");
        fetchData();
        setEditingId(null);
        setFormData({ mataPelajaran: "", kelas: "7", linkUjian: "", icon: "Book", order: "0" });
      } else {
        toast.error("Terjadi kesalahan");
      }
    } catch (error) {
      toast.error("Gagal menyimpan data");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus mata pelajaran ini?")) return;
    try {
      const res = await fetch(`/api/asesmen/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Berhasil dihapus");
        fetchData();
      }
    } catch (error) {
      toast.error("Gagal menghapus");
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      mataPelajaran: item.mataPelajaran,
      kelas: item.kelas,
      linkUjian: item.linkUjian,
      icon: item.icon,
      order: item.order.toString(),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ mataPelajaran: "", kelas: "7", linkUjian: "", icon: "Book", order: "0" });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
        <LucideIcons.BookOpenCheck className="w-6 h-6" /> Kelola Asesmen Sumatif
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 sticky top-24">
            <h2 className="text-lg font-bold text-emerald-800 mb-4">
              {editingId ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                <input required type="text" value={formData.mataPelajaran} onChange={e => setFormData({...formData, mataPelajaran: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="Misal: Pendidikan Agama" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                <select value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                  <option value="7">Kelas 7</option>
                  <option value="8">Kelas 8</option>
                  <option value="9">Kelas 9</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Ujian</label>
                <input required type="url" value={formData.linkUjian} onChange={e => setFormData({...formData, linkUjian: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="https://forms.gle/..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Ikon</label>
                <select value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  Preview Ikon: 
                  {(() => {
                    const Icon = (LucideIcons as any)[formData.icon] || LucideIcons.Book;
                    return <Icon className="w-5 h-5 text-emerald-600" />;
                  })()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil</label>
                <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" disabled={formLoading} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50">
                  {formLoading ? "Menyimpan..." : "Simpan"}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {["7", "8", "9"].map((kelasMap) => {
            const kelasData = data.filter(d => d.kelas === kelasMap);
            if (kelasData.length === 0 && !loading) return null;
            
            return (
              <div key={kelasMap} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <h3 className="text-xl font-bold text-emerald-800 mb-4 border-b pb-2 flex items-center gap-2">
                  <LucideIcons.GraduationCap className="w-5 h-5" /> Kelas {kelasMap}
                </h3>
                <div className="space-y-3">
                  {kelasData.map((item) => {
                    const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Book;
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-xl hover:border-emerald-300 transition-colors bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{item.mataPelajaran}</div>
                            <a href={item.linkUjian} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline line-clamp-1">{item.linkUjian}</a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-md">Urutan: {item.order}</span>
                          <button onClick={() => handleEdit(item)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"><LucideIcons.Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><LucideIcons.Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {loading && <div className="text-center py-10 text-gray-500">Memuat data...</div>}
          {!loading && data.length === 0 && (
            <div className="text-center py-10 text-gray-500 bg-white rounded-2xl shadow-sm border">
              Belum ada data asesmen sumatif.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
