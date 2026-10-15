"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Package,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  X,
} from "lucide-react";
import ProductCatalogTable from "@/components/products/ProductCatalogTable";
import AddMedicineModal from "@/components/products/AddMedicineModal";
import { initialProducts, getStoredProducts } from "@/data/mockProducts";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  // Dynamic KPI Calculations
  const totalProductsCount = products.length;

  const lowStockCount = products.filter((p) => {
    const totalStock = p.batches.reduce((sum, b) => sum + b.availableQuantity, 0);
    return totalStock > 0 && totalStock <= p.reorderLevel;
  }).length;

  const nearExpiryCount = products.reduce((count, p) => {
    return count + p.batches.filter((b) => b.isNearExpiry).length;
  }, 0);

  const totalInventoryValue = products.reduce((total, p) => {
    const productVal = p.batches.reduce(
      (sum, b) => sum + b.availableQuantity * b.costPrice,
      0
    );
    return total + productVal;
  }, 0);

  // Add Product Handler
  const handleProductAdded = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    setToastMessage(`Medicine "${newProduct.tradeName}" successfully added with batch allocation!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Archive Product Handler
  const handleArchiveProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setToastMessage("Medicine moved to archive.");
    setTimeout(() => setToastMessage(null), 3000);
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
            Medicine Catalog & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-pharmacy-textMuted mt-0.5">
            Manage pharmaceutical formulations, batch stocks, unit conversions, and reorder levels
          </p>
        </div>

        {/* Add Medicine Button (Routes to dedicated full page) */}
        <Link
          href="/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white font-medium text-sm shadow-pill hover:shadow-lg transition-all duration-200 self-start sm:self-auto group active:scale-95 cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-200">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>+ Add Medicine</span>
        </Link>
      </div>

      {/* Top Summary KPI Cards (4-Column Grid) */}
      <section
        aria-label="Inventory Metrics"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Total Products */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Total Products
            </span>
            <div className="p-2 rounded-2xl bg-pharmacy-canvas text-teal-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-pharmacy-dark tracking-tight">
              {totalProductsCount}
            </div>
            <div className="text-[11px] text-pharmacy-textMuted mt-1">
              Active stock formulations across 7 categories
            </div>
          </div>
        </div>

        {/* Card 2: Low Stock Alert */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Low Stock Alert
            </span>
            <div className="p-2 rounded-2xl bg-amber-50 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-700 tracking-tight">
              {lowStockCount}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Below reorder safety threshold</span>
            </div>
          </div>
        </div>

        {/* Card 3: Near Expiry Batches */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Near Expiry Batches
            </span>
            <div className="p-2 rounded-2xl bg-rose-50 text-rose-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-rose-600 tracking-tight">
              {nearExpiryCount}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-rose-700">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Expiring within &lt; 60 days (FEFO)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Inventory Valuation */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-pharmacy-border/60 flex flex-col justify-between transition-all duration-300 hover:shadow-floating">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
              Total Valuation
            </span>
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-teal-900 tracking-tight">
              ${totalInventoryValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Cost basis inventory value</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Data Table Section */}
      <section aria-label="Products Table">
        <ProductCatalogTable
          products={products}
          onArchiveProduct={handleArchiveProduct}
        />
      </section>

      {/* Add Medicine Modal */}
      <AddMedicineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
}
