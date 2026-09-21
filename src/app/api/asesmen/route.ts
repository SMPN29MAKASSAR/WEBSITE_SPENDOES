/* eslint-disable */
// @ts-nocheck
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const data = await prisma.asesmen.findMany({
      orderBy: [
        { kelas: 'asc' },
        { order: 'asc' },
        { mataPelajaran: 'asc' }
      ]
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = await prisma.asesmen.create({
      data: {
        mataPelajaran: json.mataPelajaran,
        kelas: String(json.kelas),
        linkUjian: json.linkUjian,
        icon: json.icon || 'Book',
        order: parseInt(json.order) || 0
      }
    });
    revalidatePath('/asesmen');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
