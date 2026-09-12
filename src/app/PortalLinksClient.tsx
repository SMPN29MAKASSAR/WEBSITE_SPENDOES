"use client";

import { useState } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

export default function PortalLinksClient({ links }: { links: any[] }) {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-6 w-full mb-12">
        {links.map((link) => {
          const IconComp = (LucideIcons as any)[link.icon] || LucideIcons.Link;
          // Map colors
          const colorStyles: any = {
            emerald: "bg-emerald-900/40 border-emerald-500/30 hover:bg-emerald-800/60 text-emerald-200",
            amber: "bg-amber-600/90 border-amber-500/30 hover:bg-amber-600 text-amber-100",
            blue: "bg-blue-900/40 border-blue-500/30 hover:bg-blue-800/60 text-blue-200",
            rose: "bg-rose-900/40 border-rose-500/30 hover:bg-rose-800/60 text-rose-200",
            purple: "bg-purple-900/40 border-purple-500/30 hover:bg-purple-800/60 text-purple-200",
            slate: "bg-slate-900/70 border-slate-500/30 hover:bg-slate-800/90 text-slate-300"
          };
          
          const styleClass = colorStyles[link.color] || colorStyles.emerald;
          const isExternal = link.url.startsWith('http');
          const isIframe = link.url.startsWith('iframe:');
          const finalUrl = isIframe ? link.url.replace('iframe:', '') : link.url;

          if (isIframe) {
            return (
              <button 
                key={link.id}
                onClick={() => setIframeUrl(finalUrl)}
                className={`w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] group relative backdrop-blur-md border p-6 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl hover:-translate-y-1 ${styleClass.split(' text-')[0]}`}
              >
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                  <IconComp className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10 flex flex-col text-left h-full">
                  <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <IconComp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-1">{link.title}</h3>
                  <p className={`text-sm mb-6 flex-grow text-${styleClass.split(' text-')[1]}`}>{link.description}</p>
                  <div className="flex items-center justify-between text-white/70 text-sm mt-auto">
                    <span>Klik untuk melihat layanan</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <span className="transform rotate-0">&rarr;</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          }

          return (
            <Link 
              key={link.id}
              href={finalUrl}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={`w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] group relative backdrop-blur-md border p-6 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl hover:-translate-y-1 ${styleClass.split(' text-')[0]}`}
            >
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                <IconComp className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10 flex flex-col text-left h-full">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <IconComp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-1">{link.title}</h3>
                <p className={`text-sm mb-6 flex-grow text-${styleClass.split(' text-')[1]}`}>{link.description}</p>
                <div className="flex items-center justify-between text-white/70 text-sm mt-auto">
                  <span>Klik untuk melihat layanan</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <span className="transform rotate-0">&rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Modal Iframe */}
      {iframeUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white w-full max-w-6xl h-full rounded-2xl overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="ml-2 text-sm font-semibold text-slate-600">Portal Layanan Digital</span>
              </div>
              <button 
                onClick={() => setIframeUrl(null)}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-bold text-sm"
              >
                TUTUP
              </button>
            </div>
            <iframe 
              src={iframeUrl} 
              className="w-full flex-1 border-none bg-white"
              title="Portal Viewer"
            />
          </div>
        </div>
      )}
    </>
  );
}
