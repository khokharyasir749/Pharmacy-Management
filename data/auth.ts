export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Pharmacist" | "Cashier" | "Pharmacy Manager";
  avatar: string;
  branch: string;
}

export const DEFAULT_ADMIN_USER: AuthUser = {
  id: "usr-001",
  name: "Dr. Sarah Alvi",
  email: "admin@pharmacy.com",
  role: "Super Admin",
  avatar: "https://images.unsplash.com/photo-1594824813589-a292357ef35c?auto=format&fit=crop&w=150&q=80",
  branch: "Main Retail Branch - Lahore",
};

export const DEFAULT_STAFF_USER: AuthUser = {
  id: "usr-002",
  name: "Budiono Siregar",
  email: "staff@pharmacy.com",
  role: "Pharmacist",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  branch: "Counter 1 - Main Branch",
};

export const AUTH_STORAGE_KEY = "pms_active_user";

export function getActiveUser(): AuthUser {
  if (typeof window === "undefined") {
    return DEFAULT_ADMIN_USER;
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to read user auth state:", e);
  }
  return DEFAULT_ADMIN_USER;
}

export function setActiveUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("pms_auth_changed"));
  } catch (e) {
    console.error("Failed to save auth state:", e);
  }
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event("pms_auth_changed"));
  } catch (e) {
    console.error("Failed to logout:", e);
  }
}
