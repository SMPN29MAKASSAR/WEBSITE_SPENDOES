import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id }
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, createdAt, imageUrl } = body;
    
    const updateData: any = { title, content };
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }
    if (createdAt) {
      updateData.createdAt = new Date(createdAt);
    }
    
    const updated = await prisma.post.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
