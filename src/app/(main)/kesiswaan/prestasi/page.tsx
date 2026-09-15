import { prisma } from "@/lib/prisma";
import { Trophy } from "lucide-react";

export const revalidate = 60;

export default async function PrestasiPage() {
  const prestasiList = await prisma.prestasi.findMany({ orderBy: { tahun: "desc" } });
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold font-jakarta text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-6 drop-shadow-sm">Hall of Fame</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Merayakan dedikasi dan prestasi gemilang siswa-siswi terbaik SMPN 29 Makassar di berbagai tingkatan.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prestasiList.map(item => (
            <div key={item.id} className="group relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-yellow-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-800">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.namaLomba} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2"><Trophy className="w-12 h-12 opacity-50"/></div>
                )}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 text-sm font-bold px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md border border-yellow-300/30">
                  {item.tahun}
                </div>
              </div>
              <div className="p-8">
                <div className="inline-block mb-4 px-3 py-1 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs font-bold uppercase tracking-widest">
                  {item.tingkat}
                </div>
                <h3 className="text-2xl font-bold font-jakarta text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors">{item.namaLomba}</h3>
                <p className="text-lg text-yellow-200/90 font-medium mb-4">{item.namaSiswa}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
        {prestasiList.length === 0 && <div className="text-center py-20 text-slate-500">Belum ada data prestasi.</div>}
      </div>
    </div>
  );
}
