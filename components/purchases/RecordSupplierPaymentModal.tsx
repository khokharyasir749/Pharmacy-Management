"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Building2,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { Supplier, SupplierPaymentRecord } from "@/types/purchase";

interface RecordSupplierPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onPaymentRecorded: (payment: SupplierPaymentRecord) => void;
}

export default function RecordSupplierPaymentModal({
  isOpen,
  onClose,
  supplier,
  onPaymentRecorded,
}: RecordSupplierPaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"Bank Transfer" | "Cash" | "Cheque">("Bank Transfer");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync initial amount when supplier changes
  useEffect(() => {
    if (supplier) {
      setPaymentAmount(supplier.outstandingBalance);
      setReference(`TXN-${Math.floor(1000 + Math.random() * 9000)}`);
      setErrorMessage(null);
    }
  }, [supplier]);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !supplier) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (paymentAmount <= 0) {
      setErrorMessage("Please enter a valid payment amount greater than zero.");
      return;
    }

    if (paymentAmount > supplier.outstandingBalance) {
      setErrorMessage(
        `Payment amount exceeds current outstanding balance ($${supplier.outstandingBalance.toFixed(2)}).`
      );
      return;
    }

    const newPayment: SupplierPaymentRecord = {
      id: `pay-${Date.now()}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      amount: Number(paymentAmount),
      paymentMethod,
      reference: reference.trim() || `TXN-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      notes: notes.trim() || undefined,
    };

    onPaymentRecorded(newPayment);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (fixed top) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                Record Supplier Payment
              </h2>
              <p className="text-xs text-slate-500">
                Settle outstanding balance with {supplier.name}
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

        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {/* Outstanding Balance Banner */}
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                  Current Payable Balance
                </span>
              <div className="text-2xl font-black text-rose-600 tracking-tight mt-0.5">
                ${supplier.outstandingBalance.toFixed(2)}
              </div>
            </div>
            <div className="text-right text-xs text-rose-800">
              <div className="font-semibold">Terms: {supplier.paymentTerms}</div>
              <div className="text-[10px] text-rose-600">Due: {supplier.nextDueDate}</div>
            </div>
          </div>

          {/* Payment Amount */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
              Settlement Amount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={supplier.outstandingBalance}
              required
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
              className="w-full h-11 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-base font-bold text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Bank Transfer", value: "Bank Transfer", icon: Building2 },
                { label: "Cash Voucher", value: "Cash", icon: Banknote },
                { label: "Bank Cheque", value: "Cheque", icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setPaymentMethod(m.value as any)}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? "bg-pharmacy-dark text-white border-pharmacy-dark shadow-xs font-semibold"
                        : "bg-white text-pharmacy-textSecondary border-pharmacy-border hover:bg-pharmacy-canvas text-xs"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
              Transaction / Cheque Reference *
            </label>
            <input
              type="text"
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. TXN-98012 or CHQ-0021"
              className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs font-mono text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
              Settlement Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via online treasury account"
              className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
            />
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
              className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow flex items-center gap-2 transition-colors active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Confirm & Deduct Balance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
