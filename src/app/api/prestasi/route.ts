/* eslint-disable */
// @ts-nocheck
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const prestasiList = await prisma.prestasi.findMany({
      orderBy: { tahun: 'desc' },
    });
    return NextResponse.json(prestasiList);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prestasi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { namaSiswa, namaLomba, tingkat, tahun, deskripsi, imageUrl } = body;
    
    const prestasi = await prisma.prestasi.create({
      data: {
        namaSiswa,
        namaLomba,
        tingkat,
        tahun: Number(tahun),
        deskripsi,
        imageUrl,
      },
    });
    
    revalidatePath('/', 'layout');
    return NextResponse.json(prestasi, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create prestasi' }, { status: 500 });
  }
}

