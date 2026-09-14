"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

type Pegawai = {
  id: string;
  nama: string;
  nip: string | null;
  jabatan: string;
  mapel: string | null;
  foto: string | null;
  nomorWa: string | null;
};

export default function GuruAdminPage() {
  const [data, setData] = useState<Pegawai[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    mapel: "",
    foto: "",
    nomorWa: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("/api/pegawai");
    const json = await res.json();
    setData(json);
    setIsLoading(false);
  };

  const uploadFile = async (f: File) => {
    const uploadData = new FormData();
    uploadData.append("file", f);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: uploadData,
    });
    if (res.ok) {
      const { url } = await res.json();
      return url;
    }
    throw new Error("Upload failed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let photoUrl = formData.foto;
      if (file) {
        photoUrl = await uploadFile(file);
      }

      const payload = { ...formData, foto: photoUrl };

      if (editingId) {
        await fetch(`/api/pegawai/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/pegawai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pegawai ini?")) return;
    await fetch(`/api/pegawai/${id}`, {
      method: "DELETE",
    });
    fetchData();
  };

  const openEdit = (pegawai: Pegawai) => {
    setEditingId(pegawai.id);
    setFormData({
      nama: pegawai.nama,
      nip: pegawai.nip || "",
      jabatan: pegawai.jabatan,
      mapel: pegawai.mapel || "",
      foto: pegawai.foto || "",
      nomorWa: pegawai.nomorWa || "",
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ nama: "", nip: "", jabatan: "", mapel: "", foto: "", nomorWa: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Data Pegawai (Guru & Staf)</h2>
          <p className="text-sm text-slate-500">Kelola informasi guru dan staf sekolah</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Pegawai
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">NIP</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Jabatan</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Mapel</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">No. WA</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.nama}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.nip || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.jabatan}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.mapel || "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.nomorWa || "-"}</td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                    Belum ada data pegawai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-2">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Pegawai" : "Tambah Pegawai"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  required
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NIP (Opsional)</label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jabatan</label>
                <input
                  required
                  type="text"
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran (Opsional)</label>
                <input
                  type="text"
                  value={formData.mapel}
                  onChange={(e) => setFormData({ ...formData, mapel: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor WA (Opsional)</label>
                <input
                  type="text"
                  placeholder="Cth: 628123456789"
                  value={formData.nomorWa}
                  onChange={(e) => setFormData({ ...formData, nomorWa: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Foto Pegawai (Opsional)</label>
                {formData.foto && !file && (
                  <div className="mb-2 text-xs text-slate-500">
                    Foto saat ini: <img src={formData.foto} alt="Foto" className="h-10 w-10 object-cover inline-block ml-2 rounded" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
