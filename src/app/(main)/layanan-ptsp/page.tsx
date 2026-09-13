"use client";

import { useState } from "react";
import { Building2, FileText, CheckCircle2, Clock, AlertCircle, FileCheck2, Send, Search, X, ShieldCheck, FileWarning, Database, GraduationCap } from "lucide-react";

const SOP_SERVICES = [
  {
    id: "legalisir",
    title: "Legalisir Ijazah / SKHUN",
    icon: <FileCheck2 className="w-8 h-8 text-emerald-600" />,
    syarat: [
      "Membawa Ijazah/SKHUN Asli untuk ditunjukkan",
      "Fotokopi Ijazah/SKHUN maksimal 5 lembar",
      "Map snelhecter berwarna hijau"
    ],
    waktu: "1 Hari Kerja",
    biaya: "Gratis",
    alur: "1. Serahkan berkas ke loket TU -> 2. Pemeriksaan keaslian -> 3. Pengesahan Kepala Sekolah -> 4. Pengambilan"
  },
  {
    id: "surat-aktif",
    title: "Surat Keterangan Aktif Siswa",
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    syarat: [
      "Fotokopi Rapor halaman biodata",
      "Pas foto ukuran 3x4 (1 lembar) menggunakan seragam"
    ],
    waktu: "1 Hari Kerja",
    biaya: "Gratis",
    alur: "1. Mengisi form pengajuan -> 2. Verifikasi Data Siswa -> 3. Pencetakan Surat -> 4. Pengambilan"
  },
  {
    id: "kelakuan-baik",
    title: "Surat Keterangan Berkelakuan Baik",
    icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
    syarat: [
      "Fotokopi Rapor terakhir",
      "Pas foto ukuran 3x4 (1 lembar)"
    ],
    waktu: "1 Hari Kerja",
    biaya: "Gratis",
    alur: "1. Mengisi form online -> 2. Verifikasi catatan Guru BK & Wali Kelas -> 3. Pengesahan Kepala Sekolah -> 4. Pengambilan di TU"
  },
  {
    id: "pindah-sekolah",
    title: "Surat Pindah Sekolah / Mutasi",
    icon: <Building2 className="w-8 h-8 text-amber-600" />,
    syarat: [
      "Surat Keterangan Diterima dari sekolah tujuan",
      "Buku Rapor Asli",
      "Fotokopi Kartu Keluarga (KK)"
    ],
    waktu: "2 Hari Kerja",
    biaya: "Gratis",
    alur: "1. Pengajuan berkas mutasi -> 2. Validasi bebas pustaka & administrasi -> 3. Penerbitan Surat Pindah -> 4. Penyerahan Dokumen"
  },
  {
    id: "perbaikan-dapodik",
    title: "Perbaikan Data Siswa (Dapodik / NISN)",
    icon: <Database className="w-8 h-8 text-cyan-600" />,
    syarat: [
      "Fotokopi Akta Kelahiran",
      "Fotokopi Kartu Keluarga (KK)",
      "Bukti / Screenshot kesalahan data sebelumnya"
    ],
    waktu: "1 - 3 Hari Kerja",
    biaya: "Gratis",
    alur: "1. Pengajuan perbaikan data -> 2. Verifikasi kelengkapan berkas -> 3. Sinkronisasi Data oleh Operator Sekolah -> 4. Konfirmasi Selesai"
  },
  {
    id: "surat-hilang",
    title: "Suket Kehilangan Ijazah / Rapor",
    icon: <FileWarning className="w-8 h-8 text-red-600" />,
    syarat: [
      "Surat Keterangan Kehilangan dari Kepolisian (Asli)",
      "Fotokopi Ijazah/Rapor yang hilang (jika ada)",
      "Fotokopi Akta Kelahiran & KK"
    ],
    waktu: "2 Hari Kerja",
    biaya: "Gratis",
    alur: "1. Pengajuan form online -> 2. Bawa syarat Asli ke loket -> 3. Pencarian arsip & Penerbitan Surat Pengganti -> 4. Pengesahan"
  },
  {
    id: "skl",
    title: "Surat Keterangan Lulus (SKL)",
    icon: <GraduationCap className="w-8 h-8 text-teal-600" />,
    syarat: [
      "Telah menyelesaikan seluruh rangkaian ujian (dibuktikan dengan Kartu Ujian)",
      "Pas foto 3x4 berwarna (2 lembar)"
    ],
    waktu: "1 Hari Kerja",
    biaya: "Gratis",
    alur: "1. Pengajuan SKL online -> 2. Verifikasi nilai & kurikulum -> 3. Pencetakan SKL -> 4. TTD Kepala Sekolah & Pengambilan"
  },
  {
    id: "izin-penelitian",
    title: "Surat Izin Penelitian / Observasi",
    icon: <Search className="w-8 h-8 text-purple-600" />,
    syarat: [
      "Surat Pengantar Resmi dari Universitas / Instansi terkait",
      "Proposal Singkat / Instrumen Penelitian"
    ],
    waktu: "1 - 2 Hari Kerja",
    biaya: "Gratis",
    alur: "1. Serahkan surat pengantar ke loket -> 2. Persetujuan Kepala Sekolah -> 3. Penerbitan Surat Izin Balasan -> 4. Penelitian dimulai"
  }
];

