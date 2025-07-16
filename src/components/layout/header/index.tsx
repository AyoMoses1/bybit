"use client";

import React, { useState, useRef } from "react";
import { Globe, Shield, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import logo from "../../../assets/svgs/bybit.svg";
import Image from "next/image";

const Header = () => {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const languageRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Language options based on the image
  const languages = [
    { code: "EN", name: "English", active: true },
    { code: "MY", name: "中文(马来西亚)" },
    { code: "ZH", name: "繁體中文" },
    { code: "JA", name: "日本語" },
    { code: "RU", name: "Русский" },
    { code: "ES", name: "Español Internacional" },
    { code: "VI", name: "Tiếng Việt" },
    { code: "BR", name: "Português" },
    { code: "ID", name: "Bahasa Indonesia" },
    { code: "UA", name: "українська" },
    { code: "MX", name: "Español (México)" },
    { code: "PL", name: "Polski" },
    { code: "RO", name: "Romania" },
    { code: "KA", name: "Kazakhstan" },
  ];

  // Handle mouse enter/leave for language dropdown
  const handleLanguageMouseEnter = () => {
    setLanguageDropdownOpen(true);
    setUserDropdownOpen(false);
  };

  const handleLanguageMouseLeave = () => {
    setLanguageDropdownOpen(false);
  };

  // Handle mouse enter/leave for user dropdown
  const handleUserMouseEnter = () => {
    setUserDropdownOpen(true);
    setLanguageDropdownOpen(false);
  };

  const handleUserMouseLeave = () => {
    setUserDropdownOpen(false);
  };

  // Handle navigation
  const handleAccountSecurityClick = () => {
    setUserDropdownOpen(false);
    router.push("/account-security");
  };

  const handleLogoutClick = () => {
    setUserDropdownOpen(false);
    router.push("/");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 font-inter">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Image src={logo} width={164} height={24} alt="" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div
          className="relative"
          ref={languageRef}
          onMouseEnter={handleLanguageMouseEnter}
          onMouseLeave={handleLanguageMouseLeave}
        >
          <button className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
            <Globe className="h-4 w-4" />
            <span className="font-medium">EN</span>
          </button>

          {languageDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="max-h-200 overflow-y-auto py-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      setLanguageDropdownOpen(false);
                      // Handle language change here
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                      language.active
                        ? "bg-orange-50 font-medium text-[#F7931A]"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="w-8 font-mono text-xs text-gray-500">
                      {language.code}
                    </span>
                    <span>{language.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          className="relative"
          ref={userRef}
          onMouseEnter={handleUserMouseEnter}
          onMouseLeave={handleUserMouseLeave}
        >
          <button className="rounded-lg p-1 transition-colors hover:bg-gray-50">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
              alt="User Avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-60 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="p-4">
                {/* Account Section */}
                <div className="mb-4">
                  <h3 className="mb-3 text-sm font-medium text-gray-500">
                    Account
                  </h3>

                  <button
                    onClick={handleAccountSecurityClick}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Account Security
                      </span>
                    </div>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      1
                    </div>
                  </button>
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-100 pt-3">
                  <button
                    onClick={handleLogoutClick}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
