"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Package,
  Calendar,
  Building2,
  DollarSign,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { InventoryExpiryItem, ExpiryRiskLevel } from "@/types/report";

interface InventoryExpiryReportProps {
  items: InventoryExpiryItem[];
}

type FilterOption = "All" | "Expiring < 30 Days" | "Expiring 60-90 Days" | "Low Stock Reorder";

export default function InventoryExpiryReport({ items }: InventoryExpiryReportProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("All");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.medicineName.toLowerCase().includes(query) ||
        item.genericName.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.batchNumber.toLowerCase().includes(query) ||
        item.branch.toLowerCase().includes(query);

      let matchesFilter = true;
      if (selectedFilter === "Expiring < 30 Days") {
        matchesFilter = item.daysToExpiry <= 30;
      } else if (selectedFilter === "Expiring 60-90 Days") {
        matchesFilter = item.daysToExpiry > 30 && item.daysToExpiry <= 90;
      } else if (selectedFilter === "Low Stock Reorder") {
        matchesFilter = item.availableUnits <= item.reorderLevel;
      }

      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, selectedFilter]);

  const totalValuation = useMemo(() => {
    return items.reduce((sum, item) => sum + item.totalStockValue, 0);
  }, [items]);

  const atRiskValuation = useMemo(() => {
    return items
      .filter((item) => item.riskLevel === "Critical" || item.daysToExpiry <= 90)
      .reduce((sum, item) => sum + item.totalStockValue, 0);
  }, [items]);

  const criticalCount = items.filter((item) => item.daysToExpiry <= 30).length;
  const lowStockCount = items.filter((item) => item.availableUnits <= item.reorderLevel).length;

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getRiskBadge = (item: InventoryExpiryItem) => {
    if (item.daysToExpiry <= 30) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          Critical ({item.daysToExpiry}d left)
        </span>
      );
    }
    if (item.daysToExpiry <= 90) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Warning ({item.daysToExpiry}d left)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Safe ({item.daysToExpiry}d)
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* 1. At-a-glance Expiry & Valuation Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-pharmacy-canvas/50 border border-pharmacy-border p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-pharmacy-textMuted font-medium block">Total Stock Asset Value</span>
            <strong className="text-base font-extrabold text-pharmacy-dark">
              {formatCurrency(totalValuation)}
            </strong>
          </div>
          <div className="p-2 rounded-xl bg-white text-teal-800 border border-pharmacy-border/60">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-rose-50/50 border border-rose-200 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-rose-700 font-medium block">Near-Expiry At-Risk Value</span>
            <strong className="text-base font-extrabold text-rose-900">
              {formatCurrency(atRiskValuation)}
            </strong>
          </div>
          <div className="p-2 rounded-xl bg-white text-rose-600 border border-rose-200">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-amber-50/50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-amber-700 font-medium block">Critical Batches (&lt;30d)</span>
            <strong className="text-base font-extrabold text-amber-900">
              {criticalCount} Batches
            </strong>
          </div>
          <div className="p-2 rounded-xl bg-white text-amber-700 border border-amber-200">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-sky-50/50 border border-sky-200 p-3.5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-sky-700 font-medium block">Low Stock Reorder Alerts</span>
            <strong className="text-base font-extrabold text-sky-900">
              {lowStockCount} SKUs below threshold
            </strong>
          </div>
          <div className="p-2 rounded-xl bg-white text-sky-700 border border-sky-200">
            <Package className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-pharmacy-borderLight">
        <div className="relative flex-1 sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
          <input
            type="text"
            placeholder="Search medicine, generic formula, batch number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-full border border-pharmacy-border bg-pharmacy-canvas/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 text-pharmacy-dark placeholder:text-pharmacy-textMuted transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pharmacy-textMuted hover:text-pharmacy-dark"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {(
            [
              "All",
              "Expiring < 30 Days",
              "Expiring 60-90 Days",
              "Low Stock Reorder",
            ] as FilterOption[]
          ).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedFilter === filter
                  ? "bg-pharmacy-dark text-white shadow-xs font-semibold"
                  : "bg-pharmacy-canvas text-pharmacy-textSecondary hover:bg-pharmacy-mintHover hover:text-pharmacy-dark border border-pharmacy-border"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Inventory Aging Table */}
      <div className="overflow-x-auto rounded-2xl border border-pharmacy-border/70">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-pharmacy-canvas/60 text-pharmacy-textSecondary font-semibold uppercase tracking-wider text-[11px] border-b border-pharmacy-border/60">
              <th className="py-3 px-4">SKU & Medicine Name</th>
              <th className="py-3 px-4">Batch Number</th>
              <th className="py-3 px-4">Storage Branch</th>
              <th className="py-3 px-4 text-right">Available Units</th>
              <th className="py-3 px-4 text-right">Unit Cost</th>
              <th className="py-3 px-4 text-right">Total Valuation</th>
              <th className="py-3 px-4">Expiry Date</th>
              <th className="py-3 px-4 text-center">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharmacy-border/40">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-pharmacy-textMuted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Package className="w-8 h-8 text-pharmacy-textMuted/60" />
                    <p className="font-medium text-sm text-pharmacy-textSecondary">
                      No inventory batches match this criteria.
                    </p>
                    <p className="text-xs">Try selecting &quot;All&quot; or adjusting your search keyword.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isLowStock = item.availableUnits <= item.reorderLevel;

                return (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-pharmacy-canvas/40"
                  >
                    {/* SKU & Medicine Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-pharmacy-dark">
                        {item.medicineName}
                      </div>
                      <div className="text-[11px] text-pharmacy-textMuted">
                        {item.genericName} • <span className="font-mono">{item.sku}</span>
                      </div>
                    </td>

                    {/* Batch Number */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                        {item.batchNumber}
                      </span>
                    </td>

                    {/* Branch */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-pharmacy-textSecondary">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-pharmacy-textMuted flex-shrink-0" />
                        <span>{item.branch}</span>
                      </div>
                    </td>

                    {/* Available Units */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-bold ${
                          isLowStock ? "text-rose-600" : "text-pharmacy-dark"
                        }`}
                      >
                        {item.availableUnits.toLocaleString()}
                      </span>
                      {isLowStock && (
                        <div className="text-[10px] text-rose-600 font-semibold">
                          Low (Reorder: {item.reorderLevel})
                        </div>
                      )}
                    </td>

                    {/* Unit Cost */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap text-pharmacy-textSecondary font-medium">
                      {formatCurrency(item.unitCost)}
                    </td>

                    {/* Total Stock Value */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-pharmacy-dark">
                      {formatCurrency(item.totalStockValue)}
                    </td>

                    {/* Expiry Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-pharmacy-dark">
                        {item.expiryDate}
                      </div>
                    </td>

                    {/* Risk Level */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getRiskBadge(item)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