export default function LayananPTSP() {
  const [selectedSop, setSelectedSop] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"sop" | "form" | "lacak">("sop");

  // Form State
  const [formData, setFormData] = useState({ name: "", identityId: "", serviceType: "Legalisir Ijazah / SKHUN", purpose: "", contactWa: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState("");

  // Track State
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/ptsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmittedTicket(data.ticketId);
        setFormData({ name: "", identityId: "", serviceType: "Legalisir Ijazah / SKHUN", purpose: "", contactWa: "" });
      }
    } catch (error) {
      alert("Gagal mengirim pengajuan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId) return;
    setIsTracking(true);
    try {
      const res = await fetch(`/api/ptsp?ticketId=${trackId}`);
      if (res.ok) {
        const data = await res.json();
        setTrackResult(data);
      } else {
        setTrackResult({ error: "Tiket tidak ditemukan" });
      }
    } catch (error) {
      setTrackResult({ error: "Terjadi kesalahan" });
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-4">
            <Building2 className="w-10 h-10 text-emerald-700" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-jakarta text-slate-800 mb-4">Layanan Terpadu Satu Pintu (PTSP)</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Komitmen kami untuk memberikan layanan administrasi yang cepat, transparan, dan terintegrasi dengan Standard Operating Procedure (SOP) yang jelas bagi seluruh warga sekolah.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-full shadow-sm p-1.5 flex gap-2 border border-slate-200">
            <button 
              onClick={() => setActiveTab("sop")}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${activeTab === 'sop' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Info & SOP Layanan
            </button>
            <button 
              onClick={() => setActiveTab("form")}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${activeTab === 'form' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Ajukan Permohonan
            </button>
            <button 
              onClick={() => setActiveTab("lacak")}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${activeTab === 'lacak' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Lacak Status
            </button>
          </div>
        </div>

        {/* SOP Content */}
        {activeTab === "sop" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SOP_SERVICES.map(sop => (
              <div key={sop.id} onClick={() => setSelectedSop(sop)} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                    {sop.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">{sop.title}</h3>
                    <p className="text-slate-500 text-sm mb-4">Klik untuk melihat detail persyaratan, alur, dan estimasi waktu pelayanan (SOP).</p>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {sop.biaya}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" /> {sop.waktu}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Content */}
        {activeTab === "form" && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            {submittedTicket ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Permohonan Berhasil Dibuat!</h2>
                <p className="text-slate-600 mb-6">Ini adalah Nomor Tiket PTSP Anda. Simpan nomor ini untuk melacak status.</p>
                <div className="bg-slate-100 py-4 px-8 rounded-xl inline-block mb-8">
                  <span className="text-3xl font-mono font-bold text-emerald-700 tracking-wider">{submittedTicket}</span>
                </div>
                <div>
                  <button onClick={() => { setSubmittedTicket(""); setActiveTab("lacak"); setTrackId(submittedTicket); handleTrack({ preventDefault: () => {} } as any); }} className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700">Lacak Status Sekarang</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Form Pengajuan Layanan</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Layanan</label>
                    <select required value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-slate-50">
                      {SOP_SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                      <option value="Lainnya">Lainnya...</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap Pemohon</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" placeholder="Masukkan nama lengkap" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">NISN / NIK</label>
                    <input type="text" required value={formData.identityId} onChange={e => setFormData({...formData, identityId: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" placeholder="Nomor Induk Siswa Nasional / NIK KTP" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
                    <input type="text" required value={formData.contactWa} onChange={e => setFormData({...formData, contactWa: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" placeholder="081234567890" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Keperluan / Keterangan Tambahan</label>
                    <textarea required value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" placeholder="Jelaskan keperluan Anda secara singkat..."></textarea>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex justify-center items-center gap-2">
                    {isSubmitting ? "Mengirim..." : <><Send className="w-5 h-5" /> Kirim Permohonan</>}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* Lacak Content */}
        {activeTab === "lacak" && (
          <div className="max-w-xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-emerald-600" /> Cek Status Permohonan</h2>
              <form onSubmit={handleTrack} className="flex gap-2">
                <input 
                  type="text" 
                  required 
                  value={trackId} 
                  onChange={e => setTrackId(e.target.value.toUpperCase())}
                  placeholder="Masukkan Nomor Tiket (Contoh: PTSP-ABCD1)" 
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                />
                <button type="submit" disabled={isTracking} className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                  Cari
                </button>
              </form>
            </div>

            {trackResult && (
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 relative overflow-hidden">
                {trackResult.error ? (
                  <div className="text-center text-red-500 py-4 flex flex-col items-center">
                    <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                    <p className="font-semibold">{trackResult.error}</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-sm text-slate-500 font-medium mb-1">Tiket PTSP</p>
                        <h3 className="text-2xl font-mono font-bold text-slate-800">{trackResult.ticketId}</h3>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                        trackResult.status === 'SELESAI' ? 'bg-emerald-100 text-emerald-700' :
                        trackResult.status === 'DIPROSES' ? 'bg-blue-100 text-blue-700' :
                        trackResult.status === 'DITOLAK' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {trackResult.status}
                      </span>
                    </div>
                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Pemohon</p>
                        <p className="font-semibold text-slate-800">{trackResult.name} ({trackResult.identityId})</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Layanan</p>
                        <p className="font-semibold text-slate-800">{trackResult.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Keperluan</p>
                        <p className="font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{trackResult.purpose}</p>
                      </div>
                    </div>
                    {trackResult.response && (
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                        <p className="text-xs font-bold text-blue-800 mb-1 uppercase tracking-wider">Tanggapan Petugas</p>
                        <p className="text-blue-900 font-medium">{trackResult.response}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal SOP */}
      {selectedSop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-4">
                {selectedSop.icon}
                <h3 className="text-xl font-bold text-slate-800">{selectedSop.title}</h3>
              </div>
              <button onClick={() => setSelectedSop(null)} className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-500 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" /> Persyaratan (Wajib Dibawa)
                </h4>
                <ul className="space-y-2">
                  {selectedSop.syarat.map((s: string, i: number) => (
                    <li key={i} className="flex gap-3 text-slate-600 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-blue-600" /> Alur Proses Layanan (SOP)
                </h4>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <ol className="relative border-l-2 border-blue-200 ml-3 space-y-4">
                    {selectedSop.alur.split("->").map((step: string, i: number) => (
                      <li key={i} className="pl-6 relative">
                        <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                        <p className="font-medium text-slate-700">{step.trim()}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex-1 text-center border-r border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Estimasi Waktu</p>
                  <p className="font-bold text-slate-800">{selectedSop.waktu}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Biaya Layanan</p>
                  <p className="font-bold text-emerald-600">{selectedSop.biaya}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={() => {
                  setFormData({...formData, serviceType: selectedSop.title});
                  setSelectedSop(null);
                  setActiveTab("form");
                }} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-md shadow-emerald-200 transition-all"
              >
                Buat Permohonan Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
