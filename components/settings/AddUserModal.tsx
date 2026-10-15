"use client";

import React, { useState, useEffect } from "react";
import ModalPortal from "@/components/common/ModalPortal";
import {
  X,
  UserPlus,
  Shield,
  Building2,
  Mail,
  Lock,
  Phone,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { UserAccount, UserRole } from "@/types/settings";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (newUser: UserAccount) => void;
}

const ROLES: UserRole[] = [
  "Cashier",
  "Pharmacist",
  "Pharmacy Manager",
  "Inventory Staff",
  "Accountant",
  "Super Admin",
];

const BRANCHES = [
  "Counter 1 - Main Branch",
  "Counter 2 - Express Lane",
  "Night Emergency Counter",
  "Central Warehouse & Cold Room",
  "All Branches (Global Admin)",
];

export default function AddUserModal({
  isOpen,
  onClose,
  onUserAdded,
}: AddUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("Cashier");
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPhone("");
      setRole("Cashier");
      setBranch(BRANCHES[0]);
      setPin("");
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

    if (!name.trim()) {
      setErrorMessage("Please enter the staff member's full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    if (pin.length < 4) {
      setErrorMessage("Please set a 4-digit security PIN for terminal login.");
      return;
    }

    // Default sample avatars for new staff
    const sampleAvatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    ];

    const newUser: UserAccount = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar: sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)],
      role,
      branch,
      isActive: true,
      lastLogin: "Never (New Account)",
      phone: phone.trim() || undefined,
    };

    onUserAdded(newUser);
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
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                Add Staff Member
              </h2>
              <p className="text-xs text-slate-500">
                Assign individual cashier account & RBAC privileges (SRS Section 3)
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block font-bold text-pharmacy-dark uppercase tracking-wider text-[11px]">
              Full Legal Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. Bilal Qureshi, Maryam Tariq"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-white text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 text-xs"
            />
          </div>

          {/* Email & Phone in 2-cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block font-bold text-pharmacy-dark uppercase tracking-wider text-[11px]">
                Work Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
                <input
                  type="email"
                  placeholder="name@pharmacy.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-pharmacy-border bg-white text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-pharmacy-dark uppercase tracking-wider text-[11px]">
                Mobile Phone
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-pharmacy-border bg-white text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Role & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block font-bold text-pharmacy-dark uppercase tracking-wider text-[11px]">
                Assigned RBAC Role <span className="text-rose-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2.5 rounded-xl border border-pharmacy-border bg-white text-pharmacy-dark font-semibold focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 text-xs"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-pharmacy-dark uppercase tracking-wider text-[11px]">
                Branch Terminal Scope
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-pharmacy-border bg-white text-pharmacy-dark font-medium focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 text-xs"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Terminal Login PIN */}
          <div className="space-y-1.5">
            <label className="block font-bold text-pharmacy-dark uppercase tracking-wider text-[11px]">
              Terminal 4-Digit Security PIN <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
              <input
                type="password"
                maxLength={6}
                placeholder="e.g. 8921"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-pharmacy-border bg-white font-mono text-sm tracking-widest text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              />
            </div>
            <p className="text-[10px] text-pharmacy-textMuted">
              Used by cashier to unlock assigned drawer terminal and sign transactions.
            </p>
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
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-colors active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
