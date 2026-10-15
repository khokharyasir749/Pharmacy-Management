"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  DollarSign,
  Receipt,
  Tag,
  Building,
  User,
  CreditCard,
  Wallet,
  ArrowDownLeft,
  FileText,
} from "lucide-react";
import { Expense, ExpenseCategory } from "@/types/payment";

interface ExpensesTableProps {
  expenses: Expense[];
  onOpenRecordModal?: () => void;
}

const CATEGORIES: ("All" | ExpenseCategory)[] = [
  "All",
  "Utilities",
  "Packaging/Supplies",
  "Refreshment",
  "Maintenance",
  "Logistics",
];

export default function ExpensesTable({
  expenses,
  onOpenRecordModal,
}: ExpensesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | ExpenseCategory>("All");
  const [selectedMethod, setSelectedMethod] = useState<string>("All");

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.description.toLowerCase().includes(query) ||
        item.payee.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.voucherRef.toLowerCase().includes(query) ||
        item.recordedBy.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesMethod =
        selectedMethod === "All" || item.paymentMethod === selectedMethod;

      return matchesSearch && matchesCategory && matchesMethod;
    });
  }, [expenses, searchQuery, selectedCategory, selectedMethod]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredExpenses]);

  const drawerTotal = useMemo(() => {
    return filteredExpenses
      .filter((e) => e.paymentMethod === "Cash Drawer")
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const getCategoryBadgeClass = (category: ExpenseCategory) => {
    switch (category) {
      case "Utilities":
        return "bg-sky-50 text-sky-800 border-sky-200";
      case "Packaging/Supplies":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Refreshment":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Maintenance":
        return "bg-orange-50 text-orange-800 border-orange-200";
      case "Logistics":
        return "bg-purple-50 text-purple-800 border-purple-200";
      default:
        return "bg-slate-50 text-slate-800 border-slate-200";
    }
  };

  const getMethodBadge = (method: Expense["paymentMethod"]) => {
    switch (method) {
      case "Cash Drawer":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Wallet className="w-3 h-3 text-emerald-600" />
            Cash Drawer
          </span>
        );
      case "Petty Cash":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
            <Receipt className="w-3 h-3 text-teal-600" />
            Petty Cash
          </span>
        );
      case "Bank":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <CreditCard className="w-3 h-3 text-blue-600" />
            Bank Transfer
          </span>
        );
      default:
        return <span>{method}</span>;
    }
  };

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-4">
      {/* Top Search, Category Filters, and Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-pharmacy-borderLight">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
          <input
            type="text"
            placeholder="Search description, payee, voucher ref, staff..."
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

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-pharmacy-dark text-white shadow-xs font-semibold"
                  : "bg-pharmacy-canvas text-pharmacy-textSecondary hover:bg-pharmacy-mintHover hover:text-pharmacy-dark border border-pharmacy-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-toolbar: Payment method filter & Quick metrics summary banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-pharmacy-textMuted font-medium">Source:</span>
          {(["All", "Cash Drawer", "Petty Cash", "Bank"] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setSelectedMethod(method)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] transition-all ${
                selectedMethod === method
                  ? "bg-teal-900 text-white font-semibold"
                  : "text-pharmacy-textSecondary hover:text-pharmacy-dark"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs bg-pharmacy-canvas px-3 py-1 rounded-full border border-pharmacy-border self-start sm:self-auto">
          <span className="text-pharmacy-textMuted">
            Filtered: <strong className="text-pharmacy-dark">{filteredExpenses.length}</strong> items
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-pharmacy-textMuted">
            Total: <strong className="text-pharmacy-dark">{formatCurrency(totalFilteredAmount)}</strong>
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-pharmacy-textMuted">
            Cash Drawer Payouts: <strong className="text-emerald-700">{formatCurrency(drawerTotal)}</strong>
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-pharmacy-border/70">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-pharmacy-canvas/60 text-pharmacy-textSecondary font-semibold uppercase tracking-wider text-[11px] border-b border-pharmacy-border/60">
              <th className="py-3 px-4">Expense ID & Date</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Description / Purpose</th>
              <th className="py-3 px-4">Payee</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4">Recorded By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharmacy-border/40">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-pharmacy-textMuted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Receipt className="w-8 h-8 text-pharmacy-textMuted/60" />
                    <p className="font-medium text-sm text-pharmacy-textSecondary">
                      No operational expenses found.
                    </p>
                    <p className="text-xs">Adjust search query or category filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => {
                const isDrawer = expense.paymentMethod === "Cash Drawer";

                return (
                  <tr
                    key={expense.id}
                    className="transition-colors hover:bg-pharmacy-canvas/40"
                  >
                    {/* Expense ID & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-pharmacy-dark">
                        <span>{expense.id}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {expense.voucherRef}
                        </span>
                      </div>
                      <div className="text-[11px] text-pharmacy-textMuted mt-0.5">
                        {expense.date}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getCategoryBadgeClass(
                          expense.category
                        )}`}
                      >
                        <Tag className="w-3 h-3 opacity-70" />
                        {expense.category}
                      </span>
                    </td>

                    {/* Description / Purpose */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-pharmacy-dark line-clamp-1">
                        {expense.description}
                      </div>
                      {expense.notes && (
                        <div className="text-[11px] text-pharmacy-textMuted line-clamp-1 mt-0.5">
                          {expense.notes}
                        </div>
                      )}
                    </td>

                    {/* Payee */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-pharmacy-textSecondary font-medium">
                        <Building className="w-3.5 h-3.5 text-pharmacy-textMuted flex-shrink-0" />
                        <span>{expense.payee}</span>
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getMethodBadge(expense.paymentMethod)}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="text-sm font-bold text-pharmacy-dark">
                        {formatCurrency(expense.amount)}
                      </span>
                      {isDrawer && (
                        <div className="text-[10px] text-emerald-700 font-medium">
                          Deducted from drawer
                        </div>
                      )}
                    </td>

                    {/* Recorded By */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-pharmacy-textSecondary">
                        <div className="w-5 h-5 rounded-full bg-pharmacy-canvas flex items-center justify-center text-pharmacy-textSecondary border border-pharmacy-border text-[10px] font-bold">
                          {expense.recordedBy.charAt(0)}
                        </div>
                        <span>{expense.recordedBy}</span>
                      </div>
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
