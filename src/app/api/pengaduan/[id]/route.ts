/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.pengaduan.update({
      where: { id },
      data: { 
        nama: body.nama,
        email: body.email,
        kategori: body.kategori,
        isiAduan: body.isiAduan,
        status: body.status, 
        tanggapan: body.tanggapan 
      },
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.pengaduan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete pengaduan" }, { status: 500 });
  }
}
