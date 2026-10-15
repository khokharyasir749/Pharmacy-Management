"use client";

import React from "react";
import {
  Building2,
  FileBadge2,
  Receipt,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Globe2,
  Lock,
} from "lucide-react";
import { BusinessProfile } from "@/types/settings";

interface BusinessProfileSettingsProps {
  profile: BusinessProfile;
  onChange: (updated: BusinessProfile) => void;
}

export default function BusinessProfileSettings({
  profile,
  onChange,
}: BusinessProfileSettingsProps) {
  const handleChange = (field: keyof BusinessProfile, value: string) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Informative Header Banner */}
      <div className="p-4 rounded-2xl bg-pharmacy-canvas/50 border border-pharmacy-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-900 text-white">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-pharmacy-dark">
              Pharmacy Enterprise Licensing & Regulatory Localization (SRS Section 5.1 & 10)
            </h4>
            <p className="text-[11px] text-pharmacy-textMuted mt-0.5">
              These details appear on POS customer receipts, tax invoices, purchase orders, and official audit slips.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300 shadow-2xs self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Verified Retail Pharmacy
        </span>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section 1: Legal Registration & Identifiers */}
        <div className="space-y-4 p-5 rounded-2xl border border-pharmacy-border/80 bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-dark flex items-center gap-2 pb-2 border-b border-pharmacy-borderLight">
            <FileBadge2 className="w-4 h-4 text-teal-800" />
            <span>Store Legal Entity & License</span>
          </h3>

          {/* Pharmacy Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-pharmacy-dark">
              Pharmacy Legal Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={profile.pharmacyName}
              onChange={(e) => handleChange("pharmacyName", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs font-semibold text-pharmacy-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              placeholder="e.g. Shifa Pharmacy & General Store"
            />
          </div>

          {/* Branch Identifier */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-pharmacy-dark">
              Branch Identifier / Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={profile.branchIdentifier}
              onChange={(e) => handleChange("branchIdentifier", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs text-pharmacy-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              placeholder="e.g. Main Retail Branch - Lahore"
            />
          </div>

          {/* Drug License Number */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-pharmacy-dark">
                Provincial Drug License Number (DRAP) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" /> Mandated Form 9
              </span>
            </div>
            <input
              type="text"
              value={profile.drugLicenseNumber}
              onChange={(e) => handleChange("drugLicenseNumber", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs font-mono font-bold text-teal-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              placeholder="e.g. DL-PB-2024-8849"
            />
          </div>

          {/* Tax / NTN Registration Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-pharmacy-dark">
              Tax / NTN Registration Number (FBR / PRA)
            </label>
            <input
              type="text"
              value={profile.ntnNumber}
              onChange={(e) => handleChange("ntnNumber", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs font-mono text-pharmacy-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              placeholder="e.g. NTN-7419203-1"
            />
            <p className="text-[10px] text-pharmacy-textMuted">
              Appears on tax invoices and B2B wholesale credit receipts.
            </p>
          </div>
        </div>

        {/* Section 2: Contact, Currency & Localization */}
        <div className="space-y-4 p-5 rounded-2xl border border-pharmacy-border/80 bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-dark flex items-center gap-2 pb-2 border-b border-pharmacy-borderLight">
            <Globe2 className="w-4 h-4 text-teal-800" />
            <span>Contact, Localization & Operational Region</span>
          </h3>

          {/* Operating Currency & Timezone in 2-cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-pharmacy-dark">
                Operating Currency
              </label>
              <input
                type="text"
                disabled
                value={profile.operatingCurrency}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-slate-100 text-xs font-bold text-slate-700 cursor-not-allowed"
              />
              <span className="text-[10px] text-pharmacy-textMuted block">Fixed to Pakistani Rupee</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-pharmacy-dark">
                System Timezone
              </label>
              <input
                type="text"
                disabled
                value={profile.timezone}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-slate-100 text-xs font-medium text-slate-700 cursor-not-allowed"
              />
              <span className="text-[10px] text-pharmacy-textMuted block">PKT (UTC+05:00)</span>
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-pharmacy-dark">
                Official Store Phone
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs text-pharmacy-dark focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-pharmacy-dark">
                Customer Support Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs text-pharmacy-dark focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Physical Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-pharmacy-dark">
              Physical Store Address
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-pharmacy-textMuted" />
              <textarea
                rows={2}
                value={profile.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs text-pharmacy-dark focus:bg-white focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Operating Hours & Invoice Prefix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-pharmacy-dark">
                Dispensary Hours
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
                <input
                  type="text"
                  value={profile.operatingHours}
                  onChange={(e) => handleChange("operatingHours", e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs text-pharmacy-dark focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-pharmacy-dark">
                Invoice Number Prefix
              </label>
              <input
                type="text"
                value={profile.invoicePrefix}
                onChange={(e) => handleChange("invoicePrefix", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs font-mono font-bold text-pharmacy-dark focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
