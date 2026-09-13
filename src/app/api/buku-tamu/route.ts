import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    const items = await prisma.guestBook.findMany({ 
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const guest = await prisma.guestBook.create({
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
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
