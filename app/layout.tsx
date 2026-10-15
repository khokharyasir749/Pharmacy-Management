import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pharmacy Management System (PMS) | Orders Management",
  description: "Modern web-based Pharmacy Management System - Orders and Operations Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full w-full m-0 p-0 overflow-x-hidden bg-[#F4F7F6]`}>
      <body className="h-full w-full m-0 p-0 overflow-x-hidden bg-[#F4F7F6] font-sans antialiased text-slate-800 selection:bg-pharmacy-dark selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
