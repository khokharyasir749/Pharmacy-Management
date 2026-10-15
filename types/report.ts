export interface SalesProfitSummary {
  grossSales: number;
  itemDiscounts: number;
  customerReturns: number;
  netRevenue: number;
  cogs: number;
  operatingExpenses: number;
  estimatedNetProfit: number;
  grossMarginPercent: number;
  netMarginPercent: number;
}

export interface ProductProfitRecord {
  id: string;
  sku: string;
  productName: string;
  category: string;
  form: string; // e.g. "Packs", "Strips", "Tablets", "Suspension", "Vials"
  unitsSold: number;
  revenue: number;
  batchCostBasis: number; // Cost of Goods Sold
  grossProfit: number;
  marginPercent: number;
}

export type ExpiryRiskLevel = "Critical" | "Warning" | "Safe";

export interface InventoryExpiryItem {
  id: string;
  sku: string;
  medicineName: string;
  genericName: string;
  batchNumber: string;
  branch: string;
  availableUnits: number;
  unitCost: number;
  totalStockValue: number;
  expiryDate: string;
  daysToExpiry: number;
  reorderLevel: number;
  riskLevel: ExpiryRiskLevel;
}

export type AgingStatus = "Current" | "Overdue 15d" | "Overdue 30d+";

export interface LedgerInvoice {
  id: string;
  date: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: "Paid" | "Partial" | "Unpaid";
}

export interface CreditLedgerEntry {
  id: string;
  type: "Supplier" | "Customer";
  entityName: string;
  contact: string;
  creditTerms: string;
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number;
  agingStatus: AgingStatus;
  lastTransactionDate: string;
  invoices: LedgerInvoice[];
}

export type AuditActionType =
  | "PRICE_OVERRIDE"
  | "STOCK_ADJUSTMENT"
  | "RETURN_APPROVED"
  | "REGISTER_CLOSED"
  | "BACKUP_DISPATCH"
  | "CREDIT_LIMIT_OVERRIDE"
  | "DISCOUNT_AUTHORIZED";

export interface AuditActor {
  name: string;
  avatar: string;
  role: string;
  email: string;
}

export interface AuditTrailEvent {
  id: string;
  timestamp: string; // PKT formatted
  actor: AuditActor;
  actionType: AuditActionType;
  targetRecord: string;
  reason: string;
  ipAddress: string;
  deviceInfo: string;
}
