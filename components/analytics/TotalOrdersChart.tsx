"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Calendar, ChevronDown, Check } from "lucide-react";

// Dynamically lazy-load the chart content containing recharts
const TotalOrdersChartContent = dynamic(
  () => import("./TotalOrdersChartContent"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col justify-between py-6 animate-pulse">
        <div className="w-full border-b border-dashed border-gray-100" />
        <div className="w-full border-b border-dashed border-gray-100" />
        <div className="w-full border-b border-dashed border-gray-100" />
        <div className="w-full border-b border-dashed border-gray-100" />
      </div>
    ),
  }
);

export default function TotalOrdersChart() {
  const [filterPeriod, setFilterPeriod] = useState("Yearly");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        {/* Title */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-pharmacy-dark">
            Total Orders
          </h2>
          <p className="text-xs text-pharmacy-textMuted mt-0.5">
            Comparative annual order volume across 12 months
          </p>
        </div>

        {/* Right Controls: Legends & Filter */}
        <div className="flex items-center gap-5 flex-wrap">
          {/* Year Legends */}
          <div className="flex items-center gap-4 text-xs font-semibold text-pharmacy-textSecondary select-none">
            <div className="flex items-center gap-2 cursor-default">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38A89D]" />
              <span>2024</span>
            </div>
            <div className="flex items-center gap-2 cursor-default">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F4A7A7]" />
              <span>2025</span>
            </div>
          </div>

          {/* Yearly Dropdown Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-9 px-3.5 rounded-full border border-pharmacy-border bg-white hover:bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textSecondary flex items-center gap-2 transition-all shadow-sm focus:outline-none"
              aria-label="Filter Orders Range"
            >
              <Calendar className="w-3.5 h-3.5 text-pharmacy-textMuted stroke-[2.2]" />
              <span>{filterPeriod}</span>
              <ChevronDown className="w-3.5 h-3.5 text-pharmacy-textMuted" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-floating border border-pharmacy-border p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                {["Yearly", "Quarterly", "Monthly"].map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setFilterPeriod(period);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between transition-colors ${
                      filterPeriod === period
                        ? "bg-pharmacy-mintLight text-pharmacy-textPrimary font-semibold"
                        : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
                    }`}
                  >
                    <span>{period}</span>
                    {filterPeriod === period && (
                      <Check className="w-3 h-3 text-teal-800" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-[260px] sm:h-[300px] mt-2 select-none">
        <TotalOrdersChartContent />
      </div>
    </div>
  );
}

