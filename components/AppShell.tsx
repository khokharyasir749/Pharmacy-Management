"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import DemoStateBanner from "@/components/common/DemoStateBanner";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#E9F3F1] text-pharmacy-textPrimary p-2 sm:p-4 md:p-6 lg:p-7 flex flex-col justify-center">
      {/* Outer rounded desktop frame matching the modern Dribbble presentation */}
      <div className="w-full max-w-[1600px] mx-auto min-h-[92vh] bg-pharmacy-canvas rounded-3xl md:rounded-[36px] shadow-floating border border-white/60 overflow-hidden flex flex-col lg:flex-row backdrop-blur-sm">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 px-4 sm:px-6 lg:px-8 py-5">
          {/* Quick Demo & Reviewer State Banner */}
          <DemoStateBanner />

          {/* Topbar Header */}
          <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          {/* Page Content Body */}
          <main className="flex-1 mt-3 sm:mt-5 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
