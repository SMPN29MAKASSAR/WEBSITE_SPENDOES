/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
  "Fasilitas & Sarana Prasarana",
  "Pelayanan Administrasi & Guru",
  "Pencegahan Perundungan (Bullying)",
  "Kegiatan Pembelajaran / Akademik",
  "Pelaksanaan Program BONSAI",
  "Sarana & Prasarana Program BONSAI",
  "Pengaduan Lainnya"
];

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "pengaduan_categories" }
    });

    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json(parsed);
        }
      } catch (e) {
        console.error("Failed to parse pengaduan_categories JSON:", e);
      }
    }

    // Default categories if not yet customized
    return NextResponse.json(DEFAULT_CATEGORIES);
  } catch (error) {
    console.error("Error fetching pengaduan categories:", error);
    return NextResponse.json(DEFAULT_CATEGORIES);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const categories = Array.isArray(body) ? body : body.categories;

    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: "Format kategori tidak valid" }, { status: 400 });
    }

    // Filter out empty strings and trim
    const cleaned = categories
      .map((c) => (typeof c === "string" ? c.trim() : ""))
      .filter((c) => c.length > 0);

    if (cleaned.length === 0) {
      return NextResponse.json({ error: "Minimal harus ada 1 kategori" }, { status: 400 });
    }

    await prisma.setting.upsert({
      where: { key: "pengaduan_categories" },
      update: { value: JSON.stringify(cleaned) },
      create: { key: "pengaduan_categories", value: JSON.stringify(cleaned) }
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, categories: cleaned });
  } catch (error) {
    console.error("Error saving pengaduan categories:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
