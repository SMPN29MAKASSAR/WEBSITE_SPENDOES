/* eslint-disable */
// @ts-nocheck

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const fasilitas = await prisma.fasilitas.findUnique({ where: { id: (await params).id } });
    if (!fasilitas) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(fasilitas);
  } catch (error) { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { nama, deskripsi, imageUrl } = await request.json();
    const fasilitas = await prisma.fasilitas.update({
      where: { id: (await params).id },
      data: { nama, deskripsi, imageUrl },
    });
    return NextResponse.json(fasilitas);
  } catch (error) { return NextResponse.json({ error: 'Failed to update' }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await prisma.fasilitas.delete({ where: { id: (await params).id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) { return NextResponse.json({ error: 'Failed to delete' }, { status: 500 }); }
}
