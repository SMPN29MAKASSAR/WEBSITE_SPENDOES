import { prisma } from "@/lib/prisma";
import { FileText } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Struktur Organisasi | SMPN 29 Makassar",
  description: "Bagan Struktur Organisasi SMPN 29 Makassar",
};

export const dynamic = 'force-dynamic';

export default async function StrukturOrganisasiPage() {
  const setting = await prisma.setting.findUnique({
    where: { key: 'struktur_organisasi_image' }
  });

  const imageUrl = setting?.value;
  const proxiedImageUrl = imageUrl?.includes('i.ibb.co') 
    ? `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl.replace('https://', ''))}`
    : imageUrl;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-orange-400 rounded-t-3xl rounded-b-md p-8 relative overflow-hidden shadow-md">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
          <div className="absolute bottom-0 right-32 w-40 h-40 bg-white/10 rounded-full translate-y-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 mb-1">
              <FileText className="w-6 h-6 text-white" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-jakarta">Struktur Organisasi</h1>
            </div>
            <p className="text-emerald-50 text-sm ml-9 font-medium">Profil</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-extrabold text-[#117b66] font-jakarta mb-2">Struktur Organisasi</h2>
          <div className="w-16 h-1 bg-[#117b66] mx-auto rounded-full mb-10"></div>
          
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 sm:p-8 max-w-5xl mx-auto transition-transform hover:shadow-2xl duration-500 relative overflow-hidden group">
            {proxiedImageUrl ? (
              <div className="relative w-full rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                <img 
                  src={proxiedImageUrl} 
                  alt="Struktur Organisasi SMPN 29 Makassar" 
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <FileText className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Gambar struktur organisasi belum diunggah.</p>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="italic text-slate-500 font-serif">Struktur Organisasi SMPN 29 Makassar</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
