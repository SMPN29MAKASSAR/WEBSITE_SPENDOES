/* eslint-disable */
// @ts-nocheck
import { prisma } from "@/lib/prisma";
import AdministrasiClient from "./AdministrasiClient";

export const metadata = {
  title: "Administrasi & Dokumen | SMPN 29 Makassar",
};

export const revalidate = 86400; // 24 hours (cache busted via revalidatePath on API)

export default async function AdministrasiPage() {
  const data = await prisma.administrasi.findMany({
    orderBy: { createdAt: "desc" }
  });

  return <AdministrasiClient initialData={data} />;
}
