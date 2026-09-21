/* eslint-disable */
// @ts-nocheck
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const json = await request.json();
    const data = await prisma.asesmen.update({
      where: { id },
      data: {
        mataPelajaran: json.mataPelajaran,
        kelas: String(json.kelas),
        linkUjian: json.linkUjian,
        icon: json.icon,
        order: parseInt(json.order) || 0
      }
    });
    revalidatePath('/asesmen');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.asesmen.delete({ where: { id } });
    revalidatePath('/asesmen');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
