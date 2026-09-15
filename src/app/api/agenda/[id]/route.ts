
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const agenda = await prisma.agenda.findUnique({ where: { id: String(params.id) } });
    if (!agenda) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(agenda);
  } catch (error) { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedAgenda = await prisma.agenda.update({
      where: { id: String(params.id) },
      data: { title: data.title, deskripsi: data.deskripsi, startDate: new Date(data.startDate), endDate: data.endDate ? new Date(data.endDate) : null, jenis: data.jenis },
    });
    return NextResponse.json(updatedAgenda);
  } catch (error) { return NextResponse.json({ error: 'Failed to update' }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.agenda.delete({ where: { id: String(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: 'Failed to delete' }, { status: 500 }); }
}
