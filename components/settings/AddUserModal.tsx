"use client";

import React, { useState, useEffect } from "react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pharmacy-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-floating border border-pharmacy-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-pharmacy-canvas/60 border-b border-pharmacy-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-900 text-white flex items-center justify-center shadow-sm">
              <UserPlus className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-pharmacy-dark">
                Add / Invite Staff Member
              </h2>
              <p className="text-xs text-pharmacy-textMuted">
                Assign individual cashier account & RBAC privileges (SRS Section 3)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-pharmacy-border text-pharmacy-textMuted hover:text-pharmacy-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
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

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-pharmacy-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-pharmacy-border font-semibold text-pharmacy-textSecondary hover:bg-pharmacy-canvas transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white font-semibold shadow-pill hover:shadow-lg transition-all active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
