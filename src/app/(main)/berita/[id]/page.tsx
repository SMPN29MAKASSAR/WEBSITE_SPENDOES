import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";

export default async function DetailBerita({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      <Link href="/berita" className="text-emerald-600 hover:text-emerald-800 mb-6 inline-block font-medium">
        &larr; Kembali ke Daftar Berita
      </Link>
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <header className="mb-8 border-b pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center text-gray-500 text-sm">
            <span>Dipublikasikan pada {format(new Date(post.createdAt), "dd MMMM yyyy", { locale: idLocale })}</span>
          </div>
        </header>
        <div className="prose prose-emerald max-w-none prose-img:rounded-xl">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-800 leading-relaxed text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
