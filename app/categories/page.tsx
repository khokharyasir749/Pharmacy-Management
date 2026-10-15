"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Package,
  ArrowRight,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { initialProducts } from "@/data/mockProducts";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categoriesMap = initialProducts.reduce((acc, prod) => {
    if (!acc[prod.category]) {
      acc[prod.category] = {
        name: prod.category,
        count: 0,
        totalStock: 0,
        sampleMeds: [] as string[],
      };
    }
    acc[prod.category].count += 1;
    acc[prod.category].sampleMeds.push(prod.tradeName);
    const stock = prod.batches.reduce((s, b) => s + b.availableQuantity, 0);
    acc[prod.category].totalStock += stock;
    return acc;
  }, {} as Record<string, { name: string; count: number; totalStock: number; sampleMeds: string[] }>);

  const categories = Object.values(categoriesMap).filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-pharmacy-dark">
            Therapeutic Categories
          </h1>
          <p className="text-xs sm:text-sm text-pharmacy-textMuted mt-0.5">
            Classified pharmaceutical drug formularies, therapeutic classes, and inventory groups
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs font-semibold shadow-pill hover:shadow-lg transition-all"
        >
          <Package className="w-3.5 h-3.5" />
          <span>View All Products</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pharmacy-textMuted" />
        <input
          type="text"
          placeholder="Search therapeutic categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-full border border-pharmacy-border bg-white text-pharmacy-dark focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20"
        />
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-white rounded-3xl p-5 border border-pharmacy-border/70 shadow-card hover:shadow-floating transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-2xl bg-teal-50 text-teal-800">
                  <LayoutGrid className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pharmacy-canvas text-pharmacy-textSecondary">
                  {cat.count} Medicines
                </span>
              </div>
              <h3 className="font-bold text-base text-pharmacy-dark mt-3">
                {cat.name}
              </h3>
              <p className="text-xs text-pharmacy-textMuted mt-1">
                {cat.sampleMeds.slice(0, 3).join(", ")}
              </p>
            </div>

            <div className="pt-4 border-t border-pharmacy-borderLight mt-4 flex items-center justify-between text-xs">
              <span className="text-pharmacy-textSecondary font-semibold">
                {cat.totalStock} units available
              </span>
              <Link
                href={`/products`}
                className="inline-flex items-center gap-1 font-bold text-teal-800 hover:text-teal-950"
              >
                <span>Browse</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
