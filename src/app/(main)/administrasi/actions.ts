"use server"
import { prisma } from "@/lib/prisma";

export async function verifyNip(nip: string) {
  if (!nip) return false;
  const pegawai = await prisma.pegawai.findFirst({
    where: { nip }
  });
  return !!pegawai;
}
