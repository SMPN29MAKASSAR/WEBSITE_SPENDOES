"use client";
import Link from "next/link";
import { GraduationCap, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function NavigationClient({ logoUrl }: { logoUrl?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-emerald-700 text-white shadow-md transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        
        <Link href="/beranda" className="flex items-center gap-3 group">
          <div className="bg-white p-1.5 rounded-full shadow-sm flex items-center justify-center overflow-hidden w-9 h-9 relative">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" fill className="object-cover" />
            ) : (
              <GraduationCap className="w-5 h-5 text-emerald-700" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold font-jakarta leading-tight">SMPN 29 Makassar</span>
            <span className="text-[11px] text-emerald-200 font-medium">Unggul & Berkarakter</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-4 lg:gap-5 font-medium text-[13px]">
          <Link href="/beranda" className="hover:text-yellow-300 transition-colors">Beranda</Link>
          <Link href="/berita" className="hover:text-yellow-300 transition-colors">Berita</Link>
          <Link href="/" className="hover:text-yellow-300 transition-colors">Portal Layanan</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-yellow-300 transition-colors py-2">
              Profil <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col text-slate-700 overflow-hidden text-[13px]">
              <Link href="/profil/tentang-kami" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700">Tentang Kami</Link>
                <Link href="/profil/fasilitas" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Fasilitas Sekolah</Link>
              <Link href="/profil/visi-misi" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Visi Misi</Link>
              <Link href="/profil/struktur-organisasi" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Struktur Organisasi</Link>
              <Link href="/profil/standar-layanan" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Standar Layanan</Link>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-yellow-300 transition-colors py-2">
              Info Publikasi <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col text-slate-700 overflow-hidden text-[13px]">
              <Link href="/info-publikasi/kalender" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700">Kalender Akademik</Link>
              
              <Link href="/info-publikasi/galeri" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Galeri Foto</Link>
              <Link href="/info-publikasi/guru" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Data Guru dan Pegawai</Link>
            </div>
          </div>

          <Link href="/administrasi" className="hover:text-yellow-300 transition-colors">Administrasi</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-yellow-300 transition-colors py-2">
              Kesiswaan <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col text-slate-700 overflow-hidden text-[13px]">
              <Link href="/ekstrakurikuler" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700">Ekstrakurikuler</Link>
              <Link href="/kesiswaan/prestasi" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Prestasi Siswa</Link>
              <Link href="/kesiswaan/mading" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Mading Digital</Link>
            </div>
          </div>

          <Link href="/kontak" className="hover:text-yellow-300 transition-colors">Kontak</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-yellow-300 transition-colors py-2">
              Pengaduan <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col text-slate-700 overflow-hidden text-[13px]">
              <Link href="/pengaduan/buat" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700">Buat Pengaduan</Link>
              <Link href="/pengaduan/lacak" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Lacak Pengaduan</Link>
            </div>
          </div>

          <Link href="/login" className="bg-yellow-500 text-slate-900 px-4 py-1.5 rounded-full font-bold hover:bg-yellow-400 transition-all duration-200 ml-1 text-[13px]">
            Login Admin
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden p-2 text-white hover:bg-emerald-600 rounded-lg transition">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="xl:hidden bg-emerald-800 border-t border-emerald-600 px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/beranda" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Beranda</Link>
          <Link href="/berita" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Berita</Link>
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Portal Layanan</Link>
          
          <div className="flex flex-col gap-2 pl-4 border-l-2 border-emerald-600">
            <span className="text-emerald-300 text-xs uppercase tracking-wider">Profil</span>
            <Link href="/profil/tentang-kami" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Tentang Kami</Link>
                <Link href="/profil/fasilitas" className="px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 border-t border-slate-100">Fasilitas Sekolah</Link>
            <Link href="/profil/visi-misi" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Visi Misi</Link>
            <Link href="/profil/struktur-organisasi" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Struktur Organisasi</Link>
            <Link href="/profil/standar-layanan" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Standar Layanan</Link>
          </div>

          <div className="flex flex-col gap-2 pl-4 border-l-2 border-emerald-600">
            <span className="text-emerald-300 text-xs uppercase tracking-wider">Info Publikasi</span>
            <Link href="/info-publikasi/guru" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Data Guru dan Pegawai</Link>
            <Link href="/info-publikasi/galeri" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Galeri Foto</Link>
            <Link href="/info-publikasi/kalender" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Kalender Akademik</Link>
          </div>

          <Link href="/administrasi" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Administrasi</Link>
          
          <div className="flex flex-col gap-2 pl-4 border-l-2 border-emerald-600">
            <span className="text-emerald-300 text-xs uppercase tracking-wider">Kesiswaan</span>
            <Link href="/ekstrakurikuler" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Ekstrakurikuler</Link>
            <Link href="/kesiswaan/prestasi" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Prestasi Siswa</Link>
            <Link href="/kesiswaan/mading" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Mading Digital</Link>
          </div>

          <Link href="/kontak" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Kontak</Link>
          
          <div className="flex flex-col gap-2 pl-4 border-l-2 border-emerald-600">
            <span className="text-emerald-300 text-xs uppercase tracking-wider">Pengaduan</span>
            <Link href="/pengaduan/buat" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Buat Pengaduan</Link>
            <Link href="/pengaduan/lacak" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300">Lacak Pengaduan</Link>
          </div>

          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 text-center mt-2">
            Login Admin
          </Link>
        </nav>
      )}
    </header>
  );
}

