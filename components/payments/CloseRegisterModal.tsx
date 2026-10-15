"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Lock,
  DollarSign,
  Receipt,
  Calculator,
  ArrowRight,
  Printer,
  FileCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { RegisterSession } from "@/types/payment";

interface CloseRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: RegisterSession | null;
  onSessionClosed: (closedSession: RegisterSession) => void;
}

export default function CloseRegisterModal({
  isOpen,
  onClose,
  session,
  onSessionClosed,
}: CloseRegisterModalProps) {
  const [countedCashInput, setCountedCashInput] = useState<string>("");
  const [varianceReason, setVarianceReason] = useState("");
  const [closingNotes, setClosingNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessSummaryOpen, setIsSuccessSummaryOpen] = useState(false);
  const [finalClosedRecord, setFinalClosedRecord] = useState<RegisterSession | null>(null);

  // Reset or preset when session opens
  useEffect(() => {
    if (session) {
      setCountedCashInput("");
      setVarianceReason("");
      setClosingNotes("");
      setErrorMessage(null);
      setIsSuccessSummaryOpen(false);
      setFinalClosedRecord(null);
    }
  }, [session, isOpen]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSuccessSummaryOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isSuccessSummaryOpen]);

  if (!isOpen || !session) return null;

  const expectedCash = session.expectedCash;
  const parsedCountedCash =
    countedCashInput === "" ? undefined : parseFloat(countedCashInput) || 0;

  const variance =
    parsedCountedCash !== undefined ? parsedCountedCash - expectedCash : undefined;

  const hasVariance = variance !== undefined && Math.abs(variance) > 0.001;

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleConfirmClose = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (parsedCountedCash === undefined || isNaN(parsedCountedCash)) {
      setErrorMessage("Please enter the total physical cash counted in drawer.");
      return;
    }

    if (parsedCountedCash < 0) {
      setErrorMessage("Counted cash cannot be negative.");
      return;
    }

    if (hasVariance && !varianceReason.trim()) {
      setErrorMessage(
        "A variance reason is mandatory because physical cash does not match system expected cash."
      );
      return;
    }

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}, ${now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })} PKT`;

    const closed: RegisterSession = {
      ...session,
      closedAt: formattedDate,
      countedCash: parsedCountedCash,
      variance: variance || 0,
      status: "Closed",
      varianceReason: hasVariance ? varianceReason.trim() : "Reconciled with zero variance.",
      notes: closingNotes.trim() || session.notes,
    };

    setFinalClosedRecord(closed);
    setIsSuccessSummaryOpen(true);
    onSessionClosed(closed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden my-auto border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (fixed top) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                {isSuccessSummaryOpen
                  ? "Register Session Closed & Reconciled"
                  : "Close Register & End Shift"}
              </h2>
              <p className="text-xs text-slate-500">
                Session ID: <strong className="text-slate-800">{session.id}</strong> • {session.branch}
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
        <div className="flex-1 overflow-hidden flex flex-col">
          {isSuccessSummaryOpen && finalClosedRecord ? (
            /* Closing Summary Receipt View */
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="p-6 overflow-y-auto flex-1 space-y-5 animate-in zoom-in-95 duration-150">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-emerald-900">
                    Register Shift Successfully Closed
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Cash drawer has been reconciled and locked. The audit record is timestamped and archived.
                  </p>
                </div>
              </div>

              {/* Printable Closing Receipt Ticket */}
              <div className="border border-dashed border-pharmacy-border rounded-2xl p-5 bg-pharmacy-canvas/30 space-y-4 font-mono text-xs text-pharmacy-dark">
                <div className="text-center pb-3 border-b border-pharmacy-border space-y-1">
                  <h3 className="font-bold text-sm tracking-wider uppercase">
                    PHARMACY MANAGEMENT SYSTEM
                  </h3>
                  <p className="text-[11px] text-pharmacy-textMuted">DAILY SHIFT RECONCILIATION SLIP</p>
                  <p className="text-[10px] text-pharmacy-textMuted">
                    {finalClosedRecord.closedAt}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-pharmacy-textMuted">Register ID:</span>{" "}
                    <strong>{finalClosedRecord.id}</strong>
                  </div>
                  <div>
                    <span className="text-pharmacy-textMuted">Branch:</span>{" "}
                    <strong>{finalClosedRecord.branch}</strong>
                  </div>
                  <div>
                    <span className="text-pharmacy-textMuted">Cashier:</span>{" "}
                    <strong>{finalClosedRecord.cashierName}</strong>
                  </div>
                  <div>
                    <span className="text-pharmacy-textMuted">Transactions:</span>{" "}
                    <strong>{finalClosedRecord.totalTransactions}</strong>
                  </div>
                </div>

                <div className="border-t border-pharmacy-border pt-3 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span>Base Opening Float:</span>
                    <span>{formatCurrency(finalClosedRecord.openingFloat)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>(+) Counter Cash Sales:</span>
                    <span>+{formatCurrency(finalClosedRecord.cashSales)}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>(-) Cash Sales Refunds:</span>
                    <span>-{formatCurrency(finalClosedRecord.cashRefunds)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>(-) Cash Drawer Expenses:</span>
                    <span>-{formatCurrency(finalClosedRecord.drawerExpenses)}</span>
                  </div>
                  <div className="border-t border-dashed border-pharmacy-border pt-1.5 flex justify-between font-bold text-xs">
                    <span>System Expected Cash:</span>
                    <span>{formatCurrency(finalClosedRecord.expectedCash)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs bg-pharmacy-canvas p-1.5 rounded">
                    <span>Physical Cash Counted:</span>
                    <span>{formatCurrency(finalClosedRecord.countedCash || 0)}</span>
                  </div>
                  <div
                    className={`flex justify-between font-bold text-xs p-1.5 rounded ${
                      finalClosedRecord.variance === 0
                        ? "bg-emerald-100 text-emerald-900"
                        : (finalClosedRecord.variance || 0) < 0
                        ? "bg-rose-100 text-rose-900"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    <span>Final Shift Variance:</span>
                    <span>
                      {finalClosedRecord.variance === 0
                        ? "$0.00 (Balanced)"
                        : (finalClosedRecord.variance || 0) < 0
                        ? `-${formatCurrency(Math.abs(finalClosedRecord.variance || 0))} (Shortage)`
                        : `+${formatCurrency(finalClosedRecord.variance || 0)} (Surplus)`}
                    </span>
                  </div>
                </div>

                {finalClosedRecord.varianceReason && (
                  <div className="border-t border-dashed border-pharmacy-border pt-2 text-[10px] text-pharmacy-textMuted">
                    <strong>Variance Reason:</strong> {finalClosedRecord.varianceReason}
                  </div>
                )}
              </div>

              {/* Sticky Footer for Success View */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Shift Slip</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 shadow-sm transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Close Shift Input Form */
            <form onSubmit={handleConfirmClose} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Cashier & Session Info Chip */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-pharmacy-canvas/50 border border-pharmacy-border text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white border border-pharmacy-border">
                    <Image
                      src={session.cashierAvatar}
                      alt={session.cashierName}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <div>
                    <span className="text-pharmacy-textMuted">Active Cashier:</span>{" "}
                    <strong className="text-pharmacy-dark">{session.cashierName}</strong>
                  </div>
                </div>
                <div className="text-pharmacy-textMuted">
                  Started: <span className="text-pharmacy-dark font-medium">{session.openedAt}</span>
                </div>
              </div>

              {/* Shift Cash Flow Breakdown Calculation Card */}
              <div className="rounded-2xl border border-pharmacy-border bg-pharmacy-canvas/30 p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between font-semibold text-pharmacy-textSecondary pb-2 border-b border-pharmacy-borderLight">
                  <span>Shift Drawer Breakdown (Audit Trail)</span>
                  <span className="text-[11px] text-pharmacy-textMuted font-mono">Real-time</span>
                </div>

                <div className="space-y-1.5 text-pharmacy-dark">
                  <div className="flex justify-between items-center">
                    <span className="text-pharmacy-textSecondary">Base Opening Float:</span>
                    <span className="font-semibold">{formatCurrency(session.openingFloat)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-700">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      (+) Counter Cash Sales:
                    </span>
                    <span className="font-semibold">+{formatCurrency(session.cashSales)}</span>
                  </div>
                  <div className="flex justify-between items-center text-rose-600">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      (-) Sales Cash Refunds:
                    </span>
                    <span className="font-semibold">-{formatCurrency(session.cashRefunds)}</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-700">
                    <span className="flex items-center gap-1">
                      <Receipt className="w-3.5 h-3.5" />
                      (-) Cash Drawer Expenses:
                    </span>
                    <span className="font-semibold">-{formatCurrency(session.drawerExpenses)}</span>
                  </div>

                  <div className="border-t border-pharmacy-border pt-2 flex justify-between items-center font-bold text-sm bg-white p-2.5 rounded-xl border border-pharmacy-border/60">
                    <span className="text-pharmacy-dark">(=) System Expected Cash:</span>
                    <span className="text-base text-teal-900">{formatCurrency(expectedCash)}</span>
                  </div>
                </div>
              </div>

              {/* Physical Cash Count Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-pharmacy-dark uppercase tracking-wider">
                  Physical Cash Counted in Drawer ($) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter total physical count e.g. 1980.50"
                    value={countedCashInput}
                    onChange={(e) => setCountedCashInput(e.target.value)}
                    required
                    className="w-full pl-9 pr-24 py-3 rounded-2xl border border-pharmacy-border bg-white text-base font-bold text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 transition-all placeholder:text-pharmacy-textMuted/60"
                  />
                  {countedCashInput !== "" && (
                    <button
                      type="button"
                      onClick={() => setCountedCashInput(expectedCash.toFixed(2))}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-pharmacy-canvas text-[11px] font-semibold text-pharmacy-textSecondary hover:text-pharmacy-dark border border-pharmacy-border"
                    >
                      Match Expected
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-pharmacy-textMuted">
                  Carefully count all currency notes and coins before submission.
                </p>
              </div>

              {/* Real-time Variance Calculation Banner */}
              {parsedCountedCash !== undefined && (
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    variance === 0
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : (variance || 0) < 0
                      ? "bg-rose-50 border-rose-200 text-rose-900"
                      : "bg-amber-50 border-amber-200 text-amber-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {variance === 0 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">
                        {variance === 0
                          ? "Reconciled (Zero Variance)"
                          : (variance || 0) < 0
                          ? "Cash Drawer Shortage Detected"
                          : "Cash Drawer Surplus Detected"}
                      </div>
                      <div className="text-[11px] opacity-80">
                        {variance === 0
                          ? "Count matches system expectation down to the cent."
                          : (variance || 0) < 0
                          ? `Count is short by ${formatCurrency(Math.abs(variance || 0))}`
                          : `Count exceeds expectation by ${formatCurrency(variance || 0)}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold tracking-tight">
                      {variance === 0
                        ? "$0.00"
                        : (variance || 0) < 0
                        ? `-${formatCurrency(Math.abs(variance || 0))}`
                        : `+${formatCurrency(variance || 0)}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Variance Reason Input (Required if Variance is non-zero) */}
              {hasVariance && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-rose-700 uppercase tracking-wider">
                    Variance Explanation / Justification <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={varianceReason}
                    onChange={(e) => setVarianceReason(e.target.value)}
                    placeholder="Provide specific reason for cash discrepancy (e.g., change error, unvouchered courier dispatch)..."
                    required
                    className="w-full p-3 rounded-2xl border border-rose-300 bg-rose-50/30 text-xs text-pharmacy-dark placeholder:text-pharmacy-textMuted focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              )}

              {/* Closing Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-pharmacy-textSecondary">
                  Shift Handover Notes (Optional)
                </label>
                <input
                  type="text"
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="e.g. Next shift cashier informed, cash safe key deposited..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs text-pharmacy-dark placeholder:text-pharmacy-textMuted focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

                </div>
              </div>

              {/* Sticky Footer CTA */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-colors active:scale-95"
                >
                  <Lock className="w-4 h-4 text-emerald-300" />
                  <span>Confirm & Close Shift</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
