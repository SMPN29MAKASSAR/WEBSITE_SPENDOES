/* eslint-disable */
// @ts-nocheck
import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = { 
      nama: body.nama,
      email: body.email,
      kategori: body.kategori,
      isiAduan: body.isiAduan,
      status: body.status, 
      tanggapan: body.tanggapan 
    };

    if (body.createdAt) {
      updateData.createdAt = new Date(body.createdAt);
    }

    const updated = await prisma.pengaduan.update({
      where: { id },
      data: updateData,
    });
    
    revalidatePath('/', 'layout');
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update pengaduan:", error);
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
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete pengaduan" }, { status: 500 });
  }
}
