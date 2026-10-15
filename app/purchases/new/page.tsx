"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  Calendar,
  Building2,
  DollarSign,
  AlertTriangle,
  Save,
  Boxes,
  Truck,
  CheckCircle2,
  X,
} from "lucide-react";
import { PurchaseOrder, POLineItem, Supplier } from "@/types/purchase";
import { getStoredSuppliers, savePurchaseOrder } from "@/data/mockPurchases";

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const suppliers = useMemo(() => getStoredSuppliers(), []);

  // Procurement Header
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "");
  const [invoiceRef, setInvoiceRef] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [branch, setBranch] = useState("Main Pharmacy Branch");
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<"Draft" | "Submitted">("Submitted");
  const [notes, setNotes] = useState("");

  // Line items state
  const [lineItems, setLineItems] = useState<
    Array<{
      id: string;
      medicineName: string;
      dosage: string;
      batchNumber: string;
      expiryDate: string;
      orderedQuantity: number;
      freeQuantity: number;
      unitCost: number;
    }>
  >([
    {
      id: "item-1",
      medicineName: "Augmentin 625mg",
      dosage: "625mg Tablet",
      batchNumber: "BTH-990",
      expiryDate: "2027-11-20",
      orderedQuantity: 50,
      freeQuantity: 2,
      unitCost: 18.5,
    },
    {
      id: "item-2",
      medicineName: "Panadol CF Extra",
      dosage: "500mg/30mg Tablet",
      batchNumber: "BTH-441",
      expiryDate: "2027-12-15",
      orderedQuantity: 100,
      freeQuantity: 5,
      unitCost: 12.0,
    },
  ]);

  const [taxPercent, setTaxPercent] = useState<number>(5);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSupplier = useMemo(() => {
    return suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];
  }, [suppliers, selectedSupplierId]);

  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        medicineName: "",
        dosage: "Tablet",
        batchNumber: `BTH-${Math.floor(100 + Math.random() * 900)}`,
        expiryDate: "2028-06-30",
        orderedQuantity: 20,
        freeQuantity: 0,
        unitCost: 15.0,
      },
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    if (lineItems.length <= 1) {
      setErrorMessage("At least one line item is required in the purchase order.");
      return;
    }
    setLineItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpdateLineItem = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setLineItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  // Financial Calculations
  const subtotal = useMemo(() => {
    return lineItems.reduce(
      (sum, it) => sum + (Number(it.orderedQuantity) || 0) * (Number(it.unitCost) || 0),
      0
    );
  }, [lineItems]);

  const taxAmount = (subtotal * taxPercent) / 100;
  const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);

  const totalOrderedUnits = useMemo(() => {
    return lineItems.reduce((acc, it) => acc + (Number(it.orderedQuantity) || 0), 0);
  }, [lineItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const invalidItem = lineItems.find(
      (it) => !it.medicineName.trim() || !it.batchNumber.trim() || Number(it.orderedQuantity) <= 0
    );
    if (invalidItem) {
      setErrorMessage("Please complete all medicine names, batch numbers, and valid quantities.");
      return;
    }

    setIsSubmitting(true);

    const todayFormatted = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const formattedItems: POLineItem[] = lineItems.map((it) => ({
      id: it.id,
      medicineName: it.medicineName.trim(),
      dosage: it.dosage.trim() || "Standard",
      batchNumber: it.batchNumber.trim().toUpperCase(),
      expiryDate: it.expiryDate,
      orderedQuantity: Number(it.orderedQuantity) || 0,
      receivedQuantity: 0,
      freeQuantity: Number(it.freeQuantity) || 0,
      unitCost: Number(it.unitCost) || 0,
      totalCost: (Number(it.orderedQuantity) || 0) * (Number(it.unitCost) || 0),
    }));

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: todayFormatted,
      expectedDeliveryDate: new Date(deliveryDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      branch,
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      supplierContact: `${selectedSupplier.representative} (${selectedSupplier.phone})`,
      invoiceRef: invoiceRef.trim() || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      items: formattedItems,
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      totalCost: grandTotal,
      paidAmount: 0,
      paymentStatus: "Unpaid",
      status: status,
      notes: notes.trim() || undefined,
    };

    savePurchaseOrder(newPO);

    setTimeout(() => {
      router.push("/purchases");
    }, 250);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-xs text-pharmacy-textMuted">
          <Link href="/purchases" className="hover:text-teal-800 transition-colors font-medium">
            Purchases
          </Link>
          <span>/</span>
          <Link href="/purchases" className="hover:text-teal-800 transition-colors font-medium">
            Orders
          </Link>
          <span>/</span>
          <span className="text-pharmacy-textPrimary font-semibold">New Purchase Order (PO)</span>
        </div>

        <Link
          href="/purchases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 bg-white border border-teal-100 hover:border-teal-300 px-3 py-1.5 rounded-full shadow-xs transition-all w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Purchases</span>
        </Link>
      </div>

      {/* Main Page Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-pharmacy-dark">
              New Purchase Order (PO & GRN)
            </h1>
            <p className="text-xs sm:text-sm text-pharmacy-textMuted mt-1 max-w-3xl leading-relaxed">
              Create distributor procurement, assign batch codes, establish credit terms, and generate goods receiving requisition.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-teal-50 border border-teal-200/80 px-3.5 py-2 rounded-2xl">
          <Truck className="w-4 h-4 text-teal-800" />
          <span className="text-xs font-bold text-teal-900">Direct Distributor Procurement</span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:text-rose-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Distributor & Requisition Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-pharmacy-textPrimary">
                Distributor & Requisition Details
              </h2>
            </div>
            <span className="text-[11px] text-pharmacy-textMuted">Official Procurement Ref</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Distributor Select */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Authorized Pharmaceutical Distributor <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} &bull; {s.paymentTerms}
                  </option>
                ))}
              </select>
              {selectedSupplier && (
                <p className="text-[11px] text-teal-800 font-medium mt-1">
                  Rep: {selectedSupplier.representative} ({selectedSupplier.phone})
                </p>
              )}
            </div>

            {/* Vendor Invoice Ref */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Distributor Performa / Invoice Ref
              </label>
              <input
                type="text"
                placeholder="e.g. INV-GSK-2026-90"
                value={invoiceRef}
                onChange={(e) => setInvoiceRef(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-mono font-semibold text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* Destination Branch */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Delivery Branch Destination
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              >
                <option value="Main Pharmacy Branch">Main Pharmacy Branch (Dispensary)</option>
                <option value="Counter 2 - Express Lane">Counter 2 - Express Lane</option>
                <option value="Central Cold-Chain Storage">Central Cold-Chain Storage Vault</option>
              </select>
            </div>

            {/* Expected Delivery Date */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Expected Goods Arrival Date
              </label>
              <input
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* Requisition Status */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Requisition Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Draft" | "Submitted")}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              >
                <option value="Submitted">Submitted (Active Requisition to Vendor)</option>
                <option value="Draft">Draft (Internal Review)</option>
              </select>
            </div>

            {/* Distributor Credit Terms Badge */}
            <div className="flex flex-col justify-end">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Credit Terms:</span>
                <span className="text-xs font-bold text-teal-800">
                  {selectedSupplier?.paymentTerms || "Net 30 Days"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Line Items Procurement Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-pharmacy-textPrimary">
                Medicine Line Items & Batch Requisition ({lineItems.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddLineItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medicine Line</span>
            </button>
          </div>

          {/* Responsive Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pr-3">Medicine / Product Name *</th>
                  <th className="pb-3 pr-3 w-32">Form / Dosage</th>
                  <th className="pb-3 pr-3 w-28">Assigned Batch</th>
                  <th className="pb-3 pr-3 w-32">Expiry Date</th>
                  <th className="pb-3 pr-3 w-24 text-center">Ordered Qty</th>
                  <th className="pb-3 pr-3 w-20 text-center">Free Qty</th>
                  <th className="pb-3 pr-3 w-24 text-right">Unit Cost ($)</th>
                  <th className="pb-3 pr-3 w-24 text-right">Line Total</th>
                  <th className="pb-3 w-10 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lineItems.map((item) => {
                  const lineTotal = (Number(item.orderedQuantity) || 0) * (Number(item.unitCost) || 0);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name */}
                      <td className="py-2.5 pr-3">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Augmentin 625mg"
                          value={item.medicineName}
                          onChange={(e) =>
                            handleUpdateLineItem(item.id, "medicineName", e.target.value)
                          }
                          className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                      </td>

                      {/* Dosage */}
                      <td className="py-2.5 pr-3">
                        <input
                          type="text"
                          placeholder="e.g. 625mg Tab"
                          value={item.dosage}
                          onChange={(e) =>
                            handleUpdateLineItem(item.id, "dosage", e.target.value)
                          }
                          className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                      </td>

                      {/* Batch */}
                      <td className="py-2.5 pr-3">
                        <input
                          type="text"
                          required
                          placeholder="e.g. BTH-902"
                          value={item.batchNumber}
                          onChange={(e) =>
                            handleUpdateLineItem(item.id, "batchNumber", e.target.value.toUpperCase())
                          }
                          className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                      </td>

                      {/* Expiry */}
                      <td className="py-2.5 pr-3">
                        <input
                          type="date"
                          required
                          value={item.expiryDate}
                          onChange={(e) =>
                            handleUpdateLineItem(item.id, "expiryDate", e.target.value)
                          }
                          className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                      </td>

                      {/* Ordered Qty */}
                      <td className="py-2.5 pr-3">
                        <input
                          type="number"
                          min="1"
                          value={item.orderedQuantity}
                          onChange={(e) =>
                            handleUpdateLineItem(
                              item.id,
                              "orderedQuantity",
                              Math.max(1, Number(e.target.value) || 1)
                            )
                          }
                          className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-center text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                      </td>

                      {/* Free Bonus Qty */}
                      <td className="py-2.5 pr-3">
                        <input
                          type="number"
                          min="0"
                          value={item.freeQuantity}
                          onChange={(e) =>
                            handleUpdateLineItem(
                              item.id,
                              "freeQuantity",
                              Math.max(0, Number(e.target.value) || 0)
                            )
                          }
                          className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-center text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                      </td>

                      {/* Unit Cost */}
                      <td className="py-2.5 pr-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitCost}
                          onChange={(e) =>
                            handleUpdateLineItem(
                              item.id,
                              "unitCost",
                              Number(e.target.value) || 0
                            )
                          }
                          className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-right text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                      </td>

                      {/* Line Total */}
                      <td className="py-2.5 pr-3 text-right font-extrabold text-teal-900">
                        ${lineTotal.toFixed(2)}
                      </td>

                      {/* Remove Button */}
                      <td className="py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              type="button"
              onClick={handleAddLineItem}
              className="text-xs font-bold text-teal-800 hover:text-teal-950 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add another product line</span>
            </button>
          </div>
        </div>

        {/* SECTION 3: Financial Summary & Notes */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-pharmacy-textPrimary">
                Procurement Cost Summary & Logistics Notes
              </h2>
            </div>
            <span className="text-[11px] text-pharmacy-textMuted">Discounts & Tax Calculation</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Notes & Receiving Instructions */}
            <div className="lg:col-span-7 space-y-3">
              <label className="block text-xs font-bold text-pharmacy-textPrimary">
                Procurement Notes & Goods Receiving Instructions (GRN Memo)
              </label>
              <textarea
                rows={4}
                placeholder="Specify temperature monitoring requirements, distributor delivery window, or consignment payment instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Total Items: <strong>{lineItems.length} lines</strong></span>
                <span>Total Stock Units: <strong>{totalOrderedUnits} packs</strong></span>
              </div>
            </div>

            {/* Right Financial Calculation Card */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal (Net Invoice):</span>
                <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Tax / Freight (%):</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                    className="w-16 h-7 text-right px-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                  {taxAmount > 0 && (
                    <span className="text-[11px] text-teal-800 font-medium">
                      +${taxAmount.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Distributor Discount ($):</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  className="w-20 h-7 text-right px-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-slate-300">
                <div>
                  <span className="text-sm font-bold text-slate-800 block">Total PO Payable:</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Net Due on Delivery
                  </span>
                </div>
                <span className="text-2xl font-black tracking-tight text-teal-900">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STICKY ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <Link
              href="/purchases"
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </Link>
            <span className="hidden sm:inline text-xs text-slate-400">
              Unsaved PO lines will be discarded
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Dispatching PO..." : "Confirm & Dispatch Purchase Order"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
