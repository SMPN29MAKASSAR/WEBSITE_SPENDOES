/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from "lucide-react";

export default function AdminFasilitas() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ id: "", nama: "", deskripsi: "", imageUrl: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const res = await fetch("/api/fasilitas");
    const data = await res.json();
    setItems(data);
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
      if (result.url) setForm({ ...form, imageUrl: result.url });
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/fasilitas/${form.id}` : "/api/fasilitas";
    const method = isEditing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ id: "", nama: "", deskripsi: "", imageUrl: "" });
    setIsEditing(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus fasilitas ini?")) return;
    await fetch(`/api/fasilitas/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-jakarta text-slate-800">Fasilitas Sekolah</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nama Fasilitas" required value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
          <textarea placeholder="Deskripsi" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
          <div className="flex gap-4 items-center">
            {form.imageUrl && <img src={form.imageUrl} className="h-16 w-16 object-cover rounded-xl" />}
            <input type="file" accept="image/*" onChange={handleFileUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
            {uploading && <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />}
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700">{isEditing ? "Update" : "Tambah"} Fasilitas</button>
          {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm({id:"",nama:"",deskripsi:"",imageUrl:""})}} className="ml-2 px-6 py-2 rounded-xl bg-slate-100 font-bold">Batal</button>}
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-48 object-cover" /> : <div className="w-full h-48 bg-slate-100 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-slate-300"/></div>}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{item.nama}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{item.deskripsi}</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => { setForm(item); setIsEditing(true); }} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
