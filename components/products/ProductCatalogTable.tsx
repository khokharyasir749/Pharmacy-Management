"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Layers,
  AlertTriangle,
  ChevronDown,
  Check,
  Eye,
  Edit2,
  Archive,
  Pill,
  Sparkles,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Product, ProductCategory } from "@/types/product";

interface ProductCatalogTableProps {
  products: Product[];
  onEditProduct?: (product: Product) => void;
  onArchiveProduct?: (productId: string) => void;
}

export default function ProductCatalogTable({
  products,
  onEditProduct,
  onArchiveProduct,
}: ProductCatalogTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>("All");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState<Product | null>(null);

  // Filter products logic
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Search matching
      const matchesSearch =
        prod.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.barcode.includes(searchQuery);

      // Category matching
      const matchesCat =
        selectedCategory === "All" || prod.category === selectedCategory;

      // Stock status matching
      const totalStock = prod.batches.reduce(
        (sum, b) => sum + b.availableQuantity,
        0
      );
      let matchesStock = true;
      if (selectedStockStatus === "In Stock") {
        matchesStock = totalStock > prod.reorderLevel;
      } else if (selectedStockStatus === "Low Stock") {
        matchesStock = totalStock > 0 && totalStock <= prod.reorderLevel;
      } else if (selectedStockStatus === "Out of Stock") {
        matchesStock = totalStock === 0;
      }

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, selectedStockStatus]);

  // Dosage form color badge
  const getDosageFormBadge = (form: string) => {
    switch (form) {
      case "Tablet":
        return "bg-teal-50 text-teal-800 border-teal-200/60";
      case "Capsule":
        return "bg-sky-50 text-sky-800 border-sky-200/60";
      case "Inhaler":
        return "bg-purple-50 text-purple-800 border-purple-200/60";
      case "Syrup":
        return "bg-amber-50 text-amber-800 border-amber-200/60";
      default:
        return "bg-slate-50 text-slate-800 border-slate-200/60";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-card border border-pharmacy-border/60 transition-all duration-300">
      {/* Table Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-pharmacy-borderLight">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-pharmacy-dark">
              Medicine Catalog & Formulations
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pharmacy-canvas text-pharmacy-textSecondary">
              {filteredProducts.length} medicines
            </span>
          </div>
          <p className="text-xs text-pharmacy-textMuted mt-0.5">
            Real-time batch tracking, reorder alert thresholds, and multi-unit retail pricing
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-pharmacy-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trade, formula, SKU..."
              className="h-10 pl-10 pr-4 bg-[#F5FAF8] border border-pharmacy-border/80 rounded-full text-xs sm:text-sm text-pharmacy-textPrimary placeholder:text-pharmacy-textMuted focus:outline-none focus:ring-2 focus:ring-pharmacy-textPrimary/20 focus:border-pharmacy-textPrimary/30 transition-all w-48 sm:w-60 shadow-xs"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="h-10 px-4 rounded-full border border-pharmacy-border/80 bg-white hover:bg-pharmacy-canvas text-xs sm:text-sm font-semibold text-pharmacy-textSecondary flex items-center gap-2 transition-all shadow-xs"
            >
              <Filter className="w-3.5 h-3.5 text-pharmacy-textMuted stroke-[2.2]" />
              <span>{selectedCategory === "All" ? "Category" : selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 text-pharmacy-textMuted" />
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-floating border border-pharmacy-border p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                {[
                  "All",
                  "Antibiotics",
                  "Cardiovascular",
                  "Analgesics",
                  "Respiratory",
                  "Gastrointestinal",
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between transition-colors ${
                      selectedCategory === cat
                        ? "bg-pharmacy-mintLight text-pharmacy-textPrimary font-semibold"
                        : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && (
                      <Check className="w-3 h-3 text-teal-800" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stock Status Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="h-10 px-4 rounded-full border border-pharmacy-border/80 bg-white hover:bg-pharmacy-canvas text-xs sm:text-sm font-semibold text-pharmacy-textSecondary flex items-center gap-2 transition-all shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-pharmacy-textMuted stroke-[2.2]" />
              <span>{selectedStockStatus === "All" ? "Stock Status" : selectedStockStatus}</span>
              <ChevronDown className="w-3.5 h-3.5 text-pharmacy-textMuted" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-floating border border-pharmacy-border p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                {["All", "In Stock", "Low Stock", "Out of Stock"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setSelectedStockStatus(status);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between transition-colors ${
                      selectedStockStatus === status
                        ? "bg-pharmacy-mintLight text-pharmacy-textPrimary font-semibold"
                        : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
                    }`}
                  >
                    <span>{status}</span>
                    {selectedStockStatus === status && (
                      <Check className="w-3 h-3 text-teal-800" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Canvas with Horizontal Scroll for Mobile */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse min-w-[980px]">
          <thead>
            <tr className="border-b border-pharmacy-borderLight text-xs font-semibold text-pharmacy-textSecondary/90 select-none">
              <th className="py-3.5 px-4">Medicine Info</th>
              <th className="py-3.5 px-4">Form & Category</th>
              <th className="py-3.5 px-4">Earliest FEFO Batch</th>
              <th className="py-3.5 px-4">Stock Level</th>
              <th className="py-3.5 px-4">Unit Packaging</th>
              <th className="py-3.5 px-4">Cost / Selling</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-pharmacy-borderLight text-sm">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const totalStock = product.batches.reduce(
                  (sum, b) => sum + b.availableQuantity,
                  0
                );
                const earliestBatch = product.batches[0];
                const isLowStock = totalStock > 0 && totalStock <= product.reorderLevel;
                const isOutOfStock = totalStock === 0;

                // Profit margin percentage
                const marginPercent = (
                  ((product.sellingPrice - product.costPrice) / product.costPrice) *
                  100
                ).toFixed(0);

                // Stock progress width (scaled against 100 max)
                const stockProgressWidth = Math.min(100, Math.max(5, (totalStock / (product.reorderLevel * 2.5)) * 100));

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-[#FAFDFC] transition-colors duration-150"
                  >
                    {/* Medicine Info */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-pharmacy-canvas flex items-center justify-center text-pharmacy-textPrimary flex-shrink-0 mt-0.5">
                          <Pill className="w-5 h-5 text-teal-800 stroke-[2]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-pharmacy-textPrimary">
                            {product.tradeName}
                          </span>
                          <span className="text-[11px] text-pharmacy-textMuted font-medium">
                            {product.genericName}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-pharmacy-canvas text-pharmacy-textSecondary border border-pharmacy-border/60">
                              {product.sku}
                            </span>
                            <span className="text-[10px] text-pharmacy-textMuted">
                              {product.manufacturer}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Form & Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border w-fit ${getDosageFormBadge(
                            product.dosageForm
                          )}`}
                        >
                          {product.dosageForm}
                        </span>
                        <span className="text-[11px] text-pharmacy-textMuted font-medium">
                          {product.category}
                        </span>
                      </div>
                    </td>

                    {/* Earliest FEFO Batch */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {earliestBatch ? (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-pharmacy-textPrimary">
                              {earliestBatch.batchNumber}
                            </span>
                            {earliestBatch.isNearExpiry && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 flex items-center gap-0.5">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Near Expiry
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-pharmacy-textMuted mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-pharmacy-textMuted" />
                            Exp: {earliestBatch.expiryDate}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-pharmacy-textMuted italic">
                          No active batches
                        </span>
                      )}
                    </td>

                    {/* Stock Level with Progress Bar */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="w-36 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-pharmacy-textPrimary">
                            {totalStock}{" "}
                            <span className="font-normal text-pharmacy-textMuted text-[11px]">
                              {product.unitConversion.baseUnit}s
                            </span>
                          </span>

                          {isOutOfStock ? (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                              Out
                            </span>
                          ) : isLowStock ? (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                              Low
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              Healthy
                            </span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isOutOfStock
                                ? "bg-rose-500 w-1"
                                : isLowStock
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${stockProgressWidth}%` }}
                          />
                        </div>

                        <span className="text-[10px] text-pharmacy-textMuted">
                          Reorder trigger at {product.reorderLevel} units
                        </span>
                      </div>
                    </td>

                    {/* Unit Conversions */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs text-pharmacy-textSecondary flex flex-col gap-0.5">
                        <span className="font-medium text-pharmacy-textPrimary">
                          1 {product.unitConversion.packUnit} = {product.unitConversion.totalBaseUnitsPerPack} {product.unitConversion.baseUnit}s
                        </span>
                        {product.unitConversion.stripUnit && (
                          <span className="text-[11px] text-pharmacy-textMuted">
                            ({product.unitConversion.stripsPerPack} strips &times; {product.unitConversion.unitsPerStrip} {product.unitConversion.baseUnit}s)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Cost / Selling Price */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-pharmacy-dark">
                            ${product.sellingPrice.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 rounded flex items-center">
                            +{marginPercent}%
                          </span>
                        </div>
                        <span className="text-[11px] text-pharmacy-textMuted mt-0.5">
                          Cost: ${product.costPrice.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Batch Details View */}
                        <button
                          type="button"
                          onClick={() => setSelectedBatchDetails(product)}
                          className="p-1.5 rounded-lg text-pharmacy-textSecondary hover:bg-pharmacy-canvas hover:text-pharmacy-dark transition-colors"
                          title="View Batches"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Product */}
                        <button
                          type="button"
                          onClick={() => onEditProduct && onEditProduct(product)}
                          className="p-1.5 rounded-lg text-pharmacy-textSecondary hover:bg-pharmacy-canvas hover:text-pharmacy-dark transition-colors"
                          title="Edit Medicine"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Archive Product */}
                        <button
                          type="button"
                          onClick={() => onArchiveProduct && onArchiveProduct(product.id)}
                          className="p-1.5 rounded-lg text-pharmacy-textMuted hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-pharmacy-textMuted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 stroke-[1.5] text-pharmacy-textMuted" />
                    <p className="text-sm font-semibold text-pharmacy-textPrimary">
                      No medicines match the selected filter
                    </p>
                    <p className="text-xs">Adjust your search query or reset filters</p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setSelectedStockStatus("All");
                      }}
                      className="mt-2 text-xs text-pharmacy-dark font-semibold underline"
                    >
                      Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Batch Details Modal Drawer */}
      {selectedBatchDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pharmacy-dark/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedBatchDetails(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-floating border border-pharmacy-border p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
              <div>
                <h3 className="text-lg font-bold text-pharmacy-dark">
                  Batch Allocation: {selectedBatchDetails.tradeName}
                </h3>
                <p className="text-xs text-pharmacy-textMuted">
                  {selectedBatchDetails.genericName} &bull; {selectedBatchDetails.dosageForm} ({selectedBatchDetails.strength})
                </p>
              </div>
              <button
                onClick={() => setSelectedBatchDetails(null)}
                className="p-1 rounded-full text-pharmacy-textMuted hover:bg-pharmacy-canvas"
              >
                ✕
              </button>
            </div>

            {/* Batches Breakdown */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {selectedBatchDetails.batches.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-2xl border border-pharmacy-border/80 flex items-center justify-between bg-pharmacy-canvas/30"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-pharmacy-textPrimary">
                        {b.batchNumber}
                      </span>
                      {b.isNearExpiry && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                          Near Expiry
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-pharmacy-textMuted mt-0.5">
                      Received: {b.receivedDate} &bull; Expiry: {b.expiryDate}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-sm text-pharmacy-dark">
                      {b.availableQuantity} / {b.initialQuantity} units
                    </div>
                    <div className="text-[11px] text-pharmacy-textMuted">
                      Cost: ${b.costPrice.toFixed(2)} | Sell: ${b.sellingPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-pharmacy-borderLight flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBatchDetails(null)}
                className="px-5 py-2 rounded-full bg-pharmacy-dark text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
