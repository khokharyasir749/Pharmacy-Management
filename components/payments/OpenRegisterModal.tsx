"use client";

import React, { useState, useEffect } from "react";
import ModalPortal from "@/components/common/ModalPortal";
import {
  X,
  Wallet,
  DollarSign,
  Building2,
  User,
  CheckCircle2,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { RegisterSession } from "@/types/payment";

interface OpenRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionOpened: (newSession: RegisterSession) => void;
}

const CASHIERS = [
  {
    name: "Budiono Siregar",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    role: "Senior Pharmacist & Cashier",
  },
  {
    name: "Ayesha Malik",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    role: "Shift Supervisor",
  },
  {
    name: "Tariq Mahmood",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    role: "Dispensary Cashier",
  },
];

export default function OpenRegisterModal({
  isOpen,
  onClose,
  onSessionOpened,
}: OpenRegisterModalProps) {
  const [selectedCashier, setSelectedCashier] = useState(CASHIERS[0]);
  const [branch, setBranch] = useState("Counter 1 - Main Branch");
  const [openingFloat, setOpeningFloat] = useState<string>("250.00");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedCashier(CASHIERS[0]);
      setBranch("Counter 1 - Main Branch");
      setOpeningFloat("250.00");
      setNotes("");
      setErrorMessage(null);
    }
  }, [isOpen]);

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

    const parsedFloat = parseFloat(openingFloat);
    if (isNaN(parsedFloat) || parsedFloat < 0) {
      setErrorMessage("Please enter a valid base opening cash float (>= $0).");
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

    const newSession: RegisterSession = {
      id: `REG-2026-${Math.floor(105 + Math.random() * 50)}`,
      branch,
      cashierName: selectedCashier.name,
      cashierAvatar: selectedCashier.avatar,
      openedAt: formattedDate,
      openingFloat: parsedFloat,
      cashSales: 0,
      cardSales: 0,
      digitalSales: 0,
      cashRefunds: 0,
      drawerExpenses: 0,
      expectedCash: parsedFloat,
      status: "Active",
      totalTransactions: 0,
      notes: notes.trim() || "New register session opened for counter billing.",
    };

    onSessionOpened(newSession);
    onClose();
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div
        className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (fixed top) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                Open Register Drawer Session
              </h2>
              <p className="text-xs text-slate-500">
                Initialize base cash float and assign cashier for new shift
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

          {/* Cashier Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-pharmacy-dark uppercase tracking-wider">
              Assigned Cashier <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {CASHIERS.map((c) => (
                <div
                  key={c.name}
                  onClick={() => setSelectedCashier(c)}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedCashier.name === c.name
                      ? "border-teal-900 bg-teal-50/50 ring-2 ring-teal-900/10"
                      : "border-pharmacy-border hover:bg-pharmacy-canvas/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-8 h-8 rounded-full object-cover border border-pharmacy-border"
                    />
                    <div>
                      <div className="text-xs font-bold text-pharmacy-dark">{c.name}</div>
                      <div className="text-[10px] text-pharmacy-textMuted">{c.role}</div>
                    </div>
                  </div>
                  {selectedCashier.name === c.name && (
                    <CheckCircle2 className="w-4 h-4 text-teal-800" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Branch & Counter Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-pharmacy-dark uppercase tracking-wider">
              Counter / Terminal Location
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-pharmacy-border bg-white text-xs text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 font-medium"
            >
              <option value="Counter 1 - Main Branch">Counter 1 - Main Branch (Main Dispensary)</option>
              <option value="Counter 2 - Express Lane">Counter 2 - Express Lane (OTC / Cosmetics)</option>
              <option value="Night Emergency Counter">Night Emergency Counter (24/7 Hatch)</option>
            </select>
          </div>

          {/* Opening Float Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-pharmacy-dark uppercase tracking-wider">
              Base Opening Cash Float ($) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={openingFloat}
                onChange={(e) => setOpeningFloat(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-pharmacy-border bg-white text-sm font-bold text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              />
            </div>
            <div className="flex gap-2 text-xs pt-1">
              {["150.00", "200.00", "250.00", "300.00"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setOpeningFloat(preset)}
                  className="px-2 py-0.5 rounded-md bg-pharmacy-canvas text-[11px] font-semibold text-pharmacy-textSecondary hover:text-pharmacy-dark border border-pharmacy-border"
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Shift Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-pharmacy-textSecondary">
              Shift Opening Remarks (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Verified coin denominations and card reader paper rolls"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-white text-xs text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-colors active:scale-95"
            >
              <FileCheck className="w-4 h-4 text-emerald-300" />
              <span>Open Register Shift</span>
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
