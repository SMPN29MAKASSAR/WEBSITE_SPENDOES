import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.pegawai.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = await prisma.pegawai.create({
      data: {
        nama: json.nama,
        nip: json.nip || null,
        jabatan: json.jabatan,
        mapel: json.mapel || null,
        foto: json.foto || null,
        nomorWa: json.nomorWa || null,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
