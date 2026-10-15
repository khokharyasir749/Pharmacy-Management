"use client";

import React, { useEffect } from "react";
import {
  X,
  Printer,
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  Download,
} from "lucide-react";
import {
  SalesProfitSummary,
  ProductProfitRecord,
  InventoryExpiryItem,
  CreditLedgerEntry,
  AuditTrailEvent,
} from "@/types/report";

interface ReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "sales" | "inventory" | "credit" | "audit";
  dateRange: string;
  salesSummary: SalesProfitSummary;
  productRecords: ProductProfitRecord[];
  inventoryItems: InventoryExpiryItem[];
  supplierLedgers: CreditLedgerEntry[];
  customerLedgers: CreditLedgerEntry[];
  auditEvents: AuditTrailEvent[];
}

export default function ReportPrintModal({
  isOpen,
  onClose,
  activeTab,
  dateRange,
  salesSummary,
  productRecords,
  inventoryItems,
  supplierLedgers,
  customerLedgers,
  auditEvents,
}: ReportPrintModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const now = new Date();
  const generatedTimestamp = `${now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} at ${now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })} PKT`;

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "sales":
        return "Sales, COGS & Gross Profit Reconciliation Report";
      case "inventory":
        return "Inventory Valuation & Batch Expiry Risk Assessment";
      case "credit":
        return "Supplier Payables & Customer Receivables Credit Ledger";
      case "audit":
        return "Security Audit Trail & Compliance Verification Log";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (fixed top) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                Print & Export Official Report
              </h2>
              <p className="text-xs text-slate-500">
                Formal pharmacy statement with ledger verification timestamp
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-xs text-slate-800 font-sans print:border-none print:shadow-none">
            {/* Pharmacy Letterhead */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-teal-900">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-teal-900 text-white flex items-center justify-center font-bold text-sm">
                    +
                  </div>
                  <h1 className="text-xl font-extrabold text-teal-950 tracking-tight">
                    PHARMACY MANAGEMENT SYSTEM (PMS)
                  </h1>
                </div>
                <p className="text-xs text-slate-500">
                  Main Healthcare Facility • License # PH-LHE-2026-904
                </p>
                <p className="text-[11px] text-slate-500">
                  Counter 1 & 2 • Central Dispensary Zone
                </p>
              </div>

              <div className="text-right sm:text-right text-[11px] space-y-1">
                <div className="font-bold text-teal-900 uppercase">
                  {getTabTitle()}
                </div>
                <div>
                  <span className="text-slate-500">Reporting Range:</span>{" "}
                  <strong>{dateRange}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Generated:</span>{" "}
                  <strong>{generatedTimestamp}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Generated By:</span>{" "}
                  <strong>Dr. Sarah Alvi (Head Pharmacist)</strong>
                </div>
              </div>
            </div>

            {/* Content Based on Active Tab */}
            {activeTab === "sales" && (
              <div className="space-y-4">
                {/* Executive Summary Cards */}
                <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Net Revenue</span>
                    <strong className="text-base font-extrabold text-teal-900">
                      {formatCurrency(salesSummary.netRevenue)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Cost of Goods (COGS)</span>
                    <strong className="text-base font-extrabold text-slate-800">
                      {formatCurrency(salesSummary.cogs)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Gross Profit</span>
                    <strong className="text-base font-extrabold text-emerald-700">
                      +{formatCurrency(salesSummary.netRevenue - salesSummary.cogs)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Gross Margin</span>
                    <strong className="text-base font-extrabold text-emerald-800">
                      {salesSummary.grossMarginPercent}%
                    </strong>
                  </div>
                </div>

                {/* Product Profit Table */}
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-700">
                    <tr>
                      <th className="p-2 border-b">Product & SKU</th>
                      <th className="p-2 border-b">Category</th>
                      <th className="p-2 border-b text-right">Units</th>
                      <th className="p-2 border-b text-right">Revenue</th>
                      <th className="p-2 border-b text-right">COGS</th>
                      <th className="p-2 border-b text-right">Profit</th>
                      <th className="p-2 border-b text-right">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {productRecords.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2 font-semibold">
                          {item.productName} ({item.sku})
                        </td>
                        <td className="p-2 text-slate-600">{item.category}</td>
                        <td className="p-2 text-right">{item.unitsSold}</td>
                        <td className="p-2 text-right font-semibold">{formatCurrency(item.revenue)}</td>
                        <td className="p-2 text-right text-slate-600">{formatCurrency(item.batchCostBasis)}</td>
                        <td className="p-2 text-right font-bold text-emerald-800">
                          +{formatCurrency(item.grossProfit)}
                        </td>
                        <td className="p-2 text-right">{item.marginPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "inventory" && (
              <div className="space-y-4">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-700">
                    <tr>
                      <th className="p-2 border-b">Medicine Name & Batch</th>
                      <th className="p-2 border-b">Location</th>
                      <th className="p-2 border-b text-right">Units</th>
                      <th className="p-2 border-b text-right">Unit Cost</th>
                      <th className="p-2 border-b text-right">Total Valuation</th>
                      <th className="p-2 border-b">Expiry</th>
                      <th className="p-2 border-b text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {inventoryItems.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2 font-semibold">
                          {item.medicineName} ({item.batchNumber})
                        </td>
                        <td className="p-2 text-slate-600">{item.branch}</td>
                        <td className="p-2 text-right">{item.availableUnits}</td>
                        <td className="p-2 text-right">{formatCurrency(item.unitCost)}</td>
                        <td className="p-2 text-right font-bold">{formatCurrency(item.totalStockValue)}</td>
                        <td className="p-2">{item.expiryDate}</td>
                        <td className="p-2 text-center font-bold">
                          {item.daysToExpiry <= 30
                            ? "CRITICAL"
                            : item.daysToExpiry <= 90
                            ? "WARNING"
                            : "SAFE"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "credit" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-teal-950 uppercase">Supplier Outstanding Balances</h3>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-700">
                    <tr>
                      <th className="p-2 border-b">Supplier Name</th>
                      <th className="p-2 border-b">Terms</th>
                      <th className="p-2 border-b text-right">Billed</th>
                      <th className="p-2 border-b text-right">Paid</th>
                      <th className="p-2 border-b text-right">Outstanding</th>
                      <th className="p-2 border-b text-center">Aging</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {supplierLedgers.map((s) => (
                      <tr key={s.id}>
                        <td className="p-2 font-semibold">{s.entityName}</td>
                        <td className="p-2 text-slate-600">{s.creditTerms}</td>
                        <td className="p-2 text-right">{formatCurrency(s.totalBilled)}</td>
                        <td className="p-2 text-right text-emerald-700">{formatCurrency(s.totalPaid)}</td>
                        <td className="p-2 text-right font-bold text-rose-700">{formatCurrency(s.outstandingBalance)}</td>
                        <td className="p-2 text-center">{s.agingStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "audit" && (
              <div className="space-y-4">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-700">
                    <tr>
                      <th className="p-2 border-b">Timestamp</th>
                      <th className="p-2 border-b">Actor</th>
                      <th className="p-2 border-b">Action</th>
                      <th className="p-2 border-b">Target Record</th>
                      <th className="p-2 border-b">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {auditEvents.map((ev) => (
                      <tr key={ev.id}>
                        <td className="p-2 whitespace-nowrap">{ev.timestamp}</td>
                        <td className="p-2 font-semibold">{ev.actor.name}</td>
                        <td className="p-2 font-mono font-bold text-[10px]">{ev.actionType}</td>
                        <td className="p-2">{ev.targetRecord}</td>
                        <td className="p-2 text-slate-600">{ev.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Official Signature Footer */}
            <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-[11px] text-slate-600">
              <div>
                <p className="font-semibold">Prepared By:</p>
                <div className="h-10 border-b border-dashed border-slate-400 mt-2" />
                <p className="mt-1 font-bold text-slate-800">Pharmacy Operations & POS Counter Staff</p>
              </div>

              <div>
                <p className="font-semibold">Verified & Approved By:</p>
                <div className="h-10 border-b border-dashed border-slate-400 mt-2" />
                <p className="mt-1 font-bold text-teal-950">Dr. Sarah Alvi (Head Pharmacist / Incharge)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer (fixed bottom) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-700" />
            <span>Ready for high-contrast thermal or A4 printing</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-colors active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
