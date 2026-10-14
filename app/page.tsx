"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, X } from "lucide-react";
import TotalOrdersChart from "@/components/analytics/TotalOrdersChart";
import RevenueStatCard from "@/components/analytics/RevenueStatCard";
import PendingOrdersCard from "@/components/analytics/PendingOrdersCard";
import RecentOrdersTable from "@/components/orders/RecentOrdersTable";
import CreateOrderModal from "@/components/orders/CreateOrderModal";
import { initialOrders } from "@/data/mockOrders";
import { OrderItem } from "@/types/order";

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Dynamic KPI calculations based on live orders
  const currentTotalRevenue = orders.reduce(
    (acc, curr) => acc + curr.quantity * curr.product.unitPrice,
    0
  );
  // Base offset to match the Dribbble reference ($74,848 baseline)
  const formattedRevenue = `$${(73500 + currentTotalRevenue).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

  const pendingCount = 130 + orders.filter((o) => o.status !== "Completed").length;

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

        {/* Create Order Button - Wired to open CreateOrderModal */}
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white font-medium text-sm shadow-pill hover:shadow-lg transition-all duration-200 self-start sm:self-auto group active:scale-95 cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-200">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>Create Order</span>
        </button>
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
            amount={formattedRevenue}
            trendPercentage="+25%"
            trendPeriod="from last 4 months"
          />
          <PendingOrdersCard
            count={pendingCount}
            trendPercentage="-05%"
            trendPeriod="from last 4 months"
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
