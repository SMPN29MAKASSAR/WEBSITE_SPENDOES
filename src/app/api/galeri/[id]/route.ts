/* eslint-disable */
// @ts-nocheck
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const data = await prisma.galeri.update({
      where: { id },
      data: {
        judul: json.judul,
        deskripsi: json.deskripsi || null,
        imageUrl: json.imageUrl,
        tanggal: json.tanggal || null,
      },
    });
    revalidatePath('/', 'layout');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.galeri.delete({
      where: { id },
    });
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
