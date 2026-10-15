"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Package,
  Clock,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  setActiveUser,
  DEFAULT_ADMIN_USER,
  DEFAULT_STAFF_USER,
  AuthUser,
} from "@/data/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@pharmacy.com");
  const [password, setPassword] = useState("admin123@password");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Quick fill handler for demo convenience
  const handleQuickFill = (role: "admin" | "staff") => {
    if (role === "admin") {
      setEmail("admin@pharmacy.com");
      setPassword("admin123@password");
      setToast({ type: "success", text: "Auto-filled credentials for Super Admin (Dr. Sarah Alvi)" });
    } else {
      setEmail("staff@pharmacy.com");
      setPassword("staff123@password");
      setToast({ type: "success", text: "Auto-filled credentials for Staff Pharmacist (Budiono Siregar)" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ type: "error", text: "Please provide both terminal email and access password" });
      return;
    }

    setIsLoading(true);

    // Determine user profile based on credentials or fallback
    let userToAuth: AuthUser;
    if (email.toLowerCase().includes("staff") || email.toLowerCase().includes("budiono")) {
      userToAuth = DEFAULT_STAFF_USER;
    } else {
      userToAuth = DEFAULT_ADMIN_USER;
    }

    setToast({
      type: "success",
      text: `Terminal authorized for ${userToAuth.name} (${userToAuth.role}). Loading workspace...`,
    });

    setTimeout(() => {
      setActiveUser(userToAuth);
      router.push("/");
    }, 700);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0B2B28]">
      {/* LEFT HALF: Brand Showcase & Architecture Highlights */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-[#0B2B28] border-b lg:border-b-0 lg:border-r border-teal-900/60">
        {/* Subtle decorative geometry */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        {/* Top Header & Branding */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-900/60 border border-teal-700/50 text-teal-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>PHARMACY MANAGEMENT SYSTEM (PMS)</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Drug Inventory, FEFO Dispensing & POS
            </h1>
            <p className="text-sm sm:text-base text-teal-200/80 max-w-xl leading-relaxed">
              Engineered for high-volume retail counters, hospital pharmacies, and regulatory compliance under national DRAP Form-9 and FEFO distribution standards.
            </p>
          </div>
        </div>

        {/* Middle: Feature Highlights */}
        <div className="relative z-10 my-8 sm:my-12 space-y-4 max-w-xl">
          <div className="p-4 sm:p-5 rounded-2xl bg-teal-950/70 border border-teal-800/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-900/80 border border-teal-700/50 flex items-center justify-center text-teal-300 flex-shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Multi-Unit Fractional Dispensing</h4>
              <p className="text-xs text-teal-200/70 mt-1 leading-normal">
                Seamless <span className="text-white font-medium">Box ➔ Strip ➔ Tablet</span> unit breakdown with real-time stock synchronization and fractional billing.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-teal-950/70 border border-teal-800/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-900/80 border border-teal-700/50 flex items-center justify-center text-teal-300 flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Automated FEFO & Expiry Quarantine</h4>
              <p className="text-xs text-teal-200/70 mt-1 leading-normal">
                Strict first-expiry-first-out batch reservation at checkout to eliminate unsellable stock and meet DRAP compliance audits.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-teal-950/70 border border-teal-800/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-900/80 border border-teal-700/50 flex items-center justify-center text-teal-300 flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash Register Handover & Reconciliation</h4>
              <p className="text-xs text-teal-200/70 mt-1 leading-normal">
                Shift-based physical cash counting, automated discrepancy tracking, and tamper-proof daily closing receipts.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Compliance & Security Footer */}
        <div className="relative z-10 pt-6 border-t border-teal-900/80 flex items-center gap-2 text-xs text-teal-300/80">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>AES-256 Encrypted • Multi-Tenant RBAC • Drug License Form-9 Compliant</span>
        </div>
      </div>

      {/* RIGHT HALF: Professional Authentication Card */}
      <div className="w-full lg:w-1/2 bg-[#F8FAFA] p-6 sm:p-10 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-7 sm:p-9 space-y-6">
          {/* Header */}
          <div className="space-y-1.5 text-left">
            <div className="inline-block px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold">
              COUNTER TERMINAL ACCESS
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Sign in to your terminal
            </h2>
            <p className="text-xs text-slate-500">
              Enter your credentials to access the pharmacy system
            </p>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 transition-all ${
                toastMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {toastMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span className="font-medium">{toastMessage.text}</span>
            </div>
          )}

          {/* Quick Demo Fill Buttons */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Quick Demo Fill</span>
              <span className="text-[10px] text-teal-700 lowercase font-normal">one-click login</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin")}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left text-xs transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-teal-900">👑 Demo Super Admin</p>
                  <p className="text-[10px] text-slate-500">Dr. Sarah Alvi (Full Access)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("staff")}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left text-xs transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-teal-900">💊 Demo Staff Pharmacist</p>
                  <p className="text-[10px] text-slate-500">Budiono Siregar (POS)</p>
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute px-3 bg-white text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Or Terminal Credentials
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700">
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@pharmacy.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all bg-white"
                />
              </div>
            </div>

            {/* Password / PIN Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Password / Terminal PIN
                </label>
                <button
                  type="button"
                  onClick={() => setToast({ type: "success", text: "Demo Mode: Default passwords are auto-filled via buttons above." })}
                  className="text-[11px] font-semibold text-teal-800 hover:text-teal-900"
                >
                  Forgot PIN?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter terminal password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Terminal Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberTerminal}
                onChange={(e) => setRememberTerminal(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-800 focus:ring-teal-700"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 select-none">
                Remember this cashier terminal for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#0B2B28] hover:bg-teal-900 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authorizing Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Return to Dashboard Link */}
          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-teal-900 font-medium transition-colors"
            >
              ← Back to Pharmacy Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
