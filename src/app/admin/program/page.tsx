"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

type Program = { id: string; nama: string; deskripsi: string | null; icon: string | null; };
const COMMON_ICONS = ["BookOpen", "Users", "Leaf", "Trophy", "Award", "Globe", "Laptop", "Heart", "Star", "Shield", "Target", "Compass", "GraduationCap", "Cpu", "Code", "Lightbulb"];

export default function ProgramAdminPage() {
  const [data, setData] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nama: "", deskripsi: "", icon: "BookOpen" });

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setData(await (await fetch("/api/program")).json()); setIsLoading(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) await fetch(`/api/program/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    else await fetch("/api/program", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    setIsModalOpen(false); resetForm(); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus program ini?")) return;
    await fetch(`/api/program/${id}`, { method: "DELETE" }); fetchData();
  };
  const resetForm = () => { setEditingId(null); setFormData({ nama: "", deskripsi: "", icon: "BookOpen" }); };
  const renderIcon = (iconName: string) => { const Icon = (LucideIcons as any)[iconName] || LucideIcons.BookOpen; return <Icon className="w-5 h-5" />; };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="text-xl font-bold text-slate-800">Manajemen Program Kami</h2></div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition"><Plus className="w-4 h-4"/> Tambah Program</button>
      </div>
      {isLoading ? <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" /> : (
        <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
          <thead><tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600"><th className="px-4 py-3 w-16">Ikon</th><th className="px-4 py-3">Nama Program</th><th className="px-4 py-3">Deskripsi Singkat</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3"><div className="w-10 h-10 bg-slate-100 text-slate-600 flex items-center justify-center rounded-md border">{renderIcon(item.icon || "BookOpen")}</div></td>
                <td className="px-4 py-3 text-sm font-semibold">{item.nama}</td><td className="px-4 py-3 text-sm text-slate-500">{item.deskripsi}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button onClick={() => { setEditingId(item.id); setFormData({ nama: item.nama, deskripsi: item.deskripsi || "", icon: item.icon || "BookOpen" }); setIsModalOpen(true); }} className="p-1.5 text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl"><h3 className="text-lg font-bold mb-4 text-slate-800">{editingId ? "Edit Program" : "Tambah Program Baru"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Program</label>
                <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Ikon</label>
                <div className="grid grid-cols-8 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {COMMON_ICONS.map(i => <div key={i} onClick={() => setFormData({...formData, icon: i})} className={`cursor-pointer border rounded-md flex justify-center p-2 transition ${formData.icon === i ? 'bg-white border-emerald-500 text-emerald-600 shadow-sm ring-1 ring-emerald-500' : 'border-transparent text-slate-500 hover:bg-white hover:border-slate-300'}`}>{renderIcon(i)}</div>)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" rows={4} />
              </div>
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition">Batal</button><button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition">Simpan Data</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
