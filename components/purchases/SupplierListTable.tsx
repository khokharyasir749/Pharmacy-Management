"use client";

import React, { useState } from "react";
import ModalPortal from "@/components/common/ModalPortal";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Supplier } from "@/types/purchase";

interface SupplierListTableProps {
  suppliers: Supplier[];
  onRecordPayment: (supplier: Supplier) => void;
}

export default function SupplierListTable({
  suppliers,
  onRecordPayment,
}: SupplierListTableProps) {
  const [selectedLedgerSupplier, setSelectedLedgerSupplier] = useState<Supplier | null>(null);

  return (
    <div className="space-y-4">
      {/* Table Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pharmacy-borderLight">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold tracking-tight text-pharmacy-dark">
              Suppliers Directory & Balance Ledgers
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pharmacy-canvas text-pharmacy-textSecondary">
              {suppliers.length} vendors
            </span>
          </div>
          <p className="text-xs text-pharmacy-textMuted mt-0.5">
            Verified pharmaceutical distributors, credit accounts, and payable settlements
          </p>
        </div>
      </div>

      {/* Table Canvas with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[940px]">
          <thead>
            <tr className="border-b border-pharmacy-borderLight text-xs font-semibold text-pharmacy-textSecondary/90 select-none">
              <th className="py-3.5 px-4">Distributor Company</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">Payment Terms</th>
              <th className="py-3.5 px-4">Total Orders</th>
              <th className="py-3.5 px-4">Outstanding Balance</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-pharmacy-borderLight text-sm">
            {suppliers.map((supplier) => {
              const hasBalance = supplier.outstandingBalance > 0;

              return (
                <tr
                  key={supplier.id}
                  className="hover:bg-[#FAFDFC] transition-colors duration-150"
                >
                  {/* Distributor Company */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800 flex-shrink-0 mt-0.5">
                        <Building2 className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-pharmacy-textPrimary">
                          {supplier.name}
                        </span>
                        <span className="text-[11px] text-pharmacy-textMuted">
                          Rep: {supplier.representative}
                        </span>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-700">
                          <span>★ {supplier.rating} Vendor Rating</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col text-xs text-pharmacy-textSecondary space-y-0.5">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-pharmacy-textMuted" />
                        {supplier.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-pharmacy-textMuted" />
                        {supplier.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-pharmacy-textMuted truncate max-w-[200px]">
                        <MapPin className="w-3 h-3 text-pharmacy-textMuted" />
                        {supplier.address}
                      </span>
                    </div>
                  </td>

                  {/* Payment Terms */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200/60">
                      {supplier.paymentTerms}
                    </span>
                  </td>

                  {/* Total Orders */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-pharmacy-dark">
                        {supplier.totalOrdersCount} orders
                      </span>
                      <span className="text-[11px] text-pharmacy-textMuted">Lifetime POs</span>
                    </div>
                  </td>

                  {/* Outstanding Balance */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span
                        className={`font-bold text-sm ${
                          hasBalance ? "text-rose-600" : "text-emerald-700"
                        }`}
                      >
                        ${supplier.outstandingBalance.toFixed(2)}
                      </span>
                      {hasBalance ? (
                        <span className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3" />
                          Due: {supplier.nextDueDate}
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Settled
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Record Payment Button */}
                      <button
                        type="button"
                        onClick={() => onRecordPayment(supplier)}
                        disabled={!hasBalance}
                        className="px-3 py-1.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <CreditCard className="w-3 h-3 stroke-[2.2]" />
                        <span>Pay</span>
                      </button>

                      {/* View Ledger Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedLedgerSupplier(supplier)}
                        className="p-1.5 rounded-lg text-pharmacy-textSecondary hover:bg-pharmacy-canvas hover:text-pharmacy-dark transition-colors"
                        title="View Ledger Statement"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Supplier Ledger Statement Modal */}
      <ModalPortal isOpen={!!selectedLedgerSupplier} onClose={() => setSelectedLedgerSupplier(null)}>
        {selectedLedgerSupplier && (
          <div
            className="relative w-full max-w-xl max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
              <div>
                <h3 className="text-lg font-bold text-pharmacy-dark">
                  Supplier Statement: {selectedLedgerSupplier.name}
                </h3>
                <p className="text-xs text-pharmacy-textMuted">
                  {selectedLedgerSupplier.email} &bull; Terms: {selectedLedgerSupplier.paymentTerms}
                </p>
              </div>
              <button
                onClick={() => setSelectedLedgerSupplier(null)}
                className="p-1 rounded-full text-pharmacy-textMuted hover:bg-pharmacy-canvas"
              >
                ✕
              </button>
            </div>

            {/* Statement Summary Card */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-pharmacy-canvas/50 rounded-2xl border border-pharmacy-border text-xs">
              <div>
                <span className="text-pharmacy-textMuted">Current Balance Payable:</span>
                <div className="text-xl font-extrabold text-rose-600 mt-0.5">
                  ${selectedLedgerSupplier.outstandingBalance.toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-pharmacy-textMuted">Payment Due By:</span>
                <div className="text-sm font-bold text-pharmacy-dark mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-700" />
                  {selectedLedgerSupplier.nextDueDate}
                </div>
              </div>
            </div>

            <div className="text-xs text-pharmacy-textSecondary space-y-2">
              <div className="font-semibold text-pharmacy-dark">Recent Ledger Transactions:</div>
              <div className="p-3 bg-white rounded-xl border border-pharmacy-border text-xs flex justify-between">
                <span>Invoice INV-GSK-9902 (Goods Receipt)</span>
                <span className="font-bold text-pharmacy-dark">+$1,480.00</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-pharmacy-border text-xs flex justify-between text-emerald-700">
                <span>Direct Bank Transfer (Ref: TXN-8902)</span>
                <span className="font-bold">-$1,480.00</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLedgerSupplier(null)}
                className="px-5 py-2 rounded-full bg-pharmacy-dark text-white text-xs font-semibold"
              >
                Close Statement
              </button>
            </div>
          </div>
        )}
      </ModalPortal>
    </div>
  );
}
