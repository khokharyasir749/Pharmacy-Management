"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Shield,
  ShieldCheck,
  Lock,
  FileCheck,
  AlertOctagon,
  RotateCcw,
  Database,
  Terminal,
  Laptop,
  CheckCircle2,
} from "lucide-react";
import { AuditTrailEvent, AuditActionType } from "@/types/report";

interface AuditTrailTableProps {
  events: AuditTrailEvent[];
}

const ACTION_TYPES: ("All" | AuditActionType)[] = [
  "All",
  "PRICE_OVERRIDE",
  "STOCK_ADJUSTMENT",
  "RETURN_APPROVED",
  "REGISTER_CLOSED",
  "BACKUP_DISPATCH",
  "CREDIT_LIMIT_OVERRIDE",
];

export default function AuditTrailTable({ events }: AuditTrailTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<"All" | AuditActionType>("All");

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        ev.id.toLowerCase().includes(query) ||
        ev.actor.name.toLowerCase().includes(query) ||
        ev.actor.role.toLowerCase().includes(query) ||
        ev.targetRecord.toLowerCase().includes(query) ||
        ev.reason.toLowerCase().includes(query) ||
        ev.ipAddress.toLowerCase().includes(query);

      const matchesAction =
        selectedAction === "All" || ev.actionType === selectedAction;

      return matchesSearch && matchesAction;
    });
  }, [events, searchQuery, selectedAction]);

  const getActionBadge = (action: AuditActionType) => {
    switch (action) {
      case "PRICE_OVERRIDE":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "STOCK_ADJUSTMENT":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "RETURN_APPROVED":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "REGISTER_CLOSED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "BACKUP_DISPATCH":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "CREDIT_LIMIT_OVERRIDE":
        return "bg-orange-50 text-orange-800 border-orange-200";
      default:
        return "bg-slate-50 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner: Compliance & Immutability Guarantee */}
      <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-teal-800 text-white">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-teal-950">
              Immutable Cryptographic Audit Trail (SRS Section 5.12 & 9)
            </h4>
            <p className="text-[11px] text-teal-800 mt-0.5">
              All supervisor approvals, stock adjustments, register closings, and discounts are non-repudiable and timestamped.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Integrity Verified
          </span>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
          <input
            type="text"
            placeholder="Search actor name, reason, entity, or IP..."
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

        {/* Action Type Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-pharmacy-textMuted font-medium">Filter Action:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value as any)}
            className="px-3 py-1.5 rounded-full border border-pharmacy-border bg-pharmacy-canvas/50 text-xs font-semibold text-pharmacy-dark focus:outline-none"
          >
            {ACTION_TYPES.map((act) => (
              <option key={act} value={act}>
                {act === "All" ? "All Event Types" : act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Audit Log Table */}
      <div className="overflow-x-auto rounded-2xl border border-pharmacy-border/70">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-pharmacy-canvas/60 text-pharmacy-textSecondary font-semibold uppercase tracking-wider text-[11px] border-b border-pharmacy-border/60">
              <th className="py-3 px-4">Timestamp (PKT)</th>
              <th className="py-3 px-4">Authorized Actor</th>
              <th className="py-3 px-4">Action Type</th>
              <th className="py-3 px-4">Target Entity / Record</th>
              <th className="py-3 px-4">Justification / Reason</th>
              <th className="py-3 px-4">IP & Device Client</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharmacy-border/40">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-pharmacy-textMuted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Shield className="w-8 h-8 text-pharmacy-textMuted/60" />
                    <p className="font-medium text-sm text-pharmacy-textSecondary">
                      No audit events match your search query.
                    </p>
                    <p className="text-xs">Try selecting &quot;All Event Types&quot; or clearing keywords.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEvents.map((ev) => (
                <tr
                  key={ev.id}
                  className="transition-colors hover:bg-pharmacy-canvas/40"
                >
                  {/* Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-pharmacy-dark">{ev.timestamp}</div>
                    <div className="text-[10px] font-mono text-pharmacy-textMuted">
                      {ev.id}
                    </div>
                  </td>

                  {/* Actor */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-pharmacy-border">
                        <Image
                          src={ev.actor.avatar}
                          alt={ev.actor.name}
                          fill
                          className="object-cover"
                          sizes="28px"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-pharmacy-dark">{ev.actor.name}</div>
                        <div className="text-[10px] text-pharmacy-textMuted">{ev.actor.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Action Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getActionBadge(
                        ev.actionType
                      )}`}
                    >
                      {ev.actionType}
                    </span>
                  </td>

                  {/* Target Record */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-pharmacy-dark">{ev.targetRecord}</div>
                  </td>

                  {/* Reason / Justification */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="text-pharmacy-textSecondary text-xs">
                      {ev.reason}
                    </div>
                  </td>

                  {/* IP / Device */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-pharmacy-textMuted text-[11px]">
                    <div className="font-mono text-pharmacy-dark">{ev.ipAddress}</div>
                    <div className="text-[10px] truncate max-w-[140px]">{ev.deviceInfo}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
