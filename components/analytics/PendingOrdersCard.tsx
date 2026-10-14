"use client";

import React from "react";
import { TrendingDown } from "lucide-react";

interface PendingOrdersCardProps {
  count?: number | string;
  trendPercentage?: string;
  trendPeriod?: string;
}

export default function PendingOrdersCard({
  count = 137,
  trendPercentage = "-05%",
  trendPeriod = "from last 4 months",
}: PendingOrdersCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-card border border-pharmacy-border/60 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-floating group">
      {/* Top Header: Title */}
      <div>
        <h3 className="text-sm font-semibold text-pharmacy-textSecondary">
          Pending Orders
        </h3>
      </div>

      {/* Main Metric & Trend Badge + Downward Sparkline */}
      <div className="mt-4 flex items-end justify-between gap-4">
        {/* Metric Figure & Trend */}
        <div className="z-10">
          <div className="text-3xl sm:text-4xl font-extrabold text-pharmacy-textPrimary tracking-tight">
            {count}
          </div>

          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FDECE8] text-[#E05A47] text-xs font-semibold">
              <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{trendPercentage}</span>
            </span>
            <span className="text-xs text-pharmacy-textMuted font-medium">
              {trendPeriod}
            </span>
          </div>
        </div>

        {/* Smooth Organic Downward SVG Sparkline with Salmon Gradient Fill */}
        <div className="w-32 sm:w-36 h-16 sm:h-20 flex-shrink-0 flex items-end justify-end pointer-events-none select-none">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 140 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="pendingSalmonGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="70"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#F4A7A7" stopOpacity="0.45" />
                <stop offset="85%" stopColor="#F4A7A7" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#F4A7A7" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill (Right-leaning valley) */}
            <path
              d="M70 70 L 70 8 C 75 14, 82 32, 90 42 C 98 52, 106 64, 118 62 C 128 60, 134 46, 140 48 L 140 70 Z"
              fill="url(#pendingSalmonGradient)"
            />

            {/* Main Crisp Downward Curve */}
            <path
              d="M70 8 C 75 14, 82 32, 90 42 C 98 52, 106 64, 118 62 C 128 60, 134 46, 140 48"
              stroke="#F4A7A7"
              strokeWidth="2.8"
              strokeLinecap="round"
              className="group-hover:stroke-rose-400 transition-colors"
            />

            {/* End Point Glow Indicator */}
            <circle
              cx="140"
              cy="48"
              r="3.5"
              fill="#F4A7A7"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
