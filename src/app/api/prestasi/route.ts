import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prestasi = await prisma.prestasi.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(prestasi);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data prestasi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, tingkat, tahun, deskripsi, imageUrl } = body;

    const prestasi = await prisma.prestasi.create({
      data: { nama, tingkat, tahun, deskripsi, imageUrl },
    });

    return NextResponse.json(prestasi, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambahkan data prestasi" }, { status: 500 });
  }
}
