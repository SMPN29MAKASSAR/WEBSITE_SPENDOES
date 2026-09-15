/* eslint-disable */
// @ts-nocheck
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from 'lucide-react';
import SidebarNav from "./SidebarNav";
import AuthProvider from "@/components/AuthProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <AuthProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-emerald-900 text-emerald-50 flex flex-col transition-all shadow-xl">
          <div className="p-6 border-b border-emerald-800/50">
            <h1 className="text-xl font-bold text-white font-jakarta flex items-center gap-2">
              <div className="w-8 h-8 bg-white text-emerald-900 rounded-lg flex items-center justify-center font-bold">29</div>
              Admin Panel
            </h1>
            <p className="text-sm text-emerald-200 mt-1 opacity-80">SMPN 29 Makassar</p>
          </div>
          
          <SidebarNav />

          <div className="p-4 border-t border-emerald-800/50">
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                {session?.user?.name?.[0] || "A"}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{session?.user?.name}</p>
                <p className="text-xs text-emerald-300 capitalize">{(session?.user as any)?.role || "Admin Utama"}</p>
              </div>
            </div>
            <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium">
              <LogOut className="w-4 h-4" /> Keluar
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto">
          <header className="bg-white border-b border-slate-200 h-20 flex items-center px-8 justify-between shadow-sm z-10 sticky top-0">
            <h2 className="text-xl font-semibold font-jakarta text-slate-800">Sistem Manajemen Konten (CMS)</h2>
            <Link href="/" target="_blank" className="text-sm font-medium text-blue-600 hover:underline">
              Lihat Website &rarr;
            </Link>
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
