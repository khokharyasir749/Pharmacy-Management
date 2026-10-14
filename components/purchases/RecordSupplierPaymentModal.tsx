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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-pharmacy-dark/50 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl md:rounded-[32px] shadow-2xl border border-pharmacy-border/60 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-pharmacy-borderLight bg-pharmacy-canvas/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pharmacy-dark flex items-center justify-center text-white shadow-sm">
              <CreditCard className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-pharmacy-dark">
                Record Supplier Payment
              </h2>
              <p className="text-xs text-pharmacy-textMuted">
                Settle outstanding balance with {supplier.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-pharmacy-textMuted hover:text-pharmacy-textPrimary hover:bg-pharmacy-canvas transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Outstanding Balance Banner */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
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

          {/* Actions */}
          <div className="pt-3 border-t border-pharmacy-borderLight flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-pharmacy-border bg-white text-xs sm:text-sm font-semibold text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs sm:text-sm font-semibold shadow-pill flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Confirm & Deduct Balance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
