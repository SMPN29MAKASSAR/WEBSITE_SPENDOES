"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  LayoutDashboard,
  CalendarPlus,
  MapPin,
  FileCheck2,
  ArrowLeft,
  Clock,
  Calendar,
  Building2,
} from "lucide-react";

interface BonsaiHeaderProps {
  activeTab: "dashboard" | "booking" | "peta" | "sop";
  setActiveTab: (tab: "dashboard" | "booking" | "peta" | "sop") => void;
  pendingCount?: number;
}

export default function BonsaiHeader({
  activeTab,
  setActiveTab,
  pendingCount = 0,
}: BonsaiHeaderProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WITA"
      );
      setCurrentDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm print:hidden">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-green-900 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              PORTAL KHUSUS
            </span>
            <span className="hidden sm:inline font-medium">
              UPT SPF SMPN 29 Makassar &bull; Gerakan Peduli & Berbudaya Lingkungan Hidup
            </span>
            <span className="sm:hidden font-medium">SMPN 29 Makassar</span>
          </div>

          <div className="flex items-center gap-4 text-emerald-100/90 font-mono text-[11px]">
            <span className="hidden md:inline flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 inline text-emerald-300 mr-1" />
              {currentDate}
            </span>
            <span className="flex items-center gap-1 font-semibold text-emerald-200">
              <Clock className="w-3.5 h-3.5 inline text-emerald-300 mr-1" />
              {currentTime}
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition text-[11px] font-sans"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Ke Website Utama</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-4 ring-emerald-50 shrink-0">
              <Sparkles className="w-6 h-6 text-emerald-100 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  BONSAI <span className="text-emerald-700">CENTER</span>
                </h1>
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Spendoes
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-800 mt-0.5">
                <span className="text-emerald-950 font-bold">BONSAI</span> (Bersih, Organik, Nyaman, Sehat, Asri dan Indah)
              </p>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Pusat Pembelajaran Luar Ruang &amp; Manajemen Standar Operasional Lingkungan Sekolah
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center overflow-x-auto pb-1 sm:pb-0 gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "bg-white text-emerald-900 shadow-sm border border-slate-200/60 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-700" />
              <span>1. Dashboard</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("booking")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === "booking"
                  ? "bg-white text-emerald-900 shadow-sm border border-slate-200/60 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <CalendarPlus className="w-4 h-4 text-teal-700" />
              <span>2. Booking Outing</span>
            </button>

            <button
              onClick={() => setActiveTab("peta")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === "peta"
                  ? "bg-white text-emerald-900 shadow-sm border border-slate-200/60 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>3. Peta Zona Belajar</span>
            </button>

            <button
              onClick={() => setActiveTab("sop")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === "sop"
                  ? "bg-white text-emerald-900 shadow-sm border border-slate-200/60 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-green-700" />
              <span>5. SOP BONSAI</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
