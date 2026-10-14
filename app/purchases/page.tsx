"use client";

import React, { useState } from "react";
import {
  Plus,
  Truck,
  PackageCheck,
  Building2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";
import PurchaseOrdersTable from "@/components/purchases/PurchaseOrdersTable";
import SupplierListTable from "@/components/purchases/SupplierListTable";
import CreatePurchaseOrderModal from "@/components/purchases/CreatePurchaseOrderModal";
import RecordSupplierPaymentModal from "@/components/purchases/RecordSupplierPaymentModal";
import AddSupplierModal from "@/components/purchases/AddSupplierModal";
import { initialPurchaseOrders, initialSuppliers } from "@/data/mockPurchases";
import { PurchaseOrder, Supplier, SupplierPaymentRecord } from "@/types/purchase";

export default function PurchasesPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);

  // Tabs: 'orders' | 'suppliers'
  const [activeTab, setActiveTab] = useState<"orders" | "suppliers">("orders");

  // Modals state
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [selectedPaySupplier, setSelectedPaySupplier] = useState<Supplier | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic KPI Calculations
  const totalPurchasesMTD = purchaseOrders
    .filter((po) => po.status === "Received")
    .reduce((sum, po) => sum + po.totalCost, 0);

  const pendingReceiptsCount = purchaseOrders.filter(
    (po) => po.status === "Submitted" || po.status === "Draft"
  ).length;

  const totalOutstandingPayables = suppliers.reduce(
    (sum, s) => sum + s.outstandingBalance,
    0
  );

  const activeDistributorsCount = suppliers.length;

  // New PO Created Handler
  const handlePOCreated = (newPO: PurchaseOrder) => {
    setPurchaseOrders((prev) => [newPO, ...prev]);

    // Update supplier balance if unpaid
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === newPO.supplierId) {
          return {
            ...s,
            totalOrdersCount: s.totalOrdersCount + 1,
            outstandingBalance: s.outstandingBalance + newPO.totalCost,
          };
        }
        return s;
      })
    );

    setToastMessage(`Purchase Order #${newPO.poNumber} successfully issued to ${newPO.supplierName}!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Goods Receiving (GRN) Handler
  const handleReceiveGoods = (poId: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id !== poId) return po;
        const updatedItems = po.items.map((it) => ({
          ...it,
          receivedQuantity: it.orderedQuantity,
        }));
        return {
          ...po,
          status: "Received",
          items: updatedItems,
        };
      })
    );

    setToastMessage("Goods Receipt Note (GRN) generated! Lot stock added to pharmacy batches.");
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Record Payment Settlement Handler
  const handlePaymentRecorded = (payment: SupplierPaymentRecord) => {
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id !== payment.supplierId) return s;
        const newBalance = Math.max(0, s.outstandingBalance - payment.amount);
        return {
          ...s,
          outstandingBalance: newBalance,
        };
      })
    );

    setToastMessage(`Payment of $${payment.amount.toFixed(2)} recorded for ${payment.supplierName} (Ref: ${payment.reference}).`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // New Supplier Added Handler
  const handleSupplierAdded = (newSup: Supplier) => {
    setSuppliers((prev) => [newSup, ...prev]);
    setToastMessage(`Distributor "${newSup.name}" registered successfully.`);
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
            Purchases & Supplier Management
          </h1>
          <p className="text-xs sm:text-sm text-pharmacy-textMuted mt-0.5">
            Track pharmaceutical purchase orders, goods receipts (GRN), supplier balances, and lot arrivals
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Secondary CTA: Add Supplier */}
          <button
            type="button"
            onClick={() => setIsAddSupplierOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-pharmacy-border bg-white hover:bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textSecondary transition-all shadow-xs"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-800" />
            <span>+ Add Supplier</span>
          </button>

          {/* Primary CTA: New Purchase Order */}
          <button
            type="button"
            onClick={() => setIsCreatePOOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white font-medium text-sm shadow-pill hover:shadow-lg transition-all duration-200 group active:scale-95 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-200">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>New Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Top Analytical KPI Cards (4-Column Grid) */}
      <section
        aria-label="Purchases Metrics"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Total Purchases MTD */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Purchases (MTD)
            </span>
            <div className="p-2 rounded-2xl bg-pharmacy-canvas text-teal-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-teal-900 tracking-tight">
              ${totalPurchasesMTD.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% from last procurement cycle</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Receipts */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Pending Receipts
            </span>
            <div className="p-2 rounded-2xl bg-sky-50 text-sky-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-sky-700 tracking-tight">
              {pendingReceiptsCount}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-sky-800">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              <span>Orders awaiting warehouse arrival & GRN</span>
            </div>
          </div>
        </div>

        {/* Card 3: Outstanding Payables */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Outstanding Payables
            </span>
            <div className="p-2 rounded-2xl bg-rose-50 text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-rose-600 tracking-tight">
              ${totalOutstandingPayables.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-rose-700">
              <span>Distributor credit liabilities</span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Distributors */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Distributors
            </span>
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-pharmacy-dark tracking-tight">
              {activeDistributorsCount}
            </div>
            <div className="text-[11px] text-pharmacy-textMuted mt-1">
              Authorized pharmaceutical vendors
            </div>
          </div>
        </div>
      </section>

      {/* Main Dual-Tab Card Container */}
      <section aria-label="Purchases Content" className="bg-white rounded-3xl p-6 shadow-card border border-pharmacy-border/60">
        {/* Tab Selection Bar */}
        <div className="flex items-center gap-2 pb-5 border-b border-pharmacy-borderLight">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Purchase Orders & GRN</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === "orders"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {purchaseOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("suppliers")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "suppliers"
                ? "bg-pharmacy-dark text-white shadow-sm"
                : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Suppliers & Ledgers</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === "suppliers"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {suppliers.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Purchase Orders Table */}
        {activeTab === "orders" && (
          <div className="mt-5">
            <PurchaseOrdersTable
              orders={purchaseOrders}
              onReceiveGoods={handleReceiveGoods}
            />
          </div>
        )}

        {/* Tab 2: Supplier Directory & Ledgers Table */}
        {activeTab === "suppliers" && (
          <div className="mt-5">
            <SupplierListTable
              suppliers={suppliers}
              onRecordPayment={(sup) => setSelectedPaySupplier(sup)}
            />
          </div>
        )}
      </section>

      {/* New Purchase Order Modal */}
      <CreatePurchaseOrderModal
        isOpen={isCreatePOOpen}
        onClose={() => setIsCreatePOOpen(false)}
        suppliers={suppliers}
        onPOCreated={handlePOCreated}
      />

      {/* Record Supplier Payment Modal */}
      <RecordSupplierPaymentModal
        isOpen={selectedPaySupplier !== null}
        onClose={() => setSelectedPaySupplier(null)}
        supplier={selectedPaySupplier}
        onPaymentRecorded={handlePaymentRecorded}
      />

      {/* Add Supplier Modal */}
      <AddSupplierModal
        isOpen={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
        onSupplierAdded={handleSupplierAdded}
      />
    </div>
  );
}
