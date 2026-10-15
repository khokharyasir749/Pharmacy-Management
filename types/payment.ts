export type RegisterSessionStatus = "Active" | "Closed";

export type PaymentMethodType =
  | "Cash Drawer"
  | "Petty Cash"
  | "Bank"
  | "Credit Card"
  | "Debit Card";

export type ExpenseCategory =
  | "Utilities"
  | "Packaging/Supplies"
  | "Refreshment"
  | "Maintenance"
  | "Logistics"
  | "Other";

export interface Expense {
  id: string; // e.g., "EXP-2026-051"
  date: string; // Timestamp e.g., "Oct 15, 2026, 09:15 AM PKT"
  category: ExpenseCategory;
  description: string;
  payee: string;
  paymentMethod: "Cash Drawer" | "Petty Cash" | "Bank";
  amount: number;
  recordedBy: string;
  voucherRef: string;
  sessionId?: string; // Links to RegisterSession id if deducted from cash drawer
  notes?: string;
}

export interface RegisterSession {
  id: string; // e.g., "REG-2026-104"
  branch: string; // e.g., "Counter 1 - Main Branch"
  cashierName: string; // e.g., "Budiono Siregar"
  cashierAvatar: string;
  openedAt: string; // e.g., "Oct 15, 2026, 08:00 AM PKT"
  closedAt?: string; // e.g., "Oct 15, 2026, 05:00 PM PKT"
  openingFloat: number; // e.g., 250.00
  cashSales: number; // Cash received from customer sales
  cardSales: number; // Visa/Master card transactions
  digitalSales: number; // Online/Mobile bank transfers
  cashRefunds: number; // Cash returned for returns/cancellations
  drawerExpenses: number; // Operational expenses paid directly from cash drawer
  expectedCash: number; // Opening Float + Cash Sales - Cash Refunds - Drawer Expenses
  countedCash?: number; // Physical cash entered by cashier at shift closing
  variance?: number; // Counted Cash - Expected Cash (0 = reconciled, <0 = shortage, >0 = surplus)
  status: RegisterSessionStatus;
  varianceReason?: string;
  notes?: string;
  totalTransactions: number;
}
