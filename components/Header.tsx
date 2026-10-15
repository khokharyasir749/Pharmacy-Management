"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { getActiveUser, logoutUser, AuthUser, DEFAULT_ADMIN_USER } from "@/data/auth";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);
  const [imgError, setImgError] = useState(false);

  // User Profile State & Dropdown
  const [user, setUser] = useState<AuthUser>(DEFAULT_ADMIN_USER);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

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

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setIsLanguageOpen(false);
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

  return (
    <header className="w-full flex items-center justify-between gap-4 py-4 px-2 sm:px-4">
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

      {/* Center: Search Bar (pill shaped with mic) */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center w-full">
          {/* Search Icon */}
          <div className="absolute left-4 pointer-events-none flex items-center justify-center text-pharmacy-textMuted">
            <Search className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
            className="w-full h-11 pl-11 pr-11 bg-white border border-pharmacy-border/80 rounded-full text-sm text-pharmacy-textPrimary placeholder:text-pharmacy-textMuted focus:outline-none focus:ring-2 focus:ring-pharmacy-textPrimary/20 focus:border-pharmacy-textPrimary/40 shadow-search transition-all duration-200"
          />

          {/* Microphone Icon Button */}
          <button
            type="button"
            className="absolute right-3.5 p-1 rounded-full text-pharmacy-textMuted hover:text-pharmacy-textPrimary hover:bg-pharmacy-canvas transition-colors"
            title="Voice search"
            aria-label="Voice search"
          >
            <Mic className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
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
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-1 sm:pl-2 py-1 pr-2 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer text-left focus:outline-none"
            aria-expanded={isProfileOpen}
            aria-label="User Profile Menu"
          >
            {/* Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0 bg-teal-100 flex items-center justify-center">
              {!imgError && user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  onError={() => setImgError(true)}
                  priority
                />
              ) : (
                <span className="text-xs font-bold text-teal-900">
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
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Top Section: Avatar, Name, Email, Role */}
              <div className="p-3 bg-slate-50 rounded-xl mb-1.5 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-slate-200 flex-shrink-0 bg-teal-100 flex items-center justify-center">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                      {user.role}
                    </span>
                  </div>
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
    </header>
  );
}
