/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminAgenda() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ id: "", title: "", deskripsi: "", startDate: "", endDate: "", jenis: "Kegiatan" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch("/api/agenda");
    const data = await res.json();
    setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/agenda/${form.id}` : "/api/agenda";
    const method = isEditing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ id: "", title: "", deskripsi: "", startDate: "", endDate: "", jenis: "Kegiatan" });
    setIsEditing(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus agenda ini?")) return;
    await fetch(`/api/agenda/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-jakarta text-slate-800">Kalender Akademik & Agenda</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Judul Agenda" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea placeholder="Deskripsi Singkat" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex gap-4">
            <div className="flex-1"><label className="block text-xs mb-1 text-slate-500">Mulai</label><input type="datetime-local" required value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="flex-1"><label className="block text-xs mb-1 text-slate-500">Selesai (Opsional)</label><input type="datetime-local" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <select value={form.jenis} onChange={e => setForm({...form, jenis: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Kegiatan">Kegiatan</option>
            <option value="Ujian">Ujian / Penilaian</option>
            <option value="Libur">Libur</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">{isEditing ? "Update" : "Tambah"} Agenda</button>
          {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm({id:"",title:"",deskripsi:"",startDate:"",endDate:"",jenis:"Kegiatan"})}} className="ml-2 px-6 py-2 rounded-xl bg-slate-100 font-bold">Batal</button>}
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50"><tr><th className="p-4">Tanggal</th><th className="p-4">Agenda</th><th className="p-4">Jenis</th><th className="p-4 text-center">Aksi</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-4 text-sm">{new Date(item.startDate).toLocaleDateString("id-ID")}</td>
                <td className="p-4 font-bold">{item.title}</td>
                <td className="p-4"><span className="px-2 py-1 text-xs bg-slate-100 rounded-full">{item.jenis}</span></td>
                <td className="p-4 text-center">
                  <button onClick={() => { setForm({ ...item, startDate: item.startDate.slice(0,16), endDate: item.endDate ? item.endDate.slice(0,16) : "" }); setIsEditing(true); }} className="p-2 text-blue-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
