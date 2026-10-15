"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Receipt,
  Wallet,
  Building2,
  FileText,
  DollarSign,
  UserCheck,
  Tag,
  AlertCircle,
  Save,
  CheckCircle2,
  Layers,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Expense } from "@/types/payment";
import { saveExpense } from "@/data/mockPayments";

export default function RecordExpensePage() {
  const router = useRouter();

  // Form State
  const [paymentMethod, setPaymentMethod] = useState<"Cash Drawer" | "Petty Cash" | "Bank">("Cash Drawer");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<Expense["category"]>("Packaging/Supplies");
  const [payee, setPayee] = useState<string>("");
  const [voucherRef, setVoucherRef] = useState<string>(`VCH-${Math.floor(1000 + Math.random() * 9000)}`);
  const [description, setDescription] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [recordedBy, setRecordedBy] = useState<string>("Budiono Siregar");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories list
  const categories: { label: string; value: Expense["category"]; desc: string }[] = [
    { label: "Packaging & Supplies", value: "Packaging/Supplies", desc: "Thermal billing rolls, barcode stickers, prescription covers" },
    { label: "Refreshment", value: "Refreshment", desc: "Staff tea, bottled water, counter snacks" },
    { label: "Logistics", value: "Logistics", desc: "Patient home delivery, rider fuel, urgent courier parcel" },
    { label: "Utilities", value: "Utilities", desc: "Electricity submeter, water dispenser refills, internet link" },
    { label: "Maintenance", value: "Maintenance", desc: "HVAC filter service, POS printer repairs, lighting" },
    { label: "Other / Misc", value: "Other", desc: "Government fee stamps, municipal sanitation, ad-hoc expenses" },
  ];

  // Disbursement Source Options
  const sources = [
    {
      id: "Cash Drawer" as const,
      title: "Active Cash Drawer",
      subtitle: "Instant deduction from POS Register #104 drawer float",
      icon: Wallet,
      badge: "Real-time Drawer Sync",
      color: "emerald",
    },
    {
      id: "Petty Cash" as const,
      title: "Petty Cash Reserve",
      subtitle: "Paid from Pharmacy back-office petty cash vault safe",
      icon: Layers,
      badge: "Back Office Ledger",
      color: "blue",
    },
    {
      id: "Bank" as const,
      title: "Bank Wire / Corporate Card",
      subtitle: "Direct bank transfer / Debit card corporate payment",
      icon: Building2,
      badge: "Statement Reconciled",
      color: "purple",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid expense payout amount greater than $0.00.");
      return;
    }

    if (!payee.trim()) {
      setErrorMessage("Please provide the Payee or Vendor name receiving the funds.");
      return;
    }

    if (!description.trim()) {
      setErrorMessage("Please specify the purpose memo / description for this expense.");
      return;
    }

    setIsSubmitting(true);

    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " PKT";

    const newExpense: Expense = {
      id: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: dateStr,
      category,
      description: description.trim(),
      payee: payee.trim(),
      paymentMethod,
      amount: parsedAmount,
      recordedBy: recordedBy.trim() || "Budiono Siregar",
      voucherRef: voucherRef.trim() || `VCH-${Math.floor(1000 + Math.random() * 9000)}`,
      sessionId: paymentMethod === "Cash Drawer" ? "REG-2026-104" : undefined,
      notes: notes.trim() || undefined,
    };

    saveExpense(newExpense);

    // Short delay for tactile feel then redirect to /payments
    setTimeout(() => {
      router.push("/payments");
    }, 400);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-xs font-semibold text-pharmacy-textMuted">
            <Link
              href="/payments"
              className="hover:text-pharmacy-dark transition-colors"
            >
              Cash Register
            </Link>
            <span>/</span>
            <Link
              href="/payments"
              className="hover:text-pharmacy-dark transition-colors"
            >
              Expenses
            </Link>
            <span>/</span>
            <span className="text-teal-900 font-bold">Record Expense & Payout</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-pharmacy-dark">
              Record Store Expense & Drawer Payout
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-pharmacy-textMuted">
            Post authorized operational cash outflows, utility payments, or dispensary supplies with automatic counter drawer balance deduction.
          </p>
        </div>

        <Link
          href="/payments"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-pharmacy-border bg-white hover:bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textSecondary transition-all shadow-xs self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cash Register</span>
        </Link>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Form Body */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Disbursement Source Selection */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-pharmacy-border/60 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-pharmacy-dark flex items-center gap-2">
                <Wallet className="w-5 h-5 text-teal-800" />
                <span>1. Select Disbursement Source</span>
              </h2>
              <p className="text-xs text-pharmacy-textMuted mt-0.5">
                Choose the physical or digital account ledger from which funds are physically disbursed.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-semibold border border-teal-100">
              Active Source: {paymentMethod}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sources.map((src) => {
              const isSelected = paymentMethod === src.id;
              const Icon = src.icon;
              return (
                <button
                  type="button"
                  key={src.id}
                  onClick={() => setPaymentMethod(src.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? "border-teal-700 bg-teal-50/40 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? "bg-teal-800 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-teal-800 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-pharmacy-dark">
                      {src.title}
                    </h3>
                    <p className="text-xs text-pharmacy-textMuted mt-1 leading-relaxed">
                      {src.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                      {src.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {paymentMethod === "Cash Drawer" && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Active Drawer Integration:</span> Recording this expense will instantly deduct from POS Register <span className="font-semibold">#REG-2026-104</span> expected cash in drawer balance and print an automated audit voucher receipt.
              </div>
            </div>
          )}
        </section>

        {/* Section 2: Financial Details & Voucher */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-pharmacy-border/60 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-pharmacy-dark flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-800" />
              <span>2. Expense Amount & Voucher Reference</span>
            </h2>
            <p className="text-xs text-pharmacy-textMuted mt-0.5">
              Specify the monetary amount disbursed, internal serial voucher number, and recipient vendor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Amount */}
            <div className="space-y-1.5 lg:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                Payout Amount ($ USD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-pharmacy-dark">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white border border-pharmacy-border rounded-2xl text-lg font-bold text-pharmacy-dark placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                />
              </div>
              <p className="text-[11px] text-pharmacy-textMuted">
                Net funds physically handed over or transferred.
              </p>
            </div>

            {/* Voucher Ref */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                Internal Voucher Ref <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Receipt className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={voucherRef}
                  onChange={(e) => setVoucherRef(e.target.value)}
                  placeholder="e.g. VCH-8824"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-pharmacy-border rounded-2xl text-xs font-semibold text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-pharmacy-textMuted">
                Pre-printed paper voucher or electronic receipt ID.
              </p>
            </div>

            {/* Payee / Vendor */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                Payee / Beneficiary Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={payee}
                  onChange={(e) => setPayee(e.target.value)}
                  placeholder="e.g. Apex Office Stationery / Rider Ali"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-pharmacy-border rounded-2xl text-xs font-semibold text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                />
              </div>
              <p className="text-[11px] text-pharmacy-textMuted">
                Individual or company who received the cash/payment.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Classification & Memo */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-pharmacy-border/60 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-pharmacy-dark flex items-center gap-2">
              <Tag className="w-5 h-5 text-teal-800" />
              <span>3. Expense Classification & Purpose</span>
            </h2>
            <p className="text-xs text-pharmacy-textMuted mt-0.5">
              Assign an accounting expense head to ensure precise profit and loss tracking.
            </p>
          </div>

          <div className="space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-2">
                Operational Expense Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const isSelected = category === cat.value;
                  return (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-teal-700 bg-teal-50/50 text-teal-900 font-bold"
                          : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{cat.label}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-teal-700" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal mt-1 line-clamp-1">
                        {cat.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description / Memo */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                Expense Purpose Memo / Line Description <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Purchase of 10x 80mm thermal receipt rolls for billing counter"
                required
                className="w-full px-4 py-3 bg-white border border-pharmacy-border rounded-2xl text-xs font-semibold text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
              />
              <p className="text-[11px] text-pharmacy-textMuted">
                Clear summary that will appear on the daily closing shift audit report.
              </p>
            </div>

            {/* Authorizing Staff & Internal Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                  Authorized Dispenser / Cashier
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={recordedBy}
                    onChange={(e) => setRecordedBy(e.target.value)}
                    placeholder="Cashier Name"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-pharmacy-border rounded-2xl text-xs font-semibold text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                  Internal Remarks / Justification (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Approved by Head Pharmacist on Duty"
                  className="w-full px-4 py-3 bg-white border border-pharmacy-border rounded-2xl text-xs font-semibold text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Action Footer Bar */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-floating border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-sm">
              $
            </div>
            <div>
              <div className="text-xs font-bold text-pharmacy-dark">
                Ready to Record: {amount ? `$${parseFloat(amount || "0").toFixed(2)}` : "$0.00"}
              </div>
              <div className="text-[11px] text-pharmacy-textMuted">
                Source: {paymentMethod} • Head: {category}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/payments"
              className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs sm:text-sm font-semibold shadow-pill hover:shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Posting Voucher..." : "Record Expense Payout"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
