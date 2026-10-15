"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Receipt,
  DollarSign,
  Building,
  Tag,
  CreditCard,
  Wallet,
  AlertCircle,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { Expense, ExpenseCategory, RegisterSession } from "@/types/payment";

interface RecordExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSession: RegisterSession | null;
  onExpenseRecorded: (expense: Expense) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  "Packaging/Supplies",
  "Refreshment",
  "Logistics",
  "Utilities",
  "Maintenance",
  "Other",
];

export default function RecordExpenseModal({
  isOpen,
  onClose,
  activeSession,
  onExpenseRecorded,
}: RecordExpenseModalProps) {
  const [category, setCategory] = useState<ExpenseCategory>("Packaging/Supplies");
  const [description, setDescription] = useState("");
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash Drawer" | "Petty Cash" | "Bank">(
    activeSession ? "Cash Drawer" : "Petty Cash"
  );
  const [voucherRef, setVoucherRef] = useState("");
  const [notes, setNotes] = useState("");
  const [recordedBy, setRecordedBy] = useState("Budiono Siregar");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-generate voucher reference when modal opens
  useEffect(() => {
    if (isOpen) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      setVoucherRef(`VCH-${rand}`);
      setCategory("Packaging/Supplies");
      setDescription("");
      setPayee("");
      setAmount("");
      setNotes("");
      setErrorMessage(null);
      setPaymentMethod(activeSession ? "Cash Drawer" : "Petty Cash");
    }
  }, [isOpen, activeSession]);

  // Escape key listener
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid expense amount greater than 0.");
      return;
    }

    if (!description.trim()) {
      setErrorMessage("Please describe the expense purpose.");
      return;
    }

    if (!payee.trim()) {
      setErrorMessage("Please enter the payee or vendor name.");
      return;
    }

    // If paying from Cash Drawer, check if active session exists and has sufficient expected cash
    if (paymentMethod === "Cash Drawer") {
      if (!activeSession) {
        setErrorMessage("Cannot pay from Cash Drawer: No active cash register session is open.");
        return;
      }
      if (parsedAmount > activeSession.expectedCash) {
        setErrorMessage(
          `Insufficient cash in active drawer ($${activeSession.expectedCash.toFixed(
            2
          )}) to pay this expense ($${parsedAmount.toFixed(2)}).`
        );
        return;
      }
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

    const newExpense: Expense = {
      id: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: formattedDate,
      category,
      description: description.trim(),
      payee: payee.trim(),
      paymentMethod,
      amount: parsedAmount,
      recordedBy: recordedBy.trim() || "Budiono Siregar",
      voucherRef: voucherRef.trim() || `VCH-${Date.now().toString().slice(-4)}`,
      sessionId: paymentMethod === "Cash Drawer" ? activeSession?.id : undefined,
      notes: notes.trim() || undefined,
    };

    onExpenseRecorded(newExpense);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden my-auto border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (fixed top) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                Record Store Expense & Payout
              </h2>
              <p className="text-xs text-slate-500">
                Log authorized store disbursements and counter cash drawer expenses
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

          {/* Payment Method / Source Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-pharmacy-dark uppercase tracking-wider">
              Disbursement Source <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("Cash Drawer")}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === "Cash Drawer"
                    ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                    : "border-pharmacy-border bg-pharmacy-canvas/40 hover:bg-pharmacy-canvas"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Wallet
                    className={`w-4 h-4 ${
                      paymentMethod === "Cash Drawer" ? "text-emerald-700" : "text-pharmacy-textMuted"
                    }`}
                  />
                  {activeSession && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900">
                      Active
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-pharmacy-dark">Cash Drawer</div>
                  <div className="text-[10px] text-pharmacy-textMuted">
                    {activeSession
                      ? `Avail: $${activeSession.expectedCash.toFixed(2)}`
                      : "No active session"}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("Petty Cash")}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === "Petty Cash"
                    ? "border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20"
                    : "border-pharmacy-border bg-pharmacy-canvas/40 hover:bg-pharmacy-canvas"
                }`}
              >
                <Receipt
                  className={`w-4 h-4 ${
                    paymentMethod === "Petty Cash" ? "text-teal-700" : "text-pharmacy-textMuted"
                  }`}
                />
                <div className="mt-2">
                  <div className="text-xs font-bold text-pharmacy-dark">Petty Cash</div>
                  <div className="text-[10px] text-pharmacy-textMuted">Main Safe Reserve</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("Bank")}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === "Bank"
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                    : "border-pharmacy-border bg-pharmacy-canvas/40 hover:bg-pharmacy-canvas"
                }`}
              >
                <CreditCard
                  className={`w-4 h-4 ${
                    paymentMethod === "Bank" ? "text-blue-700" : "text-pharmacy-textMuted"
                  }`}
                />
                <div className="mt-2">
                  <div className="text-xs font-bold text-pharmacy-dark">Bank Transfer</div>
                  <div className="text-[10px] text-pharmacy-textMuted">Online / Cheque</div>
                </div>
              </button>
            </div>
            {paymentMethod === "Cash Drawer" && (
              <p className="text-[11px] text-emerald-700">
                ⚠️ Deducts directly from active drawer expected cash in real time.
              </p>
            )}
          </div>

          {/* Amount & Category in 2-cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-pharmacy-dark uppercase tracking-wider">
                Amount ($) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-pharmacy-border bg-white text-sm font-bold text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-pharmacy-dark uppercase tracking-wider">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-pharmacy-border bg-white text-xs text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payee / Vendor & Voucher Ref */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-pharmacy-dark uppercase tracking-wider">
                Payee / Vendor <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
                <input
                  type="text"
                  placeholder="e.g. Apex Stationery, TCS Courier"
                  value={payee}
                  onChange={(e) => setPayee(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pharmacy-border bg-white text-xs text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-pharmacy-dark uppercase tracking-wider">
                Voucher / Receipt Ref
              </label>
              <input
                type="text"
                placeholder="e.g. VCH-8824"
                value={voucherRef}
                onChange={(e) => setVoucherRef(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-pharmacy-border bg-white text-xs font-mono text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              />
            </div>
          </div>

          {/* Description / Purpose */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-pharmacy-dark uppercase tracking-wider">
              Expense Description / Purpose <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Thermal Receipt Paper Rolls, Urgent Courier Dispatch"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-white text-xs text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
            />
          </div>

          {/* Authorized By & Additional Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-pharmacy-textSecondary">
                Authorized By (Staff Member)
              </label>
              <input
                type="text"
                value={recordedBy}
                onChange={(e) => setRecordedBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-white text-xs text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-pharmacy-textSecondary">
                Internal Remarks (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Approved by Head Pharmacist"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-white text-xs text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
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
              <FileCheck className="w-4 h-4 text-emerald-300" />
              <span>Record Expense Payout</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
