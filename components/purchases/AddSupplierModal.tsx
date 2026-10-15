"use client";

import React, { useState, useEffect } from "react";
import ModalPortal from "@/components/common/ModalPortal";
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
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div
        className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (fixed top) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                Add Distributor Vendor
              </h2>
              <p className="text-xs text-slate-500">
                Register verified pharmaceutical distributor & credit terms
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

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
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
              <span>Save Supplier</span>
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
