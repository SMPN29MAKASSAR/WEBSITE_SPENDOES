"use client";

import Link from "next/link";
import { GraduationCap, Menu, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-emerald-700 text-white shadow-md transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          
          <Link href="/beranda" className="flex items-center gap-3 group">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <GraduationCap className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-jakarta leading-tight">SMPN 29 Makassar</span>
              <span className="text-xs text-emerald-200 font-medium">Unggul & Berkarakter</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-6 font-medium text-sm">
            <Link href="/beranda" className="hover:text-yellow-300 transition-colors">Beranda</Link>
            <Link href="/berita" className="hover:text-yellow-300 transition-colors">Berita</Link>
            <Link href="/" className="hover:text-yellow-300 transition-colors">Portal Layanan</Link>
            
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-yellow-300 transition-colors py-2">
                Profil <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col text-slate-700 overflow-hidden text-sm">
                <Link href="/profil#tentang" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700">Tentang Kami</Link>
                <Link href="/profil#standar" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Standar Layanan</Link>
                <Link href="/profil#sejarah" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Sejarah</Link>
                <Link href="/profil#visimisi" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Visi Misi</Link>
                <Link href="/profil#struktur" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Struktur Organisasi</Link>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-yellow-300 transition-colors py-2">
                Info Publikasi <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col text-slate-700 overflow-hidden text-sm">
                <Link href="#" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700">Kalender Akademik</Link>
                <Link href="/galeri-prestasi" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Galeri Prestasi</Link>
                <Link href="/info-publikasi/galeri" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Galeri Foto</Link>
                <Link href="#" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Survei Evaluasi Kinerja Guru</Link>
                <Link href="#" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">PPID</Link>
                <Link href="#" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Laporan Hasil Survei</Link>
                <Link href="/info-publikasi/guru" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Data Guru dan Pegawai</Link>
              </div>
            </div>

            <Link href="/akademik" className="hover:text-yellow-300 transition-colors">Akademik</Link>
            <Link href="/ekstrakurikuler" className="hover:text-yellow-300 transition-colors">Ekstrakurikuler</Link>
            <Link href="/kontak" className="hover:text-yellow-300 transition-colors">Kontak</Link>
            
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-yellow-300 transition-colors py-2">
                Pengaduan <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col text-slate-700 overflow-hidden text-sm">
                <Link href="/pengaduan/buat" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700">Buat Pengaduan</Link>
                <Link href="/pengaduan/lacak" className="px-4 py-3 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Lacak Pengaduan</Link>
              </div>
            </div>

            <Link href="/login" className="bg-yellow-500 text-slate-900 px-5 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all duration-200 ml-2">
              Login Admin
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden p-2 text-white hover:bg-emerald-600 rounded-lg transition">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} UPT SPF SMPN 29 Makassar. Semua Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
