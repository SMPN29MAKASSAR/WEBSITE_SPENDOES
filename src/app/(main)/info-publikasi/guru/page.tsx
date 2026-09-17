/* eslint-disable */
// @ts-nocheck
import { prisma } from "@/lib/prisma";
import GuruClient from "./GuruClient";

export const metadata = {
  title: "Direktori Guru & Pegawai",
  description: "Daftar guru dan pegawai SMPN 29 Makassar",
};

export const revalidate = 86400; // 24 hours - data rarely changes

export default async function GuruPage() {
  const pegawaiList = await prisma.pegawai.findMany({
    orderBy: { nama: 'asc' },
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <GuruClient initialPegawai={pegawaiList} />
    </div>
  );
}

