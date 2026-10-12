"use client";

import React, { useState } from "react";
import {
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sprout,
  Recycle,
  Flower2,
  Droplets,
  Layers,
} from "lucide-react";
import { BONSAI_ZONES, BonsaiZone } from "./data";
import { BookingData } from "./BonsaiDashboard";

interface BonsaiZoneMapProps {
  bookings: BookingData[];
  onSelectZoneForBooking: (zoneName: string) => void;
}

export default function BonsaiZoneMap({
  bookings,
  onSelectZoneForBooking,
}: BonsaiZoneMapProps) {
  const [selectedZoneId, setSelectedZoneId] = useState<string>("zona-1");

  const todayStr = new Date().toISOString().split("T")[0];
  const todayApprovedBookings = bookings.filter(
    (b) => b.tanggal === todayStr && b.status === "DISETUJUI"
  );

  const getZoneStatus = (zone: BonsaiZone) => {
    const booking = todayApprovedBookings.find((b) =>
      b.zona.includes(zone.code) || b.zona.includes(zone.nama)
    );
    if (booking) {
      return {
        status: "Terjadwal Hari Ini",
        badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
        indicator: "bg-amber-500",
        detail: `Digunakan oleh ${booking.kelas} (${booking.jamMulai} - ${booking.jamSelesai})`,
      };
    }
    return {
      status: "Tersedia Hari Ini",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      indicator: "bg-emerald-500",
      detail: "Siap digunakan untuk outing kelas",
    };
  };

  const activeZone = BONSAI_ZONES.find((z) => z.id === selectedZoneId) || BONSAI_ZONES[0];
  const activeZoneStatus = getZoneStatus(activeZone);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Denah Lokasi Edukasi Terpadu
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Peta Zona Belajar BONSAI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Eksplorasi 6 Zona Pembelajaran Luar Ruang SMPN 29 Makassar. Cek kapasitas,
              fasilitas pendukung, aturan penggunaan, serta ketersediaan zona sebelum mengajukan outing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>6 Zona Aktif</span>
            </span>
          </div>
        </div>

        {/* Skema Peta Denah Sekolah Interaktif (Visual Layout) */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-800/60 shadow-inner">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-800/40">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Skematik Denah Lingkungan SMPN 29 Makassar
              </span>
            </div>
            <span className="text-[11px] text-emerald-300/80 hidden sm:inline">
              Klik salah satu zona di bawah untuk melihat detail spesifikasi
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {BONSAI_ZONES.map((zone, idx) => {
              const zoneStatus = getZoneStatus(zone);
              const isSelected = zone.id === selectedZoneId;

              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`p-3.5 rounded-xl text-left transition relative border ${
                    isSelected
                      ? "bg-emerald-500/25 border-emerald-400 shadow-lg ring-2 ring-emerald-400/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white/10 text-emerald-300">
                      {zone.code}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${zoneStatus.indicator}`}
                      title={zoneStatus.status}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                    {zone.nama.replace(/Zona \d+: /, "")}
                  </h4>
                  <p className="text-[10px] text-emerald-200/70 mt-1 flex items-center gap-1">
                    <Users className="w-3 h-3 inline" />
                    {zone.kapasitas} Siswa
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Showcase Zona yang Dipilih */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800">
                {activeZone.code}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${activeZoneStatus.badgeColor}`}
              >
                {activeZoneStatus.status}
              </span>
              <span className="text-xs text-slate-500 italic">
                &bull; {activeZoneStatus.detail}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {activeZone.nama}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              {activeZone.deskripsi}
            </p>
          </div>

          <button
            onClick={() => onSelectZoneForBooking(activeZone.nama)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 shrink-0 group self-start"
          >
            <span>Pilih Zona Ini &amp; Buat Booking</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* 4 Kolom Karakteristik Zona */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* Kolom 1: Lokasi & Kapasitas */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Lokasi &amp; Kapasitas
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Titik Lokasi:</span>
                <strong className="text-slate-800">{activeZone.lokasi}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Daya Tampung:</span>
                <strong className="text-emerald-800 font-mono text-sm">
                  {activeZone.kapasitas} Siswa
                </strong>
                <span className="text-slate-500 text-[11px]"> (1 Rombel Lengkap)</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Fasilitas Pembelajaran */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Fasilitas Tersedia
            </h4>
            <ul className="text-xs text-slate-700 space-y-1.5">
              {activeZone.fasilitas.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-tight">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Aturan Penggunaan */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Aturan Penggunaan
            </h4>
            <ul className="text-xs text-slate-700 space-y-1.5">
              {activeZone.aturan.map((a, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold text-xs mt-0.5">&bull;</span>
                  <span className="leading-tight">{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Rekomendasi Mapel */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Rekomendasi Mapel
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeZone.mapelRekomendasi.map((m, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-semibold"
                >
                  {m}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 italic">
              Cocok untuk penguatan Kurikulum Merdeka &amp; P5.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Seluruh 6 Kartu Zona */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Daftar 6 Zona Belajar Terbuka</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BONSAI_ZONES.map((zone) => {
            const zStatus = getZoneStatus(zone);
            return (
              <div
                key={zone.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 transition hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {zone.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${zStatus.badgeColor}`}
                    >
                      {zStatus.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {zone.nama}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {zone.lokasi}
                  </p>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {zone.deskripsi}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      Kapasitas: <strong>{zone.kapasitas} Siswa</strong>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {zone.fasilitas.length} Fasilitas
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedZoneId(zone.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-xs font-bold transition text-center"
                  >
                    Detail Zona
                  </button>
                  <button
                    onClick={() => onSelectZoneForBooking(zone.nama)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm text-center"
                  >
                    Booking
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
