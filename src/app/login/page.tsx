import { GraduationCap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login Portal | UPT SPF SMPN 29 Makassar",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#061e12] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm relative mt-[-5vh]">
        {/* Card Container */}
        <div className="bg-[#102d1f] rounded-2xl shadow-2xl border border-[#1b4431] overflow-hidden">
          {/* Orange Top Border Accent */}
          <div className="h-1.5 w-full bg-orange-500"></div>
          
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-white p-3.5 rounded-full mb-4 shadow-lg">
                 <GraduationCap className="w-7 h-7 text-[#061e12]" strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-bold text-white text-center">Portal Admin</h1>
              <p className="text-[11px] text-[#86af9a] mt-1 text-center font-medium tracking-wide">
                Sistem Informasi & Manajemen
                <br />
                <span className="text-orange-500 font-bold">UPT SPF SMPN 29 Makassar</span>
              </p>
            </div>

            <LoginForm />

            {/* Helper Box */}
            <div className="mt-8 bg-[#092216] rounded-xl p-4 border border-[#153a29]">
              <p className="text-[10px] text-center text-[#55826b] font-medium leading-relaxed uppercase tracking-wider mb-2">Petunjuk Akses</p>
              <p className="text-[10px] text-center text-[#86af9a] leading-relaxed">
                Silakan masukkan <strong className="text-orange-400">Email</strong> atau <strong className="text-orange-400">Username</strong> khusus yang diberikan oleh admin sekolah.
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/" className="inline-flex text-[11px] text-[#55826b] font-medium hover:text-white transition-colors">
                &larr; Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
        
        <p className="text-center text-[#375e4a] text-[10px] mt-6 font-medium tracking-widest">
          &copy; 2026 UPT SPF SMPN 29 MAKASSAR
        </p>
      </div>
    </div>
  );
}
