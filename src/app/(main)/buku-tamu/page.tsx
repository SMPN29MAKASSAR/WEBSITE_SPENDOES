"use client";

import { useState, useEffect } from "react";
import { User, Building, Target, Phone, Users, Fingerprint, Printer, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function BukuTamu() {
  const [time, setTime] = useState<Date | null>(null);
  
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    agency: "",
    purpose: "",
    meetWith: "",
    contact: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/buku-tamu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      alert("Gagal mengisi buku tamu");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Barcode generator (dummy visual using divs)
  const renderBarcode = () => (
    <div className="flex gap-[2px] justify-center items-end h-8 opacity-70">
      {[...Array(40)].map((_, i) => (
        <div key={i} className="bg-slate-800" style={{ width: Math.random() > 0.5 ? '2px' : '4px', height: Math.random() > 0.3 ? '100%' : '70%' }}></div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Decorative Patterns */}
      <div className="absolute top-0 left-0 w-full h-96 bg-emerald-900 skew-y-3 -translate-y-20 origin-top-left -z-10 shadow-2xl"></div>
      
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Introduction & Form */}
        <div className="z-10">
          <div className="mb-8 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold font-jakarta mb-2 drop-shadow-md">Buku Tamu Digital</h1>
            <p className="text-emerald-100 text-lg">UPT SPF SMPN 29 Makassar</p>
            
            {time && (
              <div className="mt-6 inline-flex items-center gap-4 bg-black/20 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-inner">
                <div className="text-3xl font-mono font-bold tracking-widest">{time.toLocaleTimeString('id-ID', { hour12: false })}</div>
                <div className="w-px h-8 bg-white/30"></div>
                <div className="text-sm font-medium uppercase tracking-widest text-emerald-100">
                  {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            )}
          </div>

          {!isSuccess ? (
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Fingerprint className="text-emerald-600 w-8 h-8" />
                Registrasi Kunjungan
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Lengkap</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="h-5 w-5" />
                      </div>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all" placeholder="John Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Instansi / Asal</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Building className="h-5 w-5" />
                      </div>
                      <input type="text" required value={formData.agency} onChange={e => setFormData({...formData, agency: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all" placeholder="Pribadi / Perusahaan / Dinas" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tujuan Kunjungan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none text-slate-400">
                      <Target className="h-5 w-5" />
                    </div>
                    <textarea required value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} rows={2} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all" placeholder="Jelaskan secara singkat keperluan Anda..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Bertemu Dengan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Users className="h-5 w-5" />
                      </div>
                      <input type="text" required value={formData.meetWith} onChange={e => setFormData({...formData, meetWith: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all" placeholder="Nama Guru / Staf / Kepsek" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">No. WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="h-5 w-5" />
                      </div>
                      <input type="text" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all" placeholder="08..." />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full mt-4 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-600/30 transition-all flex justify-center items-center gap-2 transform active:scale-95">
                  {isSubmitting ? "Memproses..." : <><Fingerprint className="w-5 h-5" /> Konfirmasi Kehadiran</>}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white text-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Terima Kasih!</h2>
              <p className="text-slate-600 mb-8">Kunjungan Anda telah tercatat dalam sistem kami. Silakan kenakan tanda pengenal pengunjung Anda.</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => { setIsSuccess(false); setFormData({name:"", agency:"", purpose:"", meetWith:"", contact:""}) }} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Isi Tamu Lainnya</button>
                <Link href="/" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">Kembali ke Beranda</Link>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live ID Card Preview (The "Canggih" part) */}
        <div className="flex justify-center items-center perspective-[1000px] h-[500px] md:h-auto">
          {/* Simulated Lanyard / Clip */}
          <div className="absolute top-0 w-8 h-16 bg-slate-300 rounded-t-full shadow-inner z-20 flex justify-center -translate-y-8 left-1/2 -translate-x-1/2">
            <div className="w-4 h-4 bg-slate-400 rounded-full mt-2 shadow-inner"></div>
          </div>
          
          <div className={`relative w-80 h-[450px] bg-white rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-700 border-4 border-slate-100 ${isSuccess ? 'translate-y-[20px] scale-105 shadow-emerald-500/50' : 'rotate-y-[-10deg] rotate-x-[5deg] shadow-2xl'}`}>
            {/* ID Card Header */}
            <div className="bg-emerald-700 text-white p-6 pt-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="w-40 h-40 bg-emerald-500 rounded-full absolute -top-10 -right-10 blur-xl"></div>
                <div className="w-20 h-20 bg-yellow-400 rounded-full absolute bottom-0 -left-10 blur-xl"></div>
              </div>
              <h3 className="relative font-bold text-lg tracking-wider mb-1">VISITOR PASS</h3>
              <p className="relative text-xs text-emerald-200 font-mono">SMPN 29 MAKASSAR</p>
            </div>

            {/* ID Card Photo Area (Placeholder) */}
            <div className="flex justify-center -mt-12 relative z-10">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                  <User className="w-10 h-10 text-slate-300" />
                </div>
              </div>
            </div>

            {/* ID Card Details */}
            <div className="p-6 text-center space-y-4">
              <div>
                <h4 className="text-2xl font-bold text-slate-800 break-words leading-tight">{formData.name || "Nama Pengunjung"}</h4>
                <p className="text-emerald-600 font-bold uppercase text-sm mt-1 tracking-widest">{formData.agency || "Instansi / Asal"}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-left space-y-2 mt-4">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Bertemu</p>
                  <p className="text-sm font-semibold text-slate-700 truncate">{formData.meetWith || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Tujuan</p>
                  <p className="text-sm font-semibold text-slate-700 truncate">{formData.purpose || "-"}</p>
                </div>
              </div>

              {/* Barcode */}
              <div className="pt-2">
                {renderBarcode()}
                <p className="text-[10px] font-mono text-slate-400 mt-1">ID: {time ? time.getTime().toString().slice(-8) : "00000000"}</p>
              </div>
            </div>

            {/* Success Overlay Effect */}
            {isSuccess && (
              <div className="absolute inset-0 bg-emerald-600/10 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in z-30">
                <div className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 transform -rotate-12 scale-110">
                  <Printer className="w-5 h-5" />
                  PASS DICETAK
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
