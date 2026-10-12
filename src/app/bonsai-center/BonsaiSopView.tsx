"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  Search,
  Printer,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Clock,
  UserCheck,
  CheckCircle2,
  Filter,
  BookOpen,
} from "lucide-react";
import { BONSAI_SOPS, SopCategory, SopItem } from "./data";

export default function BonsaiSopView() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItemId, setExpandedItemId] = useState<string | null>("sop-a-1");
  const [copied, setCopied] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  // Filter Categories & Items
  const filteredCategories = BONSAI_SOPS.map((cat) => {
    const matchingItems = cat.items.filter((item) => {
      const q = searchQuery.toLowerCase();
      const inTitle = item.judul.toLowerCase().includes(q);
      const inTujuan = item.tujuan.toLowerCase().includes(q);
      const inKode = item.kode.toLowerCase().includes(q);
      const inProsedur = item.prosedur.some(
        (p) =>
          p.namaLangkah.toLowerCase().includes(q) ||
          p.deskripsi.toLowerCase().includes(q)
      );
      return inTitle || inTujuan || inKode || inProsedur;
    });

    return {
      ...cat,
      items: matchingItems,
    };
  }).filter((cat) => {
    if (selectedCategory !== "ALL" && cat.id !== selectedCategory) {
      return false;
    }
    return cat.items.length > 0;
  });

  const totalSops = BONSAI_SOPS.reduce((acc, c) => acc + c.items.length, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = BONSAI_SOPS.map(
      (cat) =>
        `[${cat.abjad}] ${cat.judulKategori}\n` +
        cat.items.map((it) => `  - ${it.kode} ${it.judul}`).join("\n")
    ).join("\n\n");

    navigator.clipboard.writeText(
      `RINGKASAN STANDAR OPERASIONAL PROSEDUR (SOP) BONSAI CENTER\nSMPN 29 MAKASSAR\n\n${summaryText}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner SOP */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              Buku Panduan Standar Operasional Prosedur
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              SOP BONSAI (Bersih, Organik, Nyaman, Sehat, Asri dan Indah)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Panduan operasional baku bagi seluruh guru, tenaga kependidikan, siswa, dan tim sanitasi
              UPT SPF SMPN 29 Makassar guna memelihara budaya lingkungan sekolah yang unggul.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Cetak seluruh dokumen SOP ini"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Cetak Dokumen (Print)</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Salin ringkasan daftar SOP ke clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Ringkasan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Pills & Search Box */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === "ALL"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua ({totalSops})
            </button>

            {BONSAI_SOPS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  {cat.abjad}
                </span>
                <span>{cat.judulKategori.replace("SOP ", "")}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari SOP, kata kunci, langkah..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Daftar Kategori & SOP */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">Tidak ada SOP yang cocok</h4>
          <p className="text-xs text-slate-400 mt-1">
            Silakan ubah kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5"
            >
              {/* Category Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3.5">
                  <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0">
                    {category.abjad}
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {category.judulKategori}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {category.deskripsi}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 shrink-0">
                  {category.items.length} Standar
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {category.items.map((item) => {
                  const isExpanded = expandedItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border transition overflow-hidden ${
                        isExpanded
                          ? "border-emerald-300 bg-slate-50/50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {/* Accordion Trigger */}
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 focus:outline-none"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {item.kode}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.waktuPelaksanaan}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            {item.judul}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-1">
                            {item.tujuan}
                          </p>
                        </div>

                        <div className="p-1 rounded-lg bg-slate-100 text-slate-600 shrink-0 mt-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      {/* Accordion Detail Content */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 pt-0 border-t border-slate-200/80 space-y-5 animate-in fade-in duration-200">
                          {/* Overview Metadata */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/70 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[11px] font-medium">
                                Ruang Lingkup:
                              </span>
                              <strong className="text-slate-800">{item.ruangLingkup}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px] font-medium">
                                Penanggung Jawab (PIC):
                              </span>
                              <strong className="text-emerald-800">{item.penanggungJawab}</strong>
                            </div>
                          </div>

                          {/* Rangkaian Langkah Prosedur */}
                          <div>
                            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              Alur &amp; Langkah Pelaksanaan Prosedur:
                            </h5>
                            <div className="space-y-2.5">
                              {item.prosedur.map((step) => (
                                <div
                                  key={step.langkah}
                                  className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-3"
                                >
                                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                    {step.langkah}
                                  </span>
                                  <div className="space-y-0.5 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <h6 className="text-xs font-bold text-slate-900">
                                        {step.namaLangkah}
                                      </h6>
                                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                        Pelaksana: {step.pelaksana}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                      {step.deskripsi}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Indikator Keberhasilan */}
                          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                            <span className="font-bold text-emerald-950 block mb-1.5 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                              Indikator Ketercapaian Mutu:
                            </span>
                            <ul className="space-y-1 text-emerald-900">
                              {item.indikatorKeberhasilan.map((ind, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-emerald-700 font-bold">&bull;</span>
                                  <span>{ind}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nilai Budaya BONSAI Footer Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <h3 className="text-base sm:text-lg font-bold text-emerald-200 flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Filosofi Budaya BONSAI SMPN 29 Makassar
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="text-xl font-black text-emerald-400">B</div>
            <div className="text-xs font-bold text-white mt-0.5">Bersih</div>
            <p className="text-[10px] text-emerald-200/70 mt-1">Bebas sampah &amp; kotoran</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="text-xl font-black text-emerald-400">O</div>
            <div className="text-xs font-bold text-white mt-0.5">Organik</div>
            <p className="text-[10px] text-emerald-200/70 mt-1">Daur ulang alami mandiri</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="text-xl font-black text-emerald-400">N</div>
            <div className="text-xs font-bold text-white mt-0.5">Nyaman</div>
            <p className="text-[10px] text-emerald-200/70 mt-1">Kondusif untuk belajar</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="text-xl font-black text-emerald-400">S</div>
            <div className="text-xs font-bold text-white mt-0.5">Sehat</div>
            <p className="text-[10px] text-emerald-200/70 mt-1">Udara segar bebas polusi</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="text-xl font-black text-emerald-400">A</div>
            <div className="text-xs font-bold text-white mt-0.5">Asri</div>
            <p className="text-[10px] text-emerald-200/70 mt-1">Rindang dan hijau sejuk</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="text-xl font-black text-emerald-400">I</div>
            <div className="text-xs font-bold text-white mt-0.5">Indah</div>
            <p className="text-[10px] text-emerald-200/70 mt-1">Estetis &amp; menyejukkan mata</p>
          </div>
        </div>
      </div>
    </div>
  );
}
