"use client";

import React, { useState, useEffect } from "react";
import { X, Building2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Supplier } from "@/types/purchase";

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSupplierAdded: (supplier: Supplier) => void;
}

export default function AddSupplierModal({
  isOpen,
  onClose,
  onSupplierAdded,
}: AddSupplierModalProps) {
  const [name, setName] = useState("");
  const [representative, setRepresentative] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentTerms, setPaymentTerms] = useState<Supplier["paymentTerms"]>("Net 30 Days");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    if (!name.trim()) {
      setErrorMessage("Please enter distributor name.");
      return;
    }

    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: name.trim(),
      representative: representative.trim() || "Sales Representative",
      phone: phone.trim() || "+92 (21) 3000-0000",
      email: email.trim() || "orders@vendor.pk",
      address: address.trim() || "Industrial Area, Logistics Hub",
      paymentTerms,
      totalOrdersCount: 0,
      outstandingBalance: 0,
      nextDueDate: "N/A",
      rating: 5.0,
    };

    onSupplierAdded(newSupplier);
    setName("");
    setRepresentative("");
    setPhone("");
    setEmail("");
    setAddress("");
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
        <div className="flex items-center justify-between px-6 py-5 border-b border-pharmacy-borderLight bg-pharmacy-canvas/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pharmacy-dark flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-pharmacy-dark">
                Add Distributor Vendor
              </h2>
              <p className="text-xs text-pharmacy-textMuted">
                Register verified pharmaceutical distributor & credit terms
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

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
              Distributor Company Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ferozsons Laboratories Distribution"
              className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
                Contact Representative
              </label>
              <input
                type="text"
                value={representative}
                onChange={(e) => setRepresentative(e.target.value)}
                placeholder="e.g. Tariq Mehmood"
                className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 (21) 3000-0000"
                className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supply@distributor.pk"
                className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
                Payment Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value as any)}
                className="w-full h-10 px-3 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              >
                <option value="Net 30 Days">Net 30 Days</option>
                <option value="Net 15 Days">Net 15 Days</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Advance Payment">Advance Payment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
              Warehouse Logistics Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Plot 18, Industrial Area, Karachi"
              className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
            />
          </div>

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
              <span>Save Supplier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
