"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  BookOpen,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Check,
  X,
  Phone,
  FileText,
  Building,
} from "lucide-react";
import { BONSAI_ZONES } from "./data";

export interface BookingData {
  id: string;
  kodeBooking: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  kelas: string;
  mataPelajaran: string;
  namaGuru: string;
  nomorWa?: string | null;
  jumlahSiswa: number;
  zona: string;
  tujuan: string;
  status: string; // MENUNGGU, DISETUJUI, SELESAI, DITOLAK
  catatanAdmin?: string | null;
  createdAt: string;
}

interface BonsaiDashboardProps {
  bookings: BookingData[];
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: string, catatan?: string) => Promise<void>;
  onNavigateBooking: () => void;
  onNavigatePeta: () => void;
}

export default function BonsaiDashboard({
  bookings,
  onRefresh,
  onUpdateStatus,
  onNavigateBooking,
  onNavigatePeta,
}: BonsaiDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  // Tanggal hari ini format YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  // Sesi hari ini
  const todayBookings = bookings.filter((b) => b.tanggal === todayStr);

  // Zona yang digunakan hari ini
  const activeZonesToday = Array.from(
    new Set(
      todayBookings
        .filter((b) => b.status === "DISETUJUI")
        .map((b) => b.zona)
    )
  );

  // Permohonan menunggu persetujuan
  const pendingBookings = bookings.filter((b) => b.status === "MENUNGGU");

  // Riwayat pembelajaran (semua booking terfilter)
  const filteredHistory = bookings.filter((item) => {
    const matchesSearch =
      item.kodeBooking.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaGuru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.zona.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "ALL" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAction = async (id: string, status: string) => {
    setIsUpdatingId(id);
    try {
      await onUpdateStatus(id, status);
    } finally {
      setIsUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Quick Stats */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Pembelajaran Alam &amp; Lingkungan Hidup
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Dashboard Pembelajaran Luar Ruang
            </h2>
            <p className="text-emerald-100/80 text-sm mt-2 leading-relaxed">
              Memfasilitasi guru dan siswa SMPN 29 Makassar dalam memanfaatkan 6 Zona Edukasi
              BONSAI secara terjadwal, tertib, dan berkelanjutan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateBooking}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow-lg shadow-emerald-500/30 transition flex items-center gap-2 group"
            >
              <span>+ Booking Outing Kelas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
            <button
              onClick={onNavigatePeta}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>Lihat 6 Zona</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-emerald-800/60">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-emerald-300">
              <span className="text-xs font-medium uppercase tracking-wider">Jadwal Hari Ini</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {todayBookings.length}
            </div>
            <p className="text-[11px] text-emerald-200/70 mt-1">
              {todayBookings.filter((b) => b.status === "DISETUJUI").length} sesi disetujui
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-emerald-300">
              <span className="text-xs font-medium uppercase tracking-wider">Zona Digunakan</span>
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {activeZonesToday.length}
              <span className="text-sm font-normal text-emerald-300/80"> / 6 Zona</span>
            </div>
            <p className="text-[11px] text-emerald-200/70 mt-1">
              {6 - activeZonesToday.length} zona tersedia hari ini
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-amber-300">
              <span className="text-xs font-medium uppercase tracking-wider">Perlu Persetujuan</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1">
              {pendingBookings.length}
            </div>
            <p className="text-[11px] text-amber-200/70 mt-1">
              Permohonan outing guru
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-emerald-300">
              <span className="text-xs font-medium uppercase tracking-wider">Total Riwayat</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {bookings.length}
            </div>
            <p className="text-[11px] text-emerald-200/70 mt-1">
              Total sesi outing kelas
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Jadwal Hari Ini & Zona Terpakai */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Ringkasan Jadwal Hari Ini (2 Kolom) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Ringkasan Jadwal Hari Ini
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {todayBookings.length} Sesi Terjadwal
            </span>
          </div>

          {todayBookings.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Belum ada jadwal outing kelas hari ini
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Semua zona belajar siap digunakan. Guru dapat mengajukan booking outing sekarang.
              </p>
              <button
                onClick={onNavigateBooking}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
              >
                + Ajukan Sesi Hari Ini
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {todayBookings.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition bg-gradient-to-r from-slate-50 to-white hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                          {session.kelas}
                        </span>
                        <span className="text-xs font-mono font-medium text-slate-500">
                          {session.kodeBooking}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            session.status === "DISETUJUI"
                              ? "bg-emerald-500 text-white"
                              : session.status === "MENUNGGU"
                              ? "bg-amber-400 text-amber-950"
                              : session.status === "SELESAI"
                              ? "bg-blue-600 text-white"
                              : "bg-rose-500 text-white"
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {session.mataPelajaran}
                      </h4>
                      <p className="text-xs text-slate-600">
                        Guru Pengampu: <strong className="text-slate-800">{session.namaGuru}</strong>
                      </p>
                    </div>

                    <div className="text-right sm:text-right shrink-0">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold font-mono">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {session.jamMulai} - {session.jamSelesai} WITA
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-end gap-1">
                        <Users className="w-3 h-3" />
                        {session.jumlahSiswa} Siswa
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{session.zona}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 italic truncate max-w-xs">
                      &ldquo;{session.tujuan}&rdquo;
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Status Zona Yang Digunakan (1 Kolom) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600" />
                Zona Yang Digunakan
              </h3>
              <span className="text-xs text-slate-500">Live Status</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Pantauan keterisian 6 Zona Belajar BONSAI pada hari ini:
            </p>

            <div className="space-y-3">
              {BONSAI_ZONES.map((zone) => {
                const isUsedToday = todayBookings.some(
                  (b) => b.zona.includes(zone.code) && b.status === "DISETUJUI"
                );
                const currentBooking = todayBookings.find(
                  (b) => b.zona.includes(zone.code) && b.status === "DISETUJUI"
                );

                return (
                  <div
                    key={zone.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      isUsedToday
                        ? "bg-amber-50/60 border-amber-200 shadow-sm"
                        : "bg-slate-50/80 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                            {zone.code}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">
                            {zone.nama.replace(/Zona \d+: /, "")}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Kapasitas: {zone.kapasitas} Siswa &bull; {zone.lokasi}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isUsedToday
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {isUsedToday ? "Terjadwal Hari Ini" : "Tersedia"}
                      </span>
                    </div>

                    {isUsedToday && currentBooking && (
                      <div className="mt-2 pt-2 border-t border-amber-200/80 text-[11px] text-amber-950 flex items-center justify-between">
                        <span>
                          {currentBooking.kelas} ({currentBooking.namaGuru})
                        </span>
                        <span className="font-mono font-semibold">
                          {currentBooking.jamMulai} - {currentBooking.jamSelesai}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onNavigatePeta}
            className="w-full mt-5 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-bold transition text-center"
          >
            Lihat Peta &amp; Aturan Zona Selengkapnya &rarr;
          </button>
        </div>
      </div>

      {/* Bagian: Permohonan yang Menunggu Persetujuan */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Permohonan Menunggu Persetujuan
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {pendingBookings.length} Pengajuan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Koordinator Tim BONSAI dan Pembina Kurikulum dapat memverifikasi kelaikan jadwal di bawah ini:
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            Segarkan Data
          </button>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
            <p className="text-sm font-bold text-emerald-900">
              Semua permohonan telah ditinjau!
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Tidak ada permohonan outing guru yang sedang menggantung saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] bg-slate-50/80">
                  <th className="py-3 px-3">Kode / Tanggal</th>
                  <th className="py-3 px-3">Guru &amp; Kontak</th>
                  <th className="py-3 px-3">Kelas &amp; Mapel</th>
                  <th className="py-3 px-3">Zona &amp; Waktu</th>
                  <th className="py-3 px-3">Tujuan Belajar</th>
                  <th className="py-3 px-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-amber-50/30 transition">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900">{b.kodeBooking}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">{b.tanggal}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{b.namaGuru}</div>
                      {b.nomorWa && (
                        <a
                          href={`https://wa.me/${b.nomorWa.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          {b.nomorWa}
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-800 mb-1">
                        {b.kelas} ({b.jumlahSiswa} Siswa)
                      </span>
                      <div className="font-medium text-slate-700">{b.mataPelajaran}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-emerald-800">{b.zona}</div>
                      <div className="font-mono text-slate-600 mt-0.5">
                        {b.jamMulai} - {b.jamSelesai} WITA
                      </div>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <p className="text-slate-600 line-clamp-2 italic">
                        &ldquo;{b.tujuan}&rdquo;
                      </p>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          disabled={isUpdatingId === b.id}
                          onClick={() => handleAction(b.id, "DISETUJUI")}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1 shadow-sm disabled:opacity-50"
                          title="Setujui permohonan outing ini"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui</span>
                        </button>
                        <button
                          disabled={isUpdatingId === b.id}
                          onClick={() => handleAction(b.id, "DITOLAK")}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition flex items-center gap-1 disabled:opacity-50"
                          title="Tolak permohonan"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bagian: Riwayat Pembelajaran Luar Ruang */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              Riwayat Pembelajaran Luar Ruang
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekapitulasi seluruh aktivitas outing kelas yang pernah diajukan dan terlaksana
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari guru, kelas, mapel..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700 font-medium"
            >
              <option value="ALL">Semua Status</option>
              <option value="DISETUJUI">Disetujui</option>
              <option value="MENUNGGU">Menunggu</option>
              <option value="SELESAI">Selesai</option>
              <option value="DITOLAK">Ditolak</option>
            </select>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">Tidak ada riwayat pembelajaran yang cocok</p>
            <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau filter status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] bg-slate-50/80">
                  <th className="py-3 px-3">Kode &amp; Tanggal</th>
                  <th className="py-3 px-3">Waktu</th>
                  <th className="py-3 px-3">Kelas &amp; Siswa</th>
                  <th className="py-3 px-3">Mata Pelajaran</th>
                  <th className="py-3 px-3">Guru Pengampu</th>
                  <th className="py-3 px-3">Zona Belajar</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900">{item.kodeBooking}</span>
                      <div className="text-[11px] text-slate-500">{item.tanggal}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {item.jamMulai} - {item.jamSelesai}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800">{item.kelas}</span>
                      <div className="text-[11px] text-slate-500">{item.jumlahSiswa} Siswa</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {item.mataPelajaran}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {item.namaGuru}
                    </td>
                    <td className="py-3 px-3 text-emerald-800 font-medium">
                      {item.zona}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "DISETUJUI"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "MENUNGGU"
                            ? "bg-amber-100 text-amber-800"
                            : item.status === "SELESAI"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {item.status === "DISETUJUI" && (
                        <button
                          disabled={isUpdatingId === item.id}
                          onClick={() => handleAction(item.id, "SELESAI")}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 font-semibold text-[10px] transition disabled:opacity-50"
                          title="Tandai sesi ini telah selesai dilaksanakan"
                        >
                          Tandai Selesai
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
