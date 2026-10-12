"use client";

import React, { useState } from "react";
import {
  CalendarPlus,
  Clock,
  MapPin,
  Users,
  BookOpen,
  User,
  Phone,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Send,
  Share2,
} from "lucide-react";
import { BONSAI_ZONES } from "./data";
import { BookingData } from "./BonsaiDashboard";

interface BonsaiBookingFormProps {
  initialZone?: string;
  onSuccess: (newBooking: BookingData) => void;
  onNavigateDashboard: () => void;
}

export default function BonsaiBookingForm({
  initialZone,
  onSuccess,
  onNavigateDashboard,
}: BonsaiBookingFormProps) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [tanggal, setTanggal] = useState(tomorrow);
  const [jamMulai, setJamMulai] = useState("08:00");
  const [jamSelesai, setJamSelesai] = useState("09:30");
  const [kelas, setKelas] = useState("VII A");
  const [mataPelajaran, setMataPelajaran] = useState("");
  const [namaGuru, setNamaGuru] = useState("");
  const [nomorWa, setNomorWa] = useState("");
  const [jumlahSiswa, setJumlahSiswa] = useState(32);
  const [zona, setZona] = useState(
    initialZone || "Zona 1: Taman TOGA & Herbal Edukasi"
  );
  const [tujuan, setTujuan] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successBooking, setSuccessBooking] = useState<BookingData | null>(null);

  const KELAS_OPTIONS = [
    "VII A", "VII B", "VII C", "VII D", "VII E", "VII F", "VII G", "VII H",
    "VIII A", "VIII B", "VIII C", "VIII D", "VIII E", "VIII F", "VIII G", "VIII H",
    "IX A", "IX B", "IX C", "IX D", "IX E", "IX F", "IX G", "IX H",
    "Gabungan Rombel / Ekskul Lingkungan",
  ];

  const MAPEL_PRESETS = [
    "IPA (Biologi Tumbuhan & Ekosistem)",
    "Prakarya (Pengolahan Sampah & Kompos)",
    "Prakarya (Budidaya Hidroponik)",
    "Bahasa Indonesia (Puisi & Literasi Alam)",
    "Bahasa Inggris (Outdoor Storytelling)",
    "Seni Budaya (Melukis Lanskap Alam)",
    "PJOK (Aktivitas Kebugaran Terbuka)",
    "IPS (Pemanfaatan Sumber Daya Alam)",
    "PAI & BP (Tadabbur Alam & Ciptaan-Nya)",
    "Proyek P5 - Gaya Hidup Berkelanjutan",
    "Proyek P5 - Rekayasa & Teknologi",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!tanggal || !jamMulai || !jamSelesai || !kelas || !mataPelajaran || !namaGuru || !zona || !tujuan) {
      setErrorMessage("Harap lengkapi semua isian formulir yang berbintang (*).");
      return;
    }

    if (jamMulai >= jamSelesai) {
      setErrorMessage("Jam berakhir harus lebih lambat dari jam mulai pembelajaran.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bonsai/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tanggal,
          jamMulai,
          jamSelesai,
          kelas,
          mataPelajaran,
          namaGuru,
          nomorWa,
          jumlahSiswa: Number(jumlahSiswa),
          zona,
          tujuan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirimkan permohonan booking.");
      }

      setSuccessBooking(data.booking);
      onSuccess(data.booking);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const selectedZoneData = BONSAI_ZONES.find((z) => zona.includes(z.code) || zona === z.nama);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Modal / Banner Sukses */}
      {successBooking ? (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-200 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
            Permohonan Berhasil Dikirimkan!
          </span>
          <h3 className="text-2xl font-black text-slate-900">
            Booking Outing Kelas Telah Masuk ke Sistem
          </h3>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mt-2">
            Permohonan Anda tercatat dengan kode registrasi resmi di bawah ini. Tim Pengelola BONSAI akan segera meninjau ketersediaan zona.
          </p>

          <div className="my-6 max-w-md mx-auto bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 text-left space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
              <span className="text-xs text-slate-500 font-medium">Kode Booking:</span>
              <span className="font-mono font-black text-emerald-800 text-base">
                {successBooking.kodeBooking}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Tanggal &amp; Jam:</span>
              <span className="font-bold text-slate-800">
                {successBooking.tanggal} ({successBooking.jamMulai} - {successBooking.jamSelesai} WITA)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Kelas &amp; Mapel:</span>
              <span className="font-bold text-slate-800">
                {successBooking.kelas} &bull; {successBooking.mataPelajaran}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Guru Pengampu:</span>
              <span className="font-bold text-slate-800">{successBooking.namaGuru}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200/60">
              <span className="text-slate-500">Zona Dipilih:</span>
              <span className="font-bold text-emerald-900">{successBooking.zona}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `*NOTIFIKASI BOOKING OUTING BONSAI CENTER*\n` +
                  `Kode: ${successBooking.kodeBooking}\n` +
                  `Guru: ${successBooking.namaGuru}\n` +
                  `Kelas: ${successBooking.kelas} (${successBooking.jumlahSiswa} Siswa)\n` +
                  `Mapel: ${successBooking.mataPelajaran}\n` +
                  `Tanggal: ${successBooking.tanggal} (${successBooking.jamMulai} - ${successBooking.jamSelesai})\n` +
                  `Zona: ${successBooking.zona}\n` +
                  `Tujuan: ${successBooking.tujuan}\n\n` +
                  `Mohon persetujuan dari Koordinator Tim BONSAI SMPN 29 Makassar. Terima kasih!`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan / Konfirmasi via WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setSuccessBooking(null);
                setMataPelajaran("");
                setTujuan("");
              }}
              className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition"
            >
              + Ajukan Booking Lainnya
            </button>

            <button
              onClick={onNavigateDashboard}
              className="px-4 py-3 rounded-2xl border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-xs sm:text-sm transition"
            >
              Buka Dashboard Pembelajaran
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Utama (2 Kolom) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            <div className="border-b border-slate-100 pb-5 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2 border border-teal-200/60">
                <CalendarPlus className="w-3.5 h-3.5" />
                Reservasi Ruang Terbuka Hijau
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Formulir Booking Outing Kelas
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Lengkapi formulir di bawah ini untuk memesan salah satu dari 6 Zona Belajar BONSAI.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Permohonan Belum Dapat Diproses:</strong>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Tanggal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tanggal Outing *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Jam Mulai (WITA) *
                  </label>
                  <input
                    type="time"
                    required
                    value={jamMulai}
                    onChange={(e) => setJamMulai(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Jam Berakhir (WITA) *
                  </label>
                  <input
                    type="time"
                    required
                    value={jamSelesai}
                    onChange={(e) => setJamSelesai(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Row 2: Kelas & Jumlah Siswa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kelas / Rombongan Belajar *
                  </label>
                  <select
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  >
                    {KELAS_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Jumlah Siswa Ikut Serta *</span>
                    <span className="text-[11px] font-mono text-emerald-700">
                      {jumlahSiswa} Siswa
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={jumlahSiswa}
                      onChange={(e) => setJumlahSiswa(Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={jumlahSiswa}
                      onChange={(e) => setJumlahSiswa(Number(e.target.value))}
                      className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-center font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Mata Pelajaran */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mata Pelajaran / Topik Pembelajaran *
                </label>
                <input
                  type="text"
                  required
                  value={mataPelajaran}
                  onChange={(e) => setMataPelajaran(e.target.value)}
                  placeholder="Contoh: IPA (Observasi Keanekaragaman Daun & Toga)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
                {/* Mapel Quick Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 self-center">Pilihan cepat:</span>
                  {MAPEL_PRESETS.slice(0, 5).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setMataPelajaran(preset)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-600 transition"
                    >
                      {preset.split(" ")[0]} {preset.split("(")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Guru & Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Guru Pengampu *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={namaGuru}
                      onChange={(e) => setNamaGuru(e.target.value)}
                      placeholder="Nama lengkap beserta gelar"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nomor WhatsApp Guru (Opsional)
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={nomorWa}
                      onChange={(e) => setNomorWa(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Zona Pembelajaran */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Zona Pembelajaran BONSAI *
                </label>
                <select
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                >
                  {BONSAI_ZONES.map((z) => (
                    <option key={z.id} value={z.nama}>
                      {z.nama} (Kapasitas: {z.kapasitas} Siswa &bull; {z.lokasi})
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 6: Tujuan Pembelajaran */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tujuan &amp; Deskripsi Aktivitas Pembelajaran *
                </label>
                <textarea
                  required
                  rows={3}
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  placeholder="Jelaskan apa capaian belajar siswa dan bagaimana siswa akan memanfaatkan zona outdoor tersebut..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {loading ? "Mengirimkan Permohonan..." : "Kirim Permohonan Booking Outing"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Kolom Informasi & Panduan (1 Kolom) */}
          <div className="space-y-6">
            {/* Info Zona Terpilih */}
            {selectedZoneData && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200/80 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Zona Terpilih
                </div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {selectedZoneData.nama}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedZoneData.deskripsi}
                </p>

                <div className="mt-4 pt-3 border-t border-emerald-200/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-medium">Kapasitas Maksimal:</span>
                    <strong className="font-mono text-emerald-800">
                      {selectedZoneData.kapasitas} Siswa
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-medium">Lokasi:</span>
                    <span className="text-right text-slate-800 font-medium truncate max-w-[160px]">
                      {selectedZoneData.lokasi}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/60">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    Fasilitas Utama:
                  </span>
                  <ul className="text-[11px] text-slate-600 space-y-1">
                    {selectedZoneData.fasilitas.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">&bull;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Panduan Etika Outing */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-teal-600" />
                Ketentuan &amp; Tata Tertib Outing
              </h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                    1
                  </span>
                  <span>
                    Pengajuan booking idealnya diajukan minimal <strong>1 hari sebelum</strong> jadwal outing dilaksanakan.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                    2
                  </span>
                  <span>
                    Guru wajib mendampingi siswa selama pembelajaran berlangsung dan memastikan ketertiban area taman.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                    3
                  </span>
                  <span>
                    Terapkan gerakan <strong>LISA (Lihat Sampah Ambil)</strong> 5 menit sebelum kembali ke kelas.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                    4
                  </span>
                  <span>
                    Patuhi Standar Operasional Prosedur (SOP) BONSAI yang berlaku demi kenyamanan bersama.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
