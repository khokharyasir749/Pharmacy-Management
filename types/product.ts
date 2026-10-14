export type ProductCategory =
  | "Antibiotics"
  | "Cardiovascular"
  | "Analgesics"
  | "Respiratory"
  | "Gastrointestinal"
  | "Antidiabetic"
  | "General";

export type DosageForm =
  | "Tablet"
  | "Capsule"
  | "Syrup"
  | "Injection"
  | "Inhaler"
  | "Drops"
  | "Suspension";

export interface UnitConversion {
  baseUnit: string; // e.g. "Tablet", "Capsule", "Bottle"
  stripUnit?: string; // e.g. "Strip"
  packUnit: string; // e.g. "Box", "Pack"
  unitsPerStrip: number; // e.g. 10
  stripsPerPack: number; // e.g. 2
  totalBaseUnitsPerPack: number; // unitsPerStrip * stripsPerPack
}

export interface ProductBatch {
  id: string;
  batchNumber: string;
  expiryDate: string; // formatted e.g. "Nov 28, 2026"
  receivedDate: string;
  costPrice: number;
  sellingPrice: number;
  initialQuantity: number;
  availableQuantity: number; // in base units
  isNearExpiry: boolean; // expiring within 60 days
  isExpired: boolean;
}

export interface Product {
  id: string;
  tradeName: string;
  genericName: string;
  strength: string;
  dosageForm: DosageForm;
  sku: string;
  barcode: string;
  manufacturer: string;
  category: ProductCategory;
  unitConversion: UnitConversion;
  reorderLevel: number; // Alert threshold in base units
  batches: ProductBatch[];
  costPrice: number;
  sellingPrice: number;
  status: "Active" | "Archived" | "Discontinued";
}
