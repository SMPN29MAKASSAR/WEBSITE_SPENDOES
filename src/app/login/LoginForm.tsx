"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, KeyRound, Mail } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Autentikasi gagal. Periksa kembali ID dan Sandi.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-medium text-center">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-[10px] font-bold text-[#55826b] mb-1.5 uppercase tracking-widest" htmlFor="email">ID Pengguna (Email / NISN)</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#55826b]">
            <Mail className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0a261a] border border-[#1b4431] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm placeholder:text-[#375e4a]"
            placeholder="Masukkan ID Anda..."
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-[10px] font-bold text-[#55826b] uppercase tracking-widest" htmlFor="password">Kata Sandi</label>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#55826b]">
            <KeyRound className="w-4 h-4" />
          </div>
          <input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0a261a] border border-[#1b4431] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm placeholder:text-[#375e4a]"
            placeholder="Masukkan Sandi..."
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 mt-6 bg-[#f97316] text-white rounded-lg font-bold hover:bg-[#ea580c] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "MEMPROSES..." : "AKSES SISTEM"} <Shield className="w-4 h-4" />
      </button>
    </form>
  );
}
