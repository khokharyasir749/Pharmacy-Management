"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  Download,
  Printer,
  Calendar,
  Layers,
  Shield,
  FileText,
  Package,
  Building2,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
} from "lucide-react";
import SalesProfitReport from "@/components/reports/SalesProfitReport";
import InventoryExpiryReport from "@/components/reports/InventoryExpiryReport";
import CreditLedgerReport from "@/components/reports/CreditLedgerReport";
import AuditTrailTable from "@/components/reports/AuditTrailTable";
import ReportPrintModal from "@/components/reports/ReportPrintModal";
import {
  mockSalesSummary,
  mockProductProfitRecords,
  mockInventoryExpiryItems,
  mockSupplierLedgers,
  mockCustomerLedgers,
  mockAuditTrailEvents,
} from "@/data/mockReports";

type ReportTab = "sales" | "inventory" | "credit" | "audit";

const DATE_RANGE_OPTIONS = [
  "Today",
  "Last 7 Days",
  "This Month",
  "Last Quarter",
  "Custom Range",
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("sales");
  const [dateRange, setDateRange] = useState("This Month");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Executive KPI Calculations
  const netSalesRevenue = mockSalesSummary.netRevenue;
  const grossProfit = mockSalesSummary.netRevenue - mockSalesSummary.cogs;
  const grossMargin = mockSalesSummary.grossMarginPercent;

  const inventoryAssetValuation = useMemo(() => {
    return mockInventoryExpiryItems.reduce(
      (sum, item) => sum + item.totalStockValue,
      0
    );
  }, []);

  const totalAuditEventsCount = mockAuditTrailEvents.length;

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Functional CSV Downloader for the currently active tab
  const handleExportCSV = () => {
    let filename = "";
    let csvContent = "";

    if (activeTab === "sales") {
      filename = `sales_profit_report_${dateRange.replace(/\s+/g, "_").toLowerCase()}.csv`;
      const headers = [
        "Product Name",
        "SKU",
        "Category",
        "Form",
        "Units Sold",
        "Revenue",
        "COGS Cost Basis",
        "Gross Profit",
        "Margin Percent",
      ];
      const rows = mockProductProfitRecords.map((r) => [
        `"${r.productName}"`,
        r.sku,
        `"${r.category}"`,
        `"${r.form}"`,
        r.unitsSold,
        r.revenue,
        r.batchCostBasis,
        r.grossProfit,
        `${r.marginPercent}%`,
      ]);
      csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    } else if (activeTab === "inventory") {
      filename = `inventory_expiry_report_${dateRange.replace(/\s+/g, "_").toLowerCase()}.csv`;
      const headers = [
        "SKU",
        "Medicine Name",
        "Generic Formula",
        "Batch",
        "Location",
        "Available Units",
        "Unit Cost",
        "Total Valuation",
        "Expiry Date",
        "Days to Expiry",
        "Risk Level",
      ];
      const rows = mockInventoryExpiryItems.map((i) => [
        i.sku,
        `"${i.medicineName}"`,
        `"${i.genericName}"`,
        i.batchNumber,
        `"${i.branch}"`,
        i.availableUnits,
        i.unitCost,
        i.totalStockValue,
        i.expiryDate,
        i.daysToExpiry,
        i.riskLevel,
      ]);
      csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    } else if (activeTab === "credit") {
      filename = `credit_ledgers_${dateRange.replace(/\s+/g, "_").toLowerCase()}.csv`;
      const headers = [
        "Type",
        "Entity Name",
        "Contact",
        "Credit Terms",
        "Total Billed",
        "Total Settled",
        "Outstanding Balance",
        "Aging Status",
      ];
      const supplierRows = mockSupplierLedgers.map((s) => [
        "Supplier",
        `"${s.entityName}"`,
        `"${s.contact}"`,
        `"${s.creditTerms}"`,
        s.totalBilled,
        s.totalPaid,
        s.outstandingBalance,
        s.agingStatus,
      ]);
      const customerRows = mockCustomerLedgers.map((c) => [
        "Customer",
        `"${c.entityName}"`,
        `"${c.contact}"`,
        `"${c.creditTerms}"`,
        c.totalBilled,
        c.totalPaid,
        c.outstandingBalance,
        c.agingStatus,
      ]);
      csvContent = [headers.join(","), ...[...supplierRows, ...customerRows].map((row) => row.join(","))].join("\n");
    } else {
      filename = `security_audit_trail_${dateRange.replace(/\s+/g, "_").toLowerCase()}.csv`;
      const headers = [
        "Event ID",
        "Timestamp",
        "Actor Name",
        "Actor Role",
        "Action Type",
        "Target Entity",
        "Justification Reason",
        "IP Address",
      ];
      const rows = mockAuditTrailEvents.map((e) => [
        e.id,
        `"${e.timestamp}"`,
        `"${e.actor.name}"`,
        `"${e.actor.role}"`,
        e.actionType,
        `"${e.targetRecord}"`,
        `"${e.reason}"`,
        e.ipAddress,
      ]);
      csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    }

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(`CSV export "${filename}" generated and downloaded successfully!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="space-y-6 pb-6 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 max-w-md bg-white border border-teal-200 rounded-2xl p-4 shadow-floating flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="p-1 rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold text-pharmacy-dark flex-1">
            {toastMessage}
          </span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-pharmacy-textMuted hover:text-pharmacy-textPrimary p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Title & Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-pharmacy-dark">
            Reports & Financial Analytics
          </h1>
          <p className="text-xs sm:text-sm text-pharmacy-textMuted mt-0.5">
            Reconcile daily pharmacy sales, cost of goods sold (COGS), gross margins, supplier ledgers, and immutable audit logs.
          </p>
        </div>

        {/* Right Action Toolbar */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Date Range Selector Pill */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-full border border-pharmacy-border bg-white text-xs font-semibold text-pharmacy-dark focus:outline-none shadow-xs cursor-pointer appearance-none"
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  📅 {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-pharmacy-textMuted">
              ▼
            </div>
          </div>

          {/* Secondary Action: Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-pharmacy-border bg-white hover:bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textSecondary transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-teal-800" />
            <span>Export CSV</span>
          </button>

          {/* Primary CTA: Dark teal pill button #0B2B28 */}
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white font-medium text-xs sm:text-sm shadow-pill hover:shadow-lg transition-all duration-200 group active:scale-95 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Printer className="w-3.5 h-3.5" />
            </div>
            <span>Print Report / PDF</span>
          </button>
        </div>
      </div>

      {/* Top Executive KPI Cards (4-Column Grid) */}
      <section
        aria-label="Executive Financial Metrics"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Net Sales Revenue */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Net Sales Revenue
            </span>
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-teal-900 tracking-tight">
              {formatCurrency(netSalesRevenue)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700">
              <TrendingUp className="w-3 h-3" />
              <span>Gross sales net of discounts & returns</span>
            </div>
          </div>
        </div>

        {/* Card 2: Gross Profit & Margin */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Gross Profit & Margin
            </span>
            <div className="p-2 rounded-2xl bg-teal-50 text-teal-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-teal-950 tracking-tight">
              {formatCurrency(grossProfit)}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                +{grossMargin}% margin
              </span>
              <span className="text-[11px] text-pharmacy-textMuted">vs COGS</span>
            </div>
          </div>
        </div>

        {/* Card 3: Inventory Asset Value */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Inventory Asset Value
            </span>
            <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-indigo-950 tracking-tight">
              {formatCurrency(inventoryAssetValuation)}
            </div>
            <div className="text-[11px] text-pharmacy-textMuted mt-1">
              Cost basis valuation of active batches
            </div>
          </div>
        </div>

        {/* Card 4: Total Audit Events */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Total Audit Events
            </span>
            <div className="p-2 rounded-2xl bg-purple-50 text-purple-700">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-purple-950 tracking-tight">
              {totalAuditEventsCount}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-purple-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Immutable transactions logged</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main 4-Tab Reporting Hub Container */}
      <section
        aria-label="Multi-Tab Reporting Hub"
        className="bg-white rounded-3xl p-6 shadow-card border border-pharmacy-border/60"
      >
        {/* Tab Selection Bar */}
        <div className="flex items-center gap-2 pb-5 border-b border-pharmacy-borderLight overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("sales")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "sales"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Sales & Profit Reconciliation</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === "sales"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {mockProductProfitRecords.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "inventory"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory & Expiry Forecast</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === "inventory"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {mockInventoryExpiryItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("credit")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "credit"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Credit Ledgers (Payables & Receivables)</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === "credit"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {mockSupplierLedgers.length + mockCustomerLedgers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "audit"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security Audit Trail & Access Logs</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === "audit"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {mockAuditTrailEvents.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Sales & Profit Reconciliation */}
        {activeTab === "sales" && (
          <div className="mt-5">
            <SalesProfitReport
              summary={mockSalesSummary}
              productRecords={mockProductProfitRecords}
            />
          </div>
        )}

        {/* Tab 2: Inventory & Expiry Forecast */}
        {activeTab === "inventory" && (
          <div className="mt-5">
            <InventoryExpiryReport items={mockInventoryExpiryItems} />
          </div>
        )}

        {/* Tab 3: Credit Ledgers */}
        {activeTab === "credit" && (
          <div className="mt-5">
            <CreditLedgerReport
              supplierLedgers={mockSupplierLedgers}
              customerLedgers={mockCustomerLedgers}
            />
          </div>
        )}

        {/* Tab 4: Security Audit Trail */}
        {activeTab === "audit" && (
          <div className="mt-5">
            <AuditTrailTable events={mockAuditTrailEvents} />
          </div>
        )}
      </section>

      {/* Print / PDF Export Modal */}
      <ReportPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        activeTab={activeTab}
        dateRange={dateRange}
        salesSummary={mockSalesSummary}
        productRecords={mockProductProfitRecords}
        inventoryItems={mockInventoryExpiryItems}
        supplierLedgers={mockSupplierLedgers}
        customerLedgers={mockCustomerLedgers}
        auditEvents={mockAuditTrailEvents}
      />
    </div>
  );
}
