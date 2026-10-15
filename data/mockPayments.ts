import { RegisterSession, Expense } from "@/types/payment";

export const initialRegisterSessions: RegisterSession[] = [
  {
    id: "REG-2026-104",
    branch: "Counter 1 - Main Branch",
    cashierName: "Budiono Siregar",
    cashierAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    openedAt: "Oct 15, 2026, 08:00 AM PKT",
    openingFloat: 250.0,
    cashSales: 1840.5,
    cardSales: 1290.0,
    digitalSales: 420.0,
    cashRefunds: 35.0,
    drawerExpenses: 75.0,
    expectedCash: 1980.5, // 250 + 1840.5 - 35 - 75
    status: "Active",
    totalTransactions: 64,
    notes: "Morning rush handled smoothly; card terminal connection verified.",
  },
  {
    id: "REG-2026-103",
    branch: "Counter 2 - Express Lane",
    cashierName: "Ayesha Malik",
    cashierAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    openedAt: "Oct 14, 2026, 03:00 PM PKT",
    closedAt: "Oct 14, 2026, 11:30 PM PKT",
    openingFloat: 200.0,
    cashSales: 2150.0,
    cardSales: 1840.0,
    digitalSales: 610.0,
    cashRefunds: 20.0,
    drawerExpenses: 45.0,
    expectedCash: 2285.0, // 200 + 2150 - 20 - 45
    countedCash: 2285.0,
    variance: 0.0,
    status: "Closed",
    totalTransactions: 82,
    varianceReason: "Perfect reconciliation. Zero variance.",
    notes: "Evening shift ended. Cash drawer locked in vault safe #2.",
  },
  {
    id: "REG-2026-102",
    branch: "Counter 1 - Main Branch",
    cashierName: "Tariq Mahmood",
    cashierAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    openedAt: "Oct 14, 2026, 08:00 AM PKT",
    closedAt: "Oct 14, 2026, 03:00 PM PKT",
    openingFloat: 250.0,
    cashSales: 1620.0,
    cardSales: 940.0,
    digitalSales: 310.0,
    cashRefunds: 50.0,
    drawerExpenses: 30.0,
    expectedCash: 1790.0, // 250 + 1620 - 50 - 30
    countedCash: 1785.0,
    variance: -5.0,
    status: "Closed",
    totalTransactions: 53,
    varianceReason: "Change calculation shortage during peak prescription queue.",
    notes: "Audited by Floor Manager Dr. Sarah Alvi.",
  },
  {
    id: "REG-2026-101",
    branch: "Counter 1 - Main Branch",
    cashierName: "Budiono Siregar",
    cashierAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    openedAt: "Oct 13, 2026, 08:00 AM PKT",
    closedAt: "Oct 13, 2026, 04:45 PM PKT",
    openingFloat: 250.0,
    cashSales: 1980.0,
    cardSales: 1450.0,
    digitalSales: 520.0,
    cashRefunds: 15.0,
    drawerExpenses: 60.0,
    expectedCash: 2155.0, // 250 + 1980 - 15 - 60
    countedCash: 2157.0,
    variance: 2.0,
    status: "Closed",
    totalTransactions: 71,
    varianceReason: "Customer left spare coin change as tip on counter.",
    notes: "Deposited into petty cash reserve.",
  },
  {
    id: "REG-2026-100",
    branch: "Counter 2 - Express Lane",
    cashierName: "Zainab Fatima",
    cashierAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    openedAt: "Oct 12, 2026, 08:30 AM PKT",
    closedAt: "Oct 12, 2026, 05:00 PM PKT",
    openingFloat: 200.0,
    cashSales: 1430.0,
    cardSales: 890.0,
    digitalSales: 210.0,
    cashRefunds: 0.0,
    drawerExpenses: 25.0,
    expectedCash: 1605.0, // 200 + 1430 - 0 - 25
    countedCash: 1605.0,
    variance: 0.0,
    status: "Closed",
    totalTransactions: 49,
    varianceReason: "Reconciled with zero variance.",
    notes: "All receipts and card settlement slips attached.",
  },
];

