/* eslint-disable */
// @ts-nocheck

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await params;
    const fasilitas = await prisma.fasilitas.findUnique({ where: { id: resolvedParams.id } });
    if (!fasilitas) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(fasilitas);
  } catch (error) { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await params;
    const { nama, deskripsi, imageUrl } = await request.json();
    const fasilitas = await prisma.fasilitas.update({
      where: { id: resolvedParams.id },
      data: { nama, deskripsi, imageUrl },
    });
    revalidatePath('/profil/fasilitas');
    revalidatePath('/', 'layout');
    return NextResponse.json(fasilitas);
  } catch (error) { return NextResponse.json({ error: 'Failed to update' }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await params;
    await prisma.fasilitas.delete({ where: { id: resolvedParams.id } });
    revalidatePath('/profil/fasilitas');
    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) { return NextResponse.json({ error: 'Failed to delete' }, { status: 500 }); }
}
