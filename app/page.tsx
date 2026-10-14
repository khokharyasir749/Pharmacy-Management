"use client";

import React from "react";
import { Plus } from "lucide-react";
import TotalOrdersChart from "@/components/analytics/TotalOrdersChart";
import RevenueStatCard from "@/components/analytics/RevenueStatCard";
import PendingOrdersCard from "@/components/analytics/PendingOrdersCard";
import RecentOrdersTable from "@/components/orders/RecentOrdersTable";

export default function OrdersManagementPage() {
  return (
    <div className="space-y-6 pb-6">
      {/* Page Title & Top CTA Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-pharmacy-dark">
            Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-pharmacy-textMuted mt-0.5">
            Real-time pharmacy analytics, inventory metrics, and prescription fulfillment
          </p>
        </div>

        {/* Create Order Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white font-medium text-sm shadow-pill hover:shadow-lg transition-all duration-200 self-start sm:self-auto group active:scale-95"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-200">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>Create Order</span>
        </button>
      </div>

      {/* Top Analytics Grid Section (Dual Line Chart + Stacked KPI Cards) */}
      <section aria-label="Analytics Overview" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Total Orders Dual-Line Chart (approx 65% width) */}
        <div className="lg:col-span-8 flex flex-col">
          <TotalOrdersChart />
        </div>

        {/* Right: Stacked KPI Stat Cards (approx 35% width) */}
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          <RevenueStatCard
            amount="$74,848"
            trendPercentage="+25%"
            trendPeriod="from last 4 months"
          />
          <PendingOrdersCard
            count={137}
            trendPercentage="-05%"
            trendPeriod="from last 4 months"
          />
        </div>
      </section>

      {/* Bottom Section: Recent Orders Interactive Data Table */}
      <section aria-label="Recent Orders Table">
        <RecentOrdersTable />
      </section>
    </div>
  );
}
