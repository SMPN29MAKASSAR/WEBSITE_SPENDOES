/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

function parseExcelDate(val: any): Date {
  if (!val) return new Date();

  if (val instanceof Date && !isNaN(val.getTime())) {
    return val;
  }

  if (typeof val === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const ms = val * 86400 * 1000;
    const d = new Date(excelEpoch.getTime() + ms);
    if (!isNaN(d.getTime())) return d;
  }

  if (typeof val === "string") {
    const s = val.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
      const d = new Date(`${s.substring(0, 10)}T12:00:00+08:00`);
      if (!isNaN(d.getTime())) return d;
    }
    const parts = s.split(/[\/\-]/);
    if (parts.length === 3) {
      if (parts[0].length <= 2 && parts[2].length === 4) {
        const d = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T12:00:00+08:00`);
        if (!isNaN(d.getTime())) return d;
      }
    }
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;
  }

  return new Date();
}

function normalizeStatus(st: any): string {
  if (!st) return "SELESAI";
  const s = String(st).toLowerCase().trim();
  if (s.includes("selesai") || s.includes("closed") || s.includes("tuntas")) return "SELESAI";
  if (s.includes("proses") || s.includes("progress") || s.includes("tangani")) return "DIPROSES";
  if (s.includes("tolak") || s.includes("tunda") || s.includes("hold")) return "DITOLAK";
  if (s.includes("tunggu") || s.includes("antre") || s.includes("baru")) return "MENUNGGU";
  return "SELESAI";
}

function generateTicketId(): string {
  return `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    let rows: any[] = [];
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
      }

      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      rows = XLSX.utils.sheet_to_json(ws);
    } else {
      const body = await req.json();
      rows = Array.isArray(body) ? body : body.data || body.rows || [];
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "Tidak ada baris data yang ditemukan dalam file" }, { status: 400 });
    }

    const recordsToInsert = [];
    const usedTicketIds = new Set<string>();

    for (const row of rows) {
      const nama = row["Nama Pelapor"] || row["Nama"] || row["nama"] || row["Pelapor"] || "";
      const isiAduan = row["Isi Pengaduan"] || row["Isi Aduan"] || row["isiAduan"] || row["Laporan"] || row["Aduan"] || "";

      // Skip blank rows
      if (!nama.toString().trim() && !isiAduan.toString().trim()) {
        continue;
      }

      const email = (row["Kontak (WA/Email)"] || row["Kontak"] || row["Email"] || row["WhatsApp"] || row["email"] || "").toString().trim();
      const kategori = (row["Kategori"] || row["kategori"] || "Pengaduan Lainnya").toString().trim();
      const statusRaw = row["Status"] || row["status"] || "SELESAI";
      const status = normalizeStatus(statusRaw);
      const tanggapan = (row["Tanggapan Resmi"] || row["Tanggapan"] || row["tanggapan"] || "").toString().trim();
      
      const rawDate = row["Tanggal (YYYY-MM-DD)"] || row["Tanggal"] || row["createdAt"] || row["Date"];
      const createdAt = parseExcelDate(rawDate);

      let tiketId = (row["Nomor Tiket (Opsional)"] || row["Nomor Tiket"] || row["tiketId"] || row["Tiket"] || "").toString().trim();
      if (!tiketId || usedTicketIds.has(tiketId)) {
        tiketId = generateTicketId();
      }
      usedTicketIds.add(tiketId);

      recordsToInsert.push({
        tiketId,
        nama: nama.toString().trim() || "Masyarakat / Anonim",
        email: email || null,
        kategori: kategori || "Pengaduan Lainnya",
        isiAduan: isiAduan.toString().trim() || "-",
        status,
        tanggapan: tanggapan || null,
        createdAt,
      });
    }

    if (recordsToInsert.length === 0) {
      return NextResponse.json({ error: "Tidak ada baris data valid yang dapat diimpor" }, { status: 400 });
    }

    let count = 0;
    for (const item of recordsToInsert) {
      try {
        await prisma.pengaduan.create({ data: item });
        count++;
      } catch (err: any) {
        if (err.code === "P2002") {
          try {
            item.tiketId = generateTicketId();
            await prisma.pengaduan.create({ data: item });
            count++;
          } catch (retryErr) {
            console.error("Failed to insert row:", retryErr);
          }
        } else {
          console.error("Failed to insert row:", err);
        }
      }
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error("Error importing pengaduan:", error);
    return NextResponse.json({ error: error.message || "Gagal memproses impor file" }, { status: 500 });
  }
}
