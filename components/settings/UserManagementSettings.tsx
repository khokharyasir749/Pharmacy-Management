"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Users,
  UserPlus,
  Shield,
  Check,
  X,
  Search,
  Lock,
  Building2,
  Phone,
  Mail,
  ToggleLeft,
  ToggleRight,
  Info,
} from "lucide-react";
import { UserAccount, RolePermission, UserRole } from "@/types/settings";
import { rbacMatrix } from "@/data/mockSettings";

interface UserManagementSettingsProps {
  users: UserAccount[];
  onAddUserClick: () => void;
  onToggleUserStatus: (userId: string) => void;
}

export default function UserManagementSettings({
  users,
  onAddUserClick,
  onToggleUserStatus,
}: UserManagementSettingsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("All");
  const [showMatrix, setShowMatrix] = useState(false);

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query) ||
      u.branch.toLowerCase().includes(query);

    const matchesRole =
      selectedRoleFilter === "All" || u.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "Pharmacy Manager":
        return "bg-teal-100 text-teal-900 border-teal-300";
      case "Pharmacist":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "Cashier":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "Inventory Staff":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "Accountant":
        return "bg-indigo-100 text-indigo-900 border-indigo-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-pharmacy-borderLight">
        <div>
          <h3 className="text-sm font-bold text-pharmacy-dark">
            Pharmacy Staff Accounts & Role-Based Access Control (RBAC)
          </h3>
          <p className="text-xs text-pharmacy-textMuted mt-0.5">
            Strict individual cashier accounting and least-privilege administrative roles (SRS Section 3).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Toggle Matrix View */}
          <button
            type="button"
            onClick={() => setShowMatrix(!showMatrix)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-pharmacy-border bg-white text-xs font-semibold text-pharmacy-textSecondary hover:bg-pharmacy-canvas transition-colors shadow-2xs"
          >
            <Shield className="w-3.5 h-3.5 text-teal-800" />
            <span>{showMatrix ? "Hide Permissions Matrix" : "View RBAC Matrix"}</span>
          </button>

          {/* Add User CTA */}
          <button
            type="button"
            onClick={onAddUserClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs font-semibold shadow-pill hover:shadow-lg transition-all active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add / Invite Staff</span>
          </button>
        </div>
      </div>

      {/* Visual Role Permissions Matrix preview (Collapsible / Toggleable) */}
      {showMatrix && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-4 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-950 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-800" />
              <span>Role Permissions Matrix (SRS Section 3.2 Matrix)</span>
            </h4>
            <span className="text-[11px] text-teal-800 font-medium">
              System-Enforced Safeguards
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-teal-200/80 bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-2 text-center">View Catalog</th>
                  <th className="py-2.5 px-2 text-center">View Cost Price</th>
                  <th className="py-2.5 px-2 text-center">Stock Adjustment</th>
                  <th className="py-2.5 px-2 text-center">Refund Approval</th>
                  <th className="py-2.5 px-2 text-center">Close Register</th>
                  <th className="py-2.5 px-2 text-center">User Admin</th>
                  <th className="py-2.5 px-2 text-center">View Reports</th>
                  <th className="py-2.5 px-2 text-center">DB Backup</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rbacMatrix.map((item) => (
                  <tr key={item.role} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {item.permissions.viewCatalog ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {item.permissions.viewCostPrice ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {item.permissions.stockAdjustment ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {item.permissions.refundApproval ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {item.permissions.closeRegister ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {item.permissions.userAdmin ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {item.permissions.viewReports ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {item.permissions.databaseBackup ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
          <input
            type="text"
            placeholder="Search staff name, email, role, branch..."
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

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {["All", "Super Admin", "Pharmacy Manager", "Pharmacist", "Cashier", "Inventory Staff"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRoleFilter(r)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                selectedRoleFilter === r
                  ? "bg-pharmacy-dark text-white font-semibold shadow-xs"
                  : "bg-pharmacy-canvas text-pharmacy-textSecondary hover:text-pharmacy-dark border border-pharmacy-border"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Accounts Table */}
      <div className="overflow-x-auto rounded-2xl border border-pharmacy-border/70">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-pharmacy-canvas/60 text-pharmacy-textSecondary font-semibold uppercase tracking-wider text-[11px] border-b border-pharmacy-border/60">
              <th className="py-3 px-4">Staff Member & Email</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Branch Scope</th>
              <th className="py-3 px-4">Last Login (PKT)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pharmacy-border/40">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-pharmacy-textMuted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="w-8 h-8 text-pharmacy-textMuted/60" />
                    <p className="font-medium text-sm text-pharmacy-textSecondary">
                      No staff accounts found.
                    </p>
                    <p className="text-xs">Try clearing filters or search keywords.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-pharmacy-canvas/40"
                >
                  {/* Avatar, Name & Email */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-pharmacy-border flex-shrink-0">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-pharmacy-dark">{user.name}</div>
                        <div className="text-[11px] text-pharmacy-textMuted">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Assigned Role */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Branch Scope */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-pharmacy-textSecondary">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-pharmacy-textMuted" />
                      <span>{user.branch}</span>
                    </div>
                  </td>

                  {/* Last Login */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-pharmacy-textSecondary text-[11px]">
                    {user.lastLogin}
                  </td>

                  {/* Active Status Badge */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        Suspended
                      </span>
                    )}
                  </td>

                  {/* Toggle / Action */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onToggleUserStatus(user.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                        user.isActive
                          ? "border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100"
                          : "border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                      }`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
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
