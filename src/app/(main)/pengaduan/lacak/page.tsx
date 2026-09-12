"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  RotateCw, 
  XCircle, 
  Tag, 
  Calendar, 
  User, 
  Mail, 
  MessageSquareQuote,
  Sparkles,
  HelpCircle,
  Hash
} from "lucide-react";

export default function LacakPengaduan() {
  const [tiketId, setTiketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [tips, setTips] = useState<string[]>([
    "Pastikan nomor tiket sesuai dengan yang Anda terima.",
    "Respons pengaduan akan diproses dalam 1x24 jam kerja.",
    "Hubungi kami jika pengaduan tidak direspon dalam 3 hari."
  ]);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.pengaduan_tips) {
          const parsed = data.pengaduan_tips.split("\n").filter((t: string) => t.trim());
          if (parsed.length > 0) setTips(parsed);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = tiketId.trim();
    if (!cleanId) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/pengaduan?tiketId=${encodeURIComponent(cleanId)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Data pengaduan tidak ditemukan. Silakan periksa kembali nomor tiket Anda.");
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err.message || "Terjadi kendala saat mencari data pengaduan.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "SELESAI":
        return {
          label: "Selesai",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          badgeColor: "bg-emerald-500",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        };
      case "DIPROSES":
        return {
          label: "Sedang Diproses",
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          badgeColor: "bg-blue-500",
          icon: <RotateCw className="w-4 h-4 text-blue-600 animate-spin" />
        };
      case "DITOLAK":
        return {
          label: "Ditolak",
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          badgeColor: "bg-rose-500",
          icon: <XCircle className="w-4 h-4 text-rose-600" />
        };
      default:
        return {
          label: "Menunggu Peninjauan",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          badgeColor: "bg-amber-500",
          icon: <Clock className="w-4 h-4 text-amber-600" />
        };
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
            Lacak Status Pengaduan
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">
            Cek progres dan tindak lanjut laporan pengaduan Anda secara real-time dan transparan.
          </p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Green Card: Lacak Status */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white p-7 shadow-xl shadow-emerald-900/10 border border-emerald-600/30">
              <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-5 border border-white/20">
                  <ShieldCheck className="w-6 h-6 text-emerald-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lacak Status</h3>
                <p className="text-emerald-100/90 text-sm leading-relaxed">
                  SMPN 29 Makassar menjamin keterbukaan informasi atas setiap pengaduan yang diajukan oleh masyarakat, orang tua, maupun siswa. Pantau setiap tahapan tindak lanjut laporan Anda di sini.
                </p>
              </div>
            </div>

            {/* White Card: Tips */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Tips & Panduan</h4>
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

            {/* Small Button Card: Belum Buat Pengaduan */}
            <Link
              href="/pengaduan/buat"
              className="group block bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Punya Keluhan Baru?</span>
                  <p className="text-slate-800 font-bold text-base mt-0.5 group-hover:text-emerald-700 transition-colors">
                    Belum Buat Pengaduan?
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Klik di sini untuk mengisi formulir pengaduan baru secara mudah.
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
                <h2 className="text-2xl font-bold tracking-tight">Cek Status Pengaduan</h2>
                <p className="text-emerald-100 text-sm mt-1.5">
                  Masukkan ID Tiket yang Anda terima saat mengirimkan pengaduan untuk melihat status terkini.
                </p>
              </div>

              {/* Form & Content */}
              <div className="p-7 sm:p-8">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label htmlFor="tiketId" className="block text-sm font-semibold text-slate-700 mb-2">
                      Nomor Antrian / ID Tiket Pengaduan
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Hash className="w-5 h-5" />
                      </div>
                      <input
                        id="tiketId"
                        type="text"
                        required
                        value={tiketId}
                        onChange={(e) => setTiketId(e.target.value)}
                        placeholder="Contoh: TKT-XYZ123"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition"
                      />
                    </div>
                  </div>

                  {/* Big Orange Submit Button */}
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
                        <span>Mencari Pengaduan...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Lacak Pengaduan Sekarang</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Error State */}
                {error && (
                  <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                    <div>
                      <p className="font-semibold">Pencarian Gagal</p>
                      <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                {/* Result Section */}
                {result && (
                  <div className="mt-8 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                    {/* Header Result */}
                    <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tiket ID</span>
                        <h4 className="text-lg font-bold text-slate-900 font-mono">{result.tiketId}</h4>
                      </div>
                      <div>
                        {(() => {
                          const config = getStatusConfig(result.status);
                          return (
                            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${config.bg}`}>
                              {config.icon}
                              {config.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-6 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                            <User className="w-3.5 h-3.5 text-emerald-600" />
                            Nama Pelapor
                          </div>
                          <p className="text-sm font-semibold text-slate-900">{result.nama}</p>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                            <Tag className="w-3.5 h-3.5 text-emerald-600" />
                            Kategori Pengaduan
                          </div>
                          <p className="text-sm font-semibold text-slate-900">{result.kategori}</p>
                        </div>

                        {result.email && (
                          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                              <Mail className="w-3.5 h-3.5 text-emerald-600" />
                              Kontak / Email
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{result.email}</p>
                          </div>
                        )}

                        {result.createdAt && (
                          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                              Tanggal Diajukan
                            </div>
                            <p className="text-sm font-semibold text-slate-900">
                              {new Date(result.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Isi Aduan */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Isi Laporan / Aduan
                        </p>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                          {result.isiAduan}
                        </div>
                      </div>

                      {/* Tanggapan Petugas */}
                      {result.tanggapan ? (
                        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                            <MessageSquareQuote className="w-4 h-4 text-emerald-700" />
                            Tanggapan Resmi Petugas
                          </div>
                          <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                            {result.tanggapan}
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-800 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Belum ada tanggapan resmi dari pihak sekolah. Pengaduan Anda sedang dalam antrean tindak lanjut.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
