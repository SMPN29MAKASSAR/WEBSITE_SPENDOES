/* eslint-disable */
// @ts-nocheck
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.administrasi.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = await prisma.administrasi.create({
      data: {
        nomor: json.nomor || null,
        nama: json.nama,
        kategori: json.kategori,
        tanggal: json.tanggal || null,
        ukuran: json.ukuran || null,
        akses: json.akses || "Publik",
        fileUrl: json.fileUrl,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

