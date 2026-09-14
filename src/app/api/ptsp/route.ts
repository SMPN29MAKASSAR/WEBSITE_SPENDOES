import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (ticketId) {
      if (ticketId.startsWith("VST-")) {
        const idPart = ticketId.replace("VST-", "").toLowerCase();
        // Since sqlite doesn't strictly enforce case, startsWith usually works. 
        // But to be safe, let's fetch all guests and find the one that matches if startsWith throws an error, or just use startsWith.
        const guest = await prisma.guestBook.findFirst({
          where: {
            id: {
              startsWith: idPart
            }
          }
        });
        
        if (!guest) {
           return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        
        return NextResponse.json({
          ticketId: ticketId,
          name: `${guest.name} (${guest.agency})`,
          serviceType: "Kunjungan / Bertamu",
          purpose: guest.purpose,
          status: "SELESAI",
          createdAt: guest.createdAt
        });
      }

      const ptsp = await prisma.ptspRequest.findUnique({ where: { ticketId } });
      if (!ptsp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(ptsp);
    }

    const items = await prisma.ptspRequest.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    
    // Generate a short readable ticket ID (e.g. PTSP-XXXXX)
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ticketId = `PTSP-${randomHex}`;

    const ptsp = await prisma.ptspRequest.create({
      data: {
        ticketId,
        name: json.name,
        identityId: json.identityId,
        serviceType: json.serviceType,
        purpose: json.purpose,
        contactWa: json.contactWa,
      }
    });
    return NextResponse.json(ptsp);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
