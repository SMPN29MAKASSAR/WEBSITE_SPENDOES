/* eslint-disable */
// @ts-nocheck

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const agenda = await prisma.prestasi.findUnique({ where: { id: String(params.id) } });
    if (!agenda) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(agenda);
  } catch (error) { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { namaSiswa, namaLomba, tingkat, tahun, deskripsi, imageUrl } = body;
    const prestasi = await prisma.prestasi.update({
      where: { id: params.id },
      data: { namaSiswa, namaLomba, tingkat, tahun: Number(tahun), deskripsi, imageUrl },
    });
    return NextResponse.json(prestasi);
  } catch (error) { return NextResponse.json({ error: 'Failed to update prestasi' }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.prestasi.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) { return NextResponse.json({ error: 'Failed to delete prestasi' }, { status: 500 }); }
}
