"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pill,
  CheckCircle2,
  AlertTriangle,
  Barcode,
  Calendar,
  Layers,
  DollarSign,
  ShieldAlert,
  Building2,
  FileText,
  Boxes,
  Sparkles,
  Save,
  X,
} from "lucide-react";
import { Product, ProductCategory, DosageForm } from "@/types/product";
import { saveProduct } from "@/data/mockProducts";

export default function NewMedicinePage() {
  const router = useRouter();

  // Section 1: Basic Formulation & Brand Details
  const [tradeName, setTradeName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [strength, setStrength] = useState("");
  const [dosageForm, setDosageForm] = useState<DosageForm>("Tablet");
  const [category, setCategory] = useState<ProductCategory>("Antibiotics");
  const [manufacturer, setManufacturer] = useState("");
  const [regulatorySchedule, setRegulatorySchedule] = useState("Schedule D (Prescription Only)");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");

  // Section 2: Packaging Units & SKU Hierarchy
  const [baseUnit, setBaseUnit] = useState("Tablet");
  const [stripUnit, setStripUnit] = useState("Strip");
  const [packUnit, setPackUnit] = useState("Box");
  const [unitsPerStrip, setUnitsPerStrip] = useState<number>(10);
  const [stripsPerPack, setStripsPerPack] = useState<number>(2);

  // Section 3: Pricing, Tax & Inventory Thresholds
  const [costPrice, setCostPrice] = useState<number>(18.5);
  const [sellingPrice, setSellingPrice] = useState<number>(24.0);
  const [taxPercent, setTaxPercent] = useState<number>(5);
  const [reorderLevel, setReorderLevel] = useState<number>(25);
  const [maxStock, setMaxStock] = useState<number>(500);

  // Section 4: Initial Batch Allocation & Expiry
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [initialQuantityPacks, setInitialQuantityPacks] = useState<number>(50);
  const [storageCondition, setStorageCondition] = useState("Controlled Room Temperature (20°C - 25°C)");
  const [receivedDate, setReceivedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // Feedback State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculated Packaging Hierarchy
  const totalBaseUnitsPerPack = useMemo(() => {
    const strips = Math.max(1, Number(stripsPerPack) || 1);
    const units = Math.max(1, Number(unitsPerStrip) || 1);
    return strips * units;
  }, [stripsPerPack, unitsPerStrip]);

  const totalInitialBaseUnits = useMemo(() => {
    return totalBaseUnitsPerPack * Math.max(1, Number(initialQuantityPacks) || 1);
  }, [totalBaseUnitsPerPack, initialQuantityPacks]);

  // Live Pricing / Margins
  const profitMargin = useMemo(() => {
    const cost = Number(costPrice) || 0;
    const sell = Number(sellingPrice) || 0;
    const profit = Math.max(0, sell - cost);
    const marginPct = sell > 0 ? ((profit / sell) * 100).toFixed(1) : "0.0";
    const markupPct = cost > 0 ? ((profit / cost) * 100).toFixed(1) : "0.0";
    return { profit: profit.toFixed(2), marginPct, markupPct };
  }, [costPrice, sellingPrice]);

  // Near Expiry Preview
  const isBatchNearExpiry = useMemo(() => {
    if (!expiryDate) return false;
    const expTime = new Date(expiryDate).getTime();
    return expTime - Date.now() < 60 * 24 * 60 * 60 * 1000;
  }, [expiryDate]);

  // SKU Auto-generator
  const handleGenerateSKU = () => {
    const prefix = tradeName ? tradeName.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() : "MED";
    const rand = Math.floor(100 + Math.random() * 900);
    const genSku = `SKU-${prefix}-${rand}`;
    setSku(genSku);
    if (!barcode) {
      setBarcode(`890${Math.floor(100000000 + Math.random() * 900000000)}`);
    }
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!tradeName.trim()) {
      setErrorMessage("Please enter the Trade / Brand Name.");
      return;
    }
    if (!genericName.trim()) {
      setErrorMessage("Please enter the Generic Formula.");
      return;
    }
    if (!batchNumber.trim()) {
      setErrorMessage("Please assign an Initial Batch Number.");
      return;
    }
    if (!expiryDate) {
      setErrorMessage("Please choose the Batch Expiry Date.");
      return;
    }

    setIsSubmitting(true);

    const expObj = new Date(expiryDate);
    const formattedExpiry = expObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const recObj = new Date(receivedDate);
    const formattedReceived = recObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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
          receivedDate: formattedReceived,
          costPrice: Number(costPrice) || 0,
          sellingPrice: Number(sellingPrice) || 0,
          initialQuantity: totalInitialBaseUnits,
          availableQuantity: totalInitialBaseUnits,
          isNearExpiry: isBatchNearExpiry,
          isExpired: false,
        },
      ],
    };

    saveProduct(newProduct);

    // Provide immediate feedback and route back to /products
    setTimeout(() => {
      router.push("/products");
    }, 250);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-xs text-pharmacy-textMuted">
          <Link href="/products" className="hover:text-teal-800 transition-colors font-medium">
            Products
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-teal-800 transition-colors font-medium">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-pharmacy-textPrimary font-semibold">Add New Medicine</span>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 bg-white border border-teal-100 hover:border-teal-300 px-3 py-1.5 rounded-full shadow-xs transition-all w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products Catalog</span>
        </Link>
      </div>

      {/* Main Page Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-pharmacy-dark">
              New Medicine Registration & Formulation
            </h1>
            <p className="text-xs sm:text-sm text-pharmacy-textMuted mt-1 max-w-3xl leading-relaxed">
              Define brand details, packaging conversion ratios, DRAP regulatory schedule, and initial batch allocation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-teal-50 border border-teal-200/80 px-3.5 py-2 rounded-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-teal-900">DRAP Compliance Ready</span>
        </div>
      </div>

      {/* Error Alert if any */}
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

      {/* Multi-Section Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Basic Formulation & Brand Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-pharmacy-textPrimary">
                Basic Formulation & Brand Details
              </h2>
            </div>
            <span className="text-[11px] text-pharmacy-textMuted">Required for Dispensing & Billing</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Trade Name */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Brand / Trade Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Augmentin 625mg, Panadol Extra"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* Generic Formula */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Generic Active Formula <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Amoxicillin + Clavulanic Acid"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* Strength / Potency */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Potency / Strength
              </label>
              <input
                type="text"
                placeholder="e.g. 625mg, 500mg/30mg, 10mg/5ml"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* Dosage Form */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Dosage Form
              </label>
              <select
                value={dosageForm}
                onChange={(e) => setDosageForm(e.target.value as DosageForm)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup (Liquid)</option>
                <option value="Suspension">Suspension</option>
                <option value="Injection">Injection (Vial/Ampoule)</option>
                <option value="Inhaler">Inhaler (MDI/DPI)</option>
                <option value="Drops">Eye/Ear Drops</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Therapeutic Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              >
                <option value="Antibiotics">Antibiotics</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Analgesics">Analgesics & Pain Relief</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Gastrointestinal">Gastrointestinal</option>
                <option value="Antidiabetic">Antidiabetic</option>
                <option value="General">General Wellness</option>
              </select>
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Principal Manufacturer / Importer
              </label>
              <input
                type="text"
                placeholder="e.g. GSK Pakistan, Abbott, Pfizer, Getz"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* DRAP Regulatory Schedule */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                DRAP Regulatory Schedule
              </label>
              <select
                value={regulatorySchedule}
                onChange={(e) => setRegulatorySchedule(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              >
                <option value="Schedule D (Prescription Only)">Schedule D (Prescription Only - Rx)</option>
                <option value="Schedule G (Controlled Narcotics)">Schedule G (Controlled Narcotics / Strict)</option>
                <option value="Over-The-Counter (OTC)">Over-The-Counter (OTC General Sales)</option>
                <option value="Schedule E (Hospital & Specialist Only)">Schedule E (Hospital & Specialist Only)</option>
              </select>
            </div>

            {/* SKU Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-pharmacy-textPrimary">
                  SKU Internal Code
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSKU}
                  className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto-Gen
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. SKU-AUG-625"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-mono font-semibold text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
              />
            </div>

            {/* Barcode */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Barcode / GTIN (EAN-13)
              </label>
              <div className="relative">
                <Barcode className="w-4 h-4 text-pharmacy-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. 890102300101"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-mono text-pharmacy-textPrimary focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Packaging Units & SKU Hierarchy */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-pharmacy-textPrimary">
                Packaging Units & SKU Hierarchy
              </h2>
            </div>
            <span className="text-[11px] text-pharmacy-textMuted">Multi-Unit Dispensing & Stock Allocation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Base Unit */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Base Dispensing Unit
              </label>
              <input
                type="text"
                placeholder="e.g. Tablet, Capsule, ml"
                value={baseUnit}
                onChange={(e) => setBaseUnit(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>

            {/* Strip Unit */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Intermediate Strip Unit
              </label>
              <input
                type="text"
                placeholder="e.g. Strip, Blister"
                value={stripUnit}
                onChange={(e) => setStripUnit(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>

            {/* Pack Unit */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Outer Pack Unit
              </label>
              <input
                type="text"
                placeholder="e.g. Box, Pack, Carton"
                value={packUnit}
                onChange={(e) => setPackUnit(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>

            {/* Units Per Strip */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Units per Strip
              </label>
              <input
                type="number"
                min="1"
                value={unitsPerStrip}
                onChange={(e) => setUnitsPerStrip(Math.max(1, Number(e.target.value) || 1))}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>

            {/* Strips Per Pack */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Strips per Pack
              </label>
              <input
                type="number"
                min="1"
                value={stripsPerPack}
                onChange={(e) => setStripsPerPack(Math.max(1, Number(e.target.value) || 1))}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>
          </div>

          {/* Live Conversion Ratio Preview Banner */}
          <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center flex-shrink-0">
                <Boxes className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold text-pharmacy-dark block">
                  Packaging Conversion Formula:
                </span>
                <span className="text-xs text-pharmacy-textSecondary">
                  1 {packUnit || "Box"} = <strong>{stripsPerPack} {stripUnit || "Strips"}</strong> = <strong>{totalBaseUnitsPerPack} {baseUnit || "Tablets"}</strong> (Base Units)
                </span>
              </div>
            </div>

            <div className="bg-white px-3.5 py-1.5 rounded-full border border-teal-200 text-xs font-mono font-bold text-teal-900 shadow-xs">
              Ratio: 1 : {stripsPerPack} : {totalBaseUnitsPerPack}
            </div>
          </div>
        </div>

        {/* SECTION 3: Pricing, Tax & Inventory Thresholds */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-pharmacy-textPrimary">
                Pricing, Tax & Inventory Thresholds
              </h2>
            </div>
            <span className="text-[11px] text-pharmacy-textMuted">Retail Margins & Reorder Triggers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Trade / Cost Price */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Trade / Cost Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value) || 0)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-bold text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Retail / Selling Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-bold text-teal-900 focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>

            {/* Sales Tax % */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Sales Tax (GST %)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>

            {/* Reorder Level */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Reorder Alert Level
              </label>
              <input
                type="number"
                min="1"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(Number(e.target.value) || 1)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-semibold text-amber-700 focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>

            {/* Max Stock Capacity */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Max Stock Capacity
              </label>
              <input
                type="number"
                min="10"
                value={maxStock}
                onChange={(e) => setMaxStock(Number(e.target.value) || 100)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-semibold text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>
          </div>

          {/* Dynamic Profit & Margin Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Projected Retail Profit Margin
                </span>
                <span className="text-xs text-slate-500">
                  Gross Profit per unit: <strong className="text-emerald-700">${profitMargin.profit}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                Margin: {profitMargin.marginPct}%
              </span>
              <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
                Markup: {profitMargin.markupPct}%
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: Initial Batch Allocation & Expiry */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-pharmacy-textPrimary">
                Initial Batch Allocation & Expiry
              </h2>
            </div>
            <span className="text-[11px] text-pharmacy-textMuted">FEFO Inventory Allocation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Batch Number */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Initial Batch Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BTH-9021"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value.toUpperCase())}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-mono font-bold text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-pharmacy-textPrimary">
                  Expiry Date <span className="text-rose-500">*</span>
                </label>
                {isBatchNearExpiry && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Expiring &lt; 60 Days
                  </span>
                )}
              </div>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
            </div>

            {/* Initial Stock Quantity */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Initial Quantity ({packUnit || "Packs"})
              </label>
              <input
                type="number"
                min="1"
                value={initialQuantityPacks}
                onChange={(e) => setInitialQuantityPacks(Math.max(1, Number(e.target.value) || 1))}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-bold text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              />
              <span className="text-[11px] text-teal-800 font-semibold mt-1 block">
                = {totalInitialBaseUnits} {baseUnit || "Units"} in stock
              </span>
            </div>

            {/* Storage Condition */}
            <div>
              <label className="block text-xs font-bold text-pharmacy-textPrimary mb-1.5">
                Storage Condition
              </label>
              <select
                value={storageCondition}
                onChange={(e) => setStorageCondition(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-pharmacy-border bg-pharmacy-canvas text-xs font-medium text-pharmacy-textPrimary focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
              >
                <option value="Controlled Room Temperature (20°C - 25°C)">Controlled Room Temp (20°C - 25°C)</option>
                <option value="Cold Chain Refrigeration (2°C - 8°C)">Cold Chain (2°C - 8°C Refrigerated)</option>
                <option value="Deep Freeze (-20°C)">Deep Freeze (-20°C Vaccines)</option>
                <option value="Protect from Light & Humidity">Protect from Light & Humidity</option>
              </select>
            </div>
          </div>
        </div>

        {/* BOTTOM STICKY ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </Link>
            <span className="hidden sm:inline text-xs text-slate-400">
              Unsaved changes will be discarded
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Registering Medicine..." : "Save & Register Medicine"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
