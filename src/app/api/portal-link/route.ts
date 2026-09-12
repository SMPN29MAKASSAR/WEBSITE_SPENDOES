import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const links = await prisma.portalLink.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const link = await prisma.portalLink.create({
      data: {
        title: json.title,
        description: json.description,
        url: json.url,
        icon: json.icon || 'Link',
        color: json.color || 'emerald',
        order: parseInt(json.order) || 0
      }
    });
    return NextResponse.json(link);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
