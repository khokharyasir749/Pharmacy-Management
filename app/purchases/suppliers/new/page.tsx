"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  AlertTriangle,
  Save,
  CheckCircle2,
  X,
  Truck,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Supplier } from "@/types/purchase";
import { saveSupplier } from "@/data/mockPurchases";

export default function NewSupplierPage() {
  const router = useRouter();

  // Form Fields
  const [name, setName] = useState("");
  const [representative, setRepresentative] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentTerms, setPaymentTerms] = useState<Supplier["paymentTerms"]>("Net 30 Days");
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [nextDueDate, setNextDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [taxRegistrationNumber, setTaxRegistrationNumber] = useState("");
  const [leadTime, setLeadTime] = useState("24 - 48 Hours");
  const [rating, setRating] = useState<number>(5.0);
  const [coldChainCertified, setColdChainCertified] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter the distributor / vendor company name.");
      return;
    }
    if (!representative.trim()) {
      setErrorMessage("Please provide the primary representative / sales contact.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Please provide a valid contact phone number.");
      return;
    }

    setIsSubmitting(true);

    const formattedDueDate =
      paymentTerms === "Cash on Delivery"
        ? "N/A"
        : new Date(nextDueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: name.trim(),
      representative: representative.trim(),
      phone: phone.trim(),
      email: email.trim() || "orders@distributor.pk",
      address: address.trim() || "Central Logistics Hub, Industrial Zone",
      paymentTerms,
      totalOrdersCount: 0,
      outstandingBalance: Number(openingBalance) || 0,
      nextDueDate: formattedDueDate,
      rating: Number(rating) || 5.0,
    };

    saveSupplier(newSupplier);

    setTimeout(() => {
      router.push("/purchases");
    }, 250);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-xs text-pharmacy-textMuted">
          <Link href="/purchases" className="hover:text-teal-800 transition-colors font-medium">
            Purchases
          </Link>
          <span>/</span>
          <Link href="/purchases" className="hover:text-teal-800 transition-colors font-medium">
            Suppliers & Ledgers
          </Link>
          <span>/</span>
          <span className="text-pharmacy-textPrimary font-semibold">Add New Supplier</span>
        </div>

        <Link
          href="/purchases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 bg-white border border-teal-100 hover:border-teal-300 px-3 py-1.5 rounded-full shadow-xs transition-all w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Suppliers</span>
        </Link>
      </div>

      {/* Main Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-pharmacy-dark">
              Register New Pharmaceutical Distributor
            </h1>
            <p className="text-xs sm:text-sm text-pharmacy-textMuted mt-1 max-w-3xl leading-relaxed">
              Enter corporate vendor credentials, sales representative contacts, payment credit terms, and opening balance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-teal-50 border border-teal-200/80 px-3.5 py-2 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-teal-800" />
          <span className="text-xs font-bold text-teal-900">Verified Vendor Ledger</span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:text-rose-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Company & Vendor Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-pharmacy-textPrimary">
                Corporate Vendor Identity & Contacts
              </h2>
            </div>
            <span className="text-[11px] text-pharmacy-textMuted">Primary Distributor Info</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Distributor / Vendor Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. GSK Pakistan Distribution, Abbott Logistics"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* Representative Name */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Key Account Manager / Rep <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Mehmood, Asif Siddiqui"
                value={representative}
                onChange={(e) => setRepresentative(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Direct Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +92 (21) 3231-9000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Orders Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. orders@gskdist.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* Tax / NTN ID */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Tax Registration / NTN Number
              </label>
              <input
                type="text"
                placeholder="e.g. NTN-9021884-7"
                value={taxRegistrationNumber}
                onChange={(e) => setTaxRegistrationNumber(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-mono font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* Initial Rating */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Vendor Compliance Rating (1 - 5 ★)
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value) || 5.0)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              >
                <option value={5.0}>★★★★★ 5.0 (Premier Vendor)</option>
                <option value={4.8}>★★★★☆ 4.8 (High Reliability)</option>
                <option value={4.5}>★★★★☆ 4.5 (Standard Approved)</option>
                <option value={4.0}>★★★★☆ 4.0 (Trial / Secondary)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Credit Terms & Financial Setup */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-pharmacy-textPrimary">
                Credit Terms & Financial Ledger Setup
              </h2>
            </div>
            <span className="text-[11px] text-pharmacy-textMuted">Disbursement & Settlement Policies</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Payment Terms */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Credit Agreement / Payment Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value as Supplier["paymentTerms"])}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              >
                <option value="Net 30 Days">Net 30 Days (Standard Commercial Credit)</option>
                <option value="Net 15 Days">Net 15 Days (Bi-weekly Settlement)</option>
                <option value="Net 60 Days">Net 60 Days (Extended Wholesale Credit)</option>
                <option value="Cash on Delivery">Cash on Delivery (COD Direct)</option>
              </select>
            </div>

            {/* Opening Balance */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Opening Outstanding Payable Balance ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(Number(e.target.value) || 0)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-bold text-teal-900 focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Existing carryover from previous accounting software
              </span>
            </div>

            {/* Next Due Date */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                First Scheduled Settlement Due Date
              </label>
              <input
                type="date"
                value={nextDueDate}
                disabled={paymentTerms === "Cash on Delivery"}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark disabled:opacity-40"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Logistics & Address */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-pharmacy-textPrimary">
                Logistics Hub, Address & Cold Chain
              </h2>
            </div>
            <span className="text-[11px] text-pharmacy-textMuted">Dispatch Location & Handling</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Central Warehouse / Fulfillment Center Address
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Plot 12, Sector 27, Korangi Industrial Area, Karachi"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            <div className="space-y-4">
              {/* Delivery Lead Time */}
              <div>
                <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                  Standard Dispatch Lead Time
                </label>
                <select
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
                >
                  <option value="Same Day (Within 6 Hours)">Same Day (Within 6 Hours - Emergency Stock)</option>
                  <option value="24 - 48 Hours">24 - 48 Hours (Standard Logistics)</option>
                  <option value="3 - 5 Business Days">3 - 5 Business Days (Inter-city Transit)</option>
                </select>
              </div>

              {/* Cold Chain Certification Toggle */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Cold-Chain Certified (2°C - 8°C Transit)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Equipped with temperature-monitored refrigerated transport for insulin & vaccines.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={coldChainCertified}
                  onChange={(e) => setColdChainCertified(e.target.checked)}
                  className="w-4 h-4 text-teal-800 rounded border-slate-300 focus:ring-teal-700 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STICKY ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <Link
              href="/purchases"
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </Link>
            <span className="hidden sm:inline text-xs text-slate-400">
              Unsaved vendor details will be discarded
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Registering Supplier..." : "Save & Register Supplier"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
