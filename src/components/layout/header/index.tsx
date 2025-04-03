"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, User } from "lucide-react";
import home from "../../../assets/svgs/icon.svg";
import Link from "next/link";
import language from "../../../assets/svgs/system-uicons_translate.svg";
import { Locale } from "next-intl";

// Constants
const ROUTES = {
  dashboard: "/dashboard",
  users: "/users",
  withdrawal: "/withdrawals",
  withdrawalDetail: "/withdrawals/",
  addAdmin: "/add-super-admin",
  updateAdmin: "/update-admin",
  customer: "/customer",
  addCustomer: "/add-customers",
  addFleetAdmin: "/add-fleet-admin",
  bookingHistory: "/booking-history",
  bookingDetail: "/booking-history/[id]",
  vehicleType: "/vehicle-type",
  vehicleDetail: "/vehicle-type/[id]",
  addVehicle: "/add-vehicle",
  updateFleetAdmin: "/update-fleet-admin",
  driver: "/driver",
  addDriver: "/add-driver",
  cars: "/cars",
  addCar: "/add-car",
  updateCar: "/cars/",
  addToWallet: "/add-to-wallet",
  settings: "/settings",
  helpCenter: "/help-center",
  reports: "/reports",
} as const;

const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.dashboard]: "Dashboard",
  [ROUTES.users]: "Users",
  [ROUTES.addAdmin]: "Add Super admin",
  [ROUTES.updateAdmin]: "Update Super admin",
  [ROUTES.addFleetAdmin]: "Add admin",
  [ROUTES.updateFleetAdmin]: "Update admin",
  [ROUTES.customer]: "Customer",
  [ROUTES.addCustomer]: "Add Customer",
  [ROUTES.driver]: "Driver",
  [ROUTES.withdrawal]: "Withdrawals",
  [ROUTES.withdrawalDetail]: "Withdrawal Detail",
  [ROUTES.addDriver]: "Add Driver",
  [ROUTES.bookingHistory]: "Booking History",
  [ROUTES.bookingDetail]: "Booking Detail",
  [ROUTES.vehicleType]: "Vehicle Type",
  [ROUTES.vehicleDetail]: "User",
  [ROUTES.addVehicle]: "Add Vehicle",
  [ROUTES.cars]: "Cars",
  [ROUTES.addCar]: "Add a car",
  [ROUTES.updateCar]: "Update Car",
  [ROUTES.addToWallet]: "Add to Wallet",
  [ROUTES.settings]: "Settings",
  [ROUTES.helpCenter]: "Help Center",
  [ROUTES.reports]: "Reports",
};
interface UserInfo {
  firstName?: string;
  lastName?: string;
  profile_image?: string;
}

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [toggleLang, setToggleLang] = useState(false);
  const locale = ["en", "fr"];

  const currentLocale = pathname.split("/")[1] as Locale;
  const displayLanguage = currentLocale === "fr" ? "Français" : "English";

  const getRouteTitle = (path: string) => {
    if (path.startsWith("/booking-history/") && path !== "/booking-history") {
      return "Booking Detail";
    }

    const baseRoute = Object.keys(ROUTE_TITLES).find((route) =>
      path.startsWith(route),
    );
    return baseRoute ? ROUTE_TITLES[baseRoute] : "Unknown Page";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = localStorage.getItem("userInfo");
      if (info) {
        setUserInfo(JSON.parse(info));
      }
    }
  }, []);

  const changeLanguage = (locale: Locale) => {
    if (locale === currentLocale) return;

    const newPath = `/${locale}${pathname.substring(3)}`;
    router.push(newPath);
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
          pathname.includes(ROUTES.customer) ||
          pathname.includes(ROUTES.addCustomer) ||
          pathname.includes(ROUTES.addDriver) ||
          pathname.includes(ROUTES.driver) ||
          pathname === ROUTES.addFleetAdmin ? (
            <div className="flex gap-3">
              <Link href={ROUTES.users} className="text-[#8B8D97]">
                Users
              </Link>
              <p className="mx-1">/</p>
              <p className="cursor-default">{getRouteTitle(pathname)}</p>
            </div>
          ) : pathname.startsWith("/booking-history/") ? (
            <div className="flex gap-3">
              <Link href={ROUTES.bookingHistory} className="text-[#8B8D97]">
                Booking History
              </Link>
              <p className="mx-1">/</p>
              <p className="cursor-default">Booking Detail</p>
            </div>
          ) : pathname.startsWith("/vehicle-type/") ? (
            <div className="flex gap-3">
              <Link href={ROUTES.vehicleType} className="text-[#8B8D97]">
                Vehicle Type
              </Link>
              <p className="mx-1">/</p>
              <p className="cursor-default">Vehicle Detail</p>
            </div>
          ) : pathname === ROUTES.addVehicle ? (
            <div className="flex gap-3">
              <Link href={ROUTES.vehicleType} className="text-[#8B8D97]">
                Vehicle Type
              </Link>
              <p className="mx-1">/</p>
              <p className="cursor-default">Add Vehicle</p>
            </div>
          ) : pathname === ROUTES.cars ||
            pathname.includes(ROUTES.updateCar) ||
            pathname.includes(ROUTES.addCar) ? (
            <div className="flex gap-3">
              <Link href={ROUTES.cars} className="text-[#8B8D97]">
                Cars
              </Link>
              <p className="mx-1">/</p>

              <p className="cursor-default">{getRouteTitle(pathname)}</p>
            </div>
          ) : pathname === ROUTES.withdrawal ||
            pathname.includes(ROUTES.withdrawalDetail) ? (
            <div className="flex gap-3">
              <Link href={ROUTES.withdrawalDetail} className="text-[#8B8D97]">
                Withdrawals
              </Link>
              <p className="mx-1">/</p>

              <p className="cursor-default">{"Withdrawal Detail"}</p>
            </div>
          ) : (
            ROUTE_TITLES[pathname] || ROUTE_TITLES[ROUTES.dashboard]
          )}
        </h1>
      </div>

      <div className="flex items-center gap-8">
        {/* Language Switcher */}
        <div className="group relative">
          <div
            onClick={(prev) => setToggleLang(!prev)}
            className="flex cursor-pointer items-center gap-2"
          >
            <Image
              src={language}
              alt="Language icon"
              width={24}
              height={24}
              className="object-contain"
            />
            <p className="text-sm font-normal capitalize text-[#646464]">
              {displayLanguage}
            </p>
            <ChevronDown className="size-4" />
          </div>

          {/* Dropdown */}
          {toggleLang && (
            <div className="mt-2 rounded-md bg-white p-2 shadow-md">
              {locale.map((locale) => (
                <button
                  key={locale}
                  onClick={() => changeLanguage(locale)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {locale === "fr" ? "Français" : "English"}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex cursor-pointer items-center gap-2">
          <div className="h-7 w-7 rounded-full border bg-gray-200">
            {userInfo?.profile_image ? (
              <Image
                src={userInfo?.profile_image}
                alt="Home icon"
                width={28}
                height={28}
                className="cursor-pointer rounded-full object-contain"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full">
                <User className="size-3" />
              </div>
            )}
          </div>
          <p className="text-sm font-bold capitalize text-[#404040]">
            {userInfo?.firstName} {userInfo?.lastName}
          </p>
          <ChevronDown className="size-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;
