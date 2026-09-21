/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";

export default function AsesmenBtn({ item, gradientFrom, gradientTo, iconColor, textColor }: any) {
  const [status, setStatus] = useState<"OPEN" | "CLOSED" | "WAITING">("OPEN");
  const [timeText, setTimeText] = useState("");

  useEffect(() => {
    const checkTime = () => {
      if (!item.waktuMulai && !item.waktuBerakhir) {
        setStatus("OPEN");
        return;
      }
      
      const now = new Date();
      // Compare with UTC dates from DB
      const start = item.waktuMulai ? new Date(item.waktuMulai) : null;
      const end = item.waktuBerakhir ? new Date(item.waktuBerakhir) : null;

      if (start && now < start) {
        setStatus("WAITING");
        setTimeText("Buka: " + start.toLocaleString('id-ID', { timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit' }) + " WITA");
      } else if (end && now > end) {
        setStatus("CLOSED");
        setTimeText("Telah Berakhir");
      } else {
        setStatus("OPEN");
        if (end) {
          setTimeText("Tutup: " + end.toLocaleString('id-ID', { timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit' }) + " WITA");
        }
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [item]);

  const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Book;
  const isOpen = status === "OPEN";

  return (
    <a 
      href={isOpen ? item.linkUjian : "#"} 
      target={isOpen ? "_blank" : "_self"} 
      rel="noreferrer"
      onClick={(e) => {
        if (!isOpen) {
          e.preventDefault();
          alert(status === "WAITING" ? `Link belum dibuka. ${timeText}` : "Maaf, waktu ujian telah berakhir.");
        }
      }}
      className={`group/btn relative flex flex-col p-4 bg-white rounded-2xl border ${isOpen ? 'border-slate-100 hover:shadow-md hover:border-slate-200' : 'border-slate-200 opacity-70'} shadow-sm transition-all duration-300 ${isOpen ? 'active:scale-[0.98]' : 'cursor-not-allowed'} overflow-hidden`}
    >
      {isOpen && <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300`}></div>}
      
      <div className="flex items-center justify-between w-full relative z-10">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl text-white ${isOpen ? iconColor.replace('text-', 'bg-').replace('-600', '-500') : 'bg-slate-400'} shadow-inner`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={`font-bold ${isOpen ? 'text-slate-700 group-hover/btn:text-slate-900' : 'text-slate-500'} transition-colors`}>{item.mataPelajaran}</span>
        </div>
        
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOpen ? 'bg-slate-50 group-hover/btn:bg-white ' + textColor : 'bg-slate-100 text-slate-400'} transition-colors relative z-10`}>
          {status === "WAITING" ? <LucideIcons.Lock className="w-4 h-4" /> : status === "CLOSED" ? <LucideIcons.Lock className="w-4 h-4" /> : <LucideIcons.ArrowRight className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />}
        </div>
      </div>
      
      {(item.waktuMulai || item.waktuBerakhir) && (
        <div className="mt-3 text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 w-fit">
          <LucideIcons.Clock className="w-3 h-3" /> {timeText}
        </div>
      )}
    </a>
  );
}
