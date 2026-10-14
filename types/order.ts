export type PaymentMethod =
  | "Credit Card (visa)"
  | "Debit Card (Master)"
  | "Cash on Counter"
  | "Apple Pay"
  | "Online Bank Transfer";

export type OrderStatus = "Completed" | "Pending" | "Processing" | "Near Expiry";

export interface OrderItem {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    avatar: string;
    email: string;
  };
  product: {
    name: string;
    genericName?: string;
    batchNumber: string;
    dosage?: string;
    availableStock: number;
    unitPrice: number;
  };
  paymentMethod: PaymentMethod;
  quantity: number;
  expiryDate: string; // ISO string or formatted string
  status: OrderStatus;
}
