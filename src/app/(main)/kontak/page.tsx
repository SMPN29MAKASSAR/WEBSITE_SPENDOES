import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  ExternalLink, 
  Navigation,
  MessageCircle,
  Calendar,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Kontak & Lokasi | UPT SPF SMPN 29 Makassar",
  description: "Hubungi UPT SPF SMPN 29 Makassar. Informasi alamat, telepon, email resmi, WhatsApp, jam operasional, dan lokasi peta Google Maps.",
};

export const dynamic = 'force-dynamic';

export default async function KontakPage() {
  // Ambil pengaturan dinamis dari database (jika sudah diset di admin)
  const settings = await prisma.setting.findMany();
  const getSetting = (key: string, defaultValue: string) => 
    settings.find(s => s.key === key)?.value || defaultValue;

  const schoolAddress = getSetting('school_address', 'Jl. Andi Mappanyukki No. 66, Kel. Mario, Kec. Mariso, Kota Makassar, Sulawesi Selatan 90125');
  const schoolPhone = getSetting('school_phone', '(0411) 854373');
  const schoolEmail = getSetting('school_email', 'info@smpn29makassar.sch.id');
  const schoolWa = getSetting('school_whatsapp', '6281242332929');
  const schoolWebsite = getSetting('school_website', 'smpn29makassar.sch.id');

  const jamSeninKamis = getSetting('jam_senin_kamis', '08:00 – 16:00 WITA');
  const jamJumat = getSetting('jam_jumat', '08:00 – 16:30 WITA');
  const jamSabtuMinggu = getSetting('jam_sabtu_minggu', 'Libur / Tutup');

  const waLink = `https://wa.me/${schoolWa}?text=${encodeURIComponent('Halo Admin Layanan SMPN 29 Makassar, saya ingin menanyakan informasi seputar...')}`;
  
  let rawMapsUrl = getSetting('maps_embed_url', "https://maps.google.com/maps?q=SMP+Negeri+29+Makassar%2C+Jl.+Andi+Mappanyukki+No.66%2C+Makassar&t=&z=16&ie=UTF8&iwloc=&output=embed");
  let mapsEmbedUrl = rawMapsUrl;
  
  // Auto-extract src if user accidentally pastes the entire <iframe> tag
  if (rawMapsUrl.includes('<iframe') && rawMapsUrl.includes('src=')) {
    const match = rawMapsUrl.match(/src="([^"]+)"/);
    if (match && match[1]) {
      mapsEmbedUrl = match[1];
    }
  }

  const mapsDirectUrl = "https://maps.google.com/?q=SMP+Negeri+29+Makassar";

  return (
    <div className="flex flex-col items-center w-full pb-24 bg-slate-50/50">
      
      {/* Hero / Header Section */}
      <section className="w-full bg-slate-900 text-white pt-24 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 left-10 w-96 h-96 bg-teal-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-orange-500/10 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 font-medium text-xs sm:text-sm mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
            <span>Layanan Informasi & Komunikasi Terpadu</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-jakarta tracking-tight text-white mb-5">
            Kontak & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-orange-300">Lokasi Kami</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Pusat komunikasi resmi UPT SPF SMPN 29 Makassar. Kami siap melayani pertanyaan, konsultasi akademik, hingga pengaduan layanan masyarakat.
          </p>
        </div>
      </section>

      {/* Main Content: 2 Column Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl -mt-8 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* ===================== LEFT COLUMN ===================== */}
          <div className="flex flex-col gap-8">
            
            {/* 1. Google Maps Embed Card */}
            <div className="bg-white rounded-3xl p-6 md:p-7 shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-2.5 rounded-2xl text-emerald-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-jakarta text-slate-900">Lokasi Sekolah</h2>
                    <p className="text-xs text-slate-500">Kec. Mariso, Kota Makassar</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                  <Navigation className="w-3 h-3" /> Peta Interaktif
                </span>
              </div>

              {/* Map Iframe */}
              <div className="relative w-full h-[340px] sm:h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                <iframe
                  title="Peta Lokasi SMPN 29 Makassar"
                  src={mapsEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Map Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm">Akses strategis di pusat kota Makassar</span>
                </div>
                <a
                  href={mapsDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors w-full sm:w-auto justify-center"
                >
                  Buka di Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 2. Green Card: Chat via WhatsApp */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl shadow-emerald-800/20 group">
              {/* Background ambient accents */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-teal-400/10 rounded-full blur-xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="w-13 h-13 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner p-3">
                    {/* WhatsApp Icon */}
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.19.53-1.1 1.04-1.54 1.1-.41.06-.9.1-2.86-.71-2.34-.97-3.83-3.35-3.95-3.51-.12-.16-.94-1.25-.94-2.39s.59-1.7 1.01-1.93c.15-.08.31-.11.47-.11.16 0 .31 0 .44.01.14.01.33-.05.52.4.2.46.68 1.66.74 1.78.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.17.6-.7.76-.94.16-.24.32-.2.53-.12.21.08 1.35.64 1.58.75.23.12.38.17.44.27.06.1.06.58-.13 1.11z"/>
                    </svg>
                  </div>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-50 border border-white/20">
                    Respon Cepat
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-jakarta text-white mb-2">
                  Chat via WhatsApp
                </h3>
                <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
                  Butuh informasi instan terkait pendaftaran siswa baru, administrasi legalisir ijazah, atau layanan sekolah lainnya? Tim kami siap menjawab pertanyaan Anda.
                </p>

                <div>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-white text-emerald-800 font-bold rounded-2xl shadow-lg hover:bg-emerald-50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 w-full sm:w-auto"
                  >
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                    <span>Hubungi Sekarang</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* ===================== RIGHT COLUMN ===================== */}
          <div className="flex flex-col gap-8">
            
            {/* 1. Card "Informasi Kontak" (4 Grids) */}
            <div className="bg-white rounded-3xl p-7 md:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-teal-50 p-2.5 rounded-2xl text-teal-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-jakarta text-slate-900">Informasi Kontak</h2>
                  <p className="text-xs text-slate-500">Saluran komunikasi resmi lembaga</p>
                </div>
              </div>

              {/* 4 Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Grid 1: Alamat */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-3">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Alamat</span>
                    <p className="text-sm font-semibold text-slate-800 mt-1 leading-snug">
                      {schoolAddress}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/50">
                    <a
                      href={mapsDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                    >
                      Petunjuk Arah &rarr;
                    </a>
                  </div>
                </div>

                {/* Grid 2: Telepon */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center mb-3">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Telepon</span>
                    <p className="text-sm font-semibold text-slate-800 mt-1 leading-snug">
                      {schoolPhone}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Layanan Kantor & Tata Usaha</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/50">
                    <a
                      href={`tel:${schoolPhone.replace(/[^0-9]/g, '')}`}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                    >
                      Panggil Nomor &rarr;
                    </a>
                  </div>
                </div>

                {/* Grid 3: Email */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-orange-600 flex items-center justify-center mb-3">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</span>
                    <p className="text-sm font-semibold text-slate-800 mt-1 break-all leading-snug">
                      {schoolEmail}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Korespondensi & Administrasi</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/50">
                    <a
                      href={`mailto:${schoolEmail}`}
                      className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
                    >
                      Kirim Pesan &rarr;
                    </a>
                  </div>
                </div>

                {/* Grid 4: Website */}
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center mb-3">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Website</span>
                    <p className="text-sm font-semibold text-slate-800 mt-1 leading-snug">
                      {schoolWebsite}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Portal Resmi Digital</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/50">
                    <Link
                      href="/"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                    >
                      Buka Portal &rarr;
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. Green / Olive Card: Jam Operasional */}
            <div className="rounded-3xl p-7 md:p-8 bg-gradient-to-br from-[#163327] via-[#10291f] to-[#0c1f17] text-white border border-emerald-800/40 shadow-xl relative overflow-hidden">
              {/* Decorative subtle olive rings */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-400/20 text-emerald-300 p-2.5 rounded-2xl border border-emerald-400/20">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-jakarta text-white">Jam Operasional</h3>
                    <p className="text-xs text-emerald-200/70">Waktu Indonesia Tengah (WITA)</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hari Kerja Aktif
                </span>
              </div>

              {/* Schedule list */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-slate-200">Senin – Kamis</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-300 font-mono">{jamSeninKamis}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-slate-200">Jumat</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-300 font-mono">{jamJumat}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">Sabtu & Minggu</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30">
                    {jamSabtuMinggu}
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-200/60 mt-5 leading-relaxed">
                * Pelayanan administrasi dan kunjungan tatap muka diselenggarakan pada hari dan jam kerja di atas.
              </p>
            </div>

            {/* 3. Card "Sosial Media" */}
            <div className="bg-white rounded-3xl p-7 md:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-xl font-bold font-jakarta text-slate-900">Sosial Media</h3>
                  <p className="text-xs text-slate-500">Ikuti kegiatan dan pembaruan terbaru sekolah</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
                  Kanal Resmi
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center p-4 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-center"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-800">Facebook</span>
                  <span className="text-xs text-slate-500 mt-0.5">SMPN 29 Makassar</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center p-4 rounded-2xl border border-slate-200/80 hover:border-pink-300 hover:bg-pink-50/50 transition-all text-center"
                >
                  <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-800">Instagram</span>
                  <span className="text-xs text-slate-500 mt-0.5">@smpn29makassar</span>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center p-4 rounded-2xl border border-slate-200/80 hover:border-red-300 hover:bg-red-50/50 transition-all text-center"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-800">YouTube</span>
                  <span className="text-xs text-slate-500 mt-0.5">SMPN 29 Official</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
