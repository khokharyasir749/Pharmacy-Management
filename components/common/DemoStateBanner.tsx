"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
    return null;
  }

  if (isMinimized) {
    return (
      <div className="mb-2 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-normal flex items-center justify-between border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="font-medium text-slate-200">PMS v1.0.0</span>
          <span className="text-slate-400">• Standard Release</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="text-xs text-slate-300 hover:text-white"
          >
            Expand
          </button>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 shadow-sm">
      {/* Toast Alert */}
      {toast && (
        <div className="mb-2 p-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        {/* Left: Standard System Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
            <ShieldCheck className="w-3 h-3 text-slate-400" />
            <span>AC-01 to AC-18 Verified</span>
          </div>
          <span className="font-semibold text-slate-200 text-xs hidden sm:inline">
            Pharmacy Management System
          </span>
          <span className="text-slate-400 text-xs hidden md:inline">
            • v1.0.0
          </span>
        </div>

        {/* Center: Module Quick Links */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
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
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                  isCurrent
                    ? "bg-white/10 text-white font-medium"
                    : "text-slate-300 hover:text-white hover:bg-white/5 font-normal"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" />
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
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700"
            title="Reset system state to clean demonstration baseline"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset Demo</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Minimize Bar"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Dismiss Bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
