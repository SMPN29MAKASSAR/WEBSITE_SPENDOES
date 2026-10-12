/* eslint-disable */
// @ts-nocheck
"use client";
import { useEffect, useState, useMemo } from "react";
import { 
  X, 
  Loader2, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Paperclip, 
  Trash2, 
  Edit, 
  TrendingUp, 
  CheckCircle2, 
  Inbox, 
  Calculator, 
  Calendar, 
  Search, 
  RefreshCw,
  FileCheck2,
  AlertCircle
} from "lucide-react";

export default function AdminPengaduanPage() {
  const [pengaduans, setPengaduans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [selectedYear, setSelectedYear] = useState("SEMUA");
  const [showFormulaDetail, setShowFormulaDetail] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pengaduan");
      const data = await res.json();
      setPengaduans(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Extract available years from data
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    pengaduans.forEach((p) => {
      if (p.createdAt) {
        const yr = new Date(p.createdAt).getFullYear().toString();
        years.add(yr);
      }
    });
    return Array.from(years).sort().reverse();
  }, [pengaduans]);

  // Filtered dataset based on year filter (for stats & table)
  const yearFilteredData = useMemo(() => {
    if (selectedYear === "SEMUA") return pengaduans;
    return pengaduans.filter((p) => {
      if (!p.createdAt) return false;
      return new Date(p.createdAt).getFullYear().toString() === selectedYear;
    });
  }, [pengaduans, selectedYear]);

  // Statistics calculation based on formula:
  // Laporan tertangani = Selesai + Sedang Ditangani (Diproses)
  // Rasio = (Laporan tertangani / Total laporan) * 100%
  const stats = useMemo(() => {
    const total = yearFilteredData.length;
    const selesai = yearFilteredData.filter((p) => p.status === "SELESAI").length;
    const diproses = yearFilteredData.filter((p) => p.status === "DIPROSES").length;
    const menunggu = yearFilteredData.filter((p) => p.status === "MENUNGGU" || !p.status).length;
    const ditolak = yearFilteredData.filter((p) => p.status === "DITOLAK").length;

    const tertangani = selesai + diproses;
    const rasio = total > 0 ? (tertangani / total) * 100 : 0;

    return {
      total,
      selesai,
      diproses,
      menunggu,
      ditolak,
      tertangani,
      rasio: rasio.toFixed(2),
      rasioNum: rasio
    };
  }, [yearFilteredData]);

  // Filtered dataset for table display (adds search & status filters)
  const displayData = useMemo(() => {
    return yearFilteredData.filter((p) => {
      const matchStatus = statusFilter === "SEMUA" || p.status === statusFilter;
      const matchSearch =
        searchQuery === "" ||
        (p.tiketId && p.tiketId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.nama && p.nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.kategori && p.kategori.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.isiAduan && p.isiAduan.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchStatus && matchSearch;
    });
  }, [yearFilteredData, statusFilter, searchQuery]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setIsUpdating(true);
    
    try {
      // Build ISO string with noon WITA offset to preserve accurate date
      const createdAtISO = formData.createdAt 
        ? new Date(`${formData.createdAt}T12:00:00+08:00`).toISOString() 
        : undefined;

      const payload = {
        ...formData,
        createdAt: createdAtISO
      };

      const res = await fetch(`/api/pengaduan/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        alert("Data pengaduan berhasil diperbarui!");
        setSelected(null);
        fetchData();
      } else {
        alert("Gagal memperbarui data.");
      }
    } catch (e) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus aduan ini? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      const res = await fetch(`/api/pengaduan/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Aduan berhasil dihapus!");
        fetchData();
      }
    } catch (error) {
      alert("Gagal menghapus aduan.");
    }
  };

  const openModal = (p: any) => {
    setSelected(p);
    // Format existing createdAt to YYYY-MM-DD for date input
    let dateStr = "";
    if (p.createdAt) {
      const d = new Date(p.createdAt);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      dateStr = `${year}-${month}-${day}`;
    }

    setFormData({
      nama: p.nama || "",
      email: p.email || "",
      kategori: p.kategori || "",
      isiAduan: p.isiAduan || "",
      status: p.status || "MENUNGGU",
      tanggapan: p.tanggapan || "",
      createdAt: dateStr
    });
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "SELESAI":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Selesai
          </span>
        );
      case "DIPROSES":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Loader2 className="w-3 h-3 animate-spin" /> Sedang Ditangani
          </span>
        );
      case "DITOLAK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <X className="w-3 h-3" /> Ditolak / Ditunda
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" /> Menunggu
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold font-jakarta text-slate-800">
            Manajemen Pengaduan & Aspirasi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola aduan masyarakat, pantau status tindak lanjut, dan hitung rasio penyelesaian.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Year selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="SEMUA">Semua Tahun</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-xs font-semibold shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* SECTION: Rasio Penyelesaian Pengaduan & Statistik (Sesuai Rumus Baku) */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-3">
                <TrendingUp className="w-3.5 h-3.5" />
                Indikator Kinerja Pelayanan
              </div>
              <h2 className="text-xl lg:text-2xl font-bold font-jakarta text-white">
                Rasio Penyelesaian Pengaduan
              </h2>
              <p className="text-emerald-100/70 text-xs lg:text-sm mt-1 max-w-xl">
                Tingkat efektivitas penanganan aduan berdasarkan perbandingan jumlah pengaduan yang tertangani terhadap total laporan yang masuk.
              </p>
            </div>

            {/* Big Ratio Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-5 shrink-0 shadow-lg">
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                  Persentase Tertangani
                </p>
                <div className="text-4xl lg:text-5xl font-black font-jakarta text-emerald-400 tracking-tight flex items-baseline justify-end gap-1">
                  <span>{stats.rasio}</span>
                  <span className="text-2xl font-bold text-emerald-200">%</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <FileCheck2 className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center text-xs font-semibold text-emerald-200 mb-2">
              <span>Progres Penyelesaian Laporan</span>
              <span>
                {stats.tertangani} dari {stats.total} laporan tertangani ({stats.rasio}%)
              </span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(stats.rasioNum, 100)}%` }}
              />
            </div>
          </div>

          {/* 4 Detail Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mt-6">
            {/* Total */}
            <div className="bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-300 text-xs mb-2">
                <span>Total Laporan</span>
                <Inbox className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold font-jakarta text-white">{stats.total}</p>
              <p className="text-[11px] text-emerald-200/60 mt-1">Aduan masuk</p>
            </div>

            {/* Selesai */}
            <div className="bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between text-emerald-300 text-xs mb-2">
                <span>Laporan Selesai</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold font-jakarta text-emerald-300">{stats.selesai}</p>
              <p className="text-[11px] text-emerald-200/60 mt-1">Telah diselesaikan</p>
            </div>

            {/* Sedang Ditangani */}
            <div className="bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between text-blue-300 text-xs mb-2">
                <span>Sedang Ditangani</span>
                <Loader2 className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold font-jakarta text-blue-300">{stats.diproses}</p>
              <p className="text-[11px] text-blue-200/60 mt-1">Dalam proses tindak lanjut</p>
            </div>

            {/* Menunggu & Ditunda */}
            <div className="bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between text-amber-300 text-xs mb-2">
                <span>Menunggu / Ditunda</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold font-jakarta text-amber-300">
                {stats.menunggu + stats.ditolak}
              </p>
              <p className="text-[11px] text-amber-200/60 mt-1">
                {stats.menunggu} antre, {stats.ditolak} ditolak
              </p>
            </div>
          </div>

          {/* Collapsible / Detailed Formula Box (Matching User Image Formula & Breakdown) */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <button
              onClick={() => setShowFormulaDetail(!showFormulaDetail)}
              className="flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-emerald-200 transition"
            >
              <Calculator className="w-4 h-4" />
              <span>{showFormulaDetail ? "Sembunyikan" : "Tampilkan"} Rincian Rumus & Perhitungan Matematika</span>
              <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-white">
                {showFormulaDetail ? "▲" : "▼"}
              </span>
            </button>

            {showFormulaDetail && (
              <div className="mt-4 bg-slate-950/60 border border-white/15 rounded-2xl p-5 text-xs text-slate-200 space-y-4 animate-in fade-in">
                {/* Rumus Banner */}
                <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-400/30 text-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-sky-300 text-xs mb-1">RUMUS PERHITUNGAN RASIO:</p>
                    <div className="font-mono text-sm sm:text-base font-semibold">
                      Rasio = [ Jumlah Pengaduan Tertangani / Jumlah Pengaduan Masuk ] × 100%
                    </div>
                  </div>
                  <div className="text-xs bg-sky-500/20 px-3 py-1.5 rounded-lg border border-sky-400/30 shrink-0">
                    Standar Pelaporan Resmi
                  </div>
                </div>

                {/* Penjelasan Langkah-Langkah */}
                <div className="space-y-2 text-slate-300 leading-relaxed font-sans">
                  <p className="font-semibold text-white">
                    Rincian data {selectedYear !== "SEMUA" ? `Tahun ${selectedYear}` : "keseluruhan"}:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>Total laporan masuk: <strong className="text-white font-mono">{stats.total}</strong></li>
                    <li>Laporan selesai: <strong className="text-emerald-300 font-mono">{stats.selesai}</strong></li>
                    <li>Laporan sedang ditangani: <strong className="text-blue-300 font-mono">{stats.diproses}</strong></li>
                    <li>Laporan menunggu / ditunda: <strong className="text-amber-300 font-mono">{stats.menunggu + stats.ditolak}</strong></li>
                  </ul>

                  <div className="pt-2">
                    <p className="font-semibold text-white">Definisi Laporan Tertangani:</p>
                    <p className="text-slate-300">
                      Laporan tertangani adalah akumulasi dari <strong>Laporan Selesai</strong> ditambah <strong>Laporan Sedang Ditangani</strong>:
                    </p>
                    <p className="font-mono bg-white/5 p-2.5 rounded-lg border border-white/10 my-2 text-emerald-300">
                      Laporan Tertangani = {stats.selesai} (selesai) + {stats.diproses} (sedang ditangani) = <span className="font-bold">{stats.tertangani} laporan</span>
                    </p>
                  </div>

                  <div className="pt-1">
                    <p className="font-semibold text-white">Kalkulasi Akhir:</p>
                    <p className="font-mono bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-400/30 text-emerald-300">
                      Rasio = ({stats.tertangani} / {stats.total}) × 100% = <span className="text-white font-bold text-sm">{stats.rasio}%</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Filters & Search Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
            {["SEMUA", "MENUNGGU", "DIPROSES", "SELESAI", "DITOLAK"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === st
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {st === "SEMUA"
                  ? "Semua Status"
                  : st === "DIPROSES"
                  ? "Sedang Ditangani"
                  : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tiket, nama, isi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
        </div>

        {/* Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">TIKET ID</th>
                <th className="px-6 py-4">NAMA PELAPOR</th>
                <th className="px-6 py-4">KATEGORI</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">TANGGAL MASUK</th>
                <th className="px-6 py-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Memuat data pengaduan...
                  </td>
                </tr>
              ) : displayData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">Tidak ada pengaduan ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Belum ada data atau kata kunci pencarian tidak cocok.
                    </p>
                  </td>
                </tr>
              ) : (
                displayData.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800 text-xs">
                      {p.tiketId}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{p.nama}</p>
                      {p.email && <p className="text-xs text-slate-400 mt-0.5">{p.email}</p>}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {p.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-xs whitespace-nowrap">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit / Buka
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                          title="Hapus Pengaduan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail & Edit Aduan */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 lg:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold mb-1.5">
                  #{selected.tiketId}
                </div>
                <h3 className="text-xl font-bold font-jakarta text-slate-800">
                  Detail &amp; Edit Pengaduan
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Tanggal Pengaduan Masuk (FITUR REQUEST: TANGGAL BISA DIEDIT) */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <label className="block mb-1.5 text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Tanggal Pengaduan Masuk (Dapat Diedit)
                </label>
                <input
                  type="date"
                  value={formData.createdAt || ""}
                  onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
                  className="w-full border border-emerald-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  required
                />
                <p className="text-[11px] text-emerald-700/80 mt-1.5">
                  Pilih tanggal untuk menyesuaikan waktu arsip laporan masuk.
                </p>
              </div>

              {/* Pelapor & Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                    Nama Pelapor
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                    Nomor WhatsApp / Email Pelapor
                  </label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="08xxxxxxxxxx atau email@contoh.com"
                  />
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                  Kategori Aduan
                </label>
                <input
                  type="text"
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Isi Aduan */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                  Isi Aduan / Laporan
                </label>
                <textarea
                  value={formData.isiAduan}
                  onChange={(e) => setFormData({ ...formData, isiAduan: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  required
                />
              </div>

              {/* Lampiran if exists */}
              {selected.lampiran && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                    Lampiran Berkas / Bukti
                  </label>
                  <a
                    href={selected.lampiran}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition"
                  >
                    <Paperclip className="w-3.5 h-3.5" /> Buka Lampiran di Tab Baru
                  </a>
                </div>
              )}

              {/* Update Status */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block mb-1.5 text-xs font-bold text-slate-700">
                  Perbarui Status Penanganan
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="MENUNGGU">Menunggu (Belum Diproses)</option>
                  <option value="DIPROSES">Diproses (Sedang Ditangani)</option>
                  <option value="SELESAI">Selesai (Sudah Ditindaklanjuti)</option>
                  <option value="DITOLAK">Ditolak / Ditunda</option>
                </select>
              </div>

              {/* Tanggapan Resmi */}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700">
                  Tanggapan Resmi Petugas untuk Pelapor
                </label>
                <textarea
                  value={formData.tanggapan}
                  onChange={(e) => setFormData({ ...formData, tanggapan: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Ketik tanggapan resmi atau keterangan tindak lanjut di sini..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-lg shadow-emerald-600/25 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
