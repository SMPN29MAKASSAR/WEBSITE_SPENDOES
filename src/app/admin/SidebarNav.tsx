"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Users, Image as ImageIcon, MessageSquare, FileText, Trophy, LayoutTemplate } from 'lucide-react';

export default function SidebarNav() {
  const pathname = usePathname();

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
        href="/admin/guru" 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
          pathname === '/admin/guru' 
            ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
            : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
        }`}
      >
        <Users className="w-5 h-5" />
        Direktori Guru
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
      
      <Link 
        href="/admin/pengaduan" 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
          pathname === '/admin/pengaduan' 
            ? 'bg-emerald-800/80 text-white shadow-sm border border-emerald-700/50' 
            : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        Manajemen Pengaduan
      </Link>
      
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
    </nav>
  );
}
