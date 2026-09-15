/* eslint-disable */
// @ts-nocheck
"use client";
import ReCAPTCHA from "react-google-recaptcha";

import { useState, useEffect } from "react";
import { Building2, FileText, CheckCircle2, Clock, AlertCircle, FileCheck2, Send, Search, X, ShieldCheck, FileWarning, Database, GraduationCap, Fingerprint, User, Building, Target, Phone, Users as UsersIcon, Printer, Copy, ArrowRight, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const SOP_SERVICES = [
  {
    id: "legalisir",
    title: "Legalisir Ijazah / SKHUN",
    icon: <FileCheck2 className="w-8 h-8 text-emerald-600" />,
    syarat: ["Membawa Ijazah/SKHUN Asli", "Fotokopi Ijazah/SKHUN maksimal 5 lembar", "Map snelhecter hijau"],
    waktu: "1 Hari Kerja", biaya: "Gratis",
    alur: "1. Ke loket TU -> 2. Pemeriksaan keaslian -> 3. Pengesahan Kepala Sekolah -> 4. Pengambilan"
  },
  {
    id: "surat-aktif",
    title: "Surat Keterangan Aktif Siswa",
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    syarat: ["Fotokopi Rapor halaman biodata", "Pas foto 3x4 seragam"],
    waktu: "1 Hari Kerja", biaya: "Gratis",
    alur: "1. Mengisi form -> 2. Verifikasi Data -> 3. Pencetakan Surat -> 4. Pengambilan"
  },
  {
    id: "kelakuan-baik",
    title: "Surat Keterangan Berkelakuan Baik",
    icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
    syarat: ["Fotokopi Rapor terakhir", "Pas foto ukuran 3x4 (1 lembar)"],
    waktu: "1 Hari Kerja", biaya: "Gratis",
    alur: "1. Form online -> 2. Verifikasi Guru BK & Wali Kelas -> 3. Pengesahan -> 4. Pengambilan"
  },
  {
    id: "pindah-sekolah",
    title: "Surat Pindah Sekolah / Mutasi",
    icon: <Building2 className="w-8 h-8 text-amber-600" />,
    syarat: ["Surat Keterangan Diterima dari sekolah tujuan", "Buku Rapor Asli", "Fotokopi KK"],
    waktu: "2 Hari Kerja", biaya: "Gratis",
    alur: "1. Pengajuan mutasi -> 2. Validasi bebas pustaka & administrasi -> 3. Penerbitan Surat -> 4. Penyerahan Dokumen"
  },
  {
    id: "perbaikan-dapodik",
    title: "Perbaikan Data Siswa (Dapodik)",
    icon: <Database className="w-8 h-8 text-cyan-600" />,
    syarat: ["Fotokopi Akta Kelahiran & KK", "Bukti kesalahan data"],
    waktu: "1 - 3 Hari Kerja", biaya: "Gratis",
    alur: "1. Pengajuan -> 2. Verifikasi berkas -> 3. Sinkronisasi Operator -> 4. Konfirmasi Selesai"
  },
  {
    id: "surat-hilang",
    title: "Suket Kehilangan Ijazah/Rapor",
    icon: <FileWarning className="w-8 h-8 text-red-600" />,
    syarat: ["Surat Keterangan Kehilangan Polisi (Asli)", "Fotokopi arsip hilang (jika ada)", "Fotokopi KK"],
    waktu: "2 Hari Kerja", biaya: "Gratis",
    alur: "1. Pengajuan online -> 2. Bawa syarat Asli ke loket -> 3. Pencarian arsip -> 4. Pengesahan"
  },
  {
    id: "skl",
    title: "Surat Keterangan Lulus (SKL)",
    icon: <GraduationCap className="w-8 h-8 text-teal-600" />,
    syarat: ["Bukti Kartu Ujian", "Pas foto 3x4 berwarna (2 lembar)"],
    waktu: "1 Hari Kerja", biaya: "Gratis",
    alur: "1. Pengajuan SKL -> 2. Verifikasi kurikulum -> 3. Pencetakan SKL -> 4. TTD Kepsek & Pengambilan"
  },
  {
    id: "izin-penelitian",
    title: "Surat Izin Penelitian / Observasi",
    icon: <Search className="w-8 h-8 text-purple-600" />,
    syarat: ["Surat Pengantar Resmi Universitas", "Proposal Singkat"],
    waktu: "1 - 2 Hari Kerja", biaya: "Gratis",
    alur: "1. Serahkan surat pengantar -> 2. Persetujuan Kepala Sekolah -> 3. Penerbitan Izin -> 4. Penelitian dimulai"
  }
];

export default function LayananPTSP() {
  const [activeTab, setActiveTab] = useState<"sop" | "bukutamu" | "form" | "lacak">("sop");
  const [selectedSop, setSelectedSop] = useState<any>(null);

  // Guestbook State
  const [time, setTime] = useState<Date | null>(null);
  const [hasFilledGuestBook, setHasFilledGuestBook] = useState(false);
  const [showGuestWarning, setShowGuestWarning] = useState(false);
  const [guestData, setGuestData] = useState({ name: "", agency: "", purpose: "", meetWith: "", contact: "" });
  const [isGuestSubmitting, setIsGuestSubmitting] = useState(false);
  const [isGuestSuccess, setIsGuestSuccess] = useState(false);
  const [visitorTicketId, setVisitorTicketId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Form State
  const [formData, setFormData] = useState({ name: "", identityId: "", serviceType: "Legalisir Ijazah / SKHUN", purpose: "", contactWa: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState("");

  // Track State
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Generate an initial random ticket ID for the preview before submission
    const initialId = "VST-" + Math.floor(100000 + Math.random() * 900000).toString();
    setVisitorTicketId(initialId);
    if (typeof window !== 'undefined') {
      setQrCodeUrl(`${window.location.origin}/layanan-ptsp?track=${initialId}`);
    }
    
    // Auto track from URL if present
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const trackParam = urlParams.get('track');
      if (trackParam) {
        setActiveTab('lacak');
        setTrackId(trackParam);
        performTrack(trackParam);
      }
    }

    return () => clearInterval(timer);
  }, []);

  const performTrack = async (idToTrack: string) => {
    setIsTracking(true);

    try {
      const res = await fetch(`/api/ptsp?ticketId=${idToTrack}`);
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

  const handleTabChange = (tab: "sop" | "bukutamu" | "form" | "lacak") => {
    if (tab === "form" && !hasFilledGuestBook) {
      setShowGuestWarning(true);
      setActiveTab("bukutamu");
      // Auto-hide warning after 4s
      setTimeout(() => setShowGuestWarning(false), 4000);
      return;
    }
    setActiveTab(tab);
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Harap centang verifikasi Captcha (I'm not a robot).");
      return;
    }
    setIsGuestSubmitting(true);
    try {
      const res = await fetch("/api/buku-tamu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestData),
      });
      if (res.ok) {
        const result = await res.json();
        // Fallback to random if no ID is returned
        const idPart = (result.id || Math.random().toString().slice(2)).slice(0, 6).toUpperCase();
        const newTicketId = `VST-${idPart}`;
        setVisitorTicketId(newTicketId);
        if (typeof window !== 'undefined') {
          setQrCodeUrl(`${window.location.origin}/layanan-ptsp?track=${newTicketId}`);
        }
        
        setIsGuestSuccess(true);
        setHasFilledGuestBook(true);
        // Pre-fill some PTSP form data
        setFormData(prev => ({ ...prev, name: guestData.name, contactWa: guestData.contact }));
      }
    } catch (error) {
      alert("Gagal mengisi buku tamu");
    } finally {
      setIsGuestSubmitting(false);
    }
  };

  const handlePtspSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Harap centang verifikasi Captcha (I'm not a robot).");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/ptsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, captchaToken }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmittedTicket(data.ticketId);
      }
    } catch (error) {
      alert("Gagal mengirim pengajuan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Harap centang verifikasi Captcha (I'm not a robot).");
      return;
    }
    if (!trackId) return;
    performTrack(trackId);
  };

  // Removed dummy barcode generator

  const handleDownloadPass = async () => {
    const cardElement = document.getElementById("visitor-pass-card");
    if (!cardElement) return;

    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardElement, {
        cacheBust: true,
        pixelRatio: 2,
        style: {
          transform: 'none', // Reset any 3d transforms that might mess up the rendering
          boxShadow: 'none',
        }
      });
      const link = document.createElement("a");
      link.download = `visitor-pass-${guestData.name || "guest"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Gagal mengunduh ID Card:", error);
      alert("Terjadi kesalahan saat mengunduh gambar.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-8 relative">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-4">
            <Building2 className="w-10 h-10 text-emerald-700" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-jakarta text-slate-800 mb-4">Layanan Terpadu Satu Pintu (PTSP)</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Komitmen kami untuk memberikan layanan administrasi yang cepat, transparan, dan terintegrasi dengan Standard Operating Procedure (SOP) yang jelas.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-sm p-1.5 flex flex-wrap gap-2 border border-slate-200 justify-center">
            <button onClick={() => handleTabChange("bukutamu")} className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${activeTab === 'bukutamu' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Fingerprint className="w-4 h-4" /> Buku Tamu
            </button>
            <button onClick={() => handleTabChange("sop")} className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${activeTab === 'sop' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
              Info & SOP Layanan
            </button>
            <button onClick={() => handleTabChange("form")} className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all relative ${activeTab === 'form' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
              Ajukan Permohonan
              {!hasFilledGuestBook && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse border-2 border-white"></div>}
            </button>
            <button onClick={() => handleTabChange("lacak")} className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${activeTab === 'lacak' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
              Lacak Status
            </button>
          </div>
        </div>

        {/* Floating Warning */}
        {showGuestWarning && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-amber-100 border border-amber-400 text-amber-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-4 fade-in">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <span className="font-semibold">Mohon isi Buku Tamu Digital terlebih dahulu sebelum mengajukan permohonan.</span>
          </div>
        )}

        {/* Buku Tamu Content */}
        {activeTab === "bukutamu" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-200">
            {/* Left Form */}
            {!isGuestSuccess ? (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-extrabold font-jakarta text-slate-800 mb-2">Buku Tamu</h2>
                  <p className="text-slate-500">Silakan lengkapi data kunjungan Anda di bawah ini.</p>
                </div>
                
                <form onSubmit={handleGuestSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Lengkap</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="h-5 w-5" />
                        </div>
                        <input type="text" required value={guestData.name} onChange={e => setGuestData({...guestData, name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all" placeholder="John Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Instansi / Asal</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Building className="h-5 w-5" />
                        </div>
                        <input type="text" required value={guestData.agency} onChange={e => setGuestData({...guestData, agency: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all" placeholder="Pribadi / Sekolah / Dinas" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tujuan Kunjungan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none text-slate-400">
                        <Target className="h-5 w-5" />
                      </div>
                      <textarea required value={guestData.purpose} onChange={e => setGuestData({...guestData, purpose: e.target.value})} rows={2} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all" placeholder="Contoh: Melegalisir ijazah, bertemu Kepsek..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Bertemu Dengan</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <UsersIcon className="h-5 w-5" />
                        </div>
                        <input type="text" required value={guestData.meetWith} onChange={e => setGuestData({...guestData, meetWith: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all" placeholder="Bagian TU / Kepsek" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">No. WhatsApp</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="h-5 w-5" />
                        </div>
                        <input type="text" required value={guestData.contact} onChange={e => setGuestData({...guestData, contact: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all" placeholder="08..." />
                      </div>
                    </div>
                  </div>

                  
                    <div className="mb-6 flex justify-center w-full">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={setCaptchaToken}
                      />
                    </div>
                    <button
                      type="submit" disabled={isGuestSubmitting} className="w-full py-4 mt-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex justify-center items-center gap-2 transform active:scale-95">
                    {isGuestSubmitting ? "Menyimpan..." : <><Fingerprint className="w-5 h-5" /> Simpan & Generate Pass</>}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-10 px-4 border border-emerald-100 rounded-3xl bg-emerald-50/50">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Buku Tamu Disimpan!</h2>
                <p className="text-slate-600 mb-8 max-w-sm mx-auto">Kunjungan Anda telah tercatat. Anda bisa mengunduh kartu Visitor Pass Anda, atau langsung melanjutkan ke pengajuan PTSP.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button type="button" onClick={handleDownloadPass} className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Unduh Gambar
                  </button>
                  <button type="button" onClick={() => { setActiveTab("form"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                    Lanjut PTSP <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Right ID Card Preview */}
            <div className="flex justify-center items-center perspective-[1000px] h-[600px]">
              <div className={`transition-all duration-700 ${isGuestSuccess ? 'translate-y-[20px] scale-105' : 'rotate-y-[-10deg] rotate-x-[5deg]'}`}>
                <div 
                  id="visitor-pass-card" 
                  className="relative flex flex-col items-center p-8 bg-transparent"
                >
                  {/* Simulated Lanyard / Clip */}
                  <div className="w-8 h-12 bg-slate-300 rounded-t-full shadow-inner z-20 flex justify-center -mb-4 relative">
                    <div className="w-4 h-4 bg-slate-400 rounded-full mt-2 shadow-inner"></div>
                  </div>
                  
                  {/* Card Body */}
                <div className="relative w-80 bg-white rounded-[2rem] overflow-hidden border-4 border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] pb-8">
                  {/* ID Card Header */}
                  <div className="bg-emerald-700 rounded-t-[1.75rem] text-white p-6 pt-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20">
                      <div className="w-40 h-40 bg-emerald-500 rounded-full absolute -top-10 -right-10 blur-xl"></div>
                      <div className="w-20 h-20 bg-yellow-400 rounded-full absolute bottom-0 -left-10 blur-xl"></div>
                    </div>
                    <h3 className="relative font-bold text-lg tracking-wider mb-1">VISITOR PASS</h3>
                    <p className="relative text-xs text-emerald-200 font-mono">PTSP SMPN 29 MAKASSAR</p>
                  </div>

                  {/* ID Card Photo Area */}
                  <div className="flex justify-center -mt-12 relative z-10">
                    <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg border border-slate-100">
                      <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-slate-300" />
                      </div>
                    </div>
                  </div>

                  {/* ID Card Details */}
                  <div className="p-6 pb-2 text-center space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 break-words leading-tight">{guestData.name || "Nama Pengunjung"}</h4>
                      <p className="text-emerald-600 font-bold uppercase text-xs mt-1 tracking-widest">{guestData.agency || "Instansi / Asal"}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left space-y-2 mt-4">
                      <div>
                        <p className="text-[10px] uppercase text-slate-400 font-bold">Bertemu</p>
                        <p className="text-sm font-semibold text-slate-700 truncate">{guestData.meetWith || "-"}</p>
                      </div>
                    </div>

                    {/* Barcode / QR Code */}
                    <div className="pt-3 flex flex-col items-center">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm inline-block">
                        {qrCodeUrl ? (
                          <QRCodeSVG value={qrCodeUrl} size={120} level="M" />
                        ) : (
                          <div className="w-[120px] h-[120px] bg-slate-100 rounded-xl flex items-center justify-center animate-pulse">
                            <Search className="w-6 h-6 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-3 font-bold tracking-widest uppercase">
                        Nomor Tiket: {visitorTicketId || "MENUNGGU..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

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
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/70 overflow-hidden w-full">
            <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-orange-500 p-7 sm:p-8 text-white relative">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <h2 className="text-2xl font-bold tracking-tight">Form Pengajuan Layanan</h2>
              <p className="text-emerald-100 text-sm mt-1.5">
                Isi formulir berikut dengan data yang benar.
              </p>
            </div>
            
            <div className="p-7 sm:p-8">
              {submittedTicket ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl mx-auto flex items-center justify-center mb-5 shadow-inner">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Permohonan Berhasil Dibuat!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                    Terima kasih atas permohonan Anda. Harap simpan <strong>Nomor Tiket</strong> berikut untuk melacak perkembangan layanan:
                  </p>
                  
                  <div className="inline-flex items-center gap-3 bg-slate-50 border-2 border-dashed border-emerald-300 px-5 py-3.5 rounded-2xl mb-6 shadow-sm">
                    <span className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-700 tracking-wider">
                      {submittedTicket}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(submittedTicket);
                        alert("Tiket tersalin: " + submittedTicket);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => { setSubmittedTicket(""); setActiveTab("lacak"); setTrackId(submittedTicket); handleTrack({ preventDefault: () => {} } as any); }} 
                      className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                      Lacak Status <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmittedTicket("")}
                      className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition"
                    >
                      Buat Baru
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <form onSubmit={handlePtspSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Layanan</label>
                      <select required value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-slate-50">
                        {SOP_SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                        <option value="Lainnya">Lainnya...</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" placeholder="Masukkan nama" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">NISN / NIK</label>
                      <input type="text" required value={formData.identityId} onChange={e => setFormData({...formData, identityId: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" placeholder="NISN / NIK" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
                      <input type="text" required value={formData.contactWa} onChange={e => setFormData({...formData, contactWa: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" placeholder="08..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Keperluan</label>
                      <textarea required value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} rows={2} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50" placeholder="Jelaskan keperluan..."></textarea>
                    </div>
                      <div className="mb-6 flex justify-center w-full">
                        <ReCAPTCHA
                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                          onChange={setCaptchaToken}
                        />
                      </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex justify-center items-center gap-2 transform active:scale-95">
                      {isSubmitting ? "Mengirim..." : <><Send className="w-5 h-5" /> Kirim Permohonan</>}
                    </button>
                  </form>
                </>
              )}
            </div>
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
              <div className="mt-4 flex justify-start">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={setCaptchaToken}
                />
              </div>
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
                  handleTabChange("form"); // This will trigger the warning if guestbook not filled
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



