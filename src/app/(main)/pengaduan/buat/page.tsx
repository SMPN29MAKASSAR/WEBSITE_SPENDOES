/* eslint-disable */
// @ts-nocheck
"use client";
import ReCAPTCHA from "react-google-recaptcha";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MessageSquarePlus, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  User, 
  PhoneCall, 
  ListFilter, 
  FileText, 
  Copy, 
  Check, 
  RotateCw,
  Search,
  Paperclip,
  CloudUpload
} from "lucide-react";

export default function BuatPengaduan() {
  const [tips, setTips] = useState<string[]>([
    "Sampaikan laporan secara jelas, runtut, dan didasarkan pada fakta yang sebenarnya.",
    "Pilih kategori yang paling sesuai agar laporan langsung diteruskan ke bidang terkait.",
    "Sertakan nomor WhatsApp atau Email aktif untuk mempermudah konfirmasi dan tindak lanjut.",
    "Setelah berhasil mengirim, simpan Nomor Tiket yang diberikan untuk mengecek status aduan Anda.",
    "Waktu respons awal adalah 1x24 jam kerja oleh tim admin pengaduan sekolah."
  ]);
  
  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      if (data.pengaduan_tips) {
        setTips(data.pengaduan_tips.split("\n").filter((t: string) => t.trim().length > 0));
      }
    });
  }, []);
  
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    kategori: "Fasilitas",
    isiAduan: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ tiketId: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Harap centang verifikasi Captcha (I'm not a robot).");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessData(null);

    try {
      let lampiranUrl = "";
      
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
           throw new Error("Ukuran file maksimal 2MB");
        }
        const uploadData = new FormData();
        uploadData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
        if (!uploadRes.ok) throw new Error("Gagal mengunggah lampiran");
        const { url } = await uploadRes.json();
        lampiranUrl = url;
      }

      const res = await fetch("/api/pengaduan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, lampiran: lampiranUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim pengaduan. Silakan coba kembali.");
      }

      setSuccessData({ tiketId: data.data.tiketId });
      setFormData({ nama: "", email: "", kategori: "Fasilitas", isiAduan: "" });
      setFile(null);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses pengaduan Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTicket = () => {
    if (successData?.tiketId) {
      navigator.clipboard.writeText(successData.tiketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb / Top Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Layanan Pengaduan & Aspirasi Publik SMPN 29 Makassar
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Buat Pengaduan Baru
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">
            Sampaikan masukan, saran, atau aduan Anda demi terciptanya lingkungan sekolah yang berintegritas dan kondusif.
          </p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Green Card: Buat Pengaduan */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white p-7 shadow-xl shadow-emerald-900/10 border border-emerald-600/30">
              <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-5 border border-white/20">
                  <MessageSquarePlus className="w-6 h-6 text-emerald-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">Buat Pengaduan</h3>
                <p className="text-emerald-100/90 text-sm leading-relaxed">
                  Layanan pengaduan SMPN 29 Makassar adalah sarana resmi bagi siswa, orang tua, dan masyarakat untuk menyampaikan keluhan serta aspirasi secara langsung, cepat, dan aman.
                </p>
              </div>
            </div>

            {/* White Card: Tips */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Tips Menyampaikan Pengaduan</h4>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-600">
                  {tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
            </div>

            {/* Small Button Card: Sudah Buat Pengaduan */}
            <Link
              href="/pengaduan/lacak"
              className="group block bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Sudah Punya Tiket?</span>
                  <p className="text-slate-800 font-bold text-base mt-0.5 group-hover:text-emerald-700 transition-colors">
                    Sudah Buat Pengaduan?
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Cek status penyelesaian aduan Anda dengan nomor tiket.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/70 overflow-hidden">
              
              {/* Gradient Header (Green to Orange) */}
              <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-orange-500 p-7 sm:p-8 text-white relative">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <h2 className="text-2xl font-bold tracking-tight">Form Pengaduan</h2>
                <p className="text-emerald-100 text-sm mt-1.5">
                  Isi formulir berikut dengan data yang benar. Identitas Anda akan dijaga kerahasiaannya.
                </p>
              </div>

              {/* Form & Success States */}
              <div className="p-7 sm:p-8">
                {successData ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl mx-auto flex items-center justify-center mb-5 shadow-inner">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Pengaduan Berhasil Dikirim!
                    </h3>
                    <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                      Terima kasih atas laporan Anda. Harap simpan <strong>Nomor Tiket</strong> berikut untuk melacak perkembangan penanganan pengaduan:
                    </p>

                    {/* Ticket Display Box */}
                    <div className="inline-flex items-center gap-3 bg-slate-50 border-2 border-dashed border-emerald-300 px-5 py-3.5 rounded-2xl mb-6 shadow-sm">
                      <span className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-700 tracking-wider">
                        {successData.tiketId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyTicket}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <Link
                        href="/pengaduan/lacak"
                        className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                      >
                        Lacak Pengaduan Sekarang <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setSuccessData(null)}
                        className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition"
                      >
                        Kirim Pengaduan Lainnya
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                        <div>
                          <p className="font-semibold">Gagal Mengirim</p>
                          <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                        </div>
                      </div>
                    )}

                    {/* Nama Pelapor */}
                    <div>
                      <label htmlFor="nama" className="block text-sm font-semibold text-slate-700 mb-2">
                        Nama Lengkap Pelapor <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          id="nama"
                          type="text"
                          name="nama"
                          required
                          value={formData.nama}
                          onChange={handleChange}
                          placeholder="Masukkan nama lengkap Anda"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition"
                        />
                      </div>
                    </div>

                    {/* WhatsApp / Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                        Nomor WhatsApp / Email <span className="text-slate-400 font-normal">(Opsional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <PhoneCall className="w-5 h-5" />
                        </div>
                        <input
                          id="email"
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Contoh: 08123456789 atau nama@email.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">
                        Digunakan petugas jika memerlukan klarifikasi tambahan terkait laporan Anda.
                      </p>
                    </div>

                    {/* Kategori */}
                    <div>
                      <label htmlFor="kategori" className="block text-sm font-semibold text-slate-700 mb-2">
                        Kategori Pengaduan <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <ListFilter className="w-5 h-5" />
                        </div>
                        <select
                          id="kategori"
                          name="kategori"
                          value={formData.kategori}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition bg-white"
                        >
                          <option value="Fasilitas">Fasilitas & Sarana Prasarana</option>
                          <option value="Pelayanan">Pelayanan Administrasi & Guru</option>
                          <option value="Bullying">Pencegahan Perundungan (Bullying)</option>
                          <option value="Akademik">Kegiatan Pembelajaran / Akademik</option>
                          <option value="Lainnya">Pengaduan Lainnya</option>
                        </select>
                      </div>
                    </div>

                    {/* Isi Aduan */}
                    <div>
                      <label htmlFor="isiAduan" className="block text-sm font-semibold text-slate-700 mb-2">
                        Isi Pengaduan / Aduan <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          id="isiAduan"
                          name="isiAduan"
                          rows={5}
                          required
                          value={formData.isiAduan}
                          onChange={handleChange}
                          placeholder="Ceritakan detail aduan Anda secara rinci, termasuk waktu kejadian, tempat kejadian, atau pihak yang terlibat..."
                          className="w-full p-4 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition"
                        />
                      </div>
                    </div>

                    {/* Lampiran (Opsional) */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <Paperclip className="w-4 h-4 text-orange-500" />
                        Lampiran <span className="text-slate-400 font-normal">(Opsional)</span>
                      </label>
                      <label 
                        htmlFor="lampiran" 
                        className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-orange-300 bg-slate-50 hover:bg-orange-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-colors group"
                      >
                        <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <CloudUpload className="w-6 h-6" />
                        </div>
                        {file ? (
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-700 text-sm">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-700 text-sm">Klik untuk upload file</p>
                            <p className="text-xs text-slate-500">PDF, JPG, atau PNG (Maks. 2MB)</p>
                          </div>
                        )}
                        <input 
                          id="lampiran" 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>

                    {/* Big Orange Submit Button */}
                    
                    <div className="mb-6 flex justify-center w-full">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={setCaptchaToken}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 flex items-center justify-center gap-2 text-base ${
                        loading ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <>
                          <RotateCw className="w-5 h-5 animate-spin" />
                          <span>Mengirimkan Pengaduan...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Kirim Pengaduan Sekarang</span>
                        </>
                      )}
                    </button>
                    
                    <Link 
                      href="/pengaduan/lacak"
                      className="w-full mt-4 bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 active:scale-[0.99] font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base text-center"
                    >
                      <Search className="w-5 h-5" />
                      <span>Lacak Status Pengaduan</span>
                    </Link>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
