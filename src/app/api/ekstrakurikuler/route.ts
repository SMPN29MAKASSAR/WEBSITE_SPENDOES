import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.ekstrakurikuler.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { pembina: true } 
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = await prisma.ekstrakurikuler.create({
      data: {
        nama: json.nama,
        deskripsi: json.deskripsi || null,
        imageUrl: json.imageUrl || null,
        pembinaId: json.pembinaId || null,
        hari: json.hari || null,
        waktuMulai: json.waktuMulai || null,
        waktuSelesai: json.waktuSelesai || null,
        lokasi: json.lokasi || null,
        linkAdArt: json.linkAdArt || null,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
