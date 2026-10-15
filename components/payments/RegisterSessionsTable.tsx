"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Building2,
  Calendar,
  Wallet,
} from "lucide-react";
import { RegisterSession } from "@/types/payment";

interface RegisterSessionsTableProps {
  sessions: RegisterSession[];
  onViewSession: (session: RegisterSession) => void;
  onCloseActiveSession?: () => void;
}

export default function RegisterSessionsTable({
  sessions,
  onViewSession,
  onCloseActiveSession,
}: RegisterSessionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Closed">("All");

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        s.id.toLowerCase().includes(query) ||
        s.cashierName.toLowerCase().includes(query) ||
        s.branch.toLowerCase().includes(query) ||
        (s.varianceReason && s.varianceReason.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchQuery, statusFilter]);

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-pharmacy-borderLight">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
            <input
              type="text"
              placeholder="Search session ID, cashier, branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-full border border-pharmacy-border bg-pharmacy-canvas/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 text-pharmacy-dark placeholder:text-pharmacy-textMuted transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pharmacy-textMuted hover:text-pharmacy-dark"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick status tabs */}
          <div className="flex items-center gap-1 bg-pharmacy-canvas p-1 rounded-full border border-pharmacy-border text-xs">
            {(["All", "Active", "Closed"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  statusFilter === tab
                    ? "bg-white text-pharmacy-dark shadow-xs font-semibold"
                    : "text-pharmacy-textSecondary hover:text-pharmacy-dark"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-pharmacy-textMuted">
          <span>
            Showing <strong className="text-pharmacy-dark">{filteredSessions.length}</strong> of {sessions.length} sessions
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-pharmacy-border/70">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-pharmacy-canvas/60 text-pharmacy-textSecondary font-semibold uppercase tracking-wider text-[11px] border-b border-pharmacy-border/60">
              <th className="py-3 px-4">Session ID</th>
              <th className="py-3 px-4">Cashier / Staff</th>
              <th className="py-3 px-4 text-right">Opening Float</th>
              <th className="py-3 px-4 text-right">Expected Cash</th>
              <th className="py-3 px-4 text-right">Counted Cash</th>
              <th className="py-3 px-4 text-right">Variance</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharmacy-border/40">
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-pharmacy-textMuted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Wallet className="w-8 h-8 text-pharmacy-textMuted/60" />
                    <p className="font-medium text-sm text-pharmacy-textSecondary">
                      No register sessions match your search.
                    </p>
                    <p className="text-xs">Try clearing filters or checking active status.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSessions.map((session) => {
                const isActive = session.status === "Active";
                const variance = session.variance ?? 0;

                return (
                  <tr
                    key={session.id}
                    className={`transition-colors hover:bg-pharmacy-canvas/40 ${
                      isActive ? "bg-emerald-50/30" : ""
                    }`}
                  >
                    {/* Session ID & Branch */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-pharmacy-dark tracking-tight">
                          {session.id}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-pharmacy-textMuted flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[140px]">{session.branch}</span>
                      </div>
                      <div className="text-[10px] text-pharmacy-textMuted/80 mt-0.5">
                        {session.openedAt}
                      </div>
                    </td>

                    {/* Cashier / Staff */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-pharmacy-canvas border border-pharmacy-border flex-shrink-0">
                          <Image
                            src={session.cashierAvatar}
                            alt={session.cashierName}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-pharmacy-dark">
                            {session.cashierName}
                          </div>
                          <div className="text-[10px] text-pharmacy-textMuted">
                            {session.totalTransactions} transactions
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Opening Float */}
                    <td className="py-3.5 px-4 text-right font-medium text-pharmacy-textSecondary">
                      {formatCurrency(session.openingFloat)}
                    </td>

                    {/* Expected Cash */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-pharmacy-dark">
                        {formatCurrency(session.expectedCash)}
                      </div>
                      <div className="text-[10px] text-pharmacy-textMuted">
                        +Sales -Refunds -Exp
                      </div>
                    </td>

                    {/* Counted Cash */}
                    <td className="py-3.5 px-4 text-right">
                      {session.countedCash !== undefined ? (
                        <span className="font-bold text-pharmacy-dark">
                          {formatCurrency(session.countedCash)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Drawer In Use
                        </span>
                      )}
                    </td>

                    {/* Variance / Discrepancy */}
                    <td className="py-3.5 px-4 text-right">
                      {session.variance !== undefined ? (
                        session.variance === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                            $0.00 (Balanced)
                          </span>
                        ) : session.variance < 0 ? (
                          <div className="inline-flex flex-col items-end">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] bg-rose-100 text-rose-800 border border-rose-200">
                              <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                              -{formatCurrency(Math.abs(session.variance))}
                            </span>
                            <span className="text-[9px] text-rose-600 font-semibold mt-0.5">
                              Cash Shortage
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-end">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] bg-amber-100 text-amber-800 border border-amber-200">
                              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                              +{formatCurrency(session.variance)}
                            </span>
                            <span className="text-[9px] text-amber-700 font-semibold mt-0.5">
                              Cash Surplus
                            </span>
                          </div>
                        )
                      ) : (
                        <span className="text-pharmacy-textMuted text-[11px]">Pending Close</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/80">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Active (Open)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          <CheckCircle2 className="w-3 h-3 text-slate-500" />
                          Closed (Reconciled)
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewSession(session)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-pharmacy-border bg-white hover:bg-pharmacy-canvas text-pharmacy-dark font-medium transition-all shadow-xs text-xs"
                          title="View Session Summary / Breakdown"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-700" />
                          <span>Breakdown</span>
                        </button>

                        {isActive && onCloseActiveSession && (
                          <button
                            type="button"
                            onClick={onCloseActiveSession}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold transition-all text-xs"
                            title="Close Active Drawer"
                          >
                            <span>End Shift</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
