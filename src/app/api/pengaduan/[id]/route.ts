import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, tanggapan } = body;

    const updated = await prisma.pengaduan.update({
      where: { id },
      data: { status, tanggapan },
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update pengaduan" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pengaduan = await prisma.pengaduan.findUnique({
      where: { id }
    });
    return NextResponse.json(pengaduan);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pengaduan" }, { status: 500 });
  }
}
