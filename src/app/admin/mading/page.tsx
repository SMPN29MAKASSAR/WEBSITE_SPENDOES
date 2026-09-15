"use client";
import { useState, useEffect } from "react";
import { Edit2, Trash2, Loader2, Image as ImageIcon, Check, X } from "lucide-react";

export default function AdminMading() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ id: "", judul: "", namaPenulis: "", kelas: "", kategori: "Puisi", content: "", imageUrl: "", status: "DISETUJUI" });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch("/api/mading");
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
    const url = isEditing ? `/api/mading/${form.id}` : "/api/mading";
    const method = isEditing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ id: "", judul: "", namaPenulis: "", kelas: "", kategori: "Puisi", content: "", imageUrl: "", status: "DISETUJUI" });
    setIsEditing(false);
    fetchItems();
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/mading/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus?")) return;
    await fetch(`/api/mading/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-jakarta text-slate-800">Verifikasi & Kelola Mading</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Judul Karya" required value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} className="col-span-2 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Nama Penulis" required value={form.namaPenulis} onChange={e => setForm({...form, namaPenulis: e.target.value})} className="col-span-1 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Kelas (Opsi)" value={form.kelas} onChange={e => setForm({...form, kelas: e.target.value})} className="col-span-1 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            
            <select required value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} className="col-span-2 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="Puisi">Puisi</option>
              <option value="Cerpen">Cerpen</option>
              <option value="Artikel">Artikel</option>
              <option value="Seni Rupa">Seni Rupa</option>
            </select>
            <select required value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="col-span-2 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold">
              <option value="MENUNGGU">Status: Menunggu Persetujuan</option>
              <option value="DISETUJUI">Status: Disetujui (Tampil di Publik)</option>
              <option value="DITOLAK">Status: Ditolak</option>
            </select>
          </div>
          
          <textarea placeholder="Isi Karya (Teks)" value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-32" />
          
          <div className="flex gap-4 items-center">
            {form.imageUrl && <img src={form.imageUrl} className="h-16 w-16 object-cover rounded-xl" />}
            <input type="file" accept="image/*" onChange={handleFileUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            {uploading && <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />}
          </div>
          
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700">{isEditing ? "Update" : "Publish Langsung"} Karya</button>
          {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm({id:"",judul:"",namaPenulis:"",kelas:"",kategori:"Puisi",content:"",imageUrl:"",status:"DISETUJUI"})}} className="ml-2 px-6 py-2 rounded-xl bg-slate-100 font-bold">Batal</button>}
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden border-2 ${item.status === 'MENUNGGU' ? 'border-yellow-400' : item.status === 'DISETUJUI' ? 'border-emerald-400' : 'border-red-400'}`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${item.status === 'MENUNGGU' ? 'bg-yellow-100 text-yellow-700' : item.status === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {item.status}
                </span>
                <span className="text-xs text-indigo-600 font-bold">{item.kategori}</span>
              </div>
              <h3 className="font-bold text-lg leading-tight mb-1">{item.judul}</h3>
              <p className="text-sm text-slate-500 italic mb-3">{item.namaPenulis} - {item.kelas}</p>
              
              {item.imageUrl && <img src={item.imageUrl} className="w-full h-32 object-cover rounded-lg mb-3" />}
              {item.content && <p className="text-sm text-slate-600 line-clamp-3 mb-4">{item.content}</p>}
              
              {item.status === 'MENUNGGU' && (
                <div className="flex gap-2 mb-3">
                  <button onClick={() => handleUpdateStatus(item.id, "DISETUJUI")} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1"><Check className="w-3 h-3"/> Terima</button>
                  <button onClick={() => handleUpdateStatus(item.id, "DITOLAK")} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1"><X className="w-3 h-3"/> Tolak</button>
                </div>
              )}
              
              <div className="flex gap-2">
                <button onClick={() => { setForm({ ...item, kelas: item.kelas || "", content: item.content || "" }); setIsEditing(true); window.scrollTo(0,0); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg">Edit / Review</button>
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
