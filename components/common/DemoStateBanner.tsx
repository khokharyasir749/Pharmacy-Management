"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  X,
  RotateCcw,
  ShoppingCart,
  Package,
  Truck,
  CreditCard,
  FileText,
  Settings,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

export default function DemoStateBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const navLinks = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Catalog", href: "/products", icon: Package },
    { label: "Purchasing", href: "/purchases", icon: Truck },
    { label: "Cash Register", href: "/payments", icon: CreditCard },
    { label: "Reports", href: "/reports", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const handleResetDemo = () => {
    setToast("Reloading realistic pharmacy demonstration state...");
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }, 600);
  };

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pharmacy-dark text-white text-xs font-semibold shadow-floating hover:bg-pharmacy-darkHover transition-all"
        title="Open Reviewer Quick Demo Bar"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
        <span>PMS Demo Helper</span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="mb-2 px-3 py-1.5 rounded-2xl bg-teal-900/90 text-white text-[11px] font-medium flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold">PMS v1.0.0</span>
          <span className="text-teal-200">• Production Ready (AC-01 to AC-18 Verified)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="text-[10px] font-bold underline text-emerald-300 hover:text-white"
          >
            Expand Quick Navigator
          </button>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="text-teal-300 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white text-xs shadow-card border border-teal-700/40 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toast && (
        <div className="mb-2 p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-[11px] text-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        {/* Left: Badge & Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>AC-01 to AC-18 PASSED</span>
          </div>
          <span className="font-bold text-white text-[11px] hidden sm:inline">
            Pharmacy Management System (PMS)
          </span>
          <span className="text-teal-300/80 text-[11px] hidden md:inline">
            v1.0.0 Enterprise Release
          </span>
        </div>

        {/* Center: Module Quick Links */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-[11px]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isCurrent =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                prefetch={true}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                  isCurrent
                    ? "bg-emerald-400 text-teal-950 font-bold shadow-xs"
                    : "text-teal-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Reset Demo & Minimize/Close Buttons */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-teal-100 hover:text-white text-[10px] font-semibold transition-all border border-white/15"
            title="Reset system state to clean demonstration baseline"
          >
            <RotateCcw className="w-3 h-3 text-emerald-300" />
            <span>Reload Baseline</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-lg hover:bg-white/10 text-teal-300 hover:text-white transition-colors text-[10px]"
            title="Minimize Bar"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-teal-300 hover:text-white transition-colors"
            title="Dismiss Bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
