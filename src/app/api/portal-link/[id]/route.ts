/* eslint-disable */
// @ts-nocheck
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const json = await request.json();

    const updateData: any = {};
    if (json.title !== undefined) updateData.title = json.title;
    if (json.description !== undefined) updateData.description = json.description;
    if (json.url !== undefined) updateData.url = json.url;
    if (json.icon !== undefined) updateData.icon = json.icon;
    if (json.color !== undefined) updateData.color = json.color;
    if (json.order !== undefined) updateData.order = parseInt(json.order) || 0;
    if (json.isActive !== undefined) updateData.isActive = Boolean(json.isActive);

    const link = await prisma.portalLink.update({
      where: { id },
      data: updateData
    });
    revalidatePath('/', 'layout');
    return NextResponse.json(link);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.portalLink.delete({ where: { id } });
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
