import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, catatanAdmin } = body;

    const updated = await prisma.bonsaiBooking.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(catatanAdmin !== undefined ? { catatanAdmin } : {}),
      },
    });

    return NextResponse.json({
      message: "Status booking berhasil diperbarui",
      booking: updated,
    });
  } catch (error) {
    console.error("Error updating bonsai booking:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.bonsaiBooking.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Data booking berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting bonsai booking:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data booking" },
      { status: 500 }
    );
  }
}
