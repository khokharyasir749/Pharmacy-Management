"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // On authentication screen, bypass the dashboard frame and chrome
  if (pathname === "/login") {
    return <main className="min-h-screen w-full bg-[#0B2B28]">{children}</main>;
  }

  return (
    <div className="min-h-screen w-full flex bg-[#F4F7F6] text-slate-800 antialiased overflow-x-hidden">
      {/* Left Fixed/Sticky Sidebar */}
      <aside className="w-64 flex-shrink-0 min-h-screen bg-white border-r border-slate-200/80">
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      </aside>

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
