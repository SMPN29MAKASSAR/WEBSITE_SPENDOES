import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const json = await request.json();
    const guest = await prisma.guestBook.update({
      where: { id: params.id },
      data: {
        name: json.name,
        agency: json.agency,
        purpose: json.purpose,
        meetWith: json.meetWith,
        contact: json.contact,
      }
    });
    return NextResponse.json(guest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.guestBook.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
