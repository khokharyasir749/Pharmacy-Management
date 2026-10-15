"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  DollarSign,
  Package,
  Layers,
} from "lucide-react";
import { PurchaseOrder, Supplier, POLineItem } from "@/types/purchase";

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  onPOCreated: (newPO: PurchaseOrder) => void;
}

export default function CreatePurchaseOrderModal({
  isOpen,
  onClose,
  suppliers,
  onPOCreated,
}: CreatePurchaseOrderModalProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "");
  const [invoiceRef, setInvoiceRef] = useState("");
  const [branch, setBranch] = useState("Main Pharmacy Branch");
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
  ]);

  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        medicineName: "",
        dosage: "Tablet",
        batchNumber: `BTH-${Math.floor(100 + Math.random() * 900)}`,
        expiryDate: "2027-12-31",
        orderedQuantity: 10,
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

  // Calculations
  const subtotal = lineItems.reduce(
    (sum, it) => sum + (Number(it.orderedQuantity) || 0) * (Number(it.unitCost) || 0),
    0
  );
  const taxAmount = (subtotal * taxPercent) / 100;
  const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const supplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];

    // Validation
    const invalidItem = lineItems.find(
      (it) => !it.medicineName.trim() || !it.batchNumber.trim() || it.orderedQuantity <= 0
    );
    if (invalidItem) {
      setErrorMessage("Please fill all medicine names, batch numbers, and valid quantities.");
      return;
    }

    const todayFormatted = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const formattedItems: POLineItem[] = lineItems.map((it) => ({
      id: it.id,
      medicineName: it.medicineName.trim(),
      dosage: it.dosage,
      batchNumber: it.batchNumber.trim().toUpperCase(),
      expiryDate: it.expiryDate,
      orderedQuantity: Number(it.orderedQuantity),
      receivedQuantity: 0, // initially 0 until GRN
      freeQuantity: Number(it.freeQuantity) || 0,
      unitCost: Number(it.unitCost),
      totalCost: Number(it.orderedQuantity) * Number(it.unitCost),
    }));

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderDate: todayFormatted,
      branch,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierContact: `${supplier.representative} (${supplier.phone})`,
      invoiceRef: invoiceRef.trim() || `INV-REF-${Date.now().toString().slice(-4)}`,
      items: formattedItems,
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      totalCost: grandTotal,
      paidAmount: 0,
      paymentStatus: "Unpaid",
      status: "Submitted",
      notes: notes.trim() || undefined,
    };

    onPOCreated(newPO);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (fixed top) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                New Purchase Order (PO)
              </h2>
              <p className="text-xs text-slate-500">
                Create distributor procurement, assign batch codes, and generate goods receiving requisition
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Supplier & Header Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
                Distributor / Supplier *
              </label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full h-11 px-3 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs font-semibold text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.paymentTerms})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
                Supplier Invoice / Bill Ref
              </label>
              <input
                type="text"
                value={invoiceRef}
                onChange={(e) => setInvoiceRef(e.target.value)}
                placeholder="e.g. INV-GSK-9902"
                className="w-full h-11 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs font-mono text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary mb-1.5">
                Delivery Pharmacy Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
              />
            </div>
          </div>

          {/* Line Items Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-pharmacy-borderLight">
              <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                Procurement Line Items ({lineItems.length})
              </span>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="px-3 py-1 rounded-full bg-pharmacy-mintLight text-teal-900 text-xs font-semibold flex items-center gap-1 hover:bg-pharmacy-canvas transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine Row</span>
              </button>
            </div>

            {/* Line Items Container */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-pharmacy-border/80 bg-[#FAFCFB] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-pharmacy-textMuted font-semibold">
                      Medicine Trade Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={item.medicineName}
                      onChange={(e) =>
                        handleUpdateLineItem(item.id, "medicineName", e.target.value)
                      }
                      placeholder="e.g. Augmentin 625mg"
                      className="w-full h-9 px-2.5 bg-white border border-pharmacy-border rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-pharmacy-textMuted font-semibold">
                      Batch Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={item.batchNumber}
                      onChange={(e) =>
                        handleUpdateLineItem(item.id, "batchNumber", e.target.value)
                      }
                      placeholder="BTH-902"
                      className="w-full h-9 px-2 bg-white border border-pharmacy-border rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-pharmacy-textMuted font-semibold">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={item.expiryDate}
                      onChange={(e) =>
                        handleUpdateLineItem(item.id, "expiryDate", e.target.value)
                      }
                      className="w-full h-9 px-2 bg-white border border-pharmacy-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-pharmacy-textMuted font-semibold">
                      Qty (+Free)
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        value={item.orderedQuantity}
                        onChange={(e) =>
                          handleUpdateLineItem(
                            item.id,
                            "orderedQuantity",
                            Number(e.target.value)
                          )
                        }
                        className="w-14 h-9 px-1.5 text-center bg-white border border-pharmacy-border rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
                      />
                      <input
                        type="number"
                        min="0"
                        title="Free bonus quantity"
                        placeholder="+0"
                        value={item.freeQuantity || ""}
                        onChange={(e) =>
                          handleUpdateLineItem(
                            item.id,
                            "freeQuantity",
                            Number(e.target.value)
                          )
                        }
                        className="w-10 h-9 px-1 text-center bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-pharmacy-textMuted font-semibold">
                      Unit Cost ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitCost}
                      onChange={(e) =>
                        handleUpdateLineItem(
                          item.id,
                          "unitCost",
                          Number(e.target.value)
                        )
                      }
                      className="w-full h-9 px-2 bg-white border border-pharmacy-border rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
                    />
                  </div>

                  <div className="sm:col-span-1 flex items-end justify-center pb-0.5">
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(item.id)}
                      className="p-1.5 text-pharmacy-textMuted hover:text-rose-600 transition-colors"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Payable Summary */}
          <div className="p-4 rounded-2xl bg-pharmacy-canvas/50 border border-pharmacy-border grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="text-xs text-pharmacy-textSecondary">
              <div>Subtotal: <strong>${subtotal.toFixed(2)}</strong></div>
              <div className="mt-1">
                Discount:{" "}
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  className="w-16 h-6 px-1.5 rounded border border-pharmacy-border bg-white text-xs font-semibold"
                />
              </div>
            </div>

            <div className="text-xs text-pharmacy-textSecondary">
              <div>
                Tax/Freight (%):{" "}
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                  className="w-14 h-6 px-1.5 rounded border border-pharmacy-border bg-white text-xs font-semibold"
                />
              </div>
              <div className="mt-1 text-pharmacy-textMuted">
                Branch delivery inspected on arrival
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-pharmacy-textMuted uppercase font-bold">
                Total PO Payable:
              </span>
              <div className="text-2xl font-black text-pharmacy-dark">
                ${grandTotal.toFixed(2)}
              </div>
            </div>
          </div>

          </div>

          {/* Sticky Footer CTA */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow flex items-center gap-2 transition-colors active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Confirm & Dispatch PO</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
