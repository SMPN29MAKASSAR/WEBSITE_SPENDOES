const fs = require('fs');
const path = require('path');

const writeAPI = (dir, content) => {
  fs.mkdirSync(path.dirname(dir), { recursive: true });
  fs.writeFileSync(dir, content);
};

writeAPI('src/app/api/fasilitas/[id]/route.ts', `
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const fasilitas = await prisma.fasilitas.findUnique({ where: { id: params.id } });
    if (!fasilitas) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(fasilitas);
  } catch (error) { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { nama, deskripsi, imageUrl } = await request.json();
    const fasilitas = await prisma.fasilitas.update({
      where: { id: params.id },
      data: { nama, deskripsi, imageUrl },
    });
    return NextResponse.json(fasilitas);
  } catch (error) { return NextResponse.json({ error: 'Failed to update' }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.fasilitas.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) { return NextResponse.json({ error: 'Failed to delete' }, { status: 500 }); }
}
`);

writeAPI('src/app/api/agenda/[id]/route.ts', `
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
`);

writeAPI('src/app/api/prestasi/[id]/route.ts', `
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const agenda = await prisma.prestasi.findUnique({ where: { id: String(params.id) } });
    if (!agenda) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(agenda);
  } catch (error) { return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { namaSiswa, namaLomba, tingkat, tahun, deskripsi, imageUrl } = body;
    const prestasi = await prisma.prestasi.update({
      where: { id: params.id },
      data: { namaSiswa, namaLomba, tingkat, tahun: Number(tahun), deskripsi, imageUrl },
    });
    return NextResponse.json(prestasi);
  } catch (error) { return NextResponse.json({ error: 'Failed to update prestasi' }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.prestasi.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) { return NextResponse.json({ error: 'Failed to delete prestasi' }, { status: 500 }); }
}
`);

writeAPI('src/app/api/mading/[id]/route.ts', `
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
`);
