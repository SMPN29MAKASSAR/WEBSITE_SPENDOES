/* eslint-disable */
// @ts-nocheck
import { Target, Eye, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Visi & Misi | UPT SPF SMPN 29 Makassar" };

export default async function VisiMisiPage() {
  const settings = await prisma.setting.findMany();
  const getSetting = (key: string, defaultValue: string) => 
    settings.find(s => s.key === key)?.value || defaultValue;

  const visi = getSetting('visi_teks', '"Terwujudnya Pelajar yang Beriman dan Bertaqwa kepada Tuhan yang Maha Esa, Unggul, Mandiri, Peduli Lingkungan dan Berwawasan Global serta Mampu Berkolaborasi berdasarkan Kearifan Lokal"');
  
  const misiRaw = getSetting('misi_teks', '');
  const misiList = misiRaw ? misiRaw.split('\n').filter(m => m.trim() !== '') : [
    "Menanamkan keimanan dan ketakwaan melalui pengamalan ajaran agama dengan menerapkan nilai-nilai agama dalam proses belajar mengajar.",
    "Menumbuhkan budaya unggul di berbagai bidang akademik dan non akademik.",
    "Membina kemandirian peserta didik melalui kegiatan pembiasaan dan pengembangan diri yang terencana dan berkesinambungan.",
    "Mengembangkan sekolah yang peduli dan berwawasan lingkungan.",
    "Mewujudkan terselenggaranya pembelajaran kreatif, inovatif, kolaboratif, komunikatif dan mampu berwawasan global.",
    "Menjalin kerja sama yang harmonis antar warga sekolah dan lembaga lain yang terkait dalam mengembangkan IPTEK berdasarkan minat, bakat dan potensi peserta didik."
  ];

  return (
    <div className="flex flex-col items-center w-full pb-20 bg-slate-50 min-h-screen">
      <section className="w-full bg-slate-900 text-white pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">Visi & Misi</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Cita-cita dan langkah nyata kami dalam mencerdaskan kehidupan bangsa dan membentuk karakter peserta didik.</p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Visi */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <Eye className="w-12 h-12 text-emerald-600 mb-6 relative z-10" />
            <h2 className="text-3xl font-bold font-jakarta text-slate-900 mb-4 relative z-10">Visi Kami</h2>
            <p className="text-xl text-slate-600 font-medium leading-relaxed relative z-10 whitespace-pre-wrap">
              {visi}
            </p>
          </div>

          {/* Misi */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <Target className="w-12 h-12 text-teal-600 mb-6" />
            <h2 className="text-3xl font-bold font-jakarta text-slate-900 mb-4">Misi Kami</h2>
            <ul className="space-y-4">
              {misiList.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
