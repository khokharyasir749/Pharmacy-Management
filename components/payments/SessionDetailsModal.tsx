"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import ModalPortal from "@/components/common/ModalPortal";
import {
  X,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Calendar,
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Receipt,
  Smartphone,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { RegisterSession } from "@/types/payment";

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: RegisterSession | null;
}

export default function SessionDetailsModal({
  isOpen,
  onClose,
  session,
}: SessionDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !session) return null;

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const isActive = session.status === "Active";
  const totalSalesAllTenders =
    session.cashSales + session.cardSales + session.digitalSales;

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (fixed top) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-slate-800">
                  Session Breakdown & Reconciliation
                </h2>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE SESSION
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    CLOSED & AUDITED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {session.id} • {session.branch}
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Cashier & Timestamps info bar */}
          <div className="p-4 rounded-2xl bg-pharmacy-canvas/40 border border-pharmacy-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white border border-pharmacy-border flex-shrink-0">
                <Image
                  src={session.cashierAvatar}
                  alt={session.cashierName}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <div className="font-bold text-pharmacy-dark text-sm">
                  {session.cashierName}
                </div>
                <div className="text-pharmacy-textMuted text-[11px]">
                  Counter Operator • {session.totalTransactions} customer transactions
                </div>
              </div>
            </div>

            <div className="text-[11px] space-y-0.5 text-right sm:text-right text-pharmacy-textSecondary">
              <div>
                <span className="text-pharmacy-textMuted">Opened:</span> {session.openedAt}
              </div>
              {session.closedAt && (
                <div>
                  <span className="text-pharmacy-textMuted">Closed:</span> {session.closedAt}
                </div>
              )}
            </div>
          </div>

          {/* Gross Sales Breakdown by Tender */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Sales by Tender / Payment Method
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
                  <span>Cash Sales</span>
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-lg font-bold text-emerald-950 mt-1">
                  {formatCurrency(session.cashSales)}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-indigo-800 font-semibold">
                  <span>Credit/Debit Cards</span>
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="text-lg font-bold text-indigo-950 mt-1">
                  {formatCurrency(session.cardSales)}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-purple-800 font-semibold">
                  <span>Digital / Bank</span>
                  <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-lg font-bold text-purple-950 mt-1">
                  {formatCurrency(session.digitalSales)}
                </div>
              </div>
            </div>
            <div className="text-right text-xs font-medium text-pharmacy-textSecondary">
              Gross Shift Turnover: <strong className="text-pharmacy-dark">{formatCurrency(totalSalesAllTenders)}</strong>
            </div>
          </div>

          {/* Cash Drawer Reconciliation Summary */}
          <div className="rounded-2xl border border-pharmacy-border bg-pharmacy-canvas/30 p-4 space-y-2.5 text-xs">
            <h4 className="font-bold text-pharmacy-dark text-xs uppercase tracking-wider pb-1.5 border-b border-pharmacy-borderLight">
              Physical Cash Drawer Reconciliation
            </h4>

            <div className="space-y-1.5 text-pharmacy-dark">
              <div className="flex justify-between items-center">
                <span className="text-pharmacy-textSecondary">Base Opening Float:</span>
                <span className="font-semibold">{formatCurrency(session.openingFloat)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-700">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  (+) Counter Cash Sales:
                </span>
                <span className="font-semibold">+{formatCurrency(session.cashSales)}</span>
              </div>
              <div className="flex justify-between items-center text-rose-600">
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  (-) Sales Cash Refunds:
                </span>
                <span className="font-semibold">-{formatCurrency(session.cashRefunds)}</span>
              </div>
              <div className="flex justify-between items-center text-amber-700">
                <span className="flex items-center gap-1">
                  <Receipt className="w-3 h-3" />
                  (-) Operational Expenses Paid from Drawer:
                </span>
                <span className="font-semibold">-{formatCurrency(session.drawerExpenses)}</span>
              </div>

              <div className="border-t border-pharmacy-border pt-2 flex justify-between items-center font-bold text-sm bg-white p-2.5 rounded-xl border border-pharmacy-border/60">
                <span className="text-pharmacy-dark">(=) System Expected Cash:</span>
                <span className="text-base text-teal-900">{formatCurrency(session.expectedCash)}</span>
              </div>

              <div className="flex justify-between items-center font-semibold text-xs p-2 rounded-xl bg-pharmacy-canvas border border-pharmacy-border">
                <span className="text-pharmacy-textSecondary">Physical Cash Counted:</span>
                <span>
                  {session.countedCash !== undefined ? (
                    <strong className="text-pharmacy-dark text-sm">
                      {formatCurrency(session.countedCash)}
                    </strong>
                  ) : (
                    <span className="text-amber-700 italic">Pending Shift Closing</span>
                  )}
                </span>
              </div>

              {session.variance !== undefined && (
                <div
                  className={`flex justify-between items-center p-2.5 rounded-xl border font-bold text-xs ${
                    session.variance === 0
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : session.variance < 0
                      ? "bg-rose-50 border-rose-200 text-rose-900"
                      : "bg-amber-50 border-amber-200 text-amber-900"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {session.variance === 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    Reconciliation Variance:
                  </span>
                  <span>
                    {session.variance === 0
                      ? "$0.00 (Balanced)"
                      : session.variance < 0
                      ? `-${formatCurrency(Math.abs(session.variance))} (Shortage)`
                      : `+${formatCurrency(session.variance)} (Surplus)`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Variance Reason or Session Notes */}
          {(session.varianceReason || session.notes) && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              {session.varianceReason && (
                <div>
                  <span className="font-bold text-slate-700">Variance Audit Note:</span>{" "}
                  <span className="text-slate-600">{session.varianceReason}</span>
                </div>
              )}
              {session.notes && (
                <div>
                  <span className="font-bold text-slate-700">Handover / Shift Remarks:</span>{" "}
                  <span className="text-slate-600">{session.notes}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer (fixed bottom) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Shift Audit Slip</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
