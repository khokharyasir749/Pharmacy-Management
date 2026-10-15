"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  Printer,
  Database,
  Save,
  CheckCircle2,
  X,
  ShieldCheck,
  Sparkles,
  Lock,
  Clock,
  HardDrive,
} from "lucide-react";
import BusinessProfileSettings from "@/components/settings/BusinessProfileSettings";
import UserManagementSettings from "@/components/settings/UserManagementSettings";
import ReceiptHardwareSettings from "@/components/settings/ReceiptHardwareSettings";
import BackupSecuritySettings from "@/components/settings/BackupSecuritySettings";
import AddUserModal from "@/components/settings/AddUserModal";
import {
  initialBusinessProfile,
  initialUsers,
  initialReceiptSettings,
  initialBackupSnapshots,
  initialSecurityPolicies,
} from "@/data/mockSettings";
import {
  BusinessProfile,
  UserAccount,
  ReceiptSettings,
  BackupSnapshot,
  SecurityPolicies,
} from "@/types/settings";

type SettingsTab = "profile" | "users" | "receipt" | "backup";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // State
  const [profile, setProfile] = useState<BusinessProfile>(initialBusinessProfile);
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [receiptSettings, setReceiptSettings] =
    useState<ReceiptSettings>(initialReceiptSettings);
  const [snapshots, setSnapshots] =
    useState<BackupSnapshot[]>(initialBackupSnapshots);
  const [policies, setPolicies] =
    useState<SecurityPolicies>(initialSecurityPolicies);

  // Modals & Async States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save All Changes CTA Handler
  const handleSaveAll = () => {
    setToastMessage("Configuration changes saved successfully across all store terminals!");
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Manual Backup Snapshot Trigger
  const handleTriggerManualBackup = () => {
    setIsBackingUp(true);

    setTimeout(() => {
      const now = new Date();
      const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
      const timePart = now.toTimeString().slice(0, 8).replace(/:/g, "");
      const newSnapshot: BackupSnapshot = {
        id: `BKP-${datePart}-${timePart}`,
        timestamp: `${now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}, ${now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })} PKT`,
        size: "25.1 MB",
        targetStorage: "Secure Cloud Bucket - Encrypted AES-256 (Asia-South1)",
        status: "Verified Restorable",
        checksum: `sha256:${Math.random().toString(16).slice(2, 10)}b82c`,
      };

      setSnapshots((prev) => [newSnapshot, ...prev]);
      setIsBackingUp(false);
      setToastMessage("Disaster recovery snapshot successfully encrypted and archived (AC-15 Passed).");
      setTimeout(() => setToastMessage(null), 5000);
    }, 1500);
  };

  // Test Restore Simulation Handler
  const handleSimulateRestore = (snapshotId: string) => {
    setToastMessage(`Rollback simulation completed for ${snapshotId}: Database restored atomically with 0 integrity errors.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Toggle user active status
  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextState = !u.isActive;
          setToastMessage(
            `Staff account "${u.name}" has been ${nextState ? "activated" : "suspended"}.`
          );
          setTimeout(() => setToastMessage(null), 3500);
          return { ...u, isActive: nextState };
        }
        return u;
      })
    );
  };

  // Add new staff account
  const handleUserAdded = (newUser: UserAccount) => {
    setUsers((prev) => [newUser, ...prev]);
    setToastMessage(`Staff account for "${newUser.name}" (${newUser.role}) created successfully!`);
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
            System Settings & Administration
          </h1>
          <p className="text-xs sm:text-sm text-pharmacy-textMuted mt-0.5">
            Configure pharmacy business profile, user roles & permissions, thermal receipt formats, and database disaster backups.
          </p>
        </div>

        {/* Right Action Toolbar: Primary Save All CTA */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white font-medium text-xs sm:text-sm shadow-pill hover:shadow-lg transition-all duration-200 group active:scale-95 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Save className="w-3.5 h-3.5" />
            </div>
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Top System Health & Configuration Summary Banner */}
      <section
        aria-label="Configuration Overview"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Business Profile */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Store Legal Entity
            </span>
            <div className="p-2 rounded-2xl bg-teal-50 text-teal-800">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-bold text-sm text-pharmacy-dark truncate">
              {profile.pharmacyName}
            </div>
            <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
              DRAP: {profile.drugLicenseNumber}
            </div>
          </div>
        </div>

        {/* Card 2: Active Users */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Active Staff Accounts
            </span>
            <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <div className="text-2xl font-extrabold text-indigo-950 tracking-tight">
              {users.filter((u) => u.isActive).length} / {users.length}
            </div>
            <span className="text-[11px] text-pharmacy-textMuted">Individual accounts</span>
          </div>
        </div>

        {/* Card 3: POS Thermal Printer */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Thermal POS Hardware
            </span>
            <div className="p-2 rounded-2xl bg-amber-50 text-amber-700">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-bold text-sm text-amber-950">
              {receiptSettings.paperWidth}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              QR Code + Cash Kick Enabled
            </div>
          </div>
        </div>

        {/* Card 4: Backup Status */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Disaster Recovery Status
            </span>
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-bold text-xs text-emerald-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AC-15 Compliant</span>
            </div>
            <div className="text-[11px] text-pharmacy-textMuted mt-0.5">
              Last backup: {snapshots[0]?.timestamp.split(",")[0]}
            </div>
          </div>
        </div>
      </section>

      {/* Main 4-Tab Settings Hub Card Container */}
      <section
        aria-label="Settings Hub Structure"
        className="bg-white rounded-3xl p-6 shadow-card border border-pharmacy-border/60"
      >
        {/* Tab Selection Bar */}
        <div className="flex items-center gap-2 pb-5 border-b border-pharmacy-borderLight overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Business Profile & Localization</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "users"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Accounts & RBAC Permissions</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === "users"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("receipt")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "receipt"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Receipt & POS Hardware Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("backup")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "backup"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Backup, Disaster Recovery & Security</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === "backup"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {snapshots.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Business Profile & Localization */}
        {activeTab === "profile" && (
          <div className="mt-5">
            <BusinessProfileSettings
              profile={profile}
              onChange={(updated) => setProfile(updated)}
            />
          </div>
        )}

        {/* Tab 2: User Accounts & RBAC Permissions */}
        {activeTab === "users" && (
          <div className="mt-5">
            <UserManagementSettings
              users={users}
              onAddUserClick={() => setIsAddUserOpen(true)}
              onToggleUserStatus={handleToggleUserStatus}
            />
          </div>
        )}

        {/* Tab 3: Receipt & POS Hardware */}
        {activeTab === "receipt" && (
          <div className="mt-5">
            <ReceiptHardwareSettings
              settings={receiptSettings}
              businessProfile={profile}
              onChange={(updated) => setReceiptSettings(updated)}
            />
          </div>
        )}

        {/* Tab 4: Backup, Disaster Recovery & Security */}
        {activeTab === "backup" && (
          <div className="mt-5">
            <BackupSecuritySettings
              snapshots={snapshots}
              policies={policies}
              onPoliciesChange={(updated) => setPolicies(updated)}
              onTriggerManualBackup={handleTriggerManualBackup}
              isBackingUp={isBackingUp}
              onSimulateRestore={handleSimulateRestore}
            />
          </div>
        )}
      </section>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
}
