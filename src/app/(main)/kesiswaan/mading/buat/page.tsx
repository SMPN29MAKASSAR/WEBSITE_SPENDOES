/* eslint-disable */
// @ts-nocheck
"use client";
import { useState } from "react";
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function BuatKaryaPage() {
  const [form, setForm] = useState({ judul: "", namaPenulis: "", kelas: "", kategori: "Puisi", content: "", imageUrl: "" });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    setLoading(true);
    await fetch("/api/mading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
        <h1 className="text-3xl font-bold font-jakarta text-slate-900 mb-4 text-center">Karya Berhasil Dikirim!</h1>
        <p className="text-slate-600 text-center max-w-md mb-8">Terima kasih telah berpartisipasi. Karya kamu sedang menunggu persetujuan dari Admin (Guru) sebelum ditampilkan di Mading Digital.</p>
        <Link href="/kesiswaan/mading" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all">Kembali ke Mading</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold font-jakarta text-slate-900 mb-4">Kirim Karya Kamu</h1>
          <p className="text-slate-600">Tunjukkan kreativitasmu! Isi formulir di bawah ini untuk mengirimkan puisimu, cerpen, artikel, atau hasil karya seni.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Judul Karya *</label>
              <input type="text" required value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" placeholder="Misal: Senja di Halaman Sekolah" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap *</label>
              <input type="text" required value={form.namaPenulis} onChange={e => setForm({...form, namaPenulis: e.target.value})} className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" placeholder="Masukkan nama lengkapmu" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kelas (Opsional)</label>
              <input type="text" value={form.kelas} onChange={e => setForm({...form, kelas: e.target.value})} className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" placeholder="Misal: IX A" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Karya *</label>
              <select required value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                <option value="Puisi">Puisi</option>
                <option value="Cerpen">Cerita Pendek (Cerpen)</option>
                <option value="Artikel">Artikel / Opini</option>
                <option value="Seni Rupa">Seni Rupa (Lukisan/Kriya)</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Isi Karya (Untuk Teks)</label>
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 h-48" placeholder="Ketik tulisanmu di sini..." />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Unggah Gambar/Ilustrasi (Opsional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="pointer-events-none flex flex-col items-center justify-center gap-3">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  ) : form.imageUrl ? (
                    <img src={form.imageUrl} className="h-32 object-contain rounded-lg shadow-sm" />
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-slate-400" />
                      <p className="text-slate-500 font-medium">Klik atau seret gambar ke sini</p>
                      <p className="text-xs text-slate-400">Wajib jika karya berupa Seni Rupa</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Mengirim..." : "Kirim Karya"}
          </button>
        </form>
      </div>
    </div>
  );
}
