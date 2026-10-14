"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

interface RevenueStatCardProps {
  amount?: string;
  trendPercentage?: string;
  trendPeriod?: string;
}

export default function RevenueStatCard({
  amount = "$74,848",
  trendPercentage = "+25%",
  trendPeriod = "from last 4 months",
}: RevenueStatCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-card border border-pharmacy-border/60 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-floating group">
      {/* Top Header: Title */}
      <div>
        <h3 className="text-sm font-semibold text-pharmacy-textSecondary">
          Revenue From Orders
        </h3>
      </div>

      {/* Main Metric & Trend Badge + Sparkline */}
      <div className="mt-4 flex items-end justify-between gap-4">
        {/* Metric Figure & Trend */}
        <div className="z-10">
          <div className="text-3xl sm:text-4xl font-extrabold text-pharmacy-textPrimary tracking-tight">
            {amount}
          </div>

          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#E8F8F4] text-[#1E988A] text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{trendPercentage}</span>
            </span>
            <span className="text-xs text-pharmacy-textMuted font-medium">
              {trendPeriod}
            </span>
          </div>
        </div>

        {/* Smooth Organic Upward SVG Sparkline with Gradient Fill */}
        <div className="w-32 sm:w-36 h-16 sm:h-20 flex-shrink-0 flex items-end justify-end pointer-events-none select-none">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 140 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="revenueTealGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="70"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#38A89D" stopOpacity="0.32" />
                <stop offset="85%" stopColor="#38A89D" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#38A89D" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill */}
            <path
              d="M0 55 C 20 54, 30 42, 50 38 C 70 34, 80 44, 100 24 C 115 8, 128 14, 140 4 L 140 70 L 0 70 Z"
              fill="url(#revenueTealGradient)"
            />

            {/* Main Crisp Upward Curve */}
            <path
              d="M0 55 C 20 54, 30 42, 50 38 C 70 34, 80 44, 100 24 C 115 8, 128 14, 140 4"
              stroke="#38A89D"
              strokeWidth="2.8"
              strokeLinecap="round"
              className="group-hover:stroke-teal-600 transition-colors"
            />

            {/* End Point Glow Indicator */}
            <circle
              cx="140"
              cy="4"
              r="3.5"
              fill="#38A89D"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
