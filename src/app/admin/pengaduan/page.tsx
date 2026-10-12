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
  Info
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
  const [showFormulaDetail, setShowFormulaDetail] = useState(true);

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

  // Extract available years from data (plus 2025 and 2026 as default presets)
  const availableYears = useMemo(() => {
    const years = new Set<string>(["2026", "2025"]);
    pengaduans.forEach((p) => {
      if (p.createdAt) {
        const yr = new Date(p.createdAt).getFullYear().toString();
        years.add(yr);
      }
    });
    return Array.from(years).sort().reverse();
  }, [pengaduans]);

  // Filtered dataset based on year filter
  const yearFilteredData = useMemo(() => {
    if (selectedYear === "SEMUA") return pengaduans;
    return pengaduans.filter((p) => {
      if (!p.createdAt) return false;
      return new Date(p.createdAt).getFullYear().toString() === selectedYear;
    });
  }, [pengaduans, selectedYear]);

  // Statistics calculation matching official SIGAP BRIDA / Public Standard:
  // Total = Total Laporan Masuk
  // In progress = Sedang Ditangani (DIPROSES)
  // Closed = Laporan Selesai (SELESAI)
  // On Hold = Menunggu / Ditunda (MENUNGGU / DITOLAK)
  // Tertangani = Closed (Selesai) + In progress (Sedang Ditangani)
  // Rasio = (Tertangani / Total) * 100%
  const stats = useMemo(() => {
    const total = yearFilteredData.length;
    const selesai = yearFilteredData.filter((p) => p.status === "SELESAI").length;
    const diproses = yearFilteredData.filter((p) => p.status === "DIPROSES").length;
    const menunggu = yearFilteredData.filter((p) => p.status === "MENUNGGU" || !p.status).length;
    const ditolak = yearFilteredData.filter((p) => p.status === "DITOLAK").length;

    const onHold = menunggu + ditolak;
    const tertangani = selesai + diproses;
    const rasio = total > 0 ? (tertangani / total) * 100 : 0;

    return {
      total,
      selesai,
      diproses,
      menunggu,
      ditolak,
      onHold,
      tertangani,
      rasio: rasio.toFixed(2),
      rasioNum: rasio
    };
  }, [yearFilteredData]);

  // Filtered dataset for table display
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
      // Build ISO string with noon WITA offset (+08:00) to keep accurate date
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
            <CheckCircle className="w-3 h-3" /> Closed (Selesai)
          </span>
        );
      case "DIPROSES":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Loader2 className="w-3 h-3 animate-spin" /> In progress
          </span>
        );
      case "DITOLAK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <X className="w-3 h-3" /> On Hold (Ditolak)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            <Clock className="w-3 h-3" /> On Hold (Menunggu)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold font-jakarta text-slate-800">
            Manajemen Pengaduan & Aspirasi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola pengaduan, verifikasi tindak lanjut, dan pantau persentase penanganan aduan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Year selector */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Pilih Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="SEMUA">Semua Tahun</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  Tahun {yr}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-xs font-semibold shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KOMPONEN KARTU STATISTIK (SESUAI CONTOH GAMBAR SIGAP BRIDA) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#3b82f6] font-bold text-base sm:text-lg tracking-tight">
            Statistik Peta Aduan {selectedYear !== "SEMUA" ? `Tahun ${selectedYear}` : "(Semua Periode)"}
          </h2>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Update otomatis sesuai database
          </span>
        </div>

        {/* 4 Kotak Statistik Presisi Sesuai Gambar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Titik Aduan */}
          <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-5 text-center shadow-xs">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#334155] font-jakarta tracking-tight">
              {stats.total}
            </p>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-medium mt-1">
              Total Titik Aduan
            </p>
          </div>

          {/* Card 2: In progress (Orange) */}
          <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-5 text-center shadow-xs">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#f59e0b] font-jakarta tracking-tight">
              {stats.diproses}
            </p>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-medium mt-1">
              In progress
            </p>
          </div>

          {/* Card 3: Closed (Green) */}
          <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-5 text-center shadow-xs">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#16a34a] font-jakarta tracking-tight">
              {stats.selesai}
            </p>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-medium mt-1">
              Closed
            </p>
          </div>

          {/* Card 4: On Hold (Red) */}
          <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-5 text-center shadow-xs">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#ef4444] font-jakarta tracking-tight">
              {stats.onHold}
            </p>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-medium mt-1">
              On Hold
            </p>
          </div>
        </div>

        {/* Panel Rasio Penyelesaian Pengaduan Terintegrasi */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-blue-50/70 via-emerald-50/50 to-teal-50/60 p-5 rounded-2xl border border-blue-100/80">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider">
                  Rasio Kinerja
                </span>
                <h3 className="text-base font-bold text-slate-800">
                  Persentase Laporan Tertangani: <span className="text-emerald-600 font-extrabold">{stats.rasio}%</span>
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Total laporan tertangani (<strong>Closed: {stats.selesai}</strong> + <strong>In progress: {stats.diproses}</strong>) berjumlah <strong>{stats.tertangani} laporan</strong> dari total <strong>{stats.total} laporan</strong> yang masuk.
              </p>
            </div>

            {/* Progress Bar & Quick Badge */}
            <div className="w-full lg:w-72 shrink-0">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                <span>Rasio Capaian</span>
                <span className="text-emerald-700 font-mono text-sm">{stats.rasio}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(stats.rasioNum, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Toggle Rincian Rumus Lengkap */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowFormulaDetail(!showFormulaDetail)}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{showFormulaDetail ? "Sembunyikan" : "Lihat"} Rincian Rumus & Perhitungan Matematika</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                {showFormulaDetail ? "Tutup ▲" : "Buka ▼"}
              </span>
            </button>
          </div>

          {showFormulaDetail && (
            <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-3 animate-in fade-in">
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-mono text-xs sm:text-sm font-bold text-slate-800">
                  Rasio = [ Jumlah Pengaduan Tertangani / Jumlah Pengaduan yang Masuk ] × 100%
                </div>
                <span className="text-[11px] text-slate-500 font-sans">
                  Formula Laporan Resmi
                </span>
              </div>

              <div className="space-y-1.5 text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-800">
                  Rincian Data {selectedYear !== "SEMUA" ? `Tahun ${selectedYear}` : "(Semua Data)"}:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-md border border-slate-200">
                    Total Laporan: <strong className="text-slate-900 font-mono">{stats.total}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-md border border-slate-200">
                    In progress: <strong className="text-amber-600 font-mono">{stats.diproses}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-md border border-slate-200">
                    Closed: <strong className="text-emerald-600 font-mono">{stats.selesai}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-md border border-slate-200">
                    On Hold: <strong className="text-rose-600 font-mono">{stats.onHold}</strong>
                  </div>
                </div>

                <p className="pt-1">
                  <strong>Laporan Tertangani</strong> = {stats.selesai} (Closed) + {stats.diproses} (In progress) = <strong className="text-slate-900 font-mono">{stats.tertangani} laporan</strong>.
                </p>
                <p>
                  <strong>Perhitungan Rasio:</strong> ({stats.tertangani} / {stats.total}) × 100% = <strong className="text-emerald-700 font-bold font-mono text-sm">{stats.rasio}%</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabel Data Pengaduan */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Filters & Search Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Filter Status:</span>
            {[
              { id: "SEMUA", label: "Semua" },
              { id: "MENUNGGU", label: "On Hold (Menunggu)" },
              { id: "DIPROSES", label: "In progress" },
              { id: "SELESAI", label: "Closed" },
              { id: "DITOLAK", label: "On Hold (Ditolak)" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === st.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor tiket, nama, isi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
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
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80">
                <label className="block mb-1.5 text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Tanggal Pengaduan Masuk (Dapat Diedit)
                </label>
                <input
                  type="date"
                  value={formData.createdAt || ""}
                  onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
                  className="w-full border border-blue-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
                <p className="text-[11px] text-blue-700/80 mt-1.5">
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
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="MENUNGGU">On Hold (Menunggu / Belum Diproses)</option>
                  <option value="DIPROSES">In progress (Sedang Ditangani)</option>
                  <option value="SELESAI">Closed (Selesai)</option>
                  <option value="DITOLAK">On Hold (Ditolak / Ditunda)</option>
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
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-lg shadow-blue-600/25 disabled:opacity-50"
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
