"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";

export const DEFAULT_DATE_RANGES = [
  "Today",
  "Last 7 Days",
  "This Month",
  "Last Quarter",
  "Custom Range",
] as const;

export type DateRangeOption = (typeof DEFAULT_DATE_RANGES)[number] | string;

interface DateRangeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: readonly string[] | string[];
  className?: string;
  buttonClassName?: string;
  align?: "left" | "right";
}

export default function DateRangeDropdown({
  value,
  onChange,
  options = DEFAULT_DATE_RANGES,
  className = "",
  buttonClassName = "",
  align = "right",
}: DateRangeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click-outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Dropdown Trigger Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`h-9 px-3.5 rounded-full border border-pharmacy-border bg-white hover:bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textSecondary flex items-center gap-2 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-700/20 active:scale-95 cursor-pointer ${buttonClassName}`}
      >
        <Calendar className="w-3.5 h-3.5 text-teal-800 stroke-[2.2]" />
        <span className="font-semibold text-pharmacy-dark">{value}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-pharmacy-textMuted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-48 bg-white rounded-2xl shadow-floating border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Select Date Range
          </div>

          <div className="space-y-0.5">
            {options.map((option) => {
              const isActive = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? "bg-teal-50 text-teal-800 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-teal-700" : "bg-transparent"
                      }`}
                    />
                    <span>{option}</span>
                  </div>

                  {isActive && (
                    <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
