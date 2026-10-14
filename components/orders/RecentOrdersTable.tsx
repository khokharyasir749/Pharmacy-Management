"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  AlertCircle,
  Check,
  Calendar,
  CreditCard,
  Building2,
  Banknote,
  Sparkles,
} from "lucide-react";
import { OrderItem } from "@/types/order";
import { initialOrders } from "@/data/mockOrders";

export default function RecentOrdersTable() {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [sortAscending, setSortAscending] = useState<boolean | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Quantity stepper handler
  const handleQuantityChange = (orderId: string, delta: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id !== orderId) return ord;
        const newQty = ord.quantity + delta;
        if (newQty < 1) return ord;
        if (newQty > ord.product.availableStock) {
          return ord;
        }
        return {
          ...ord,
          quantity: newQty,
        };
      })
    );
  };

  // Master Checkbox Toggle
  const handleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((ord) => ord.id));
    }
  };

  // Single Row Checkbox Toggle
  const handleSelectRow = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Filter and Search logic
  const filteredOrders = useMemo(() => {
    let result = orders.filter((order) => {
      // Search matching customer name, product name, or batch
      const matchesSearch =
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter status / category
      let matchesFilter = true;
      if (selectedFilter === "Near Expiry") {
        matchesFilter = order.status === "Near Expiry";
      } else if (selectedFilter === "Pending") {
        matchesFilter = order.status === "Pending" || order.status === "Processing";
      } else if (selectedFilter === "Completed") {
        matchesFilter = order.status === "Completed";
      }

      return matchesSearch && matchesFilter;
    });

    // Date sorting if active
    if (sortAscending !== null) {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.expiryDate).getTime();
        const dateB = new Date(b.expiryDate).getTime();
        return sortAscending ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }, [orders, searchQuery, selectedFilter, sortAscending]);

  // Payment icon helper
  const renderPaymentIcon = (method: string) => {
    if (method.includes("Credit")) {
      return <CreditCard className="w-3.5 h-3.5 text-blue-500" />;
    }
    if (method.includes("Debit")) {
      return <Building2 className="w-3.5 h-3.5 text-emerald-600" />;
    }
    return <Banknote className="w-3.5 h-3.5 text-amber-600" />;
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-card border border-pharmacy-border/60 transition-all duration-300">
      {/* Table Card Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-pharmacy-borderLight">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-pharmacy-dark">
              Recent Orders
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pharmacy-canvas text-pharmacy-textSecondary">
              {filteredOrders.length} records
            </span>
          </div>
          <p className="text-xs text-pharmacy-textMuted mt-0.5">
            Customer prescriptions, real-time quantity counters, and FEFO expiry auditing
          </p>
        </div>

        {/* Toolbar: Search, Filter, Sort */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-pharmacy-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-10 pl-10 pr-4 bg-[#F5FAF8] border border-pharmacy-border/80 rounded-full text-xs sm:text-sm text-pharmacy-textPrimary placeholder:text-pharmacy-textMuted focus:outline-none focus:ring-2 focus:ring-pharmacy-textPrimary/20 focus:border-pharmacy-textPrimary/30 transition-all w-44 sm:w-56 shadow-sm"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="h-10 px-4 rounded-full border border-pharmacy-border/80 bg-white hover:bg-pharmacy-canvas text-xs sm:text-sm font-semibold text-pharmacy-textSecondary flex items-center gap-2 transition-all shadow-sm focus:outline-none"
            >
              <Filter className="w-3.5 h-3.5 text-pharmacy-textMuted stroke-[2.2]" />
              <span>{selectedFilter === "All" ? "Filter" : selectedFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-pharmacy-textMuted" />
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-floating border border-pharmacy-border p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                {["All", "Completed", "Pending", "Near Expiry"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(status);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors ${
                      selectedFilter === status
                        ? "bg-pharmacy-mintLight text-pharmacy-textPrimary font-semibold"
                        : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
                    }`}
                  >
                    <span>{status}</span>
                    {selectedFilter === status && (
                      <Check className="w-3 h-3 text-teal-800" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort / Short Button */}
          <button
            type="button"
            onClick={() => setSortAscending((prev) => (prev === null ? true : !prev))}
            className={`h-10 px-4 rounded-full border transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm ${
              sortAscending !== null
                ? "border-pharmacy-dark bg-pharmacy-dark text-white"
                : "border-pharmacy-border/80 bg-white hover:bg-pharmacy-canvas text-pharmacy-textSecondary"
            }`}
            title="Toggle sort by Expiry Date"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Short</span>
            {sortAscending !== null && (
              <span className="text-[10px] uppercase font-bold">
                {sortAscending ? "▲" : "▼"}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Bulk Action Banner (when rows selected) */}
      {selectedOrderIds.length > 0 && (
        <div className="mt-3 px-4 py-2.5 rounded-2xl bg-pharmacy-mintLight/70 border border-teal-200/50 flex items-center justify-between text-xs text-pharmacy-textPrimary animate-in fade-in duration-200">
          <span className="font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-700" />
            {selectedOrderIds.length} order{selectedOrderIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedOrderIds([])}
              className="text-xs text-pharmacy-textSecondary hover:text-pharmacy-textPrimary underline"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Table Canvas with Horizontal Scroll for Responsive Displays */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse min-w-[840px]">
          {/* Table Head */}
          <thead>
            <tr className="border-b border-pharmacy-borderLight text-xs font-semibold text-pharmacy-textSecondary/90 select-none">
              {/* Checkbox */}
              <th className="py-3.5 px-3 w-10">
                <input
                  type="checkbox"
                  checked={
                    filteredOrders.length > 0 &&
                    selectedOrderIds.length === filteredOrders.length
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-pharmacy-dark focus:ring-pharmacy-dark/30 cursor-pointer accent-pharmacy-dark"
                  aria-label="Select all orders"
                />
              </th>

              {/* Name */}
              <th className="py-3.5 px-4 font-semibold text-pharmacy-textSecondary">
                Name
              </th>

              {/* Product Name */}
              <th className="py-3.5 px-4 font-semibold text-pharmacy-textSecondary">
                Product Name
              </th>

              {/* Payment Method */}
              <th className="py-3.5 px-4 font-semibold text-pharmacy-textSecondary">
                Payment Method
              </th>

              {/* Quantity */}
              <th className="py-3.5 px-4 font-semibold text-pharmacy-textSecondary text-center">
                Quantity
              </th>

              {/* Total Price */}
              <th className="py-3.5 px-4 font-semibold text-pharmacy-textSecondary">
                Total Price
              </th>

              {/* Expiry Date (Sortable) */}
              <th
                onClick={() => setSortAscending((prev) => (prev === null ? true : !prev))}
                className="py-3.5 px-4 font-semibold text-pharmacy-textSecondary cursor-pointer hover:text-pharmacy-textPrimary transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Expiry Date</span>
                  {sortAscending === true ? (
                    <ChevronUp className="w-3.5 h-3.5 text-pharmacy-dark" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-pharmacy-textMuted group-hover:text-pharmacy-dark" />
                  )}
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-pharmacy-borderLight text-sm">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const isSelected = selectedOrderIds.includes(order.id);
                const totalPrice = (order.quantity * order.product.unitPrice).toFixed(2);
                const isNearExpiry = order.status === "Near Expiry";

                return (
                  <tr
                    key={order.id}
                    className={`transition-colors duration-150 ${
                      isSelected
                        ? "bg-[#F3FAF7]"
                        : "hover:bg-[#FAFDFC]"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-4 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(order.id)}
                        className="w-4 h-4 rounded border-gray-300 text-pharmacy-dark focus:ring-pharmacy-dark/30 cursor-pointer accent-pharmacy-dark"
                        aria-label={`Select order for ${order.customer.name}`}
                      />
                    </td>

                    {/* Customer Name & Avatar */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-teal-100 ring-2 ring-white shadow-sm flex items-center justify-center">
                          {!imgErrors[order.id] ? (
                            <Image
                              src={order.customer.avatar}
                              alt={order.customer.name}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                              onError={() =>
                                setImgErrors((prev) => ({ ...prev, [order.id]: true }))
                              }
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-pharmacy-textPrimary">
                              {order.customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-pharmacy-textPrimary text-sm">
                          {order.customer.name}
                        </span>
                      </div>
                    </td>

                    {/* Product Name & Batch */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-pharmacy-textPrimary">
                          {order.product.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-medium text-pharmacy-textMuted">
                            {order.product.genericName || "Pharmaceutical"}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-pharmacy-canvas text-pharmacy-textSecondary font-mono border border-pharmacy-border/50">
                            {order.product.batchNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {renderPaymentIcon(order.paymentMethod)}
                        <span className="text-xs font-medium text-pharmacy-textSecondary">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* Quantity Stepper (Pill with - counter +) */}
                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-2 bg-[#EAF3F0] rounded-full px-2 py-1 shadow-sm border border-teal-100/40">
                        {/* Decrement Button */}
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(order.id, -1)}
                          disabled={order.quantity <= 1}
                          className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-pharmacy-textSecondary hover:bg-pharmacy-canvas disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>

                        {/* Quantity Number */}
                        <span className="w-5 text-xs font-bold text-pharmacy-textPrimary select-none text-center">
                          {order.quantity}
                        </span>

                        {/* Increment Button */}
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(order.id, 1)}
                          disabled={order.quantity >= order.product.availableStock}
                          className="w-5 h-5 rounded-full bg-pharmacy-dark flex items-center justify-center text-white hover:bg-pharmacy-darkHover disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                      </div>
                    </td>

                    {/* Total Price (Dynamically Recalculated) */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-bold text-sm text-pharmacy-textPrimary">
                        $ {totalPrice}
                      </span>
                    </td>

                    {/* Expiry Date (with Warning Indicator if near expiry) */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-medium ${
                            isNearExpiry
                              ? "text-rose-600 font-semibold"
                              : "text-pharmacy-textSecondary"
                          }`}
                        >
                          {order.expiryDate}
                        </span>

                        {isNearExpiry && (
                          <span
                            className="p-1 rounded-full bg-rose-100 text-rose-600"
                            title="Near Expiry Batch (< 60 days)"
                          >
                            <AlertCircle className="w-3 h-3 stroke-[2.5]" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-pharmacy-textMuted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 stroke-[1.5] text-pharmacy-textMuted" />
                    <p className="text-sm font-semibold text-pharmacy-textPrimary">
                      No matching orders found
                    </p>
                    <p className="text-xs">Try adjusting your search query or filter</p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedFilter("All");
                      }}
                      className="mt-2 text-xs text-pharmacy-dark font-semibold underline"
                    >
                      Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination / Footer Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 mt-4 border-t border-pharmacy-borderLight text-xs text-pharmacy-textMuted">
        <div>
          Showing{" "}
          <span className="font-semibold text-pharmacy-textPrimary">
            {filteredOrders.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-pharmacy-textPrimary">
            {orders.length}
          </span>{" "}
          orders
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-pharmacy-border bg-white text-pharmacy-textSecondary hover:bg-pharmacy-canvas disabled:opacity-50 font-medium"
            disabled
          >
            Previous
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-pharmacy-dark text-white font-medium"
          >
            1
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-pharmacy-border bg-white text-pharmacy-textSecondary hover:bg-pharmacy-canvas font-medium"
          >
            2
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-pharmacy-border bg-white text-pharmacy-textSecondary hover:bg-pharmacy-canvas font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
