"use client";
import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { BellIconSVG, ChevronDownIconSVG, MenuIconSVG } from "@/svgs";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import LogoutIconSVG from "@/svgs/LogOutIconSVG";
import { assetLib } from "@/lib/assets";
import { Home } from "lucide-react";
import home from "../../../assets/svgs/icon.svg";
import Link from "next/link";

// Type definitions
type MenuItemType = {
  label: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
};

// Constants
const ROUTES = {
  dashboard: "/dashboard",
  users: "/users",
  addAdmin: "/add-super-admin",
  updateAdmin: "/update-admin",
  addFleetAdmin: "/add-fleet-admin",
  updateFleetAdmin: "/update-fleet-admin",
  settings: "/settings",
  helpCenter: "/help-center",
} as const;

const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.dashboard]: "Dashboard",
  [ROUTES.users]: "Users",
  [ROUTES.addAdmin]: "Add Super admin",
  [ROUTES.updateAdmin]: "Update Super admin",
  [ROUTES.addFleetAdmin]: "Add admin",
  [ROUTES.updateFleetAdmin]: "Update admin",
  [ROUTES.settings]: "Settings",
  [ROUTES.helpCenter]: "Help Center",
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  // const { setOpen } = useSidebar();

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.replace("/auth");
  };

  const getRouteTitle = (path: string) => {
    const baseRoute = Object.keys(ROUTE_TITLES).find((route) =>
      path.startsWith(route),
    );
    return baseRoute ? ROUTE_TITLES[baseRoute] : "Unknown Page";
  };

  return (
    <header className="sticky top-0 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Image
            src={home}
            alt="Home icon"
            width={16}
            height={16}
            className="cursor-pointer object-contain"
          />
        </Link>
        <p className="font-[inter] text-xs text-[#8B8D97]">/</p>

        <h1 className="font-[Roboto] text-xs font-normal text-[#8B8D97]">
          {pathname === ROUTES.addAdmin ||
          pathname.includes(ROUTES.updateAdmin) ||
          pathname.includes(ROUTES.updateFleetAdmin) ||
          pathname === ROUTES.addFleetAdmin ? (
            <div className="flex gap-3">
              <Link href={ROUTES.users} className="text-[#8B8D97]">
                Users
              </Link>
              <p className="mx-1">/</p>

              <p className="cursor-default">{getRouteTitle(pathname)}</p>
            </div>
          ) : (
            ROUTE_TITLES[pathname] || ROUTE_TITLES[ROUTES.dashboard]
          )}
        </h1>
      </div>

      {/* <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50">
          <BellIconSVG className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5 hover:bg-gray-50">
              <Image
                src={assetLib.avatar}
                alt="Profile Picture"
                width={32}
                height={32}
                className="rounded-full"
              />
              <ChevronDownIconSVG className="h-5 w-5 text-gray-500" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-gray-700">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {renderMenuItems()}
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
    </header>
  );
};

export default Header;
