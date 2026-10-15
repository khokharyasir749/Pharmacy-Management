"use client";

import React, { useState } from "react";
import {
  Printer,
  Receipt,
  QrCode,
  Barcode,
  Scissors,
  Wallet,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Info,
} from "lucide-react";
import { ReceiptSettings, BusinessProfile } from "@/types/settings";

interface ReceiptHardwareSettingsProps {
  settings: ReceiptSettings;
  businessProfile: BusinessProfile;
  onChange: (updated: ReceiptSettings) => void;
}

export default function ReceiptHardwareSettings({
  settings,
  businessProfile,
  onChange,
}: ReceiptHardwareSettingsProps) {
  const [pulseTesting, setPulseTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleToggle = (field: keyof ReceiptSettings) => {
    onChange({
      ...settings,
      [field]: !settings[field],
    });
  };

  const handleWidthChange = (width: "80mm Standard" | "58mm Compact") => {
    onChange({
      ...settings,
      paperWidth: width,
    });
  };

  const handleTestCashDrawer = () => {
    setPulseTesting(true);
    setTestResult(null);

    // Simulate hardware 24V RJ-11 electrical kick pulse to printer port
    setTimeout(() => {
      setPulseTesting(false);
      setTestResult("✅ Cash drawer kick-pulse signal (ESC/POS 27,112,0,25,250) sent successfully!");
      setTimeout(() => setTestResult(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Informative Header */}
      <div className="p-4 rounded-2xl bg-pharmacy-canvas/50 border border-pharmacy-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-900 text-white">
            <Printer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-pharmacy-dark">
              Thermal POS Printer & Cash Drawer Hardware (ESC/POS)
            </h4>
            <p className="text-[11px] text-pharmacy-textMuted mt-0.5">
              Customize receipt typography, tax headers, verification QR codes, and hardware trigger pulses.
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Left Controls, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Settings Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Paper Width Selection */}
          <div className="p-5 rounded-2xl border border-pharmacy-border bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-dark">
              Thermal Paper Width
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleWidthChange("80mm Standard")}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  settings.paperWidth === "80mm Standard"
                    ? "border-teal-900 bg-teal-50/50 ring-2 ring-teal-900/10 font-bold text-teal-950"
                    : "border-pharmacy-border bg-pharmacy-canvas/30 hover:bg-pharmacy-canvas text-pharmacy-textSecondary"
                }`}
              >
                <div className="text-xs font-bold">80mm Standard (Recommended)</div>
                <div className="text-[11px] font-normal text-pharmacy-textMuted mt-0.5">
                  Full 48-column high-speed dispensary receipt format
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleWidthChange("58mm Compact")}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  settings.paperWidth === "58mm Compact"
                    ? "border-teal-900 bg-teal-50/50 ring-2 ring-teal-900/10 font-bold text-teal-950"
                    : "border-pharmacy-border bg-pharmacy-canvas/30 hover:bg-pharmacy-canvas text-pharmacy-textSecondary"
                }`}
              >
                <div className="text-xs font-bold">58mm Compact Mobile</div>
                <div className="text-[11px] font-normal text-pharmacy-textMuted mt-0.5">
                  Condensed 32-column format for portable Bluetooth printers
                </div>
              </button>
            </div>
          </div>

          {/* Header & Footer Customization */}
          <div className="p-5 rounded-2xl border border-pharmacy-border bg-white space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-dark">
              Receipt Messages & Policies
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-pharmacy-dark">
                Receipt Welcome Header Line
              </label>
              <input
                type="text"
                value={settings.headerMessage}
                onChange={(e) =>
                  onChange({ ...settings, headerMessage: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs text-pharmacy-dark focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-pharmacy-dark">
                Return & Refund Policy Footer
              </label>
              <textarea
                rows={2}
                value={settings.footerMessage}
                onChange={(e) =>
                  onChange({ ...settings, footerMessage: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas/30 text-xs text-pharmacy-dark focus:bg-white focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Toggles & Hardware Options */}
          <div className="p-5 rounded-2xl border border-pharmacy-border bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-dark">
              Hardware Triggers & Verification Tokens
            </h3>

            <div className="divide-y divide-pharmacy-borderLight text-xs">
              {/* QR Code */}
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-pharmacy-dark flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-teal-800" />
                    <span>Print QR Verification Token</span>
                  </div>
                  <div className="text-[11px] text-pharmacy-textMuted">
                    Allows patients to scan and verify authenticity of digital prescription bill
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showQrCode}
                  onChange={() => handleToggle("showQrCode")}
                  className="w-4 h-4 accent-teal-800 rounded cursor-pointer"
                />
              </div>

              {/* Barcode */}
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-pharmacy-dark flex items-center gap-1.5">
                    <Barcode className="w-3.5 h-3.5 text-teal-800" />
                    <span>Print Code-128 Invoice Barcode</span>
                  </div>
                  <div className="text-[11px] text-pharmacy-textMuted">
                    Allows 1-second barcode scan for processing customer returns & exchanges
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showBarcode}
                  onChange={() => handleToggle("showBarcode")}
                  className="w-4 h-4 accent-teal-800 rounded cursor-pointer"
                />
              </div>

              {/* Auto Cut */}
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-pharmacy-dark flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-teal-800" />
                    <span>Auto-Cut Paper After Transaction</span>
                  </div>
                  <div className="text-[11px] text-pharmacy-textMuted">
                    Sends partial guillotine blade cut command at bill termination
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoCutPaper}
                  onChange={() => handleToggle("autoCutPaper")}
                  className="w-4 h-4 accent-teal-800 rounded cursor-pointer"
                />
              </div>

              {/* Cash Drawer Pulse */}
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-pharmacy-dark flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-teal-800" />
                    <span>Auto-Kick Cash Drawer On Cash Tender</span>
                  </div>
                  <div className="text-[11px] text-pharmacy-textMuted">
                    Triggers RJ-11 solenoid pulse whenever a cash settlement is committed
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.cashDrawerPulse}
                  onChange={() => handleToggle("cashDrawerPulse")}
                  className="w-4 h-4 accent-teal-800 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Test Hardware Kick Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestCashDrawer}
                disabled={pulseTesting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-pharmacy-border bg-pharmacy-canvas hover:bg-pharmacy-canvas/80 text-xs font-semibold text-pharmacy-dark transition-all disabled:opacity-50"
              >
                <Wallet className="w-3.5 h-3.5 text-teal-800" />
                <span>
                  {pulseTesting
                    ? "Sending 24V Pulse Signal..."
                    : "Test Drawer Kick Signal Now"}
                </span>
              </button>
              {testResult && (
                <div className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  {testResult}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Live Preview Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-dark flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-teal-800" />
              <span>Live Thermal Receipt Preview</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {settings.paperWidth}
            </span>
          </div>

          {/* Thermal Paper Realistic Mock */}
          <div
            className={`mx-auto bg-white border border-slate-300 rounded-2xl p-5 shadow-card font-mono text-[11px] text-slate-800 space-y-3 transition-all ${
              settings.paperWidth === "80mm Standard" ? "max-w-sm" : "max-w-xs"
            }`}
          >
            {/* Header */}
            <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-300">
              <div className="font-extrabold text-xs uppercase tracking-tight">
                {businessProfile.pharmacyName}
              </div>
              <div className="text-[10px] text-slate-500">
                {businessProfile.branchIdentifier}
              </div>
              <div className="text-[9px] text-slate-500">
                DRAP Lic: {businessProfile.drugLicenseNumber}
              </div>
              <div className="text-[9px] text-slate-500">
                NTN: {businessProfile.ntnNumber}
              </div>
              <div className="text-[10px] italic text-slate-600 pt-1">
                &ldquo;{settings.headerMessage}&rdquo;
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="space-y-0.5 text-[10px] text-slate-600">
              <div className="flex justify-between">
                <span>Inv: PMS-2026-8904</span>
                <span>Oct 15, 2026 09:42 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier: Budiono S.</span>
                <span>Counter: #01</span>
              </div>
              <div>Patient: Walk-in Retail Customer</div>
            </div>

            {/* Line Items */}
            <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1 text-[10px]">
              <div className="flex justify-between font-bold">
                <span>ITEM</span>
                <span>QTY x PRICE = AMT</span>
              </div>
              <div className="space-y-0.5">
                <div className="font-semibold">Augmentin 625mg Tab</div>
                <div className="flex justify-between text-slate-600">
                  <span>Batch: BTH-9940</span>
                  <span>1 x $18.50 = $18.50</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="font-semibold">Panadol Extra 500mg</div>
                <div className="flex justify-between text-slate-600">
                  <span>Batch: BTH-3312</span>
                  <span>2 x $4.00 = $8.00</span>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>$26.50</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Discounts (0%):</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-dashed border-slate-300">
                <span>TOTAL PAID (CASH):</span>
                <span>$26.50</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[9px]">
                <span>Tendered: $30.00</span>
                <span>Change: $3.50</span>
              </div>
            </div>

            {/* QR / Barcode Preview */}
            {(settings.showQrCode || settings.showBarcode) && (
              <div className="text-center pt-2 space-y-2 border-t border-dashed border-slate-300">
                {settings.showQrCode && (
                  <div className="inline-block p-2 bg-slate-100 rounded-lg border border-slate-200">
                    <QrCode className="w-12 h-12 text-slate-800 mx-auto" />
                    <span className="text-[8px] text-slate-500 block mt-0.5">Scan to Verify</span>
                  </div>
                )}
                {settings.showBarcode && (
                  <div className="text-center">
                    <Barcode className="w-36 h-7 text-slate-800 mx-auto" />
                    <span className="text-[8px] font-mono text-slate-600">PMS-2026-8904</span>
                  </div>
                )}
              </div>
            )}

            {/* Footer Message */}
            <div className="text-center pt-2 border-t border-dashed border-slate-300 text-[9px] text-slate-500 leading-tight">
              {settings.footerMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
