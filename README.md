# Pharmacy Management System (PMS)

A modern, high-performance web-based Pharmacy Management System built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Lucide Icons**, crafted to pixel-perfection based on the Dribbble Order Management Interface reference.

---

## 🚀 Key Features

### 1. Modern Core App Shell & Theming
- **Visual Design**: Soft mint / pale cyan canvas (`#EDF5F3` / `#E8F3F1`), deep dark teal accents (`#0B2B28`), and pure white rounded cards (`rounded-3xl` / `shadow-card`).
- **Persistent Left Sidebar (`Sidebar.tsx`)**:
  - Medical Pharmacy plus brand icon with bold typography.
  - Grouped navigation structure:
    - **MAIN MENU**: Dashboard, Products, Categories.
    - **LEADS**: Orders (active dark teal pill `#0B2B28`), Sales, Customers.
    - **COMMS**: Payments, Reports, Settings.
  - Interactive hover animations, collapsible chevron toggles, and mobile drawer support.
- **Top Navigation Bar (`Header.tsx`)**:
  - Centered rounded pill search bar with voice search microphone.
  - Unread notification indicator.
  - Multi-language toggle pill (`EN 🌐`).
  - User profile chip for *Budiono Siregar* with circular avatar.

### 2. Top Analytics Section
- **Total Orders Dual-Line Chart (`TotalOrdersChart.tsx`)**:
  - Smooth curved dual lines comparing **2024 (`#38A89D`)** vs **2025 (`#F4A7A7`)**.
  - Distinct landmark dot markers on quarter peaks (`Feb`, `May`, `Aug`, `Nov`).
  - Interactive hover tooltips displaying exact numbers and YoY percentage growth.
  - Timeframe filter pill (`Yearly`, `Quarterly`, `Monthly`).
- **Stacked KPI Stat Cards**:
  - **Revenue From Orders (`RevenueStatCard.tsx`)**: Bold **$74,848** metric, `+25% from last 4 months` mint badge, and smooth organic teal upward SVG sparkline.
  - **Pending Orders (`PendingOrdersCard.tsx`)**: Bold **137** metric, `-05% from last 4 months` soft salmon badge, and smooth organic downward salmon SVG sparkline.

### 3. "Recent Orders" Interactive Data Table (`RecentOrdersTable.tsx`)
- Customer profile with avatar and full name.
- Product details with trade name, generic formula, and FEFO batch tag (e.g. `BTH-902`).
- Payment method badges (`Credit Card (visa)`, `Debit Card (Master)`, `Cash on Counter`).
- **Interactive Quantity Stepper**:
  - Minus button `[-]`, current quantity counter, and dark teal plus button `[+]`.
  - **Stock Guard**: Enforces min qty of 1 and max available inventory stock.
  - **Live Dynamic Price Recalculation**: Total price dynamically updates in real time based on quantity and unit price.
- Expiry date display with sort direction and subtle warning indicator for near-expiry batches (< 60 days).
- Live search bar and status filter dropdown (`All`, `Completed`, `Pending`, `Near Expiry`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/) & Responsive SVG Curves
- **Icons**: [Lucide React](https://lucide.dev/)
- **Font**: Google Plus Jakarta Sans

---

## 💻 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khokharyasir749/Pharmacy-Management.git
   cd Pharmacy-Management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Production Build

```bash
npm run build
npm run start
```
