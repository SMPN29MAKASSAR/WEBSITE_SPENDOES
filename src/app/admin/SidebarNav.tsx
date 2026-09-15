/* eslint-disable */
// @ts-nocheck
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Settings, Users, Image as ImageIcon, MessageSquare, FileText, Trophy, LayoutTemplate, ShieldCheck, Building2, Folder } from 'lucide-react';

export default function SidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "";

  const hasAccess = (menus: string[]) => {
    if (role === "Admin Utama") return true;
    return menus.includes(role);
  };

  return (
    <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
      <Link 
        href="/admin/dashboard" 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
          pathname === '/admin/dashboard' 
            ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
            : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </Link>

      {hasAccess(["Admin Berita"]) && (
        <>
          <Link 
            href="/admin/berita" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === '/admin/berita' 
                ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
                : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            Kelola Berita
          </Link>
          <Link 
            href="/admin/galeri" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === '/admin/galeri' 
                ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
                : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            Galeri Foto
          </Link>
        </>
      )}

      {hasAccess(["Admin Kesiswaan"]) && (
        <Link 
          href="/admin/ekstrakurikuler" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            pathname === '/admin/ekstrakurikuler' 
              ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
              : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
          }`}
        >
          <Trophy className="w-5 h-5" />
          Ekstrakurikuler
        </Link>
      )}

      {hasAccess(["Admin TU", "Admin Kurikulum"]) && (
        <Link 
          href="/admin/guru" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            pathname === '/admin/guru' 
              ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
              : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          Direktori Pegawai
        </Link>
      )}

      {hasAccess(["Admin Kurikulum", "Admin Prestasi"]) && (
        <Link 
          href="/admin/prestasi" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            pathname === '/admin/prestasi' 
              ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
              : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
          }`}
        >
          <Trophy className="w-5 h-5" />
          Manajemen Prestasi
        </Link>
      )}

      
      

      {hasAccess(["Admin TU", "Admin Kurikulum"]) && (
        <Link 
          href="/admin/agenda" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            pathname === '/admin/agenda' 
              ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
              : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
          }`}
        >
          <LayoutTemplate className="w-5 h-5" />
          Kelola Agenda
        </Link>
      )}
      
      {hasAccess(["Admin TU", "Admin Sarpras"]) && (
        <Link 
          href="/admin/fasilitas" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            pathname === '/admin/fasilitas' 
              ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
              : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
          }`}
        >
          <Building2 className="w-5 h-5" />
          Kelola Fasilitas
        </Link>
      )}

      {hasAccess(["Admin Kurikulum"]) && (
        <Link 
          href="/admin/program" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            pathname === '/admin/program' 
              ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
              : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
          }`}
        >
          <LayoutTemplate className="w-5 h-5" />
          Program Kami
        </Link>
      )}

      {hasAccess(["Admin Pengaduan"]) && (
        <Link 
          href="/admin/pengaduan" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            pathname === '/admin/pengaduan' 
              ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
              : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Layanan Pengaduan
        </Link>
      )}

      {hasAccess([]) && (
        <div className="pt-4 mt-4 border-t border-emerald-800/50">
          <p className="px-4 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Sistem</p>
          <Link 
            href="/admin/ptsp" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === '/admin/ptsp' 
                ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
                : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Layanan PTSP
          </Link>
          <Link 
            href="/admin/administrasi" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === '/admin/administrasi' 
                ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
                : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <Folder className="w-5 h-5" />
            Administrasi
          </Link>
          <Link 
            href="/admin/buku-tamu" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === '/admin/buku-tamu' 
                ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
                : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            Buku Tamu
          </Link>
          <Link 
            href="/admin/portal" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === '/admin/portal' 
                ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
                : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <LayoutTemplate className="w-5 h-5" />
            Portal Layanan
          </Link>
          <Link 
            href="/admin/pengaturan" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === '/admin/pengaturan' 
                ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
                : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            Pengaturan Web
          </Link>
          <Link 
            href="/admin/akun" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === '/admin/akun' 
                ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
                : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            Manajemen Akun
          </Link>
        </div>
      )}
    </nav>
  );
}
