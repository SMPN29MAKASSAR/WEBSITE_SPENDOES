/* eslint-disable */
// @ts-nocheck
import { ShieldCheck, Clock, MessageSquare, Headphones, FileText, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Standar Layanan | UPT SPF SMPN 29 Makassar" };

export default function StandarLayananPage() {
  const services = [
    {
      title: "Pelayanan Administrasi Terpadu",
      desc: "Layanan legalisir ijazah, mutasi siswa, dan persuratan diselesaikan maksimal 1-2 hari kerja dengan syarat dokumen yang lengkap.",
      icon: <FileText className="w-8 h-8 text-emerald-600" />
    },
    {
      title: "Respon Pengaduan Cepat",
      desc: "Setiap laporan dan keluhan yang masuk melalui portal pengaduan akan ditindaklanjuti dan diberikan respon awal maksimal 1x24 jam.",
      icon: <MessageSquare className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Konseling & Bimbingan",
      desc: "Layanan Bimbingan Konseling (BK) terbuka setiap hari kerja untuk siswa dan orang tua yang membutuhkan pendampingan psikologis maupun akademik.",
      icon: <Headphones className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Ketepatan Waktu KBM",
      desc: "Kegiatan Belajar Mengajar (KBM) dipastikan berjalan tepat waktu sesuai dengan jadwal kalender akademik yang telah ditetapkan.",
      icon: <Clock className="w-8 h-8 text-purple-500" />
    },
  ];

  return (
    <div className="flex flex-col items-center w-full pb-20 bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="w-full bg-slate-900 text-white pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">Standar Layanan</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Komitmen kami dalam memberikan pelayanan pendidikan dan administrasi yang cepat, tepat, dan transparan.</p>
        </div>
      </section>

      {/* Maklumat Pelayanan */}
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="bg-emerald-700 text-white p-8 md:p-12 rounded-3xl shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-600 rounded-br-full opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-800 rounded-tl-full opacity-50"></div>
          
          <ShieldCheck className="w-16 h-16 text-yellow-400 mx-auto mb-6 relative z-10" />
          <h2 className="text-2xl md:text-3xl font-bold font-jakarta mb-4 relative z-10">Maklumat Pelayanan</h2>
          <p className="text-lg md:text-xl text-emerald-50 italic font-medium leading-relaxed relative z-10">
            "Kami Pimpinan dan Seluruh Staf UPT SPF SMPN 29 Makassar Menyatakan Sanggup Menyelenggarakan Pelayanan Sesuai Standar Pelayanan yang Telah Ditetapkan, dan Apabila Tidak Menepati Janji, Kami Siap Menerima Sanksi Sesuai Peraturan Perundang-undangan yang Berlaku."
          </p>
        </div>
      </section>

      {/* Grid Standar Layanan */}
      <section className="container mx-auto px-6 max-w-6xl mb-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold font-jakarta text-slate-900 mb-4">Fokus Layanan Kami</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">Kami terus berupaya meningkatkan mutu layanan publik, mencakup bidang akademik maupun non-akademik di lingkungan sekolah.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((srv, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex gap-6 items-start">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors shrink-0">
                {srv.icon}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">{srv.title}</h4>
                <p className="text-slate-600 leading-relaxed">{srv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Penutup / CTA Info */}
      <section className="container mx-auto px-6 max-w-4xl">
        <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-1">Butuh bantuan lebih lanjut?</h4>
            <p className="text-slate-600 text-sm">Jika Anda memiliki pertanyaan terkait prosedur layanan, silakan hubungi kami.</p>
          </div>
          <a href="/kontak" className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap">
            Hubungi Kami
          </a>
        </div>
      </section>
    </div>
  );
}
