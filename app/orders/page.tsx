"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Plus,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Building2,
  Banknote,
  Calendar,
  X,
  FileText,
  RotateCcw,
} from "lucide-react";
import { OrderItem, OrderStatus, PaymentMethod } from "@/types/order";
import { initialOrders, getStoredOrders } from "@/data/mockOrders";
import CreateOrderModal from "@/components/orders/CreateOrderModal";
import ModalPortal from "@/components/common/ModalPortal";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedPayment, setSelectedPayment] = useState<string>("All");
  const [dateRange, setDateRange] = useState<string>("All Time");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  // KPI calculations
  const totalOrdersCount = orders.length;
  const completedOrders = orders.filter((o) => o.status === "Completed");
  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Processing");
  const totalRevenue = orders.reduce(
    (acc, o) => acc + o.quantity * o.product.unitPrice,
    0
  );

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search
      const matchesSearch =
        searchQuery === "" ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());

      // Status
      const matchesStatus =
        selectedStatus === "All" || order.status === selectedStatus;

      // Payment
      const matchesPayment =
        selectedPayment === "All" || order.paymentMethod.includes(selectedPayment);

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, selectedStatus, selectedPayment]);

  const handleOrderCreated = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    setToastMessage(`Order #${newOrder.orderNumber} for ${newOrder.customer.name} created successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = [
      "Order Number",
      "Customer Name",
      "Customer Email",
      "Product Name",
      "Batch Number",
      "Quantity",
      "Unit Price",
      "Total Price",
      "Payment Method",
      "Expiry Date",
      "Status",
    ];

    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      `"${o.customer.name}"`,
      o.customer.email,
      `"${o.product.name}"`,
      o.product.batchNumber,
      o.quantity,
      o.product.unitPrice.toFixed(2),
      (o.quantity * o.product.unitPrice).toFixed(2),
      `"${o.paymentMethod}"`,
      `"${o.expiryDate}"`,
      o.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pms_orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage("Orders exported to CSV successfully.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleQuantityAdjust = (orderId: string, delta: number) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const newQty = ord.quantity + delta;
        if (newQty < 1 || newQty > ord.product.availableStock) return ord;
        return { ...ord, quantity: newQty };
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-teal-600 hover:text-teal-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Orders & Prescriptions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer orders, counter dispensing sessions, and printable tax receipts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {/* Create Order Button (Routes to dedicated full page) */}
          <Link
            href="/orders/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Order</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-800">{totalOrdersCount}</div>
          <p className="text-[11px] text-slate-400">Lifetime system checkouts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Completed & Dispensed</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{completedOrders.length}</div>
          <p className="text-[11px] text-emerald-600 font-medium">
            {totalOrdersCount > 0
              ? `${Math.round((completedOrders.length / totalOrdersCount) * 100)}% fulfillment rate`
              : "0%"}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pending Fulfillment</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-700">{pendingOrders.length}</div>
          <p className="text-[11px] text-amber-600 font-medium">Awaiting customer collection</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Gross Sales Value</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-800">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">Total line totals</p>
        </div>
      </div>

      {/* Main Orders Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, customer, medicine..."
              className="w-full pl-10 pr-3.5 py-2 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl text-xs font-semibold text-slate-600">
              {["All", "Completed", "Pending", "Processing"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-xl text-xs transition-colors ${
                    selectedStatus === status
                      ? "bg-white text-slate-800 shadow-sm"
                      : "hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Payment Method Selector */}
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="px-3 py-1.5 rounded-2xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
            >
              <option value="All">All Payments</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Order #</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Dispensed Medicine</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right">Line Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No orders found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const lineTotal = order.quantity * order.product.unitPrice;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Order Number */}
                      <td className="py-3.5 px-5 font-mono font-bold text-teal-800">
                        {order.orderNumber}
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 ring-1 ring-slate-200">
                            {!imgErrors[order.id] && order.customer.avatar ? (
                              <Image
                                src={order.customer.avatar}
                                alt={order.customer.name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                                onError={() => setImgErrors((prev) => ({ ...prev, [order.id]: true }))}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-slate-600">
                                {order.customer.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{order.customer.name}</p>
                            <p className="text-[10px] text-slate-400">{order.customer.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Product & Batch */}
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-slate-800">{order.product.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Batch: {order.product.batchNumber} • Exp: {order.expiryDate.split(" ")[0]}
                        </p>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.paymentMethod}</span>
                        </span>
                      </td>

                      {/* Quantity Stepper */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-xl px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() => handleQuantityAdjust(order.id, -1)}
                            className="p-0.5 text-slate-500 hover:text-slate-800"
                            disabled={order.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="font-bold text-xs min-w-[18px] text-center">
                            {order.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityAdjust(order.id, 1)}
                            className="p-0.5 text-slate-500 hover:text-slate-800"
                            disabled={order.quantity >= order.product.availableStock}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Line Total */}
                      <td className="py-3.5 px-4 text-right font-bold text-slate-800 font-mono">
                        ${lineTotal.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : order.status === "Pending"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            title="View Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setTimeout(() => window.print(), 300);
                            }}
                            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            title="Print Tax Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Receipt Modal */}
      <ModalPortal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <div
            className="relative w-full max-w-xl max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Order Details: {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tax Invoice & Dispensing Fulfillment Slip
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Receipt Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Customer Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedOrder.customer.name}</span>
                  <span className="text-slate-500 block">{selectedOrder.customer.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedOrder.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Itemized Medicine Details */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{selectedOrder.product.name}</h4>
                    <p className="text-slate-500 text-[11px]">{selectedOrder.product.genericName || "Pharmaceutical Item"}</p>
                    <p className="text-slate-400 font-mono text-[10px] mt-0.5">
                      Batch #{selectedOrder.product.batchNumber} • Expiry: {selectedOrder.expiryDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-teal-900 font-mono">
                      ${(selectedOrder.quantity * selectedOrder.product.unitPrice).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {selectedOrder.quantity} units &times; ${selectedOrder.product.unitPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 text-slate-600">
                  <div className="flex justify-between text-xs">
                    <span>Payment Method:</span>
                    <strong className="text-slate-800">{selectedOrder.paymentMethod}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Available Store Stock:</span>
                    <strong className="text-slate-800">{selectedOrder.product.availableStock} packs remaining</strong>
                  </div>
                  <div className="flex justify-between text-xs border-t border-dashed border-slate-200 pt-2 font-bold text-slate-900">
                    <span>Total Amount Paid:</span>
                    <span className="text-base text-teal-900 font-mono">
                      ${(selectedOrder.quantity * selectedOrder.product.unitPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </ModalPortal>

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
}
