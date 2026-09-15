import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const works = await prisma.karyaSiswa.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(works);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newWork = await prisma.karyaSiswa.create({ data });
    return NextResponse.json(newWork, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
