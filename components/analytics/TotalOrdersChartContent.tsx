"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface MonthlyData {
  month: string;
  orders2024: number;
  orders2025: number;
  highlight?: boolean;
}

const chartData: MonthlyData[] = [
  { month: "Jan", orders2024: 12000, orders2025: 15500 },
  { month: "Feb", orders2024: 12200, orders2025: 24000, highlight: true },
  { month: "Mar", orders2024: 15000, orders2025: 26500 },
  { month: "Apr", orders2024: 19000, orders2025: 29000 },
  { month: "May", orders2024: 23500, orders2025: 32000, highlight: true },
  { month: "Jun", orders2024: 26000, orders2025: 35000 },
  { month: "Jul", orders2024: 29000, orders2025: 38500 },
  { month: "Aug", orders2024: 34800, orders2025: 41800, highlight: true },
  { month: "Sep", orders2024: 32000, orders2025: 41000 },
  { month: "Oct", orders2024: 31000, orders2025: 42000 },
  { month: "Nov", orders2024: 29500, orders2025: 39500, highlight: true },
  { month: "Dec", orders2024: 33000, orders2025: 44000 },
];

const CustomDot = (props: any) => {
  const { cx, cy, payload, dataKey } = props;
  if (!payload?.highlight) return null;

  const is2025 = dataKey === "orders2025";
  const fillColor = is2025 ? "#F4A7A7" : "#38A89D";

  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={fillColor} fillOpacity={0.25} />
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={fillColor}
        stroke="#FFFFFF"
        strokeWidth={2}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val2025 = payload.find((p: any) => p.dataKey === "orders2025")?.value || 0;
    const val2024 = payload.find((p: any) => p.dataKey === "orders2024")?.value || 0;
    const growth = (((val2025 - val2024) / val2024) * 100).toFixed(1);

    return (
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-floating border border-pharmacy-border/80 text-xs space-y-1.5 z-50">
        <div className="font-bold text-pharmacy-textPrimary text-sm border-b border-pharmacy-borderLight pb-1 flex items-center justify-between gap-4">
          <span>{label}</span>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            +{growth}% YoY
          </span>
        </div>

        <div className="flex items-center justify-between gap-6 pt-0.5">
          <div className="flex items-center gap-1.5 text-pharmacy-textSecondary">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4A7A7]" />
            <span>2025:</span>
          </div>
          <span className="font-bold text-pharmacy-textPrimary">
            {val2025.toLocaleString()} orders
          </span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-1.5 text-pharmacy-textSecondary">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38A89D]" />
            <span>2024:</span>
          </div>
          <span className="font-bold text-pharmacy-textPrimary">
            {val2024.toLocaleString()} orders
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function TotalOrdersChartContent() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 15, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2EEEB" />

        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#87A19D", fontSize: 12, fontWeight: 500 }}
          dy={10}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#87A19D", fontSize: 12, fontWeight: 500 }}
          tickFormatter={(value) => `${value / 1000}K`}
          domain={[0, 50000]}
          ticks={[10000, 20000, 30000, 40000]}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            stroke: "#B2D2CC",
            strokeWidth: 1.5,
            strokeDasharray: "3 3",
          }}
        />

        <Line
          type="natural"
          dataKey="orders2024"
          stroke="#38A89D"
          strokeWidth={2.8}
          dot={<CustomDot dataKey="orders2024" />}
          activeDot={{
            r: 7,
            fill: "#38A89D",
            stroke: "#FFFFFF",
            strokeWidth: 2.5,
          }}
        />

        <Line
          type="natural"
          dataKey="orders2025"
          stroke="#F4A7A7"
          strokeWidth={2.8}
          dot={<CustomDot dataKey="orders2025" />}
          activeDot={{
            r: 7,
            fill: "#F4A7A7",
            stroke: "#FFFFFF",
            strokeWidth: 2.5,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
