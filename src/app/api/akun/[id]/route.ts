/* eslint-disable */
// @ts-nocheck
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const json = await request.json();
    const { email, password, role, name } = json;

    const dataToUpdate: any = { role, name };
    
    if (email) {
      dataToUpdate.email = email;
    }
    
    if (password && password.trim() !== '') {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const data = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: { id: true, email: true, name: true, role: true }
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Cegah penghapusan admin utama terakhir
    const adminCount = await prisma.user.count({ where: { role: 'Admin Utama' } });
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    
    if (userToDelete?.role === 'Admin Utama' && adminCount <= 1) {
      return NextResponse.json({ error: 'Tidak dapat menghapus Admin Utama terakhir' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
