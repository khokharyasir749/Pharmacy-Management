"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Pill,
  CheckCircle2,
  AlertTriangle,
  Barcode,
  Calendar,
  Layers,
} from "lucide-react";
import { Product, ProductCategory, DosageForm } from "@/types/product";

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (newProduct: Product) => void;
}

export default function AddMedicineModal({
  isOpen,
  onClose,
  onProductAdded,
}: AddMedicineModalProps) {
  // Form fields state
  const [tradeName, setTradeName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [strength, setStrength] = useState("");
  const [dosageForm, setDosageForm] = useState<DosageForm>("Tablet");
  const [category, setCategory] = useState<ProductCategory>("Antibiotics");
  const [manufacturer, setManufacturer] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");

  // Unit conversions
  const [baseUnit, setBaseUnit] = useState("Tablet");
  const [packUnit, setPackUnit] = useState("Box");
  const [stripUnit, setStripUnit] = useState("Strip");
  const [unitsPerStrip, setUnitsPerStrip] = useState<number>(10);
  const [stripsPerPack, setStripsPerPack] = useState<number>(2);

  // Initial Batch
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [initialQuantity, setInitialQuantity] = useState<number>(50);
  const [costPrice, setCostPrice] = useState<number>(15.0);
  const [sellingPrice, setSellingPrice] = useState<number>(20.0);
  const [reorderLevel, setReorderLevel] = useState<number>(20);

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

  // Reset form
  const handleReset = () => {
    setTradeName("");
    setGenericName("");
    setStrength("");
    setDosageForm("Tablet");
    setCategory("Antibiotics");
    setManufacturer("");
    setSku("");
    setBarcode("");
    setBatchNumber("");
    setExpiryDate("");
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!tradeName.trim()) {
      setErrorMessage("Please enter the Medicine Trade Name.");
      return;
    }
    if (!genericName.trim()) {
      setErrorMessage("Please enter the Generic Formula.");
      return;
    }
    if (!batchNumber.trim()) {
      setErrorMessage("Please allocate an Initial Batch Number.");
      return;
    }
    if (!expiryDate) {
      setErrorMessage("Please select the Batch Expiry Date.");
      return;
    }

    const totalBaseUnitsPerPack = (unitsPerStrip || 1) * (stripsPerPack || 1);

    // Format expiry date display e.g. "Dec 15, 2027"
    const expObj = new Date(expiryDate);
    const formattedExpiry = expObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const isNearExpiry =
      expObj.getTime() - Date.now() < 60 * 24 * 60 * 60 * 1000;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      tradeName: tradeName.trim(),
      genericName: genericName.trim(),
      strength: strength.trim() || "Standard",
      dosageForm,
      sku: sku.trim() || `SKU-${tradeName.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      barcode: barcode.trim() || `${Date.now()}`.slice(-10),
      manufacturer: manufacturer.trim() || "Standard Pharma",
      category,
      unitConversion: {
        baseUnit: baseUnit.trim() || "Unit",
        stripUnit: stripUnit.trim() || undefined,
        packUnit: packUnit.trim() || "Box",
        unitsPerStrip: Number(unitsPerStrip) || 1,
        stripsPerPack: Number(stripsPerPack) || 1,
        totalBaseUnitsPerPack,
      },
      reorderLevel: Number(reorderLevel) || 15,
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      status: "Active",
      batches: [
        {
          id: `bth-${Date.now()}`,
          batchNumber: batchNumber.trim().toUpperCase(),
          expiryDate: formattedExpiry,
          receivedDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          costPrice: Number(costPrice) || 0,
          sellingPrice: Number(sellingPrice) || 0,
          initialQuantity: Number(initialQuantity) || 0,
          availableQuantity: Number(initialQuantity) || 0,
          isNearExpiry,
          isExpired: false,
        },
      ],
    };

    onProductAdded(newProduct);
    handleReset();
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
        {/* Header (fixed top) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                Add New Medicine
              </h2>
              <p className="text-xs text-slate-500">
                Define formulation, multi-unit conversions, reorder triggers, and initial batch
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

        {/* Validation Error Banner */}
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
          {/* Section 1: Basic Formulation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary pb-2 border-b border-pharmacy-borderLight">
              1. Basic Formulation & Brand Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Brand / Trade Name *
                </label>
                <input
                  type="text"
                  required
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  placeholder="e.g. Augmentin 625mg"
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Generic Formula *
                </label>
                <input
                  type="text"
                  required
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                  placeholder="e.g. Amoxicillin + Clavulanate"
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Strength / Potency
                </label>
                <input
                  type="text"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  placeholder="e.g. 625mg, 20mg"
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Dosage Form
                </label>
                <select
                  value={dosageForm}
                  onChange={(e) => setDosageForm(e.target.value as DosageForm)}
                  className="w-full h-10 px-3 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Inhaler">Inhaler</option>
                  <option value="Drops">Drops</option>
                  <option value="Suspension">Suspension</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full h-10 px-3 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                >
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Cardiovascular">Cardiovascular</option>
                  <option value="Analgesics">Analgesics</option>
                  <option value="Respiratory">Respiratory</option>
                  <option value="Gastrointestinal">Gastrointestinal</option>
                  <option value="Antidiabetic">Antidiabetic</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. GSK, Pfizer, Getz"
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Identifiers & Packaging Units */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary pb-2 border-b border-pharmacy-borderLight">
              2. Packaging Unit Conversions & SKU
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  SKU Code
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. SKU-AUG-625"
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs font-mono text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Barcode (EAN/UPC)
                </label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="e.g. 8901023001"
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs font-mono text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Base Unit
                </label>
                <input
                  type="text"
                  value={baseUnit}
                  onChange={(e) => setBaseUnit(e.target.value)}
                  placeholder="Tablet / Capsule / Bottle"
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Pack Unit
                </label>
                <input
                  type="text"
                  value={packUnit}
                  onChange={(e) => setPackUnit(e.target.value)}
                  placeholder="Box / Carton"
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Units Per Strip
                </label>
                <input
                  type="number"
                  min="1"
                  value={unitsPerStrip}
                  onChange={(e) => setUnitsPerStrip(Number(e.target.value) || 1)}
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Strips Per Pack
                </label>
                <input
                  type="number"
                  min="1"
                  value={stripsPerPack}
                  onChange={(e) => setStripsPerPack(Number(e.target.value) || 1)}
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div className="sm:col-span-2 flex items-center bg-pharmacy-canvas/50 rounded-xl px-4 py-2 text-xs text-pharmacy-textSecondary border border-pharmacy-border/60">
                <span>
                  Resulting Conversion: <strong>1 {packUnit || "Box"}</strong> ={" "}
                  <strong>{unitsPerStrip * stripsPerPack} {baseUnit || "Unit"}s</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Initial Batch Allocation & Pricing */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary pb-2 border-b border-pharmacy-borderLight">
              3. Initial Batch Allocation & Retail Pricing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Batch Number *
                </label>
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="e.g. BTH-902"
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs font-mono font-bold text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Initial Stock ({baseUnit}s)
                </label>
                <input
                  type="number"
                  min="1"
                  value={initialQuantity}
                  onChange={(e) => setInitialQuantity(Number(e.target.value) || 0)}
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Purchase Cost Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value) || 0)}
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Retail Selling Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pharmacy-textPrimary mb-1">
                  Reorder Alert Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(Number(e.target.value) || 10)}
                  className="w-full h-10 px-3.5 bg-[#F8FCFB] border border-pharmacy-border rounded-xl text-xs text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
                />
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
              <span>Save & Allocate Medicine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
