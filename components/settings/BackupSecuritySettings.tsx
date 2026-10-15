"use client";

import React, { useState } from "react";
import {
  Database,
  Shield,
  ShieldCheck,
  Download,
  RotateCcw,
  Clock,
  Lock,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileCheck,
} from "lucide-react";
import { BackupSnapshot, SecurityPolicies } from "@/types/settings";

interface BackupSecuritySettingsProps {
  snapshots: BackupSnapshot[];
  policies: SecurityPolicies;
  onPoliciesChange: (updated: SecurityPolicies) => void;
  onTriggerManualBackup: () => void;
  isBackingUp: boolean;
  onSimulateRestore: (snapshotId: string) => void;
}

export default function BackupSecuritySettings({
  snapshots,
  policies,
  onPoliciesChange,
  onTriggerManualBackup,
  isBackingUp,
  onSimulateRestore,
}: BackupSecuritySettingsProps) {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownload = (snapshot: BackupSnapshot) => {
    // Generate dummy dump file
    const dumpContent = `-- PHARMACY MANAGEMENT SYSTEM (PMS) ENCRYPTED BACKUP DUMP\n-- Snapshot: ${snapshot.id}\n-- Timestamp: ${snapshot.timestamp}\n-- Checksum: ${snapshot.checksum}\n-- Encryption: AES-256-GCM\n-- Verified Restorable: AC-15 Passed\n`;
    const blob = new Blob([dumpContent], { type: "application/gzip" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${snapshot.id}.sql.gz`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast(`Archive dump "${snapshot.id}.sql.gz" downloaded.`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast alert for download */}
      {downloadToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-pharmacy-canvas/50 border border-pharmacy-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-900 text-white">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-pharmacy-dark">
              Disaster Recovery, Automated Backups & System Hardening (SRS Section 9 & AC-15)
            </h4>
            <p className="text-[11px] text-pharmacy-textMuted mt-0.5">
              Daily encrypted snapshots with cryptographic SHA-256 verification and atomic rollback simulations.
            </p>
          </div>
        </div>

        {/* Trigger Manual Backup CTA */}
        <button
          type="button"
          onClick={onTriggerManualBackup}
          disabled={isBackingUp}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs font-semibold shadow-pill hover:shadow-lg transition-all disabled:opacity-60 active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Database className={`w-3.5 h-3.5 ${isBackingUp ? "animate-spin" : ""}`} />
          <span>{isBackingUp ? "Encrypting Snapshot..." : "Create Immediate Backup Now"}</span>
        </button>
      </div>

      {/* Backup Schedule & Security Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Backup Schedule Policy */}
        <div className="p-5 rounded-2xl border border-pharmacy-border bg-white space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-dark flex items-center gap-1.5 pb-2 border-b border-pharmacy-borderLight">
            <Clock className="w-4 h-4 text-teal-800" />
            <span>Automated Backup Schedule Policy</span>
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-pharmacy-dark">
              Automated Snapshot Frequency
            </label>
            <select
              value={policies.backupFrequency}
              onChange={(e) =>
                onPoliciesChange({
                  ...policies,
                  backupFrequency: e.target.value as any,
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs font-semibold text-pharmacy-dark focus:bg-white focus:outline-none"
            >
              <option value="Daily at 02:00 AM PKT">Daily at 02:00 AM PKT (Default)</option>
              <option value="Hourly Snapshots">Hourly Snapshots (High Volume)</option>
              <option value="Weekly on Sundays">Weekly on Sundays</option>
            </select>
            <p className="text-[11px] text-pharmacy-textMuted">
              Offsite cold backup is dispatched automatically without interrupting billing operations.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/80 text-[11px] text-teal-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>AC-15 Compliance Verified</span>
            </div>
            <div>
              Automated integrity checks verify that all catalog items, batches, customer ledgers, and transactions can be restored atomically in &lt; 5 minutes.
            </div>
          </div>
        </div>

        {/* Security Policies */}
        <div className="p-5 rounded-2xl border border-pharmacy-border bg-white space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-dark flex items-center gap-1.5 pb-2 border-b border-pharmacy-borderLight">
            <Lock className="w-4 h-4 text-teal-800" />
            <span>Access Control & Security Hardening</span>
          </h3>

          {/* Session Timeout */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-pharmacy-dark">
              POS Inactivity Session Timeout
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[15, 30, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() =>
                    onPoliciesChange({ ...policies, sessionTimeoutMinutes: mins })
                  }
                  className={`py-2 rounded-xl border font-bold text-xs transition-all ${
                    policies.sessionTimeoutMinutes === mins
                      ? "border-teal-900 bg-teal-50 text-teal-950 ring-2 ring-teal-900/10"
                      : "border-pharmacy-border bg-pharmacy-canvas/40 text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </div>

          {/* Two-Factor Authentication Toggle */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-pharmacy-dark">
                Enforce Two-Factor Authentication (2FA)
              </div>
              <div className="text-[11px] text-pharmacy-textMuted">
                Mandatory for Super Admin & Pharmacy Manager logins
              </div>
            </div>
            <input
              type="checkbox"
              checked={policies.enforce2FA}
              onChange={() =>
                onPoliciesChange({ ...policies, enforce2FA: !policies.enforce2FA })
              }
              className="w-4 h-4 accent-teal-800 rounded cursor-pointer"
            />
          </div>

          {/* Auto Logoff Toggle */}
          <div className="pt-1 flex items-center justify-between text-xs border-t border-pharmacy-borderLight">
            <div>
              <div className="font-semibold text-pharmacy-dark">
                Auto-Lock Register on Cashier Walk-away
              </div>
              <div className="text-[11px] text-pharmacy-textMuted">
                Requires 4-digit PIN re-entry to unlock cash register
              </div>
            </div>
            <input
              type="checkbox"
              checked={policies.autoLogoffOnIdle}
              onChange={() =>
                onPoliciesChange({
                  ...policies,
                  autoLogoffOnIdle: !policies.autoLogoffOnIdle,
                })
              }
              className="w-4 h-4 accent-teal-800 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Recent Backup Snapshots Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-dark flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-teal-800" />
            <span>Encrypted Disaster Snapshots Archive</span>
          </h3>
          <span className="text-xs text-pharmacy-textMuted">
            Showing <strong className="text-pharmacy-dark">{snapshots.length}</strong> verified snapshots
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-pharmacy-border/70">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pharmacy-canvas/60 text-pharmacy-textSecondary font-semibold uppercase tracking-wider text-[11px] border-b border-pharmacy-border/60">
                <th className="py-3 px-4">Snapshot ID & Checksum</th>
                <th className="py-3 px-4">Timestamp (PKT)</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Target Vault Storage</th>
                <th className="py-3 px-4 text-center">Verification Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pharmacy-border/40">
              {snapshots.map((snap) => (
                <tr
                  key={snap.id}
                  className="transition-colors hover:bg-pharmacy-canvas/40"
                >
                  {/* Snapshot ID & Checksum */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-pharmacy-dark">{snap.id}</div>
                    <div className="text-[10px] font-mono text-pharmacy-textMuted">
                      {snap.checksum}
                    </div>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-pharmacy-textSecondary">
                    {snap.timestamp}
                  </td>

                  {/* Size */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-pharmacy-dark">
                    {snap.size}
                  </td>

                  {/* Target Storage */}
                  <td className="py-3.5 px-4 max-w-xs text-pharmacy-textSecondary">
                    <div className="truncate">{snap.targetStorage}</div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {snap.status}
                    </span>
                  </td>

                  {/* Actions: Download & Simulate Restore */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDownload(snap)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-pharmacy-border bg-white hover:bg-pharmacy-canvas text-pharmacy-dark text-[11px] font-medium transition-colors shadow-2xs"
                        title="Download compressed SQL dump"
                      >
                        <Download className="w-3 h-3 text-teal-800" />
                        <span>Download</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSimulateRestore(snap.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-900 text-[11px] font-semibold transition-colors"
                        title="Simulate disaster restore"
                      >
                        <RotateCcw className="w-3 h-3 text-teal-700" />
                        <span>Test Restore</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
