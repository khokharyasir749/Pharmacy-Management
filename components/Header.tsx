import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Mic,
  Bell,
  Globe,
  ChevronDown,
  Menu,
  Settings,
  LogOut,
  Monitor,
  X,
  Pill,
  ShoppingCart,
  FileText,
  LayoutDashboard,
  PackageCheck,
  Banknote,
  BarChart3,
  Truck,
  User,
  ArrowRight,
  Sparkles,
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { getActiveUser, setActiveUser, logoutUser, AuthUser, DEFAULT_ADMIN_USER } from "@/data/auth";
import { getStoredProducts } from "@/data/mockProducts";
import { getStoredOrders } from "@/data/mockOrders";
import { initialSuppliers } from "@/data/mockPurchases";
import { mockCustomers } from "@/data/mockInventory";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);
  const [imgError, setImgError] = useState(false);

  // User Profile State & Dropdown
  const [user, setUser] = useState<AuthUser>(DEFAULT_ADMIN_USER);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileToast, setProfileToast] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUser(getActiveUser());
    const handleAuthChange = () => {
      setUser(getActiveUser());
    };
    window.addEventListener("pms_auth_changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("pms_auth_changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Global Keyboard Shortcuts (Ctrl + K / Cmd + K to focus search, Escape to dismiss)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setIsLanguageOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsProfileOpen(false);
    router.push("/login");
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileToast("Sirf image file (JPG, PNG, WebP) select karein.");
      setTimeout(() => setProfileToast(null), 4000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileToast("Tasweer ka size 5MB se kam hona chahiye.");
      setTimeout(() => setProfileToast(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const updatedUser: AuthUser = { ...user, avatar: base64 };
        setUser(updatedUser);
        setActiveUser(updatedUser);
        setImgError(false);
        setProfileToast("Profile picture kamyabi se update ho gayi!");
        setTimeout(() => setProfileToast(null), 4000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    const updatedUser: AuthUser = { ...user, avatar: "" };
    setUser(updatedUser);
    setActiveUser(updatedUser);
    setImgError(false);
    setProfileToast("Custom profile picture hata di gayi.");
    setTimeout(() => setProfileToast(null), 4000);
  };

  // Fresh data queries
  const allProducts = useMemo(() => getStoredProducts(), [searchValue, isSearchOpen]);
  const allOrders = useMemo(() => getStoredOrders(), [searchValue, isSearchOpen]);

  // System Navigation Pages
  const systemPages = useMemo(
    () => [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        category: "Analytics",
        desc: "Main analytics, sales trends & KPIs",
      },
      {
        name: "Products Catalog",
        href: "/products",
        icon: Pill,
        category: "Inventory",
        desc: "Medicine inventory, batches & stocks",
      },
      {
        name: "Add New Medicine",
        href: "/products/new",
        icon: Sparkles,
        category: "Inventory",
        desc: "Register new pharmaceutical formulation & batch",
      },
      {
        name: "New Order (POS)",
        href: "/orders/new",
        icon: ShoppingCart,
        category: "Orders",
        desc: "Counter dispensing & instant checkout",
      },
      {
        name: "Orders List",
        href: "/orders",
        icon: FileText,
        category: "Orders",
        desc: "Prescription orders, fulfillment & invoices",
      },
      {
        name: "Purchases & GRN",
        href: "/purchases",
        icon: PackageCheck,
        category: "Procurement",
        desc: "Distributor orders & receiving goods",
      },
      {
        name: "Cash Register & POS",
        href: "/payments",
        icon: Banknote,
        category: "Finance",
        desc: "Shift reconciliation & drawer cash",
      },
      {
        name: "Financial Reports",
        href: "/reports",
        icon: BarChart3,
        category: "Reports",
        desc: "Credit ledgers & tax audit statements",
      },
      {
        name: "Store Settings",
        href: "/settings",
        icon: Settings,
        category: "System",
        desc: "Store profile, thermal printers & receipt config",
      },
    ],
    []
  );

  const query = searchValue.trim().toLowerCase();

  // 1. Filtered Medicines
  const filteredProducts = useMemo(() => {
    if (!query) return [];
    return allProducts
      .filter((p) => {
        return (
          p.tradeName.toLowerCase().includes(query) ||
          p.genericName.toLowerCase().includes(query) ||
          (p.strength && p.strength.toLowerCase().includes(query)) ||
          p.dosageForm.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.sku && p.sku.toLowerCase().includes(query)) ||
          (p.barcode && p.barcode.toLowerCase().includes(query)) ||
          (p.manufacturer && p.manufacturer.toLowerCase().includes(query))
        );
      })
      .slice(0, 5);
  }, [allProducts, query]);

  // 2. Filtered Orders
  const filteredOrders = useMemo(() => {
    if (!query) return [];
    return allOrders
      .filter((o) => {
        return (
          o.orderNumber.toLowerCase().includes(query) ||
          o.customer.name.toLowerCase().includes(query) ||
          o.customer.email.toLowerCase().includes(query) ||
          o.product.name.toLowerCase().includes(query) ||
          (o.product.genericName && o.product.genericName.toLowerCase().includes(query)) ||
          o.paymentMethod.toLowerCase().includes(query) ||
          o.status.toLowerCase().includes(query)
        );
      })
      .slice(0, 4);
  }, [allOrders, query]);

  // 3. Filtered Navigation Pages
  const filteredPages = useMemo(() => {
    if (!query) return [];
    return systemPages
      .filter((page) => {
        return (
          page.name.toLowerCase().includes(query) ||
          page.desc.toLowerCase().includes(query) ||
          page.category.toLowerCase().includes(query) ||
          page.href.toLowerCase().includes(query)
        );
      })
      .slice(0, 4);
  }, [systemPages, query]);

  // 4. Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    if (!query) return [];
    return initialSuppliers
      .filter((s) => {
        return (
          s.name.toLowerCase().includes(query) ||
          s.representative.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.phone.toLowerCase().includes(query)
        );
      })
      .slice(0, 3);
  }, [query]);

  // 5. Filtered Customers
  const filteredCustomers = useMemo(() => {
    if (!query) return [];
    return mockCustomers
      .filter((c) => {
        return (
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.toLowerCase().includes(query)
        );
      })
      .slice(0, 3);
  }, [query]);

  const totalResultsCount =
    filteredProducts.length +
    filteredOrders.length +
    filteredPages.length +
    filteredSuppliers.length +
    filteredCustomers.length;

  const handleSelectResult = (href: string) => {
    setIsSearchOpen(false);
    setSearchValue("");
    inputRef.current?.blur();
    router.push(href);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (filteredPages.length > 0) {
        handleSelectResult(filteredPages[0].href);
      } else if (filteredProducts.length > 0) {
        handleSelectResult("/products");
      } else if (filteredOrders.length > 0) {
        handleSelectResult("/orders");
      } else if (filteredSuppliers.length > 0) {
        handleSelectResult("/purchases");
      }
    }
  };

  return (
    <header className="w-full flex items-center justify-between gap-4 py-4 px-6 lg:px-8">
      {/* Left: Mobile hamburger menu trigger */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-2.5 rounded-full bg-white border border-pharmacy-border shadow-sm text-pharmacy-textPrimary hover:bg-pharmacy-canvas transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Small Pharmacy icon on mobile header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pharmacy-textPrimary flex items-center justify-center text-white text-xs font-bold">
            +
          </div>
          <span className="font-bold text-lg text-pharmacy-textPrimary">Pharmacy</span>
        </div>
      </div>

      {/* Center: Search Bar with Global Real-time Dropdown */}
      <div ref={searchRef} className="flex-1 max-w-xl lg:max-w-2xl relative">
        <div className="relative flex items-center w-full">
          {/* Search Icon */}
          <div className="absolute left-4 pointer-events-none flex items-center justify-center text-pharmacy-textMuted">
            <Search className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setIsSearchOpen(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search medicines, orders, suppliers, pages (Ctrl + K)..."
            className="w-full h-11 pl-11 pr-24 bg-white border border-pharmacy-border/80 rounded-full text-sm text-pharmacy-textPrimary placeholder:text-pharmacy-textMuted focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 shadow-search transition-all duration-200"
          />

          {/* Right Action within Input: Clear (X) + Keyboard Shortcut / Mic */}
          <div className="absolute right-3 flex items-center gap-1.5">
            {searchValue ? (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  setIsSearchOpen(false);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md select-none">
                ⌘K
              </kbd>
            )}
            <button
              type="button"
              className="p-1 rounded-full text-pharmacy-textMuted hover:text-pharmacy-textPrimary hover:bg-pharmacy-canvas transition-colors"
              title="Voice search"
              aria-label="Voice search"
            >
              <Mic className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Global Interactive Search Results Dropdown */}
        {isSearchOpen && query.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 max-h-[70vh] overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {totalResultsCount > 0 ? (
              <div>
                {/* 1. Medicines & Catalog */}
                {filteredProducts.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center justify-between px-2 pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-teal-700" />
                        Medicines & Catalog ({filteredProducts.length})
                      </span>
                      <span className="text-[10px] text-slate-400">Click to view in catalog</span>
                    </div>

                    <div className="space-y-1">
                      {filteredProducts.map((p) => {
                        const totalStock = p.batches.reduce(
                          (sum, b) => sum + b.availableQuantity,
                          0
                        );
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectResult("/products")}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-teal-50/60 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                                <Pill className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-2">
                                  <span>{p.tradeName}</span>
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                    {p.category}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {p.genericName} &bull; {p.strength} &bull; {p.dosageForm}
                                </div>
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <div className="text-xs font-bold text-teal-900">
                                ${p.sellingPrice.toFixed(2)}
                              </div>
                              <div
                                className={`text-[10px] font-semibold ${
                                  totalStock < 20 ? "text-amber-700" : "text-emerald-700"
                                }`}
                              >
                                {totalStock > 0 ? `${totalStock} in stock` : "Out of stock"}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Orders & POS Transactions */}
                {filteredOrders.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center justify-between px-2 pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                        <ShoppingCart className="w-3.5 h-3.5 text-teal-700" />
                        Orders & POS Records ({filteredOrders.length})
                      </span>
                      <span className="text-[10px] text-slate-400">Click to view order details</span>
                    </div>

                    <div className="space-y-1">
                      {filteredOrders.map((o) => {
                        const orderTotal = o.quantity * o.product.unitPrice;
                        return (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => handleSelectResult("/orders")}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-teal-50/60 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-2">
                                  <span>Order #{o.orderNumber}</span>
                                  <span
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                      o.status === "Completed"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {o.status}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {o.customer.name} &bull; {o.product.name} ({o.quantity} units)
                                </div>
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <div className="text-xs font-bold text-slate-800">
                                ${orderTotal.toFixed(2)}
                              </div>
                              <div className="text-[10px] text-slate-400 font-medium">
                                {o.paymentMethod.split(" ")[0]}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Quick Navigation Pages */}
                {filteredPages.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center justify-between px-2 pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                        <LayoutDashboard className="w-3.5 h-3.5 text-teal-700" />
                        Quick Navigation ({filteredPages.length})
                      </span>
                      <span className="text-[10px] text-slate-400">Direct page jump</span>
                    </div>

                    <div className="space-y-1">
                      {filteredPages.map((page) => {
                        const Icon = page.icon;
                        return (
                          <button
                            key={page.href}
                            type="button"
                            onClick={() => handleSelectResult(page.href)}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-teal-50/60 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                  <span>{page.name}</span>
                                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                    {page.category}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {page.desc}
                                </div>
                              </div>
                            </div>

                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Suppliers & Directory */}
                {filteredSuppliers.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center justify-between px-2 pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-teal-700" />
                        Suppliers & Vendors ({filteredSuppliers.length})
                      </span>
                      <span className="text-[10px] text-slate-400">Click to view in purchases</span>
                    </div>

                    <div className="space-y-1">
                      {filteredSuppliers.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleSelectResult("/purchases")}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-teal-50/60 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                              <Truck className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-800 truncate">
                                {s.name}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                Rep: {s.representative} &bull; {s.phone}
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-xs font-bold text-slate-800">
                              ${s.outstandingBalance.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-amber-700 font-semibold">
                              ★ {s.rating} Rating
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Customers & Contacts */}
                {filteredCustomers.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center justify-between px-2 pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-teal-700" />
                        Customers ({filteredCustomers.length})
                      </span>
                      <span className="text-[10px] text-slate-400">Click to view orders</span>
                    </div>

                    <div className="space-y-1">
                      {filteredCustomers.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleSelectResult("/orders")}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-teal-50/60 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0 bg-teal-100">
                              <Image
                                src={c.avatar}
                                alt={c.name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-800 truncate">
                                {c.name}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                {c.email} &bull; {c.phone}
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                            Customer
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dropdown Summary Footer */}
                <div className="p-3 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 rounded-b-2xl">
                  <span>
                    Found <strong className="text-slate-800">{totalResultsCount}</strong> results for &ldquo;{searchValue}&rdquo;
                  </span>
                  <span className="hidden sm:inline text-slate-400">
                    Press <kbd className="px-1.5 py-0.5 font-mono text-[9px] bg-white border border-slate-200 rounded">ESC</kbd> to close
                  </span>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="py-10 text-center px-4">
                <Search className="w-9 h-9 mx-auto text-slate-300 stroke-[1.5] mb-2" />
                <p className="text-xs font-bold text-slate-700">
                  No matching medicines, orders, or pages found
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                  Try searching by brand name, generic formula, customer name, order number, or page title.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Action Items */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Pill/Circle */}
        <div className="relative">
          <button
            onClick={() => setHasUnreadNotification(!hasUnreadNotification)}
            className="w-10 h-10 rounded-full bg-white border border-pharmacy-border/80 shadow-sm flex items-center justify-center text-pharmacy-textSecondary hover:text-pharmacy-textPrimary hover:shadow transition-all duration-200"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[2.2]" />
          </button>
          {hasUnreadNotification && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#F26465] ring-2 ring-white" />
          )}
        </div>

        {/* Language Toggle Pill */}
        <div ref={languageRef} className="relative">
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="h-10 px-3.5 rounded-full bg-white border border-pharmacy-border/80 shadow-sm flex items-center gap-1.5 text-xs font-semibold text-pharmacy-textSecondary hover:text-pharmacy-textPrimary hover:shadow transition-all duration-200"
            aria-label="Select Language"
          >
            <span>{currentLang}</span>
            <Globe className="w-3.5 h-3.5 stroke-[2] text-pharmacy-textMuted" />
          </button>

          {/* Language dropdown */}
          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-floating border border-pharmacy-border p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              {["EN", "UR", "ID", "ES"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setCurrentLang(lang);
                    setIsLanguageOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors ${
                    currentLang === lang
                      ? "bg-pharmacy-mintLight text-pharmacy-textPrimary font-semibold"
                      : "text-pharmacy-textSecondary hover:bg-pharmacy-canvas"
                  }`}
                >
                  {lang === "EN" && "English (EN)"}
                  {lang === "UR" && "Urdu (UR)"}
                  {lang === "ID" && "Indonesian (ID)"}
                  {lang === "ES" && "Spanish (ES)"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Chip with Interactive Dropdown */}
        <div ref={profileRef} className="relative">
          {/* Hidden File Input for Custom Photo Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={handleProfilePhotoUpload}
          />

          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-1 sm:pl-2 py-1 pr-2 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer text-left focus:outline-none"
            aria-expanded={isProfileOpen}
            aria-label="User Profile Menu"
          >
            {/* Header Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0 bg-gradient-to-tr from-teal-800 to-emerald-600 flex items-center justify-center text-white">
              {!imgError && user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="object-cover w-full h-full"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-xs font-black tracking-wider text-white">
                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              )}
            </div>

            {/* User Name & Subtext (hidden on small screens) */}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-bold text-pharmacy-textPrimary leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-pharmacy-textMuted leading-tight truncate max-w-[130px]">
                {user.email}
              </span>
            </div>

            {/* Dropdown Chevron */}
            <div className="text-pharmacy-textMuted hover:text-pharmacy-textPrimary transition-colors p-0.5">
              <ChevronDown
                className={`w-4 h-4 stroke-[2] transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Interactive Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-slate-100 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Top Section: Avatar with Camera Edit, Name, Email, Role */}
              <div className="p-3 bg-slate-50/90 rounded-2xl mb-1.5 border border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Clickable Profile Avatar with Camera Overlay */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    title="Click karein apni marzi ki picture upload karne ke liye"
                    className="relative group/avatar cursor-pointer flex-shrink-0"
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-teal-700/20 shadow-sm bg-gradient-to-tr from-teal-800 to-emerald-600 flex items-center justify-center text-white">
                      {!imgError && user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="object-cover w-full h-full"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <span className="text-sm font-black tracking-wider text-white">
                          {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                      )}

                      {/* Hover Camera Overlay */}
                      <div className="absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Camera Badge Icon */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-teal-800 text-white border-2 border-white flex items-center justify-center shadow-xs">
                      <Camera className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Upload & Remove Photo Action Buttons */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Photo</span>
                  </button>

                  {user.avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      title="Tasweer hatayein"
                      className="inline-flex items-center justify-center p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-500 text-[11px] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Action Links */}
              <div className="space-y-0.5">
                <Link
                  href="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Store Profile & Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    router.push("/payments");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Monitor className="w-4 h-4 text-slate-400" />
                  <span>Switch Session / Terminal</span>
                </button>
              </div>

              {/* Divider Line */}
              <div className="my-1.5 border-t border-slate-100" />

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout / Lock Register</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Photo Toast Notification */}
      {profileToast && (
        <div className="fixed top-6 right-6 z-50 max-w-sm bg-white border border-teal-200 rounded-2xl p-3 shadow-floating flex items-center gap-2.5 animate-in slide-in-from-top-3 duration-200">
          <div className="p-1 rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold text-pharmacy-dark flex-1">
            {profileToast}
          </span>
          <button
            type="button"
            onClick={() => setProfileToast(null)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </header>
  );
}
