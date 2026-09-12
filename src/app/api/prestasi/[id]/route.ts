import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nama, tingkat, tahun, deskripsi, imageUrl } = body;

    const prestasi = await prisma.prestasi.update({
      where: { id },
      data: { nama, tingkat, tahun, deskripsi, imageUrl },
    });

    return NextResponse.json(prestasi);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui data prestasi" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.prestasi.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Data prestasi berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data prestasi" }, { status: 500 });
  }
}
