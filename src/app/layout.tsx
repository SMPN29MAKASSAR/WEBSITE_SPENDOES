import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import VisitorTracker from "@/components/VisitorTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "UPT SPF SMPN 29 Makassar",
  description: "Website Resmi UPT SPF SMPN 29 Makassar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${jakarta.variable} font-sans bg-slate-50 text-slate-800`}>
        <VisitorTracker />
        {children}
        <Script id="chatway" strategy="lazyOnload" src="https://cdn.chatway.app/widget.js?id=cTM1YJMiRoE9" />
      </body>
    </html>
  );
}