export const initialExpenses: Expense[] = [
  {
    id: "EXP-2026-051",
    date: "Oct 15, 2026, 09:15 AM PKT",
    category: "Packaging/Supplies",
    description: "Thermal POS Receipt Paper Rolls (Pack of 10)",
    payee: "Apex Stationery & POS Ltd",
    paymentMethod: "Cash Drawer",
    amount: 35.0,
    recordedBy: "Budiono Siregar",
    voucherRef: "VCH-8821",
    sessionId: "REG-2026-104",
    notes: "For counter 1 & 2 high-speed billing printers",
  },
  {
    id: "EXP-2026-052",
    date: "Oct 15, 2026, 11:30 AM PKT",
    category: "Refreshment",
    description: "Staff Morning Tea, Light Snacks & Bottled Mineral Water",
    payee: "Corner Cafe & Bakery",
    paymentMethod: "Cash Drawer",
    amount: 18.5,
    recordedBy: "Budiono Siregar",
    voucherRef: "VCH-8822",
    sessionId: "REG-2026-104",
    notes: "Authorized daily shift refreshment entitlement",
  },
  {
    id: "EXP-2026-053",
    date: "Oct 15, 2026, 01:20 PM PKT",
    category: "Logistics",
    description: "Urgent Courier Medicine Dispatch (Patient Home Delivery)",
    payee: "TCS Express Courier Co.",
    paymentMethod: "Cash Drawer",
    amount: 21.5,
    recordedBy: "Budiono Siregar",
    voucherRef: "VCH-8823",
    sessionId: "REG-2026-104",
    notes: "Cold-chain insulin delivery to patient home address",
  },
  {
    id: "EXP-2026-050",
    date: "Oct 14, 2026, 04:10 PM PKT",
    category: "Utilities",
    description: "Monthly Store Electricity Submeter Bill Voucher",
    payee: "Metropolitan Electric Supply Corp",
    paymentMethod: "Bank",
    amount: 280.0,
    recordedBy: "Dr. Sarah Alvi",
    voucherRef: "VCH-8819",
    notes: "October commercial billing cycle payment via online banking",
  },
  {
    id: "EXP-2026-049",
    date: "Oct 14, 2026, 02:45 PM PKT",
    category: "Maintenance",
    description: "Pharmacy HVAC Filter Deep Cleaning & Antimicrobial Spray",
    payee: "CoolAir HVAC Technicals",
    paymentMethod: "Petty Cash",
    amount: 65.0,
    recordedBy: "Budiono Siregar",
    voucherRef: "VCH-8818",
    notes: "Medicine storage climate control maintenance",
  },
  {
    id: "EXP-2026-048",
    date: "Oct 13, 2026, 11:00 AM PKT",
    category: "Packaging/Supplies",
    description: "Custom Biodegradable Pharmacy Carry Bags (500 pcs)",
    payee: "EcoPack Solutions",
    paymentMethod: "Petty Cash",
    amount: 45.0,
    recordedBy: "Budiono Siregar",
    voucherRef: "VCH-8815",
    notes: "Restocked under counter dispensary zone",
  },
  {
    id: "EXP-2026-047",
    date: "Oct 12, 2026, 03:15 PM PKT",
    category: "Logistics",
    description: "Insulated Cold-Chain Gel Ice Packs for Vaccine Transit",
    payee: "MediLogix Distribution",
    paymentMethod: "Cash Drawer",
    amount: 25.0,
    recordedBy: "Zainab Fatima",
    voucherRef: "VCH-8812",
    sessionId: "REG-2026-100",
    notes: "Approved by Head Pharmacist",
  },
];

export function getStoredExpenses(): Expense[] {
  if (typeof window === "undefined") return initialExpenses;
  try {
    const stored = localStorage.getItem("pms_expenses_list");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return initialExpenses;
}

export function saveExpense(expense: Expense): Expense[] {
  const current = getStoredExpenses();
  const updated = [expense, ...current.filter((e) => e.id !== expense.id)];
  initialExpenses.unshift(expense);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("pms_expenses_list", JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  }
  return updated;
}
