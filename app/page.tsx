"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, CheckCircle2, X } from "lucide-react";
import TotalOrdersChart from "@/components/analytics/TotalOrdersChart";
import RevenueStatCard from "@/components/analytics/RevenueStatCard";
import PendingOrdersCard from "@/components/analytics/PendingOrdersCard";
import RecentOrdersTable from "@/components/orders/RecentOrdersTable";
import CreateOrderModal from "@/components/orders/CreateOrderModal";
import DateRangeDropdown from "@/components/common/DateRangeDropdown";
import { initialOrders, getStoredOrders } from "@/data/mockOrders";
import { OrderItem } from "@/types/order";

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [dateRange, setDateRange] = useState("This Month");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  // Dynamic KPI calculations based on live orders and dateRange
  const currentTotalRevenue = orders.reduce(
    (acc, curr) => acc + curr.quantity * curr.product.unitPrice,
    0
  );

  const getDashboardKPIs = () => {
    switch (dateRange) {
      case "Today":
        return {
          revenue: `$${(3200 + Math.min(286, currentTotalRevenue * 0.05)).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`,
          revenueTrend: "+8.2%",
          revenuePeriod: "vs yesterday",
          pending: 6,
          pendingTrend: "-12%",
          pendingPeriod: "vs yesterday",
        };
      case "Last 7 Days":
        return {
          revenue: `$${(18500 + Math.min(1420, currentTotalRevenue * 0.25)).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`,
          revenueTrend: "+14.6%",
          revenuePeriod: "vs previous week",
          pending: 38,
          pendingTrend: "-08%",
          pendingPeriod: "vs previous week",
        };
      case "Last Quarter":
        return {
          revenue: `$${(221000 + currentTotalRevenue * 3).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`,
          revenueTrend: "+31.4%",
          revenuePeriod: "YoY growth",
          pending: 390,
          pendingTrend: "+04%",
          pendingPeriod: "quarterly volume",
        };
      case "Custom Range":
        return {
          revenue: `$${(46000 + currentTotalRevenue * 0.6).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`,
          revenueTrend: "+12.0%",
          revenuePeriod: "selected timeframe",
          pending: 74,
          pendingTrend: "-02%",
          pendingPeriod: "selected range",
        };
      case "This Month":
      default:
        return {
          revenue: `$${(73500 + currentTotalRevenue).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`,
          revenueTrend: "+25%",
          revenuePeriod: "from last 4 months",
          pending: 130 + orders.filter((o) => o.status !== "Completed").length,
          pendingTrend: "-05%",
          pendingPeriod: "from last 4 months",
        };
    }
  };

  const kpis = getDashboardKPIs();

  const handleOrderCreated = (newOrder: OrderItem) => {
    // Atomic insert at the top of the table without reload
    setOrders((prev) => [newOrder, ...prev]);

    // Toast notification
    setToastMessage({
      title: "Order Placed Successfully",
      description: `Order #${newOrder.orderNumber} for ${newOrder.customer.name} ($${(
        newOrder.quantity * newOrder.product.unitPrice
      ).toFixed(2)}) has been added.`,
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <div className="space-y-6 pb-6 relative">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 max-w-md bg-white border border-teal-200 rounded-2xl p-4 shadow-floating flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-pharmacy-dark">
              {toastMessage.title}
            </div>
            <div className="text-[11px] text-pharmacy-textMuted mt-0.5">
              {toastMessage.description}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-pharmacy-textMuted hover:text-pharmacy-textPrimary p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Date Range Selector Pill */}
          <DateRangeDropdown
            value={dateRange}
            onChange={(val) => {
              setDateRange(val);
              setToastMessage({
                title: "Dashboard Range Updated",
                description: `Showing orders and financial metrics for: ${val}`,
              });
              setTimeout(() => setToastMessage(null), 3500);
            }}
          />

          {/* Create Order Button - Routes to dedicated full POS checkout page */}
          <Link
            href="/orders/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white font-medium text-sm shadow-pill hover:shadow-lg transition-all duration-200 group active:scale-95 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-200">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Create Order</span>
          </Link>
        </div>
      </div>

      {/* Top Analytics Grid Section (Dual Line Chart + Stacked KPI Cards) */}
      <section aria-label="Analytics Overview" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Total Orders Dual-Line Chart (~65% width) */}
        <div className="lg:col-span-8 flex flex-col">
          <TotalOrdersChart />
        </div>

        {/* Right: Stacked KPI Stat Cards (~35% width with live dynamic stats) */}
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          <RevenueStatCard
            amount={kpis.revenue}
            trendPercentage={kpis.revenueTrend}
            trendPeriod={kpis.revenuePeriod}
          />
          <PendingOrdersCard
            count={kpis.pending}
            trendPercentage={kpis.pendingTrend}
            trendPeriod={kpis.pendingPeriod}
          />
        </div>
      </section>

      {/* Bottom Section: Recent Orders Interactive Data Table */}
      <section aria-label="Recent Orders Table">
        <RecentOrdersTable orders={orders} onOrdersChange={setOrders} />
      </section>

      {/* Interactive Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
}
