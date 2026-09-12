"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Image as ImageIcon } from "lucide-react";

type Ekstrakurikuler = { id: string; nama: string; deskripsi: string | null; imageUrl: string | null; };

export default function EkstrakurikulerAdminPage() {
  const [data, setData] = useState<Ekstrakurikuler[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nama: "", deskripsi: "", imageUrl: "" });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const res = await fetch("/api/ekstrakurikuler");
    setData(await res.json());
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    let uploadedUrl = formData.imageUrl;
    if (file) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      if (res.ok) uploadedUrl = (await res.json()).url;
      else { alert("Gagal mengunggah foto."); setIsUploading(false); return; }
    }
    const submitData = { ...formData, imageUrl: uploadedUrl };
    if (editingId) await fetch(`/api/ekstrakurikuler/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(submitData) });
    else await fetch("/api/ekstrakurikuler", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(submitData) });
    setIsModalOpen(false); resetForm(); fetchData(); setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    await fetch(`/api/ekstrakurikuler/${id}`, { method: "DELETE" });
    fetchData();
  };

  const resetForm = () => { setEditingId(null); setFormData({ nama: "", deskripsi: "", imageUrl: "" }); setFile(null); };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="text-xl font-bold text-slate-800">Manajemen Ekstrakurikuler</h2></div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"><Plus className="w-4 h-4"/> Tambah Data</button>
      </div>
      {isLoading ? <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" /> : (
        <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="px-4 py-3 w-24">Foto</th><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Deskripsi</th><th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">{item.imageUrl ? <img src={item.imageUrl} className="w-12 h-12 object-cover rounded-md border" /> : <div className="w-12 h-12 bg-slate-100 flex items-center justify-center rounded-md border"><ImageIcon className="w-5 h-5 text-slate-400" /></div>}</td>
                <td className="px-4 py-3 text-sm font-semibold">{item.nama}</td><td className="px-4 py-3 text-sm text-slate-500">{item.deskripsi}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button onClick={() => { setEditingId(item.id); setFormData({ nama: item.nama, deskripsi: item.deskripsi || "", imageUrl: item.imageUrl || "" }); setIsModalOpen(true); }} className="p-1.5 text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl"><h3 className="text-lg font-bold mb-4">{editingId ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Foto Sampul</label>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                {formData.imageUrl && !file && <img src={formData.imageUrl} className="mt-2 w-20 h-20 object-cover rounded-md" />}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" rows={4} />
              </div>
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition">Batal</button><button type="submit" disabled={isUploading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">{isUploading ? "Menyimpan..." : "Simpan Data"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
