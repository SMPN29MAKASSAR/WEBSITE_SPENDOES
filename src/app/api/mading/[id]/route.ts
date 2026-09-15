/* eslint-disable */
// @ts-nocheck

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.karyaSiswa.findUnique({ where: { id: params.id } });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updated = await prisma.karyaSiswa.update({ where: { id: params.id }, data });
    return NextResponse.json(updated);
  } catch (error) { return NextResponse.json({ error: 'Failed to update' }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.karyaSiswa.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: 'Failed to delete' }, { status: 500 }); }
}
