"use client";

import React, { useState } from "react";
import {
  Home,
  DollarSign,
  TrendingUp,
  Gift,
  BarChart3,
  BookOpen,
  FileText,
  ChevronRight,
} from "lucide-react";

const AppSidebar = () => {
  const [activeItem, setActiveItem] = useState("Overview");

  const sidebarItems = [
    { icon: Home, label: "Overview", active: true },
    { icon: DollarSign, label: "Account Balance" },
    { icon: TrendingUp, label: "Commissions" },
    { icon: Gift, label: "Promotion Tools" },
    { icon: BarChart3, label: "Campaigns" },
    { icon: BarChart3, label: "My Performance", hasSubmenu: true },
    { icon: BookOpen, label: "Academy" },
    { icon: FileText, label: "Resources" },
  ];

  const handleItemClick = (label: string) => {
    setActiveItem(label);
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 font-inter text-white">
      {/* User Info Section */}
      <div className="border-b border-gray-700 p-6">
        <div className="mb-1 text-sm text-gray-400">Need help?</div>
        <div className="mb-4 text-sm text-gray-400">
          Contact your account manager
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-yellow-400 text-xs font-bold text-black">
            bybit
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              Wilson Ogheneovo
            </div>
            <div className="text-xs text-gray-400">
              wilson.ogheneovo@bybit.com
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center space-x-2">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
            <span className="text-xs text-white">✓</span>
          </div>
          <span className="text-xs text-gray-400">Honourable_Minister</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleItemClick(item.label)}
                className={`flex w-full items-center justify-between px-6 py-3 text-left transition-colors ${
                  activeItem === item.label
                    ? "bg-yellow-400 font-medium text-black"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.hasSubmenu && <ChevronRight className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AppSidebar;
