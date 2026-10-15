"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  Search,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Layers,
  Sparkles,
  PieChart,
} from "lucide-react";
import { SalesProfitSummary, ProductProfitRecord } from "@/types/report";

interface SalesProfitReportProps {
  summary: SalesProfitSummary;
  productRecords: ProductProfitRecord[];
}

export default function SalesProfitReport({
  summary,
  productRecords,
}: SalesProfitReportProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = new Set(productRecords.map((r) => r.category));
    return ["All", ...Array.from(cats)];
  }, [productRecords]);

  const filteredRecords = useMemo(() => {
    return productRecords.filter((rec) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        rec.productName.toLowerCase().includes(query) ||
        rec.sku.toLowerCase().includes(query) ||
        rec.category.toLowerCase().includes(query);

      const matchesCat =
        selectedCategory === "All" || rec.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [productRecords, searchQuery, selectedCategory]);

  const totals = useMemo(() => {
    return filteredRecords.reduce(
      (acc, curr) => ({
        units: acc.units + curr.unitsSold,
        revenue: acc.revenue + curr.revenue,
        cogs: acc.cogs + curr.batchCostBasis,
        profit: acc.profit + curr.grossProfit,
      }),
      { units: 0, revenue: 0, cogs: 0, profit: 0 }
    );
  }, [filteredRecords]);

  const overallFilteredMargin =
    totals.revenue > 0 ? ((totals.profit / totals.revenue) * 100).toFixed(1) : "0.0";

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Metric Strip (Executive Reconciliation) */}
      <div className="rounded-2xl border border-pharmacy-border/80 bg-pharmacy-canvas/40 p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-dark">
              Financial Margin Reconciliation Strip
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Audited Ledger Basis
            </span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Gross Margin: {summary.grossMarginPercent}%
          </span>
        </div>

        {/* Horizontal calculation flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4 text-xs">
          {/* Gross Sales */}
          <div className="bg-white p-3 rounded-xl border border-pharmacy-border/60">
            <span className="text-pharmacy-textMuted text-[11px] block">Gross Sales</span>
            <strong className="text-sm font-extrabold text-pharmacy-dark">
              {formatCurrency(summary.grossSales)}
            </strong>
          </div>

          {/* Item Discounts */}
          <div className="bg-white p-3 rounded-xl border border-pharmacy-border/60">
            <span className="text-amber-700 text-[11px] block">(-) Discounts</span>
            <strong className="text-sm font-extrabold text-amber-700">
              -{formatCurrency(summary.itemDiscounts)}
            </strong>
          </div>

          {/* Returns */}
          <div className="bg-white p-3 rounded-xl border border-pharmacy-border/60">
            <span className="text-rose-600 text-[11px] block">(-) Returns</span>
            <strong className="text-sm font-extrabold text-rose-600">
              -{formatCurrency(summary.customerReturns)}
            </strong>
          </div>

          {/* Net Revenue */}
          <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-200/80">
            <span className="text-teal-900 font-semibold text-[11px] block">(=) Net Revenue</span>
            <strong className="text-sm font-extrabold text-teal-950">
              {formatCurrency(summary.netRevenue)}
            </strong>
          </div>

          {/* COGS */}
          <div className="bg-white p-3 rounded-xl border border-pharmacy-border/60">
            <span className="text-pharmacy-textSecondary text-[11px] block">(-) COGS (Cost)</span>
            <strong className="text-sm font-extrabold text-pharmacy-textPrimary">
              -{formatCurrency(summary.cogs)}
            </strong>
          </div>

          {/* Opex */}
          <div className="bg-white p-3 rounded-xl border border-pharmacy-border/60">
            <span className="text-pharmacy-textMuted text-[11px] block">(-) Op Expenses</span>
            <strong className="text-sm font-extrabold text-pharmacy-textSecondary">
              -{formatCurrency(summary.operatingExpenses)}
            </strong>
          </div>

          {/* Net Margin */}
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300">
            <span className="text-emerald-900 font-bold text-[11px] block">(=) Net Profit</span>
            <strong className="text-sm font-extrabold text-emerald-900">
              {formatCurrency(summary.estimatedNetProfit)}
            </strong>
            <span className="block text-[10px] text-emerald-700 font-semibold mt-0.5">
              Net {summary.netMarginPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Product-Level Profit Breakdown Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
            <input
              type="text"
              placeholder="Search product name, SKU, formula..."
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

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-full border border-pharmacy-border bg-pharmacy-canvas/50 text-xs text-pharmacy-dark font-medium focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-pharmacy-textMuted">
          Showing <strong className="text-pharmacy-dark">{filteredRecords.length}</strong> items • Avg Margin:{" "}
          <strong className="text-emerald-700">{overallFilteredMargin}%</strong>
        </div>
      </div>

      {/* 3. Product Profit Table */}
      <div className="overflow-x-auto rounded-2xl border border-pharmacy-border/70">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-pharmacy-canvas/60 text-pharmacy-textSecondary font-semibold uppercase tracking-wider text-[11px] border-b border-pharmacy-border/60">
              <th className="py-3 px-4">Product Name & SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Dosage / Form</th>
              <th className="py-3 px-4 text-right">Units Sold</th>
              <th className="py-3 px-4 text-right">Revenue</th>
              <th className="py-3 px-4 text-right">COGS (Cost Basis)</th>
              <th className="py-3 px-4 text-right">Gross Profit</th>
              <th className="py-3 px-4 text-right">Margin %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharmacy-border/40">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-pharmacy-textMuted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PieChart className="w-8 h-8 text-pharmacy-textMuted/60" />
                    <p className="font-medium text-sm text-pharmacy-textSecondary">
                      No product sales records match your criteria.
                    </p>
                    <p className="text-xs">Try selecting &quot;All&quot; categories or clearing the search.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-pharmacy-canvas/40"
                >
                  {/* Product Name & SKU */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-pharmacy-dark">{item.productName}</div>
                    <div className="text-[11px] font-mono text-pharmacy-textMuted mt-0.5">
                      {item.sku}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-pharmacy-canvas text-pharmacy-textSecondary border border-pharmacy-border">
                      <Tag className="w-3 h-3 text-teal-700" />
                      {item.category}
                    </span>
                  </td>

                  {/* Form */}
                  <td className="py-3.5 px-4 text-pharmacy-textSecondary">
                    {item.form}
                  </td>

                  {/* Units Sold */}
                  <td className="py-3.5 px-4 text-right font-semibold text-pharmacy-dark">
                    {item.unitsSold.toLocaleString()}
                  </td>

                  {/* Revenue */}
                  <td className="py-3.5 px-4 text-right font-bold text-pharmacy-dark">
                    {formatCurrency(item.revenue)}
                  </td>

                  {/* Cost Basis */}
                  <td className="py-3.5 px-4 text-right text-pharmacy-textSecondary">
                    {formatCurrency(item.batchCostBasis)}
                  </td>

                  {/* Gross Profit */}
                  <td className="py-3.5 px-4 text-right font-extrabold text-emerald-800">
                    +{formatCurrency(item.grossProfit)}
                  </td>

                  {/* Margin % */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                      {item.marginPercent.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Table Totals Footer */}
          {filteredRecords.length > 0 && (
            <tfoot className="bg-pharmacy-canvas/70 font-bold border-t-2 border-pharmacy-border">
              <tr className="text-pharmacy-dark">
                <td colSpan={3} className="py-3.5 px-4 text-xs uppercase tracking-wider">
                  Reconciled Subtotal ({filteredRecords.length} items)
                </td>
                <td className="py-3.5 px-4 text-right text-xs">
                  {totals.units.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right text-xs text-pharmacy-dark">
                  {formatCurrency(totals.revenue)}
                </td>
                <td className="py-3.5 px-4 text-right text-xs text-pharmacy-textSecondary">
                  {formatCurrency(totals.cogs)}
                </td>
                <td className="py-3.5 px-4 text-right text-sm text-emerald-900 font-extrabold">
                  +{formatCurrency(totals.profit)}
                </td>
                <td className="py-3.5 px-4 text-right text-xs text-emerald-800">
                  {overallFilteredMargin}%
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
