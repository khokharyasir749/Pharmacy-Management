"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Mic,
  Bell,
  Globe,
  ChevronDown,
  Menu,
} from "lucide-react";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);
  const [imgError, setImgError] = useState(false);

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
        <div className="relative">
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

        {/* User Profile Chip */}
        <div className="flex items-center gap-3 pl-1 sm:pl-2">
          {/* Avatar */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0 bg-teal-100 flex items-center justify-center">
            {!imgError ? (
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Budiono Siregar"
                width={40}
                height={40}
                className="object-cover w-full h-full"
                onError={() => setImgError(true)}
                priority
              />
            ) : (
              <span className="text-xs font-bold text-pharmacy-textPrimary">BS</span>
            )}
          </div>

          {/* User Name & Subtext (hidden on small screens) */}
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-bold text-pharmacy-textPrimary leading-tight">
              Budiono Siregar
            </span>
            <span className="text-[11px] text-pharmacy-textMuted leading-tight truncate max-w-[130px]">
              budionosiregar@...
            </span>
          </div>

          {/* Dropdown Chevron */}
          <button
            className="text-pharmacy-textMuted hover:text-pharmacy-textPrimary transition-colors p-0.5"
            aria-label="User Options"
          >
            <ChevronDown className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </header>
  );
}
