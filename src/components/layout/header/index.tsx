"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Header = () => {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 font-inter">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-yellow-400"></div>
            <span className="text-lg font-bold text-gray-900">BYBIT</span>
          </div>
          <span className="text-lg font-normal text-gray-600">AFFILIATES</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-50"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
              🌐
            </div>
            <span className="text-sm text-gray-700">EN</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {languageDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-32 rounded-md border border-gray-200 bg-white shadow-lg">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                English
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                Français
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-sm font-semibold text-black">
            WO
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;
