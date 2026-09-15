"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from "lucide-react";

export default function AdminPrestasi() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ id: "", namaSiswa: "", namaLomba: "", tingkat: "", tahun: "", deskripsi: "", imageUrl: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const res = await fetch("/api/prestasi");
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
    const url = isEditing ? `/api/prestasi/${form.id}` : "/api/prestasi";
    const method = isEditing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ id: "", namaSiswa: "", namaLomba: "", tingkat: "", tahun: "", deskripsi: "", imageUrl: "" });
    setIsEditing(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus?")) return;
    await fetch(`/api/prestasi/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-jakarta text-slate-800">Prestasi Siswa (Hall of Fame)</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nama Siswa / Tim" required value={form.namaSiswa} onChange={e => setForm({...form, namaSiswa: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500" />
            <input type="text" placeholder="Nama Perlombaan" required value={form.namaLomba} onChange={e => setForm({...form, namaLomba: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500" />
            <select required value={form.tingkat} onChange={e => setForm({...form, tingkat: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500">
              <option value="">Pilih Tingkat...</option>
              <option value="Sekolah">Tingkat Sekolah</option>
              <option value="Kota/Kabupaten">Kota / Kabupaten</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Nasional">Nasional</option>
              <option value="Internasional">Internasional</option>
            </select>
            <input type="number" placeholder="Tahun" required value={form.tahun} onChange={e => setForm({...form, tahun: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500" />
          </div>
          <textarea placeholder="Deskripsi Prestasi / Medali" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500" />
          <div className="flex gap-4 items-center">
            {form.imageUrl && <img src={form.imageUrl} className="h-16 w-16 object-cover rounded-xl" />}
            <input type="file" accept="image/*" onChange={handleFileUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100" />
            {uploading && <Loader2 className="w-5 h-5 animate-spin text-yellow-600" />}
          </div>
          <button type="submit" className="bg-yellow-500 text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-yellow-400">{isEditing ? "Update" : "Tambah"} Prestasi</button>
          {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm({id:"",namaSiswa:"",namaLomba:"",tingkat:"",tahun:"",deskripsi:"",imageUrl:""})}} className="ml-2 px-6 py-2 rounded-xl bg-slate-100 font-bold">Batal</button>}
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 p-4">
            {item.imageUrl ? <img src={item.imageUrl} className="w-20 h-20 object-cover rounded-xl" /> : <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center"><ImageIcon className="w-6 h-6 text-slate-300"/></div>}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 line-clamp-1">{item.namaLomba}</h3>
              <p className="text-sm font-semibold text-yellow-600 truncate">{item.namaSiswa}</p>
              <p className="text-xs text-slate-500 mt-1">{item.tingkat} • {item.tahun}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setForm({ ...item, tahun: String(item.tahun) }); setIsEditing(true); }} className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
