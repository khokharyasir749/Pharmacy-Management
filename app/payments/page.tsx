"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Wallet,
  Receipt,
  CreditCard,
  UserCheck,
  Plus,
  Lock,
  Unlock,
  CheckCircle2,
  X,
  History,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import RegisterSessionsTable from "@/components/payments/RegisterSessionsTable";
import ExpensesTable from "@/components/payments/ExpensesTable";
import CloseRegisterModal from "@/components/payments/CloseRegisterModal";
import RecordExpenseModal from "@/components/payments/RecordExpenseModal";
import SessionDetailsModal from "@/components/payments/SessionDetailsModal";
import OpenRegisterModal from "@/components/payments/OpenRegisterModal";
import { initialRegisterSessions, initialExpenses, getStoredExpenses } from "@/data/mockPayments";
import { RegisterSession, Expense } from "@/types/payment";

export default function PaymentsPage() {
  const [sessions, setSessions] = useState<RegisterSession[]>(initialRegisterSessions);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  useEffect(() => {
    setExpenses(getStoredExpenses());
  }, []);

  // Active Tab: 'sessions' | 'expenses'
  const [activeTab, setActiveTab] = useState<"sessions" | "expenses">("sessions");

  // Modal States
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isRecordExpenseOpen, setIsRecordExpenseOpen] = useState(false);
  const [isOpenRegisterOpen, setIsOpenRegisterOpen] = useState(false);
  const [selectedSessionForDetails, setSelectedSessionForDetails] =
    useState<RegisterSession | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Session Lookup
  const activeSession = sessions.find((s) => s.status === "Active") || null;

  // KPI Calculations
  // 1. Active Register Drawer (Expected physical cash in drawer)
  const activeDrawerCash = activeSession ? activeSession.expectedCash : 0;

  // 2. Today's Operational Expenses
  const todayExpensesTotal = expenses
    .filter((e) => e.date.includes("Oct 15, 2026"))
    .reduce((sum, e) => sum + e.amount, 0);

  // 3. Card & Digital Payments (from active session, or all today)
  const nonCashPaymentsTotal = activeSession
    ? activeSession.cardSales + activeSession.digitalSales
    : sessions
        .filter((s) => s.openedAt.includes("Oct 15, 2026"))
        .reduce((sum, s) => sum + s.cardSales + s.digitalSales, 0);

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Handler: When a new expense is recorded
  const handleExpenseRecorded = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev]);

    // If paid from cash drawer and there's an active session, deduct from expected cash
    if (newExpense.paymentMethod === "Cash Drawer" && activeSession) {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeSession.id) return s;
          const updatedDrawerExpenses = s.drawerExpenses + newExpense.amount;
          const updatedExpectedCash =
            s.openingFloat + s.cashSales - s.cashRefunds - updatedDrawerExpenses;
          return {
            ...s,
            drawerExpenses: updatedDrawerExpenses,
            expectedCash: updatedExpectedCash,
          };
        })
      );
    }

    setToastMessage(
      `Expense #${newExpense.id} of ${formatCurrency(
        newExpense.amount
      )} recorded (${newExpense.paymentMethod}).`
    );
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Handler: When active session is closed
  const handleSessionClosed = (closedSession: RegisterSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === closedSession.id ? closedSession : s))
    );

    const varianceText =
      closedSession.variance === 0
        ? "Reconciled with 0 variance"
        : (closedSession.variance || 0) < 0
        ? `Variance: -${formatCurrency(Math.abs(closedSession.variance || 0))} (Shortage)`
        : `Variance: +${formatCurrency(closedSession.variance || 0)} (Surplus)`;

    setToastMessage(
      `Register #${closedSession.id} closed! ${varianceText}. Drawer locked.`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Handler: When new session is opened
  const handleSessionOpened = (newSession: RegisterSession) => {
    setSessions((prev) => [newSession, ...prev]);
    setToastMessage(
      `New register session #${newSession.id} initialized for ${newSession.cashierName}!`
    );
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="space-y-6 pb-6 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 max-w-md bg-white border border-teal-200 rounded-2xl p-4 shadow-floating flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="p-1 rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold text-pharmacy-dark flex-1">
            {toastMessage}
          </span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-pharmacy-textMuted hover:text-pharmacy-textPrimary p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Title & Top CTA Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-pharmacy-dark">
            Cash Register & Expense Management
          </h1>
          <p className="text-xs sm:text-sm text-pharmacy-textMuted mt-0.5">
            Manage counter cash drawer sessions, operational expenses, payment transactions, and daily shift closings.
          </p>
        </div>

        {/* Right Action Toolbar */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Secondary CTA: Outline pill button + Record Expense */}
          <Link
            href="/payments/expenses/new"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-pharmacy-border bg-white hover:bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textSecondary transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Receipt className="w-3.5 h-3.5 text-teal-800" />
            <span>+ Record Expense</span>
          </Link>

          {/* Primary CTA: Dark teal pill button #0B2B28 */}
          {activeSession ? (
            <button
              type="button"
              onClick={() => setIsCloseModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white font-medium text-xs sm:text-sm shadow-pill hover:shadow-lg transition-all duration-200 group active:scale-95 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span>Close Register / End Shift</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsOpenRegisterOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white font-medium text-xs sm:text-sm shadow-pill hover:shadow-lg transition-all duration-200 group active:scale-95 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Unlock className="w-3.5 h-3.5" />
              </div>
              <span>Open New Register</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Analytical KPI Cards (4-Column Grid) */}
      <section
        aria-label="Cash Register & Financial KPIs"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Active Register Drawer */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Active Register Drawer
            </span>
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-teal-900 tracking-tight">
              {formatCurrency(activeDrawerCash)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700">
              {activeSession ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Expected Physical Cash in Counter</span>
                </>
              ) : (
                <span className="text-pharmacy-textMuted">No active session open</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Today's Operational Expenses */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Today&apos;s Store Expenses
            </span>
            <div className="p-2 rounded-2xl bg-amber-50 text-amber-700">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-900 tracking-tight">
              {formatCurrency(todayExpensesTotal)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-amber-800">
              <span>{expenses.filter((e) => e.date.includes("Oct 15, 2026")).length} payouts logged today</span>
            </div>
          </div>
        </div>

        {/* Card 3: Card & Digital Payments */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Card & Digital Settlements
            </span>
            <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-indigo-950 tracking-tight">
              {formatCurrency(nonCashPaymentsTotal)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-indigo-700">
              <TrendingUp className="w-3 h-3" />
              <span>Visa, Mastercard & Direct Bank</span>
            </div>
          </div>
        </div>

        {/* Card 4: Current Session Status */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Current Session Status
            </span>
            <div className="p-2 rounded-2xl bg-teal-50 text-teal-800">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            {activeSession ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-pharmacy-border">
                    <Image
                      src={activeSession.cashierAvatar}
                      alt={activeSession.cashierName}
                      fill
                      className="object-cover"
                      sizes="24px"
                    />
                  </div>
                  <span className="text-sm font-bold text-pharmacy-dark truncate">
                    {activeSession.cashierName}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 ml-auto">
                    ACTIVE
                  </span>
                </div>
                <div className="text-[11px] text-pharmacy-textMuted flex items-center justify-between">
                  <span>Float: <strong className="text-pharmacy-dark">{formatCurrency(activeSession.openingFloat)}</strong></span>
                  <span>{activeSession.openedAt.split(",")[1]}</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-lg font-bold text-pharmacy-textMuted">
                  Register Closed
                </div>
                <div className="text-[11px] text-pharmacy-textMuted mt-1">
                  Ready for next cashier shift opening
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Dual-Tab Card Container */}
      <section
        aria-label="Register Sessions and Expenses Ledger"
        className="bg-white rounded-3xl p-6 shadow-card border border-pharmacy-border/60"
      >
        {/* Tab Selection Bar */}
        <div className="flex items-center gap-2 pb-5 border-b border-pharmacy-borderLight">
          <button
            type="button"
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "sessions"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Cash Register Sessions & Shift History</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === "sessions"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {sessions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("expenses")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "expenses"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Operational Expenses & Petty Cash</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === "expenses"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {expenses.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Cash Register Sessions Table */}
        {activeTab === "sessions" && (
          <div className="mt-5">
            <RegisterSessionsTable
              sessions={sessions}
              onViewSession={(session) => setSelectedSessionForDetails(session)}
              onCloseActiveSession={() => setIsCloseModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Operational Expenses Table */}
        {activeTab === "expenses" && (
          <div className="mt-5">
            <ExpensesTable
              expenses={expenses}
              onOpenRecordModal={() => setIsRecordExpenseOpen(true)}
            />
          </div>
        )}
      </section>

      {/* Close Register / End Shift Modal */}
      <CloseRegisterModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        session={activeSession}
        onSessionClosed={handleSessionClosed}
      />

      {/* Record Expense Modal */}
      <RecordExpenseModal
        isOpen={isRecordExpenseOpen}
        onClose={() => setIsRecordExpenseOpen(false)}
        activeSession={activeSession}
        onExpenseRecorded={handleExpenseRecorded}
      />

      {/* Session Details / Reconciliation Modal */}
      <SessionDetailsModal
        isOpen={selectedSessionForDetails !== null}
        onClose={() => setSelectedSessionForDetails(null)}
        session={selectedSessionForDetails}
      />

      {/* Open New Register Modal */}
      <OpenRegisterModal
        isOpen={isOpenRegisterOpen}
        onClose={() => setIsOpenRegisterOpen(false)}
        onSessionOpened={handleSessionOpened}
      />
    </div>
  );
}
