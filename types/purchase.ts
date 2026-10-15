export type POStatus = "Draft" | "Submitted" | "Received" | "Cancelled";
export type PaymentStatus = "Paid" | "Partial" | "Unpaid";

export interface POLineItem {
  id: string;
  medicineName: string;
  dosage: string;
  batchNumber: string;
  expiryDate: string;
  orderedQuantity: number;
  receivedQuantity: number;
  freeQuantity: number; // Bonus goods
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. "PO-2026-081"
  orderDate: string;
  branch: string;
  supplierId: string;
  supplierName: string;
  supplierContact: string;
  invoiceRef: string; // Supplier invoice reference
  items: POLineItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalCost: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  status: POStatus;
  expectedDeliveryDate?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  representative: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: "Net 30 Days" | "Net 15 Days" | "Cash on Delivery" | "Advance Payment";
  totalOrdersCount: number;
  outstandingBalance: number;
  nextDueDate: string;
  rating: number; // 1 to 5
}

export interface SupplierPaymentRecord {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  paymentMethod: "Bank Transfer" | "Cash" | "Cheque";
  reference: string;
  date: string;
  notes?: string;
}
