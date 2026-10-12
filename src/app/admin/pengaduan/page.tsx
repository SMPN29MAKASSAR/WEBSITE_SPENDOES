/* eslint-disable */
// @ts-nocheck
"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
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
  Info,
  Tags,
  Plus,
  Check,
  FileSpreadsheet,
  Upload,
  Download,
  AlertTriangle,
  FileUp
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

  // Kategori Management
  const [categories, setCategories] = useState<string[]>([
    "Fasilitas & Sarana Prasarana",
    "Pelayanan Administrasi & Guru",
    "Pencegahan Perundungan (Bullying)",
    "Kegiatan Pembelajaran / Akademik",
    "Pelaksanaan Program BONSAI",
    "Sarana & Prasarana Program BONSAI",
    "Pengaduan Lainnya"
  ]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [tempCategories, setTempCategories] = useState<string[]>([]);
  const [newCatInput, setNewCatInput] = useState("");
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingCatText, setEditingCatText] = useState("");
  const [isSavingCategories, setIsSavingCategories] = useState(false);

  // Import Excel Management
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/pengaduan/kategori");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      }
    } catch (e) {
      console.error("Gagal memuat kategori:", e);
    }
  };

  const openCategoryModal = () => {
    setTempCategories([...categories]);
    setNewCatInput("");
    setEditingCatIndex(null);
    setShowCategoryModal(true);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (tempCategories.includes(trimmed)) {
      alert("Kategori tersebut sudah ada!");
      return;
    }
    setTempCategories([...tempCategories, trimmed]);
    setNewCatInput("");
  };

  const handleDeleteCategory = (index: number) => {
    if (tempCategories.length <= 1) {
      alert("Minimal harus ada 1 kategori tersisa.");
      return;
    }
    const catName = tempCategories[index];
    if (confirm(`Yakin ingin menghapus kategori "${catName}"?`)) {
      const updated = tempCategories.filter((_, i) => i !== index);
      setTempCategories(updated);
      if (editingCatIndex === index) {
        setEditingCatIndex(null);
      }
    }
  };

  const handleStartEditCategory = (index: number) => {
    setEditingCatIndex(index);
    setEditingCatText(tempCategories[index]);
  };

  const handleSaveEditCategory = (index: number) => {
    const trimmed = editingCatText.trim();
    if (!trimmed) {
      alert("Nama kategori tidak boleh kosong.");
      return;
    }
    const updated = [...tempCategories];
    updated[index] = trimmed;
    setTempCategories(updated);
    setEditingCatIndex(null);
    setEditingCatText("");
  };

  const handleSaveAllCategories = async () => {
    if (tempCategories.length === 0) {
      alert("Minimal harus ada 1 kategori.");
      return;
    }

    setIsSavingCategories(true);
    try {
      const res = await fetch("/api/pengaduan/kategori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempCategories),
      });

      if (res.ok) {
        setCategories([...tempCategories]);
        alert("Daftar kategori pengaduan berhasil disimpan!");
        setShowCategoryModal(false);
      } else {
        alert("Gagal menyimpan kategori.");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan saat menyimpan kategori.");
    } finally {
      setIsSavingCategories(false);
    }
  };

  // Import Handlers
  const handleDownloadTemplate = () => {
    // Download directly from public folder or dynamic fallback
    const link = document.createElement("a");
    link.href = "/template_import_pengaduan.xlsx";
    link.download = "template_import_pengaduan.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("");
    const file = e.target.files?.[0];
    if (!file) {
      setImportFile(null);
      setImportData([]);
      return;
    }

    setImportFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const parsed = XLSX.utils.sheet_to_json(ws);
        
        if (!Array.isArray(parsed) || parsed.length === 0) {
          setImportError("File Excel kosong atau format tidak sesuai.");
          setImportData([]);
          return;
        }

        setImportData(parsed);
      } catch (err: any) {
        console.error("Error parsing excel:", err);
        setImportError("Gagal membaca file Excel. Pastikan file valid.");
        setImportData([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExecuteImport = async () => {
    if (!importData || importData.length === 0) {
      alert("Pilih file Excel yang memiliki baris data terlebih dahulu.");
      return;
    }

    setIsImporting(true);
    setImportError("");

    try {
      const res = await fetch("/api/pengaduan/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: importData }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        alert(`Berhasil mengimpor ${result.count} data pengaduan!`);
        setShowImportModal(false);
        setImportFile(null);
        setImportData([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchData();
      } else {
        setImportError(result.error || "Gagal mengimpor data pengaduan.");
      }
    } catch (err: any) {
      console.error(err);
      setImportError("Terjadi kesalahan saat mengirim data ke server.");
    } finally {
      setIsImporting(false);
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
      kategori: p.kategori || categories[0] || "",
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
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tombol Import Excel (FITUR REQUEST) */}
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 text-xs font-bold shadow-sm shadow-blue-600/20 transition active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Import Pengaduan (.xlsx)
          </button>

          {/* Tombol Kelola Kategori */}
          <button
            onClick={openCategoryModal}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 flex items-center gap-2 text-xs font-bold shadow-sm shadow-emerald-600/20 transition active:scale-95"
          >
            <Tags className="w-3.5 h-3.5" />
            Kelola Kategori
          </button>

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
              {/* Tanggal Pengaduan Masuk */}
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

              {/* Kategori Pengaduan (Dropdown Dinamis) */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Kategori Aduan</span>
                  <button
                    type="button"
                    onClick={openCategoryModal}
                    className="text-blue-600 hover:text-blue-700 text-[11px] font-bold flex items-center gap-1"
                  >
                    <Tags className="w-3 h-3" /> Kelola Kategori
                  </button>
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {formData.kategori && !categories.includes(formData.kategori) && (
                    <option value={formData.kategori}>{formData.kategori} (Lama)</option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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

      {/* MODAL IMPORT EXCEL PENGADUAN (FITUR REQUEST) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 lg:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Import Data Massal
                </div>
                <h3 className="text-xl font-bold font-jakarta text-slate-800">
                  Import Pengaduan Manual via Excel
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unggah data pengaduan lama/manual menggunakan format template Excel yang telah disediakan.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportData([]);
                  setImportError("");
                }}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Step 1: Download Template */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Langkah 1: Unduh Format Template
                  </p>
                  <p className="text-xs text-blue-700/80">
                    Gunakan template resmi agar kolom Tanggal, Nama, Kategori, dan Status terbaca presisi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 transition shrink-0 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Download Template (.xlsx)
                </button>
              </div>

              {/* Step 2: Upload File */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Langkah 2: Pilih &amp; Unggah File Excel (.xlsx / .xls / .csv)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-blue-50/30 transition-all">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-file-input"
                  />
                  <label htmlFor="excel-file-input" className="cursor-pointer block">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                      <FileUp className="w-6 h-6" />
                    </div>
                    {importFile ? (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800">{importFile.name}</p>
                        <p className="text-xs text-emerald-600 font-semibold">
                          {(importFile.size / 1024).toFixed(1)} KB — Siap diproses
                        </p>
                        <span className="text-[11px] text-blue-600 underline font-medium inline-block mt-2">
                          Ganti file lain
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700">
                          Klik untuk memilih file Excel dari komputer
                        </p>
                        <p className="text-xs text-slate-400">
                          Mendukung format .xlsx, .xls, dan .csv
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Error Alert */}
              {importError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Step 3: Data Preview */}
              {importData.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Terdeteksi {importData.length} Baris Pengaduan
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Menampilkan pratinjau 3 baris pertama
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                          <tr>
                            <th className="p-2.5">TANGGAL</th>
                            <th className="p-2.5">PELAPOR</th>
                            <th className="p-2.5">KATEGORI</th>
                            <th className="p-2.5">STATUS</th>
                            <th className="p-2.5">RINGKASAN ISI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {importData.slice(0, 3).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-medium text-slate-600 whitespace-nowrap">
                                {String(row["Tanggal (YYYY-MM-DD)"] || row["Tanggal"] || "-").substring(0, 10)}
                              </td>
                              <td className="p-2.5 font-bold text-slate-800">
                                {String(row["Nama Pelapor"] || row["Nama"] || "-")}
                              </td>
                              <td className="p-2.5 text-slate-600">
                                {String(row["Kategori"] || "-")}
                              </td>
                              <td className="p-2.5 font-semibold text-emerald-700">
                                {String(row["Status"] || "SELESAI")}
                              </td>
                              <td className="p-2.5 text-slate-500 max-w-xs truncate">
                                {String(row["Isi Pengaduan"] || row["Isi Aduan"] || "-")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportData([]);
                  setImportError("");
                }}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isImporting || importData.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-lg shadow-blue-600/25 disabled:opacity-50 active:scale-95"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Mengimpor Data...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Mulai Impor ({importData.length} Data)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KELOLA KATEGORI PENGADUAN */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl p-6 lg:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-1.5">
                  <Tags className="w-3.5 h-3.5" /> Manajemen Kategori
                </div>
                <h3 className="text-xl font-bold font-jakarta text-slate-800">
                  Kelola Kategori Pengaduan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tambah, ubah nama, atau hapus opsi kategori pengaduan yang muncul pada formulir publik.
                </p>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Tambah Kategori Baru */}
            <form onSubmit={handleAddCategory} className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Tambah Kategori Baru
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: Sarana & Prasarana Program BONSAI"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!newCatInput.trim()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>
            </form>

            {/* Daftar Kategori Aktif */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Daftar Kategori ({tempCategories.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Klik ikon pensil untuk mengedit
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {tempCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition"
                  >
                    {editingCatIndex === idx ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingCatText}
                          onChange={(e) => setEditingCatText(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-blue-400 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditCategory(idx)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs transition"
                          title="Simpan Perubahan Nama"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCatIndex(null)}
                          className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs transition"
                          title="Batal"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-800 truncate">
                            {cat}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditCategory(idx)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Nama Kategori"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(idx)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol Simpan Perubahan */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveAllCategories}
                disabled={isSavingCategories}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-lg shadow-emerald-600/25 disabled:opacity-50"
              >
                {isSavingCategories ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan Kategori"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
