"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  DollarSign,
  Link,
  Megaphone,
  TrendingUp,
  GraduationCap,
  FolderOpen,
  ChevronDown,
  Mail,
} from "lucide-react";
import Image from "next/image";

const AppSidebar = () => {
  const [activeItem, setActiveItem] = useState("Overview");
  const [promotionToolsOpen, setPromotionToolsOpen] = useState(false);
  const [performanceOpen, setPerformanceOpen] = useState(false);

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      active: true,
    },
    {
      icon: Wallet,
      label: "Account Balance",
    },
    {
      icon: DollarSign,
      label: "Commissions",
    },
    {
      icon: Link,
      label: "Promotion Tools",
      hasSubmenu: true,
      isOpen: promotionToolsOpen,
      onClick: () => setPromotionToolsOpen(!promotionToolsOpen),
    },
    {
      icon: Megaphone,
      label: "Campaigns",
    },
    {
      icon: TrendingUp,
      label: "My Performance",
      hasSubmenu: true,
      isOpen: performanceOpen,
      onClick: () => setPerformanceOpen(!performanceOpen),
    },
    {
      icon: GraduationCap,
      label: "Academy",
    },
    {
      icon: FolderOpen,
      label: "Resources",
    },
  ];

  const handleItemClick = (
    label: string,
    hasSubmenu = false,
    onClick?: () => void,
  ) => {
    if (hasSubmenu && onClick) {
      onClick();
    } else {
      setActiveItem(label);
    }
  };

  return (
    <div className="w-42 flex h-screen flex-col bg-[#1a1f2e] font-inter text-white">
      {/* Navigation Menu */}
      <nav className="flex-2 py-4">
        <ul className="space-y-1">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() =>
                  handleItemClick(item.label, item.hasSubmenu, item.onClick)
                }
                className={`flex w-full items-center justify-between rounded-md px-4 py-3 text-left transition-all duration-200 ${
                  activeItem === item.label
                    ? "bg-gray-700/50 font-medium text-[#F7931A] shadow-lg"
                    : "text-gray-300 hover:bg-gray-700/10 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.hasSubmenu && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      item.isOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Submenu items would go here if needed */}
              {item.hasSubmenu && item.isOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  {/* Add submenu items here based on requirements */}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="flex-1 border-t border-gray-600/30 bg-gray-600/30 p-4">
        {/* Help Section */}
        <div className="mb-6">
          <div className="mb-1 text-xs text-gray-400">Need help?</div>
          <div className="mb-4 text-xs text-gray-400">
            Contact your account manager
          </div>
        </div>

        {/* User Profile Section */}
        <div className="space-y-3">
          {/* Main Profile */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7931A] text-sm font-bold text-white">
              <span className="text-xs">bybit</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-white">
                Wilson Ogheneovo
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-2 pl-1">
            <Mail className="h-4 w-4 text-[#F7931A]" />
            <span className="truncate text-xs text-gray-400">
              wilson.ogheneovo@bybit.com
            </span>
          </div>

          {/* Telegram/Social */}
          <div className="flex items-center space-x-2 pl-1">
            <Image
              src={
                "data:image/svg+xml,%3csvg%20enable-background='new%200%200%2024%2024'%20height='512'%20viewBox='0%200%2024%2024'%20width='512'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='12'%20cy='12'%20fill='%23039be5'%20r='12'/%3e%3cpath%20d='m5.491%2011.74%2011.57-4.461c.537-.194%201.006.131.832.943l.001-.001-1.97%209.281c-.146.658-.537.818-1.084.508l-3-2.211-1.447%201.394c-.16.16-.295.295-.605.295l.213-3.053%205.56-5.023c.242-.213-.054-.333-.373-.121l-6.871%204.326-2.962-.924c-.643-.204-.657-.643.136-.953z'%20fill='%23fff'/%3e%3c/svg%3e"
              }
              alt="telegram icon"
              width={20}
              height={20}
            />
            <span className="text-xs text-gray-400">Honourable_Minister</span>
          </div>
        </div>

        {/* Collapse Button */}
        <div className="mt-4 flex justify-center">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700/50 text-gray-400 transition-colors hover:bg-gray-600/50 hover:text-white">
            <ChevronDown className="h-4 w-4 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
