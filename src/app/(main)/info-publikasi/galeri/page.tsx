/* eslint-disable */
// @ts-nocheck
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const metadata = {
  title: "Galeri Sekolah",
  description: "Galeri foto kegiatan dan fasilitas sekolah",
};

export const dynamic = 'force-dynamic';

export default async function GaleriPage() {
  const galeriList = await prisma.galeri.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Galeri Sekolah
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Dokumentasi kegiatan, prestasi, dan momen-momen penting.
        </p>
      </div>

      {galeriList.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Belum ada foto galeri.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galeriList.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.judul}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-bold text-white mb-1">{item.judul}</h3>
                  {item.deskripsi && (
                    <p className="text-sm text-gray-200 line-clamp-2">{item.deskripsi}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
