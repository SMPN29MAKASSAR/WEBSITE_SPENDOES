import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const json = await request.json();
    const data = await prisma.ekstrakurikuler.update({
      where: { id },
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
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.ekstrakurikuler.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
