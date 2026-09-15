/* eslint-disable */
// @ts-nocheck
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const fasilitas = await prisma.fasilitas.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(fasilitas);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch fasilitas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nama, deskripsi, imageUrl } = await request.json();
    const fasilitas = await prisma.fasilitas.create({
      data: { nama, deskripsi, imageUrl },
    });
    return NextResponse.json(fasilitas, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create fasilitas' }, { status: 500 });
  }
}

