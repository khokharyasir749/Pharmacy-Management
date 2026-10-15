"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  Truck,
  Eye,
  PackageCheck,
  Building2,
  Calendar,
  DollarSign,
  ChevronDown,
  Check,
} from "lucide-react";
import { PurchaseOrder, POStatus } from "@/types/purchase";

interface PurchaseOrdersTableProps {
  orders: PurchaseOrder[];
  onReceiveGoods?: (poId: string) => void;
}

export default function PurchaseOrdersTable({
  orders,
  onReceiveGoods,
}: PurchaseOrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((po) => {
      const matchesSearch =
        po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.invoiceRef.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || po.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatus]);

  const getStatusBadge = (status: POStatus) => {
    switch (status) {
      case "Received":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/60";
      case "Submitted":
        return "bg-sky-50 text-sky-800 border-sky-200/60";
      case "Draft":
        return "bg-amber-50 text-amber-800 border-amber-200/60";
      case "Cancelled":
        return "bg-rose-50 text-rose-800 border-rose-200/60";
      default:
        return "bg-slate-50 text-slate-800 border-slate-200/60";
    }
  };

  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case "Paid":
        return "text-emerald-700 bg-emerald-50";
      case "Partial":
        return "text-amber-700 bg-amber-50";
      default:
        return "text-rose-700 bg-rose-50";
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pharmacy-borderLight">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold tracking-tight text-pharmacy-dark">
              Purchase Orders & Goods Receipts (GRN)
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pharmacy-canvas text-pharmacy-textSecondary">
              {filteredOrders.length} orders
            </span>
          </div>
          <p className="text-xs text-pharmacy-textMuted mt-0.5">
            Incoming lot shipments, vendor delivery inspection, and supplier invoices
          </p>
        </div>

        {/* Toolbar: Search and Filter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-pharmacy-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PO#, supplier, invoice..."
              className="h-10 pl-10 pr-4 bg-[#F5FAF8] border border-pharmacy-border/80 rounded-full text-xs sm:text-sm text-pharmacy-textPrimary placeholder:text-pharmacy-textMuted focus:outline-none focus:ring-2 focus:ring-pharmacy-textPrimary/20 focus:border-pharmacy-textPrimary/30 transition-all w-52 sm:w-64 shadow-xs"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="h-10 px-4 rounded-full border border-pharmacy-border/80 bg-white hover:bg-pharmacy-canvas text-xs sm:text-sm font-semibold text-pharmacy-textSecondary flex items-center gap-2 transition-all shadow-xs"
            >
              <Filter className="w-3.5 h-3.5 text-pharmacy-textMuted stroke-[2.2]" />
              <span>{selectedStatus === "All" ? "Status" : selectedStatus}</span>
              <ChevronDown className="w-3.5 h-3.5 text-pharmacy-textMuted" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-floating border border-pharmacy-border p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                {["All", "Received", "Submitted", "Draft", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(status);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between transition-colors ${
                      selectedStatus === status
                        ? "bg-pharmacy-mintLight text-pharmacy-textPrimary font-semibold"
                        : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
                    }`}
                  >
                    <span>{status}</span>
                    {selectedStatus === status && (
                      <Check className="w-3 h-3 text-teal-800" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Canvas with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="border-b border-pharmacy-borderLight text-xs font-semibold text-pharmacy-textSecondary/90 select-none">
              <th className="py-3.5 px-4">PO Number & Date</th>
              <th className="py-3.5 px-4">Distributor / Supplier</th>
              <th className="py-3.5 px-4">Items & Batches</th>
              <th className="py-3.5 px-4">Invoice Ref</th>
              <th className="py-3.5 px-4">Total Amount</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-pharmacy-borderLight text-sm">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((po) => {
                const totalItemsCount = po.items.reduce(
                  (sum, it) => sum + it.orderedQuantity,
                  0
                );
                const isPendingReceiving =
                  po.status === "Submitted" || po.status === "Draft";

                return (
                  <tr
                    key={po.id}
                    className="hover:bg-[#FAFDFC] transition-colors duration-150"
                  >
                    {/* PO Number & Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-pharmacy-dark font-mono">
                          {po.poNumber}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-pharmacy-textMuted">
                          <Calendar className="w-3 h-3 text-pharmacy-textMuted" />
                          <span>{po.orderDate}</span>
                        </div>
                      </div>
                    </td>

                    {/* Supplier */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-pharmacy-textPrimary">
                          {po.supplierName}
                        </span>
                        <span className="text-[11px] text-pharmacy-textMuted">
                          {po.supplierContact}
                        </span>
                      </div>
                    </td>

                    {/* Items & Batches */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-xs text-pharmacy-textPrimary">
                          {po.items.length} Product{po.items.length > 1 ? "s" : ""} &bull; {totalItemsCount} Units
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          {po.items.slice(0, 2).map((it) => (
                            <span
                              key={it.id}
                              className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-pharmacy-canvas text-pharmacy-textSecondary border border-pharmacy-border/50"
                            >
                              {it.batchNumber}
                            </span>
                          ))}
                          {po.items.length > 2 && (
                            <span className="text-[10px] text-pharmacy-textMuted font-mono">
                              +{po.items.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Invoice Ref */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {po.invoiceRef}
                      </span>
                    </td>

                    {/* Total Cost */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-pharmacy-dark">
                          ${po.totalCost.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-pharmacy-textMuted">
                          Paid: ${po.paidAmount.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPaymentBadge(
                          po.paymentStatus
                        )}`}
                      >
                        {po.paymentStatus}
                      </span>
                    </td>

                    {/* PO Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          po.status
                        )}`}
                      >
                        {po.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Receive Goods GRN CTA */}
                        {isPendingReceiving && onReceiveGoods && (
                          <button
                            type="button"
                            onClick={() => onReceiveGoods(po.id)}
                            className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                            title="Receive Goods and update batch inventory"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Receive</span>
                          </button>
                        )}

                        {/* View Invoice Details */}
                        <button
                          type="button"
                          onClick={() => setSelectedPO(po)}
                          className="p-1.5 rounded-lg text-pharmacy-textSecondary hover:bg-pharmacy-canvas hover:text-pharmacy-dark transition-colors"
                          title="View Invoice & Line Items"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-pharmacy-textMuted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Truck className="w-8 h-8 stroke-[1.5] text-pharmacy-textMuted" />
                    <p className="text-sm font-semibold text-pharmacy-textPrimary">
                      No purchase orders match this filter
                    </p>
                    <p className="text-xs">Adjust your search query or reset status</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Details Dialog Modal */}
      {selectedPO && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedPO(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
              <div>
                <h3 className="text-lg font-bold text-pharmacy-dark">
                  Purchase Order: {selectedPO.poNumber}
                </h3>
                <p className="text-xs text-pharmacy-textMuted">
                  {selectedPO.supplierName} &bull; Bill Ref: {selectedPO.invoiceRef}
                </p>
              </div>
              <button
                onClick={() => setSelectedPO(null)}
                className="p-1 rounded-full text-pharmacy-textMuted hover:bg-pharmacy-canvas"
              >
                ✕
              </button>
            </div>

            {/* Line items list */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {selectedPO.items.map((it) => (
                <div
                  key={it.id}
                  className="p-3 rounded-2xl border border-pharmacy-border/80 flex items-center justify-between bg-pharmacy-canvas/30"
                >
                  <div>
                    <div className="font-bold text-xs text-pharmacy-textPrimary">
                      {it.medicineName} ({it.dosage})
                    </div>
                    <div className="text-[11px] text-pharmacy-textMuted mt-0.5">
                      Batch: <span className="font-mono">{it.batchNumber}</span> &bull; Exp: {it.expiryDate}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-sm text-pharmacy-dark">
                      ${it.totalCost.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-pharmacy-textMuted">
                      {it.orderedQuantity} ordered (+{it.freeQuantity} free) &times; ${it.unitCost.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Summary */}
            <div className="p-3 rounded-2xl bg-[#F6FAF8] border border-pharmacy-border space-y-1 text-xs">
              <div className="flex justify-between text-pharmacy-textSecondary">
                <span>Subtotal:</span>
                <span className="font-semibold">${selectedPO.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-pharmacy-textSecondary">
                <span>Tax / Freight:</span>
                <span className="font-semibold">${selectedPO.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-pharmacy-dark pt-1 border-t border-pharmacy-borderLight">
                <span>Total Payable:</span>
                <span className="text-teal-900">${selectedPO.totalCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPO(null)}
                className="px-5 py-2 rounded-full bg-pharmacy-dark text-white text-xs font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
