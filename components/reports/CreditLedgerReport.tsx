"use client";

import React, { useState, useMemo } from "react";
import ModalPortal from "@/components/common/ModalPortal";
import {
  Search,
  Building2,
  Users,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  X,
  FileText,
  Printer,
  ChevronRight,
} from "lucide-react";
import { CreditLedgerEntry, LedgerInvoice, AgingStatus } from "@/types/report";

interface CreditLedgerReportProps {
  supplierLedgers: CreditLedgerEntry[];
  customerLedgers: CreditLedgerEntry[];
}

export default function CreditLedgerReport({
  supplierLedgers,
  customerLedgers,
}: CreditLedgerReportProps) {
  const [ledgerType, setLedgerType] = useState<"Supplier" | "Customer">("Supplier");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedEntryForStatement, setSelectedEntryForStatement] =
    useState<CreditLedgerEntry | null>(null);

  const activeLedgers = ledgerType === "Supplier" ? supplierLedgers : customerLedgers;

  const filteredLedgers = useMemo(() => {
    return activeLedgers.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.entityName.toLowerCase().includes(query) ||
        item.contact.toLowerCase().includes(query) ||
        item.creditTerms.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "All" || item.agingStatus === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [activeLedgers, searchQuery, selectedStatus]);

  const totalOutstanding = useMemo(() => {
    return activeLedgers.reduce((sum, item) => sum + item.outstandingBalance, 0);
  }, [activeLedgers]);

  const overdueCount = useMemo(() => {
    return activeLedgers.filter((item) => item.agingStatus !== "Current").length;
  }, [activeLedgers]);

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getAgingBadge = (status: AgingStatus) => {
    switch (status) {
      case "Current":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Current (Within Terms)
          </span>
        );
      case "Overdue 15d":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Overdue (15 Days)
          </span>
        );
      case "Overdue 30d+":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Critical Overdue (30d+)
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Toggle Switch & Summary Metric Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-pharmacy-canvas/50 border border-pharmacy-border">
        {/* Toggle between Supplier vs Customer */}
        <div className="inline-flex p-1 rounded-full bg-white border border-pharmacy-border shadow-xs text-xs">
          <button
            type="button"
            onClick={() => setLedgerType("Supplier")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold transition-all ${
              ledgerType === "Supplier"
                ? "bg-pharmacy-dark text-white shadow-pill"
                : "text-pharmacy-textSecondary hover:text-pharmacy-dark"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Supplier Payables Ledger</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                ledgerType === "Supplier"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {supplierLedgers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setLedgerType("Customer")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold transition-all ${
              ledgerType === "Customer"
                ? "bg-pharmacy-dark text-white shadow-pill"
                : "text-pharmacy-textSecondary hover:text-pharmacy-dark"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customer Receivables Ledger</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                ledgerType === "Customer"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {customerLedgers.length}
            </span>
          </button>
        </div>

        {/* Ledger Balance Quick Metric */}
        <div className="flex items-center gap-3 text-xs">
          <div>
            <span className="text-pharmacy-textMuted block text-[11px]">
              {ledgerType === "Supplier" ? "Total Accounts Payable" : "Total Accounts Receivable"}
            </span>
            <strong
              className={`text-base font-extrabold ${
                ledgerType === "Supplier" ? "text-rose-700" : "text-emerald-800"
              }`}
            >
              {formatCurrency(totalOutstanding)}
            </strong>
          </div>
          <span className="w-px h-8 bg-pharmacy-border" />
          <div>
            <span className="text-pharmacy-textMuted block text-[11px]">Overdue Accounts</span>
            <strong className="text-base font-extrabold text-amber-700">
              {overdueCount} {ledgerType === "Supplier" ? "Vendors" : "Clients"}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Search & Aging Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
          <input
            type="text"
            placeholder={`Search ${ledgerType.toLowerCase()} name, contact phone, or terms...`}
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

        {/* Aging Filter Tabs */}
        <div className="flex items-center gap-1.5 text-xs">
          {(["All", "Current", "Overdue 15d", "Overdue 30d+"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedStatus === status
                  ? "bg-pharmacy-dark text-white font-semibold shadow-xs"
                  : "bg-pharmacy-canvas text-pharmacy-textSecondary hover:text-pharmacy-dark border border-pharmacy-border"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Ledgers Table */}
      <div className="overflow-x-auto rounded-2xl border border-pharmacy-border/70">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-pharmacy-canvas/60 text-pharmacy-textSecondary font-semibold uppercase tracking-wider text-[11px] border-b border-pharmacy-border/60">
              <th className="py-3 px-4">Entity Name & Contact</th>
              <th className="py-3 px-4">Credit Terms</th>
              <th className="py-3 px-4 text-right">Total Billed</th>
              <th className="py-3 px-4 text-right">Total Settled</th>
              <th className="py-3 px-4 text-right">Outstanding Balance</th>
              <th className="py-3 px-4 text-center">Aging Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharmacy-border/40">
            {filteredLedgers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-pharmacy-textMuted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-pharmacy-textMuted/60" />
                    <p className="font-medium text-sm text-pharmacy-textSecondary">
                      No {ledgerType.toLowerCase()} records match your filter.
                    </p>
                    <p className="text-xs">Adjust your search keyword or aging status.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLedgers.map((entry) => (
                <tr
                  key={entry.id}
                  className="transition-colors hover:bg-pharmacy-canvas/40"
                >
                  {/* Entity Name & Contact */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-pharmacy-dark">{entry.entityName}</div>
                    <div className="text-[11px] text-pharmacy-textMuted mt-0.5">
                      {entry.contact}
                    </div>
                  </td>

                  {/* Credit Terms */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-medium text-pharmacy-textSecondary">
                      {entry.creditTerms}
                    </span>
                    <div className="text-[10px] text-pharmacy-textMuted">
                      Last: {entry.lastTransactionDate}
                    </div>
                  </td>

                  {/* Total Billed */}
                  <td className="py-3.5 px-4 text-right font-medium text-pharmacy-textSecondary">
                    {formatCurrency(entry.totalBilled)}
                  </td>

                  {/* Total Settled */}
                  <td className="py-3.5 px-4 text-right font-medium text-emerald-700">
                    {formatCurrency(entry.totalPaid)}
                  </td>

                  {/* Outstanding Balance */}
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`text-sm font-extrabold ${
                        entry.outstandingBalance > 0
                          ? ledgerType === "Supplier"
                            ? "text-rose-600"
                            : "text-amber-800"
                          : "text-emerald-700"
                      }`}
                    >
                      {formatCurrency(entry.outstandingBalance)}
                    </span>
                  </td>

                  {/* Aging Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {getAgingBadge(entry.agingStatus)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedEntryForStatement(entry)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-pharmacy-border bg-white hover:bg-pharmacy-canvas text-pharmacy-dark font-medium transition-all shadow-xs text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-700" />
                      <span>Statement</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Statement Breakdown Preview Modal */}
      <ModalPortal isOpen={!!selectedEntryForStatement} onClose={() => setSelectedEntryForStatement(null)}>
        {selectedEntryForStatement && (
          <div
            className="relative w-full max-w-xl max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-pharmacy-canvas/60 border-b border-pharmacy-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-pharmacy-dark">
                  Statement Breakdown • {selectedEntryForStatement.entityName}
                </h3>
                <p className="text-xs text-pharmacy-textMuted">
                  {selectedEntryForStatement.type} Ledger • Terms: {selectedEntryForStatement.creditTerms}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntryForStatement(null)}
                className="p-1 rounded-full hover:bg-pharmacy-border text-pharmacy-textMuted hover:text-pharmacy-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-pharmacy-canvas/40 border border-pharmacy-border text-center">
                <div>
                  <span className="text-pharmacy-textMuted text-[10px] block">TOTAL BILLED</span>
                  <strong className="text-sm font-bold text-pharmacy-dark">
                    {formatCurrency(selectedEntryForStatement.totalBilled)}
                  </strong>
                </div>
                <div>
                  <span className="text-pharmacy-textMuted text-[10px] block">TOTAL SETTLED</span>
                  <strong className="text-sm font-bold text-emerald-700">
                    {formatCurrency(selectedEntryForStatement.totalPaid)}
                  </strong>
                </div>
                <div>
                  <span className="text-pharmacy-textMuted text-[10px] block">OUTSTANDING BALANCE</span>
                  <strong className="text-sm font-extrabold text-rose-600">
                    {formatCurrency(selectedEntryForStatement.outstandingBalance)}
                  </strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-pharmacy-dark text-xs mb-2">Itemized Invoices & Vouchers</h4>
                <div className="rounded-xl border border-pharmacy-border overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-pharmacy-canvas/50 text-[10px] uppercase font-bold text-pharmacy-textSecondary">
                      <tr>
                        <th className="p-2.5">Invoice #</th>
                        <th className="p-2.5">Issue Date</th>
                        <th className="p-2.5">Due Date</th>
                        <th className="p-2.5 text-right">Amount</th>
                        <th className="p-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pharmacy-border/40">
                      {selectedEntryForStatement.invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-pharmacy-canvas/30">
                          <td className="p-2.5 font-mono font-bold text-pharmacy-dark">{inv.id}</td>
                          <td className="p-2.5 text-pharmacy-textSecondary">{inv.date}</td>
                          <td className="p-2.5 text-pharmacy-textSecondary">{inv.dueDate}</td>
                          <td className="p-2.5 text-right font-bold">{formatCurrency(inv.amount)}</td>
                          <td className="p-2.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                inv.status === "Paid"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-pharmacy-canvas/60 border-t border-pharmacy-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-pharmacy-border text-xs font-semibold hover:bg-white"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Statement</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedEntryForStatement(null)}
                className="px-5 py-1.5 rounded-full bg-pharmacy-dark text-white text-xs font-semibold hover:bg-pharmacy-darkHover"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </ModalPortal>
    </div>
  );
}
