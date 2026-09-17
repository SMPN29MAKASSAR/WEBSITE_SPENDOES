/* eslint-disable */
// @ts-nocheck
import NavigationClient from "@/components/NavigationClient";
import { prisma } from "@/lib/prisma";

// Cache logo 24 jam - logo hampir tidak pernah berubah
export const revalidate = 86400;

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.setting.findMany();
  const logoUrl = settings.find((s) => s.key === "school_logo")?.value;

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationClient logoUrl={logoUrl} />

      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} UPT SPF SMPN 29 Makassar. Semua Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
