import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Direktori Guru & Pegawai",
  description: "Daftar guru dan pegawai SMPN 29 Makassar",
};

export const dynamic = 'force-dynamic';

export default async function GuruPage() {
  const pegawaiList = await prisma.pegawai.findMany({
    orderBy: { nama: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Direktori Guru & Pegawai
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Mengenal lebih dekat tenaga pendidik dan kependidikan di lingkungan sekolah kami.
        </p>
      </div>

      {pegawaiList.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Belum ada data pegawai.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {pegawaiList.map((pegawai) => (
            <div key={pegawai.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-w-3 aspect-h-4 bg-gray-200 relative h-64 overflow-hidden">
                {pegawai.foto ? (
                  <img
                    src={pegawai.foto}
                    alt={pegawai.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
                    <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{pegawai.nama}</h3>
                <p className="text-sm font-medium text-emerald-600 mb-2">{pegawai.jabatan}</p>
                {pegawai.mapel && (
                  <p className="text-sm text-gray-500 bg-gray-50 rounded-full px-3 py-1 inline-block mt-1">
                    {pegawai.mapel}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
