"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Search,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Building2,
  Banknote,
  Barcode,
  Calendar,
  Layers,
  ShoppingCart,
} from "lucide-react";
import { OrderItem, PaymentMethod } from "@/types/order";
import { mockInventory, mockCustomers, InventoryItem } from "@/data/mockInventory";

interface CartItem {
  inventoryItem: InventoryItem;
  quantity: number;
  unitType: "Pack" | "Strip" | "Tablet";
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (newOrder: OrderItem) => void;
}

export default function CreateOrderModal({
  isOpen,
  onClose,
  onOrderCreated,
}: CreateOrderModalProps) {
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

  // Validation / Feedback error
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

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Filtered inventory list
  const filteredInventory = useMemo(() => {
    return mockInventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        item.genericName.toLowerCase().includes(productSearch.toLowerCase()) ||
        item.barcode.includes(productSearch) ||
        item.batchNumber.toLowerCase().includes(productSearch.toLowerCase());

      const matchesCat =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [productSearch, selectedCategory]);

  // Add item to cart (with stock & expiry guard)
  const handleAddToCart = (item: InventoryItem) => {
    setErrorMessage(null);

    // Expiry Guard
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

          // Stock guard
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

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, curr) => acc + curr.inventoryItem.unitPrice * curr.quantity,
    0
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Confirm order
  const handleConfirmOrder = () => {
    if (cartItems.length === 0) {
      setErrorMessage("Please select at least one medicine before creating the order.");
      return;
    }

    // Build standard OrderItem
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

    onOrderCreated(newOrder);
    onClose();

    // Reset local state
    setCartItems([]);
    setDiscountPercent(0);
    setErrorMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden my-auto border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (fixed top) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">
                Create New Order
              </h2>
              <p className="text-xs text-slate-500">
                Allocate FEFO batches, verify retail stock, and finalize customer payment
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

        {/* Validation Banner if any */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body - 2 Columns (Catalog vs Cart) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Customer & Medicine Selection (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-5">
            {/* Customer Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                Customer Profile
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                  className="w-full h-12 px-4 rounded-2xl border border-pharmacy-border bg-[#F8FCFB] flex items-center justify-between shadow-xs hover:border-pharmacy-textSecondary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative bg-teal-100 flex-shrink-0">
                      <Image
                        src={selectedCustomer.avatar}
                        alt={selectedCustomer.name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-pharmacy-textPrimary">
                        {selectedCustomer.name}
                      </div>
                      <div className="text-[10px] text-pharmacy-textMuted">
                        {selectedCustomer.email}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-teal-800 bg-pharmacy-mintLight px-2.5 py-1 rounded-full">
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
                            ? "bg-pharmacy-mintLight"
                            : "hover:bg-pharmacy-canvas"
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full overflow-hidden relative">
                          <Image
                            src={c.avatar}
                            alt={c.name}
                            width={28}
                            height={28}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-pharmacy-textPrimary">
                            {c.name}
                          </div>
                          <div className="text-[10px] text-pharmacy-textMuted">
                            {c.phone}
                          </div>
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

            {/* Medicine Search & Barcode Scan Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                  Medicine Catalog (FEFO Batch Allocation)
                </label>
                <span className="text-[11px] text-pharmacy-textMuted flex items-center gap-1 font-mono">
                  <Barcode className="w-3.5 h-3.5 text-teal-700" />
                  Barcode Scan Active
                </span>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-pharmacy-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search by brand name, formula, or barcode..."
                  className="w-full h-11 pl-10 pr-4 bg-[#F8FCFB] border border-pharmacy-border rounded-2xl text-xs text-pharmacy-textPrimary placeholder:text-pharmacy-textMuted focus:outline-none focus:ring-2 focus:ring-pharmacy-dark/20 focus:border-pharmacy-dark/40 transition-all shadow-xs"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
                {["All", "Antibiotics", "Cardiovascular", "Pain Relief", "Respiratory"].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? "bg-pharmacy-dark text-white font-semibold"
                          : "bg-pharmacy-canvas text-pharmacy-textSecondary hover:bg-pharmacy-mintHover"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Product Cards List */}
            <div className="space-y-2.5 overflow-y-auto max-h-[320px] pr-1">
              {filteredInventory.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    item.isExpired
                      ? "bg-rose-50/50 border-rose-200/80 opacity-75"
                      : "bg-white border-pharmacy-border/80 hover:border-teal-400 hover:shadow-card"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-pharmacy-textPrimary truncate">
                        {item.name}
                      </span>

                      {/* FEFO Tag */}
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

                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pharmacy-canvas text-pharmacy-textSecondary">
                        {item.batchNumber}
                      </span>
                    </div>

                    <div className="text-[11px] text-pharmacy-textMuted mt-0.5 truncate">
                      {item.genericName} &bull; {item.dosage}
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-pharmacy-textSecondary">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-pharmacy-textMuted" />
                        Exp: {item.expiryDate.split(" ")[0]} {item.expiryDate.split(" ")[1]}
                      </span>

                      <span
                        className={`font-semibold ${
                          item.availableStock < 20
                            ? "text-amber-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {item.availableStock} in stock
                      </span>
                    </div>
                  </div>

                  {/* Price & Add Action */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="font-extrabold text-sm text-pharmacy-dark">
                      ${item.unitPrice.toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      disabled={item.isExpired || item.availableStock === 0}
                      className="px-3.5 py-1.5 rounded-full bg-pharmacy-dark hover:bg-pharmacy-darkHover text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all active:scale-95"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: POS Cart & Order Summary (5 cols) */}
          <div className="lg:col-span-5 bg-[#F6FAF8] rounded-2xl p-5 border border-pharmacy-border flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-pharmacy-borderLight">
                <span className="text-xs font-bold uppercase tracking-wider text-pharmacy-textSecondary">
                  Selected Cart Items ({cartItems.length})
                </span>
                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCartItems([])}
                    className="text-[11px] text-rose-600 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {cartItems.length > 0 ? (
                  cartItems.map((c) => (
                    <div
                      key={c.inventoryItem.id}
                      className="p-3 bg-white rounded-xl border border-pharmacy-border/60 shadow-xs flex items-center justify-between gap-3"
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
                        <div className="inline-flex items-center gap-1.5 bg-pharmacy-canvas rounded-full px-2 py-0.5 border border-teal-100">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(c.inventoryItem.id, -1)}
                            className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-pharmacy-textSecondary hover:bg-teal-50"
                          >
                            <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                          </button>
                          <span className="text-xs font-bold text-pharmacy-textPrimary w-4 text-center">
                            {c.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(c.inventoryItem.id, 1)}
                            className="w-4 h-4 rounded-full bg-pharmacy-dark flex items-center justify-center text-white hover:bg-pharmacy-darkHover"
                          >
                            <Plus className="w-2.5 h-2.5 stroke-[3]" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(c.inventoryItem.id)}
                          className="p-1 rounded text-pharmacy-textMuted hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-pharmacy-textMuted">
                    <Layers className="w-7 h-7 mx-auto mb-1 stroke-[1.5] text-pharmacy-textMuted/60" />
                    <p className="text-xs font-medium">Cart is currently empty</p>
                    <p className="text-[10px]">Select medicines from the catalog</p>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-pharmacy-textSecondary block mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
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
                        className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? "bg-pharmacy-dark text-white border-pharmacy-dark shadow-xs font-semibold"
                            : "bg-white text-pharmacy-textSecondary border-pharmacy-border hover:bg-pharmacy-canvas text-xs"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-[11px] leading-tight">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pricing Breakdown & Checkout Total */}
            <div className="mt-4 pt-3 border-t border-pharmacy-border/80 space-y-2">
              <div className="flex justify-between text-xs text-pharmacy-textSecondary">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-pharmacy-textSecondary">
                <span>Discount (%):</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                  className="w-16 h-7 text-right px-2 rounded-lg border border-pharmacy-border bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pharmacy-dark"
                />
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-pharmacy-border text-pharmacy-dark">
                <span className="text-sm font-bold">Grand Total:</span>
                <span className="text-2xl font-black tracking-tight text-teal-900">
                  ${grandTotal.toFixed(2)}
                </span>
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
            type="button"
            onClick={handleConfirmOrder}
            disabled={cartItems.length === 0}
            className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Confirm & Create Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
