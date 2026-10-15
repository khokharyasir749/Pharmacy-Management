"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  Calendar,
  AlertTriangle,
  CreditCard,
  Banknote,
  Building2,
  CheckCircle2,
  Barcode,
  Layers,
  Save,
  X,
  User,
} from "lucide-react";
import { OrderItem, PaymentMethod } from "@/types/order";
import { InventoryItem, mockInventory } from "@/data/mockInventory";
import { saveOrder } from "@/data/mockOrders";

interface CartItem {
  inventoryItem: InventoryItem;
  quantity: number;
  unitType: string;
}

const mockCustomers = [
  {
    name: "Susan Williams",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    email: "susan.williams@gmail.com",
    phone: "+1 (555) 019-2834",
  },
  {
    name: "Bentley Howard",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    email: "b.howard@outlook.com",
    phone: "+1 (555) 014-9921",
  },
  {
    name: "Evelyn Johnson",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    email: "evelyn.j@yahoo.com",
    phone: "+1 (555) 018-4491",
  },
  {
    name: "David Chen",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80",
    email: "david.chen@techno.sg",
    phone: "+1 (555) 012-7788",
  },
];

export default function NewOrderPOSPage() {
  const router = useRouter();

  // Customer selection
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0]);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);

  // Product search & filtering
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Credit Card (visa)");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(5);

  // Validation / Feedback error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered inventory list
  const filteredInventory = useMemo(() => {
    return mockInventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        item.genericName.toLowerCase().includes(productSearch.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(productSearch.toLowerCase());

      const matchesCat =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [productSearch, selectedCategory]);

  // Add item to cart (with stock & expiry guard)
  const handleAddToCart = (item: InventoryItem) => {
    setErrorMessage(null);

    if (item.isExpired) {
      setErrorMessage(`Cannot dispense expired medicine: ${item.name} (${item.batchNumber})`);
      return;
    }

    const existingIndex = cartItems.findIndex(
      (c) => c.inventoryItem.id === item.id
    );

    if (existingIndex > -1) {
      const currentQty = cartItems[existingIndex].quantity;
      if (currentQty >= item.availableStock) {
        setErrorMessage(`Stock Limit: Only ${item.availableStock} units available for batch ${item.batchNumber}.`);
        return;
      }

      setCartItems((prev) =>
        prev.map((c, idx) =>
          idx === existingIndex ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        { inventoryItem: item, quantity: 1, unitType: "Pack" },
      ]);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setErrorMessage(null);
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.inventoryItem.id !== itemId) return item;
          const newQty = item.quantity + delta;

          if (newQty > item.inventoryItem.availableStock) {
            setErrorMessage(
              `Maximum available stock reached for ${item.inventoryItem.name}`
            );
            return item;
          }

          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove from cart
  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.inventoryItem.id !== itemId));
  };

  // Financial Calculations
  const subtotal = cartItems.reduce(
    (acc, curr) => acc + curr.inventoryItem.unitPrice * curr.quantity,
    0
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const grandTotal = taxableAmount + taxAmount;

  // Confirm and Place Order
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage("Please select at least one medicine before finalizing the order.");
      return;
    }

    setIsSubmitting(true);
    const primaryItem = cartItems[0];
    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderNumber: `PMS-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: {
        name: selectedCustomer.name,
        avatar: selectedCustomer.avatar,
        email: selectedCustomer.email,
      },
      product: {
        name:
          cartItems.length === 1
            ? primaryItem.inventoryItem.name
            : `${primaryItem.inventoryItem.name} +${cartItems.length - 1} more`,
        genericName: primaryItem.inventoryItem.genericName,
        batchNumber: primaryItem.inventoryItem.batchNumber,
        dosage: primaryItem.inventoryItem.dosage,
        availableStock: primaryItem.inventoryItem.availableStock,
        unitPrice: Number((grandTotal / cartItems.reduce((a, b) => a + b.quantity, 0)).toFixed(2)),
      },
      paymentMethod: paymentMethod,
      quantity: cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
      expiryDate: primaryItem.inventoryItem.expiryDate,
      status: "Completed",
    };

    saveOrder(newOrder);

    setTimeout(() => {
      router.push("/orders");
    }, 250);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-xs text-pharmacy-textMuted">
          <Link href="/orders" className="hover:text-teal-800 transition-colors font-medium">
            Orders
          </Link>
          <span>/</span>
          <span className="text-pharmacy-textSecondary font-medium">Counter POS</span>
          <span>/</span>
          <span className="text-pharmacy-textPrimary font-semibold">New Order</span>
        </div>

        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 bg-white border border-teal-100 hover:border-teal-300 px-3 py-1.5 rounded-full shadow-xs transition-all w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Orders</span>
        </Link>
      </div>

      {/* Main Page Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pharmacy-border/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-pharmacy-dark">
              Point of Sale (POS) Counter & Dispensing
            </h1>
            <p className="text-xs sm:text-sm text-pharmacy-textMuted mt-1 max-w-3xl leading-relaxed">
              Allocate FEFO batches, verify retail stock, apply customer discounts, and finalize payment.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-teal-50 border border-teal-200/80 px-3.5 py-2 rounded-2xl">
          <Barcode className="w-4 h-4 text-teal-800" />
          <span className="text-xs font-bold text-teal-900">Live Barcode Reader Active</span>
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

      {/* 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Customer Selection & Medicine Catalog (7 Cols / ~60%) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Customer Profile Card */}
          <div className="bg-white rounded-3xl p-5 border border-pharmacy-border/80 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                Customer Profile
              </label>
              <span className="text-[11px] text-teal-800 font-semibold">Walk-in or Registered</span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                className="w-full h-14 px-4 rounded-2xl border border-pharmacy-border bg-pharmacy-canvas flex items-center justify-between shadow-xs hover:border-pharmacy-textSecondary/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden relative bg-teal-100 flex-shrink-0">
                    <Image
                      src={selectedCustomer.avatar}
                      alt={selectedCustomer.name}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-pharmacy-textPrimary">
                      {selectedCustomer.name}
                    </div>
                    <div className="text-[11px] text-pharmacy-textMuted">
                      {selectedCustomer.email} &bull; {selectedCustomer.phone}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full">
                  Change
                </span>
              </button>

              {/* Customer Dropdown */}
              {isCustomerDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-floating border border-pharmacy-border p-2 z-40 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                  {mockCustomers.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(c);
                        setIsCustomerDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-colors ${
                        selectedCustomer.name === c.name
                          ? "bg-teal-50 text-teal-900 font-semibold"
                          : "hover:bg-pharmacy-canvas text-pharmacy-textPrimary"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden relative">
                        <Image
                          src={c.avatar}
                          alt={c.name}
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold">{c.name}</div>
                        <div className="text-[10px] text-pharmacy-textMuted">{c.email}</div>
                      </div>
                      {selectedCustomer.name === c.name && (
                        <CheckCircle2 className="w-4 h-4 text-teal-700" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Medicine Catalog & Search Card */}
          <div className="bg-white rounded-3xl p-5 border border-pharmacy-border/80 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                Medicine Catalog (FEFO Batch Allocation)
              </label>
              <span className="text-xs font-mono text-pharmacy-textMuted">
                {filteredInventory.length} products available
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-pharmacy-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search by brand name, active formula, or batch barcode..."
                className="w-full h-12 pl-10 pr-4 bg-pharmacy-canvas border border-pharmacy-border rounded-2xl text-xs text-pharmacy-textPrimary placeholder:text-pharmacy-textMuted focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark transition-all shadow-xs"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
              {["All", "Antibiotics", "Cardiovascular", "Pain Relief", "Respiratory"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-pharmacy-dark text-white font-semibold shadow-xs"
                      : "bg-pharmacy-canvas text-pharmacy-textSecondary hover:bg-pharmacy-mintHover"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Cards List */}
            <div className="space-y-3 max-h-[62vh] overflow-y-auto pr-1">
              {filteredInventory.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    item.isExpired
                      ? "bg-rose-50/50 border-rose-200/80 opacity-75"
                      : "bg-white border-pharmacy-border/80 hover:border-teal-400 hover:shadow-card"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-pharmacy-textPrimary truncate">
                        {item.name}
                      </span>

                      {item.isNearExpiry && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          FEFO Earliest
                        </span>
                      )}

                      {item.isExpired && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
                          Expired
                        </span>
                      )}

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pharmacy-canvas text-pharmacy-textSecondary border border-slate-100">
                        {item.batchNumber}
                      </span>
                    </div>

                    <div className="text-xs text-pharmacy-textMuted mt-1 truncate">
                      {item.genericName} &bull; {item.dosage}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-pharmacy-textSecondary">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-pharmacy-textMuted" />
                        Exp: {item.expiryDate.split(" ")[0]} {item.expiryDate.split(" ")[1]}
                      </span>

                      <span
                        className={`font-semibold ${
                          item.availableStock < 20 ? "text-amber-700" : "text-emerald-700"
                        }`}
                      >
                        {item.availableStock} in stock
                      </span>
                    </div>
                  </div>

                  {/* Price & Add Action */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="font-extrabold text-base text-pharmacy-dark">
                      ${item.unitPrice.toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      disabled={item.isExpired || item.availableStock === 0}
                      className="px-4 py-2 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: POS Cart & Checkout Summary (5 Cols / ~40%) */}
        <div className="lg:col-span-5 bg-[#F6FAF8] rounded-3xl p-6 border border-pharmacy-border shadow-card flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
              <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                Selected Cart Items ({cartItems.length})
              </span>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCartItems([])}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-[34vh] overflow-y-auto pr-1">
              {cartItems.length > 0 ? (
                cartItems.map((c) => (
                  <div
                    key={c.inventoryItem.id}
                    className="p-3.5 bg-white rounded-2xl border border-pharmacy-border/60 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-pharmacy-textPrimary truncate">
                        {c.inventoryItem.name}
                      </div>
                      <div className="text-[10px] text-pharmacy-textMuted flex items-center gap-1 font-mono">
                        Batch: {c.inventoryItem.batchNumber}
                      </div>
                      <div className="text-xs font-semibold text-teal-800 mt-1">
                        ${(c.inventoryItem.unitPrice * c.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Stepper & Trash */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="inline-flex items-center gap-2 bg-pharmacy-canvas rounded-full px-2.5 py-1 border border-teal-100">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(c.inventoryItem.id, -1)}
                          className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-pharmacy-textSecondary hover:bg-teal-50"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                        <span className="text-xs font-bold text-pharmacy-textPrimary w-4 text-center">
                          {c.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(c.inventoryItem.id, 1)}
                          className="w-5 h-5 rounded-full bg-pharmacy-dark flex items-center justify-center text-white hover:bg-pharmacy-darkHover"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(c.inventoryItem.id)}
                        className="p-1.5 rounded text-pharmacy-textMuted hover:text-rose-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-pharmacy-textMuted">
                  <Layers className="w-8 h-8 mx-auto mb-2 stroke-[1.5] text-pharmacy-textMuted/60" />
                  <p className="text-xs font-medium">Cart is currently empty</p>
                  <p className="text-[11px]">Select medicines from the catalog to dispense</p>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-pharmacy-textSecondary block mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    label: "Cash",
                    value: "Cash on Counter",
                    icon: Banknote,
                  },
                  {
                    label: "Credit Card",
                    value: "Credit Card (visa)",
                    icon: CreditCard,
                  },
                  {
                    label: "Debit Card",
                    value: "Debit Card (Master)",
                    icon: Building2,
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setPaymentMethod(m.value as PaymentMethod)}
                      className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-pharmacy-dark text-white border-pharmacy-dark shadow-xs font-semibold"
                          : "bg-white text-pharmacy-textSecondary border-pharmacy-border hover:bg-pharmacy-canvas text-xs"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs leading-tight">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown & Checkout Total */}
          <div className="mt-4 pt-4 border-t border-pharmacy-border/80 space-y-2.5">
            <div className="flex justify-between text-xs text-pharmacy-textSecondary">
              <span>Subtotal ({cartItems.reduce((acc, c) => acc + c.quantity, 0)} items):</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-pharmacy-textSecondary">
              <span>Discount (%):</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                  className="w-16 h-8 text-right px-2 rounded-xl border border-pharmacy-border bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
                />
                {discountPercent > 0 && (
                  <span className="text-[11px] text-rose-600 font-medium">
                    -${discountAmount.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-pharmacy-textSecondary">
              <span>Sales Tax (%):</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                  className="w-16 h-8 text-right px-2 rounded-xl border border-pharmacy-border bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
                />
                {taxAmount > 0 && (
                  <span className="text-[11px] text-emerald-700 font-medium">
                    +${taxAmount.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-pharmacy-border text-pharmacy-dark">
              <div>
                <span className="text-sm font-bold block">Grand Total:</span>
                <span className="text-[10px] text-pharmacy-textMuted uppercase font-semibold">
                  Live POS Receipt Total
                </span>
              </div>
              <span className="text-2xl font-black tracking-tight text-teal-900">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full mt-4 py-3.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Finalizing Order..." : "Confirm & Complete Order"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
