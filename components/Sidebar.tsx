"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  LayoutGrid,
  ShoppingCart,
  TrendingUp,
  Users,
  CreditCard,
  FileText,
  Settings,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activePath?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "MAIN MENU",
    collapsible: false,
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Products", href: "/products", icon: Package },
      { name: "Categories", href: "/categories", icon: LayoutGrid },
    ],
  },
  {
    title: "LEADS",
    collapsible: true,
    defaultExpanded: true,
    items: [
      { name: "Orders", href: "/", icon: ShoppingCart },
      { name: "Sales", href: "/sales", icon: TrendingUp },
      { name: "Customers", href: "/customers", icon: Users },
    ],
  },
  {
    title: "COMMS",
    collapsible: true,
    defaultExpanded: true,
    items: [
      { name: "Payments", href: "/payments", icon: CreditCard },
      { name: "Reports", href: "/reports", icon: FileText },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar({ isOpen, onClose, activePath = "/" }: SidebarProps) {
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    LEADS: true,
    COMMS: true,
  });

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-pharmacy-dark/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen lg:h-auto w-64 flex-shrink-0 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } bg-pharmacy-canvas lg:bg-transparent`}
      >
        <div className="flex flex-col">
          {/* Logo / Brand Header */}
          <div className="flex items-center justify-between pb-8">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Circular Pharmacy Plus Icon */}
              <div className="relative w-10 h-10 rounded-full bg-pharmacy-textPrimary flex items-center justify-center text-white shadow-sm ring-4 ring-pharmacy-textPrimary/10 group-hover:scale-105 transition-transform duration-200">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2.2" />
                  <path d="M12 7v10" />
                  <path d="M7 12h10" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-pharmacy-textPrimary">
                Pharmacy
              </span>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-pharmacy-textSecondary hover:bg-pharmacy-border lg:hidden transition-colors"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
            {navSections.map((section) => {
              const isExpanded =
                !section.collapsible || expandedSections[section.title] !== false;

              return (
                <div key={section.title} className="space-y-2">
                  {/* Section Title Header */}
                  <div
                    onClick={() => section.collapsible && toggleSection(section.title)}
                    className={`flex items-center justify-between text-[11px] font-semibold tracking-wider text-pharmacy-textMuted uppercase px-3 select-none ${
                      section.collapsible ? "cursor-pointer hover:text-pharmacy-textSecondary" : ""
                    }`}
                  >
                    <span>{section.title}</span>
                    {section.collapsible && (
                      <span className="text-pharmacy-textMuted hover:text-pharmacy-textSecondary transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Section Links */}
                  {isExpanded && (
                    <ul className="space-y-1.5 pt-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activePath === item.href;

                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? "bg-pharmacy-dark text-white shadow-pill"
                                  : "text-pharmacy-textSecondary hover:text-pharmacy-textPrimary hover:bg-pharmacy-mintHover"
                              }`}
                            >
                              {/* Icon Badge container */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                                  isActive
                                    ? "bg-white/15 text-white"
                                    : "bg-white/70 text-pharmacy-textSecondary group-hover:bg-white group-hover:text-pharmacy-textPrimary shadow-sm"
                                }`}
                              >
                                <Icon className="w-4 h-4 stroke-[2.2]" />
                              </div>

                              {/* Label */}
                              <span className="tracking-wide">{item.name}</span>

                              {/* Active indicator dot on right (optional visual touch) */}
                              {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom subtle system status / footer */}
        <div className="pt-4 border-t border-pharmacy-border/60">
          <div className="flex items-center justify-between text-xs text-pharmacy-textMuted px-2">
            <span>PMS v1.0.4</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
