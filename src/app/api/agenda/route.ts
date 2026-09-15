/* eslint-disable */
// @ts-nocheck
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const agendas = await prisma.agenda.findMany({
      orderBy: { startDate: 'asc' },
    });
    return NextResponse.json(agendas);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agendas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newAgenda = await prisma.agenda.create({
      data: {
        title: data.title,
        deskripsi: data.deskripsi,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        jenis: data.jenis,
      },
    });
    return NextResponse.json(newAgenda, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create agenda' }, { status: 500 });
  }
}

