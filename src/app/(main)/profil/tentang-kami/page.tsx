/* eslint-disable */
// @ts-nocheck
import { History, Award, BookOpen } from "lucide-react";

export const metadata = { title: "Tentang Kami | UPT SPF SMPN 29 Makassar" };

export default function TentangKamiPage() {
  return (
    <div className="flex flex-col items-center w-full pb-20 bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="w-full bg-slate-900 text-white pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">Tentang Kami</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Mengenal lebih dekat UPT SPF SMPN 29 Makassar dan rekam jejak perjalanan kami.</p>
        </div>
      </section>

      {/* Profil Singkat */}
      <section className="container mx-auto px-6 py-16 max-w-5xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 text-center">
          <BookOpen className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold font-jakarta text-slate-900 mb-6">Profil UPT SPF SMPN 29 Makassar</h2>
          <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto text-lg">
            UPT SPF SMPN 29 Makassar adalah salah satu institusi pendidikan negeri di Kota Makassar yang berkomitmen memberikan layanan pendidikan terbaik. Kami senantiasa mengembangkan potensi peserta didik tidak hanya dari segi akademis, namun juga dari sisi moral, etika, dan keterampilan ekstrakurikuler guna mencetak generasi yang cerdas, berbudi pekerti luhur, serta siap menghadapi tantangan masa depan.
          </p>
        </div>
      </section>

      {/* Sejarah (Dipindahkan ke sini) */}
      <section className="w-full">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 items-center bg-emerald-900 text-white rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative">
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-700 rounded-full mix-blend-multiply opacity-50 blur-2xl"></div>
            
            <div className="w-full md:w-1/3 relative z-10">
              <div className="aspect-square rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-xl relative p-6">
                 <History className="w-full h-full text-white/80" />
                 <div className="absolute -bottom-6 -right-6 bg-yellow-500 p-4 rounded-xl shadow-lg transform rotate-12">
                    <Award className="w-10 h-10 text-slate-900" />
                 </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 relative z-10">
              <h2 className="text-sm font-bold tracking-widest text-emerald-300 uppercase mb-2">Jejak Langkah</h2>
              <h3 className="text-3xl md:text-4xl font-bold font-jakarta mb-6">Sejarah Singkat</h3>
              <div className="space-y-4 text-emerald-50 text-lg leading-relaxed">
                <p>
                  SMPN 29 Makassar didirikan bermula dari kebutuhan masyarakat sekitar akan hadirnya institusi pendidikan menengah pertama yang berkualitas.
                </p>
                <p>
                  Dalam perjalanannya, sekolah ini terus mengalami perkembangan baik dari segi infrastruktur fisik maupun kualitas sumber daya manusia. Dengan dedikasi para pendidik dan dukungan pemerintah serta masyarakat, SMPN 29 Makassar telah berhasil mencetak ribuan alumni yang kini berkiprah di berbagai bidang.
                </p>
                <p>
                  Hingga kini, kami terus berkomitmen untuk beradaptasi dengan kemajuan teknologi dan metode pembelajaran modern demi mempersiapkan generasi emas Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
