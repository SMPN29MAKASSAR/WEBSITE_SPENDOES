import { GraduationCap } from "lucide-react";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login Portal | UPT SPF SMPN 29 Makassar",
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl mb-4">
             <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-jakarta text-slate-900 text-center">Portal Akademik</h1>
          <p className="text-sm text-slate-500 mt-2 text-center">Silakan masuk menggunakan akun sekolah Anda.</p>
        </div>

        <LoginForm />

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Belum memiliki akun? Hubungi pihak tata usaha sekolah.</p>
          <Link href="/" className="inline-flex mt-4 text-blue-600 font-medium hover:underline">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
