export type UserRole =
  | "Super Admin"
  | "Pharmacy Manager"
  | "Pharmacist"
  | "Cashier"
  | "Inventory Staff"
  | "Accountant";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  branch: string;
  isActive: boolean;
  lastLogin: string; // PKT formatted
  phone?: string;
}

export interface RolePermission {
  role: UserRole;
  badgeColor: string;
  description: string;
  permissions: {
    viewCatalog: boolean;
    viewCostPrice: boolean;
    stockAdjustment: boolean;
    refundApproval: boolean;
    closeRegister: boolean;
    userAdmin: boolean;
    viewReports: boolean;
    databaseBackup: boolean;
  };
}

export interface BusinessProfile {
  pharmacyName: string;
  branchIdentifier: string;
  drugLicenseNumber: string;
  ntnNumber: string;
  operatingCurrency: string;
  timezone: string;
  phone: string;
  email: string;
  address: string;
  operatingHours: string;
  invoicePrefix: string;
}

export interface ReceiptSettings {
  paperWidth: "80mm Standard" | "58mm Compact";
  headerMessage: string;
  footerMessage: string;
  showQrCode: boolean;
  showBarcode: boolean;
  autoCutPaper: boolean;
  cashDrawerPulse: boolean;
  showGenericFormula: boolean;
  showPharmacistLicense: boolean;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  size: string;
  targetStorage: string;
  status: "Verified Restorable" | "In Progress" | "Failed";
  checksum: string;
  downloadUrl?: string;
}

export interface SecurityPolicies {
  sessionTimeoutMinutes: number; // 15, 30, 60
  enforce2FA: boolean;
  lockoutAttempts: number;
  backupFrequency: "Daily at 02:00 AM PKT" | "Hourly Snapshots" | "Weekly on Sundays";
  autoLogoffOnIdle: boolean;
}
