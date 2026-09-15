import { Eye, FileText, Image as ImageIcon, Users, Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Dashboard Admin | UPT SPF SMPN 29 Makassar",
};

export default async function DashboardPage() {
  const postCount = await prisma.post.count();
  const galeriCount = await prisma.galeri.count();
  const userCount = await prisma.user.count();
  const pengaduanCount = await prisma.pengaduan.count();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold font-jakarta mb-2">Selamat Datang di Dashboard Admin!</h2>
        <p className="text-emerald-100 max-w-2xl">
          Di sini Anda dapat mengelola seluruh konten website, mulai dari mengubah teks profil, menambah berita terbaru, mengatur menu, hingga mengubah galeri foto sekolah.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-emerald-50 p-4 rounded-xl">
            <Eye className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Pengaduan</p>
            <p className="text-2xl font-bold font-jakarta text-slate-900">{pengaduanCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-teal-50 p-4 rounded-xl">
            <FileText className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Berita</p>
            <p className="text-2xl font-bold font-jakarta text-slate-900">{postCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-green-50 p-4 rounded-xl">
            <ImageIcon className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Galeri Foto</p>
            <p className="text-2xl font-bold font-jakarta text-slate-900">{galeriCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-amber-50 p-4 rounded-xl">
            <Users className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Akun</p>
            <p className="text-2xl font-bold font-jakarta text-slate-900">{userCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold font-jakarta text-slate-800 mb-6">Berita & Pengumuman Terbaru</h3>
          <div className="space-y-4">
            {[
              { title: "Juara Umum Lomba Cerdas Cermat Tingkat Kota 2026", date: "Hari ini, 10:00", status: "Published", color: "bg-green-100 text-green-700" },
              { title: "Peringatan Hari Kemerdekaan RI Ke-81", date: "17 Agu 2026", status: "Published", color: "bg-green-100 text-green-700" },
              { title: "Jadwal Pengambilan Rapor Semester Ganjil", date: "Belum rilis", status: "Draft", color: "bg-slate-100 text-slate-700" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                <div>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.date}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Lihat Semua Berita
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold font-jakarta text-slate-800 mb-6">Aksi Cepat</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors text-left">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              Tulis Berita Baru
            </button>
            <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-teal-50 text-teal-700 font-semibold hover:bg-teal-100 transition-colors text-left">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <ImageIcon className="w-5 h-5 text-teal-600" />
              </div>
              Unggah Foto Galeri
            </button>
            <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100 transition-colors text-left">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Settings className="w-5 h-5 text-slate-600" />
              </div>
              Ubah Profil Sekolah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
