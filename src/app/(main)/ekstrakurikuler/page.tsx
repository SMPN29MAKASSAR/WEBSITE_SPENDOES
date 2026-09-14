import { prisma } from "@/lib/prisma";
import EkstrakurikulerClient from "./EkstrakurikulerClient";

export const metadata = { title: "Ekstrakurikuler | UPT SPF SMPN 29 Makassar" };

export const dynamic = 'force-dynamic';

export default async function EkstrakurikulerPage() {
  const ekstrakurikuler = await prisma.ekstrakurikuler.findMany({ 
    orderBy: { createdAt: "asc" },
    include: { pembina: true } 
  });

  return (
    <div className="flex flex-col items-center w-full pb-20 bg-slate-50">
      <section className="w-full bg-slate-900 text-white pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-jakarta mb-4">Daftar Ekstrakurikuler</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Wadah pengembangan minat, bakat, dan potensi diri siswa di luar jam pelajaran akademik.</p>
        </div>
      </section>
      
      <section className="container mx-auto px-6 py-12 max-w-7xl">
        <EkstrakurikulerClient initialData={ekstrakurikuler} />
      </section>
    </div>
  );
}
