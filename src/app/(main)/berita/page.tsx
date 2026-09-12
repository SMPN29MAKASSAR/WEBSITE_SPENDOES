import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { Newspaper, Calendar, Search, ArrowRight, X } from "lucide-react";

export const metadata = {
  title: "Berita & Artikel | SMPN 29 Makassar",
  description: "Ikuti berita terkini dan informasi penting dari SMPN 29 Makassar",
};

interface BeritaPageProps {
  searchParams?: Promise<{
    q?: string;
    category?: string;
  }>;
}

const CATEGORIES = [
  "Berita Umum",
  "Inovasi Guru",
  "Kegiatan Sekolah",
  "Prestasi",
];

export default async function BeritaPage(props: BeritaPageProps) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q?.trim() || "";
  const selectedCategory = searchParams?.category?.trim() || "";

  // Build filter query for prisma
  const whereConditions: any[] = [];

  if (q) {
    whereConditions.push({
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
      ],
    });
  }

  if (selectedCategory) {
    if (selectedCategory === "Berita Umum") {
      whereConditions.push({
        OR: [
          { category: "BERITA" },
          { category: "Berita Umum" },
          { category: { contains: "Berita" } },
        ],
      });
    } else {
      whereConditions.push({
        OR: [
          { category: { contains: selectedCategory } },
          { title: { contains: selectedCategory } },
          { content: { contains: selectedCategory } },
        ],
      });
    }
  }

  const whereClause = whereConditions.length > 0 ? { AND: whereConditions } : {};

  const [posts, recentPosts] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      {/* Header: Green Background */}
      <section className="w-full bg-emerald-700 text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-inner">
        {/* Subtle Decorative Background Shapes */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white blur-2xl"></div>
          <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-emerald-300 blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-4">
              <Newspaper className="w-3.5 h-3.5" />
              Warta & Informasi
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-jakarta text-white tracking-tight mb-3">
              Berita & Artikel
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
              Ikuti berita terkini dan informasi penting dari SMPN 29 Makassar
            </p>
          </div>
        </div>
      </section>

      {/* Main Container: 2-Column Layout (Main & Sidebar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 w-full">
        {/* Active Filter Indicators */}
        {(q || selectedCategory) && (
          <div className="mb-6 flex flex-wrap items-center gap-2 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-sm">
            <span className="text-slate-500 font-medium">Filter Aktif:</span>
            {q && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-semibold text-xs">
                Pencarian: "{q}"
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs">
                Kategori: {selectedCategory}
              </span>
            )}
            <Link
              href="/berita"
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium ml-auto"
            >
              <X className="w-3.5 h-3.5" /> Hapus Semua Filter
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Column (Left): 2-columns News Cards Grid */}
          <div className="lg:col-span-2">
            {posts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Tidak ada berita ditemukan</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  {q || selectedCategory
                    ? "Coba ubah kata kunci atau reset kategori pencarian Anda."
                    : "Belum ada berita atau artikel yang dipublikasikan saat ini."}
                </p>
                {(q || selectedCategory) && (
                  <Link
                    href="/berita"
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
                  >
                    Kembali ke Semua Berita
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/berita/${post.id}`}
                    className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image Container with Badge */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                          {/* Subtle decorative mesh overlay */}
                          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                          <Newspaper className="w-12 h-12 text-white/30" />
                        </div>
                      )}

                      {/* Badge top-left */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-md">
                          Berita Umum
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        <span>{format(new Date(post.createdAt), "dd MMM yyyy", { locale: id })}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-base sm:text-lg font-bold font-jakarta text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug mb-2.5">
                        {post.title}
                      </h2>

                      {/* Snippet */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed flex-grow">
                        {post.content || "Tidak ada deskripsi singkat."}
                      </p>

                      {/* Action: Baca -> */}
                      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-emerald-600 group-hover:text-orange-600 transition-colors">
                        <span>Baca</span>
                        <span className="group-hover:translate-x-1.5 transition-transform duration-200 inline-block font-bold">
                          &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar (Right) */}
          <aside className="lg:col-span-1 space-y-6">
            {/* 1. "Cari Berita" (Orange header box) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3.5 text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-white" />
                  <h3 className="font-bold font-jakarta text-sm sm:text-base tracking-wide">Cari Berita</h3>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <form action="/berita" method="GET" className="space-y-3">
                  {selectedCategory && (
                    <input type="hidden" name="category" value={selectedCategory} />
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      name="q"
                      defaultValue={q}
                      placeholder="Ketik kata kunci..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" /> Cari
                  </button>
                  {q && (
                    <Link
                      href={selectedCategory ? `/berita?category=${encodeURIComponent(selectedCategory)}` : "/berita"}
                      className="block text-center text-xs text-orange-600 hover:text-orange-700 font-medium pt-1"
                    >
                      &times; Hapus Filter Pencarian
                    </Link>
                  )}
                </form>
              </div>
            </div>

            {/* 2. "Berita Terkini" List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden p-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <div className="w-1.5 h-5 bg-emerald-600 rounded-full"></div>
                <h3 className="font-bold font-jakarta text-slate-900 text-base">Berita Terkini</h3>
              </div>
              <div className="space-y-4 divide-y divide-slate-100">
                {recentPosts.length === 0 ? (
                  <p className="text-slate-400 text-xs py-2">Belum ada berita terkini.</p>
                ) : (
                  recentPosts.map((recent, idx) => (
                    <Link
                      key={recent.id}
                      href={`/berita/${recent.id}`}
                      className={`group flex items-start gap-3.5 ${idx > 0 ? "pt-4" : ""}`}
                    >
                      {/* Small thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 overflow-hidden relative group-hover:border-emerald-300 transition-all">
                        {recent.imageUrl ? (
                          <img src={recent.imageUrl} alt={recent.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <Newspaper className="w-6 h-6 text-emerald-600/70 group-hover:scale-110 transition-transform duration-300" />
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                          {recent.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5 font-medium">
                          <Calendar className="w-3 h-3 text-orange-500" />
                          <span>{format(new Date(recent.createdAt), "dd MMM yyyy", { locale: id })}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* 3. "Kategori" with Pill Tags */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden p-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
                <h3 className="font-bold font-jakarta text-slate-900 text-base">Kategori</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <Link
                      key={cat}
                      href={
                        isActive
                          ? q ? `/berita?q=${encodeURIComponent(q)}` : "/berita"
                          : q ? `/berita?q=${encodeURIComponent(q)}&category=${encodeURIComponent(cat)}` : `/berita?category=${encodeURIComponent(cat)}`
                      }
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-orange-500 text-white shadow-sm ring-2 ring-orange-400/30"
                          : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200/60"
                      }`}
                    >
                      {cat}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
