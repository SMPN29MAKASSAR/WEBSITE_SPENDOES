/* eslint-disable */
// @ts-nocheck
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsTabs from "./SettingsTabs";

export const metadata = {
  title: "Pengaturan Web | Admin SMPN 29 Makassar",
};

export default async function PengaturanPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const settingsRaw = await prisma.setting.findMany();
  const initialSettings = settingsRaw.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as Record<string, string>);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-jakarta text-slate-800">Pengaturan Web</h2>
        <p className="text-slate-500 mt-2">
          Kelola seluruh teks, gambar latar, visi misi, dan konfigurasi utama website di sini.
        </p>
      </div>

      <SettingsTabs initialSettings={initialSettings} />
    </div>
  );
}
