"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Folder, ExternalLink } from "lucide-react";

type Administrasi = { 
  id: string; 
  nomor: string | null; 
  nama: string; 
  kategori: string;
  tanggal: string | null;
  ukuran: string | null;
  akses: string;
  fileUrl: string;
};

const PREDEFINED_CATEGORIES = ["Surat Keputusan (SK)", "Tata Tertib", "Surat Edaran", "Kurikulum"];

export default function AdministrasiAdminPage() {
  const [data, setData] = useState<Administrasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialForm = { 
    nomor: "", 
    nama: "", 
    kategoriSelect: "Surat Keputusan (SK)", 
    customKategori: "",
    tanggal: "", 
    ukuran: "", 
    akses: "Publik", 
    fileUrl: "" 
  };
  const [formData, setFormData] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const res = await fetch("/api/administrasi");
    setData(await res.json());
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const finalKategori = formData.kategoriSelect === "Lainnya" ? formData.customKategori : formData.kategoriSelect;

    const payload = {
        nomor: formData.nomor,
        nama: formData.nama,
        kategori: finalKategori,
        tanggal: formData.tanggal,
        ukuran: formData.ukuran,
        akses: formData.akses,
        fileUrl: formData.fileUrl
    };

    if (editingId) {
      await fetch(`/api/administrasi/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch("/api/administrasi", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    setIsModalOpen(false); resetForm(); fetchData(); setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus dokumen ini?")) return;
    await fetch(`/api/administrasi/${id}`, { method: "DELETE" });
    fetchData();
  };

  const resetForm = () => { setEditingId(null); setFormData(initialForm); };

  const handleEditClick = (item: Administrasi) => {
    const isCustom = !PREDEFINED_CATEGORIES.includes(item.kategori);
    setFormData({ 
      nomor: item.nomor || "", 
      nama: item.nama, 
      kategoriSelect: isCustom ? "Lainnya" : item.kategori,
      customKategori: isCustom ? item.kategori : "", 
      tanggal: item.tanggal || "", 
      ukuran: item.ukuran || "", 
      akses: item.akses, 
      fileUrl: item.fileUrl 
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Administrasi & Dokumen</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola berkas, SK, dan Tata Tertib.</p>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium">
          <Plus className="w-4 h-4"/> Tambah Berkas
        </button>
      </div>

      {isLoading ? <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" /> : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600 uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">Nomor & Nama Dokumen</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Akses</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-slate-800">{item.nama}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Folder className="w-3 h-3"/> {item.nomor || "Tanpa Nomor"} 
                      {item.ukuran && <span className="text-slate-400">| {item.ukuran}</span>}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600"><span className="px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200 text-xs font-medium">{item.kategori}</span></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.tanggal || "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.akses === "Publik" 
                      ? <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded font-medium text-xs">Publik</span>
                      : <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded font-medium text-xs">Internal</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100" title="Buka Link">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button onClick={() => handleEditClick(item)} className="p-1.5 text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">Belum ada dokumen yang ditambahkan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-xl my-8">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? "Edit Dokumen" : "Tambah Dokumen"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Dokumen *</label>
                  <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Cth: SK Pembagian Tugas..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Dokumen</label>
                  <input type="text" value={formData.nomor} onChange={e => setFormData({...formData, nomor: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Cth: SK/012/VII/2025" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori *</label>
                  <select required value={formData.kategoriSelect} onChange={e => setFormData({...formData, kategoriSelect: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    {PREDEFINED_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value="Lainnya">Lainnya (Ketik Manual)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hak Akses *</label>
                  <select required value={formData.akses} onChange={e => setFormData({...formData, akses: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    <option value="Publik">Publik (Semua Orang)</option>
                    <option value="Internal">Internal (Hanya Guru/Pegawai)</option>
                  </select>
                </div>
              </div>

              {formData.kategoriSelect === "Lainnya" && (
                <div className="animate-in fade-in slide-in-from-top-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kategori Kustom *</label>
                  <input required type="text" value={formData.customKategori} onChange={e => setFormData({...formData, customKategori: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ketik nama kategori..." />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Terbit</label>
                  <input type="date" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ukuran (Opsional)</label>
                  <input type="text" value={formData.ukuran} onChange={e => setFormData({...formData, ukuran: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Cth: 1.4 MB" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link File / Dokumen (Google Drive, dll) *</label>
                <div className="text-xs text-amber-600 mb-2 bg-amber-50 p-2 rounded border border-amber-200">
                  Karena keterbatasan penyimpanan server, silakan upload file PDF/Word Anda ke Google Drive dan tempelkan link (yang sudah diset "Anyone with the link") di bawah ini.
                </div>
                <input required type="url" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://drive.google.com/..." />
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition">Batal</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
                  {isSaving ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
