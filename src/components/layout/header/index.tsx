"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, User } from "lucide-react";
import { Locale } from "next-intl";

import home from "../../../assets/svgs/icon.svg";
import languageIcon from "../../../assets/svgs/system-uicons_translate.svg";

const ROUTES = {
  dashboard: "/dashboard",
  users: "/users",
  complaints: "/complaints",
  complaintsDetail: "/complaint/",
  withdrawal: "/withdrawals",
  withdrawalDetail: "/withdrawals/",
  addAdmin: "/add-super-admin",
  updateAdmin: "/update-admin",
  customer: "/customer",
  addCustomer: "/add-customers",
  addFleetAdmin: "/add-fleet-admin",
  bookingHistory: "/booking-history",
  bookingDetail: "/booking-history/",
  vehicleType: "/vehicle-type",
  vehicleDetail: "/vehicle-type/",
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
  notifications: "/push-notification",
  addNotification: "/add-notification",
  profile: "/profile",
  audit: "/audit",
  sos: "/sos",
} as const;

const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.dashboard]: "Dashboard",
  [ROUTES.users]: "Users",
  [ROUTES.complaints]: "Complaints",
  [ROUTES.complaintsDetail]: "Complaints Detail",
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
  [ROUTES.vehicleDetail]: "Vehicle Detail",
  [ROUTES.addVehicle]: "Add Vehicle",
  [ROUTES.cars]: "Cars",
  [ROUTES.addCar]: "Add a car",
  [ROUTES.updateCar]: "Update Car",
  [ROUTES.addToWallet]: "Add to Wallet",
  [ROUTES.settings]: "Settings",
  [ROUTES.helpCenter]: "Help Center",
  [ROUTES.reports]: "Reports",
  [ROUTES.notifications]: "Notifications",
  [ROUTES.addNotification]: "Add Notification",
  [ROUTES.profile]: "Update Profile",
  [ROUTES.audit]: "Audit",
  [ROUTES.sos]: "SOS",
};

interface UserInfo {
  firstName?: string;
  lastName?: string;
  profile_image?: string;
}

const BREADCRUMB_ROUTES: { [key: string]: { parent: string; label: string } } =
  {
    [ROUTES.addAdmin]: {
      parent: ROUTES.users,
      label: ROUTE_TITLES[ROUTES.addAdmin],
    },
    [ROUTES.updateAdmin]: {
      parent: ROUTES.users,
      label: ROUTE_TITLES[ROUTES.updateAdmin],
    },
    [ROUTES.addFleetAdmin]: {
      parent: ROUTES.users,
      label: ROUTE_TITLES[ROUTES.addFleetAdmin],
    },
    [ROUTES.updateFleetAdmin]: {
      parent: ROUTES.users,
      label: ROUTE_TITLES[ROUTES.updateFleetAdmin],
    },
    [ROUTES.customer]: {
      parent: ROUTES.users,
      label: ROUTE_TITLES[ROUTES.customer],
    },
    [ROUTES.addCustomer]: {
      parent: ROUTES.users,
      label: ROUTE_TITLES[ROUTES.addCustomer],
    },
    [ROUTES.addDriver]: {
      parent: ROUTES.users,
      label: ROUTE_TITLES[ROUTES.addDriver],
    },
    [ROUTES.driver]: {
      parent: ROUTES.users,
      label: ROUTE_TITLES[ROUTES.driver],
    },
    [ROUTES.bookingDetail]: {
      parent: ROUTES.bookingHistory,
      label: ROUTE_TITLES[ROUTES.bookingDetail],
    },
    [ROUTES.vehicleDetail]: {
      parent: ROUTES.vehicleType,
      label: ROUTE_TITLES[ROUTES.vehicleDetail],
    },
    [ROUTES.addVehicle]: {
      parent: ROUTES.vehicleType,
      label: ROUTE_TITLES[ROUTES.addVehicle],
    },
    [ROUTES.updateCar]: {
      parent: ROUTES.cars,
      label: ROUTE_TITLES[ROUTES.updateCar],
    },
    [ROUTES.addCar]: {
      parent: ROUTES.cars,
      label: ROUTE_TITLES[ROUTES.addCar],
    },
    [ROUTES.withdrawalDetail]: {
      parent: ROUTES.withdrawal,
      label: ROUTE_TITLES[ROUTES.withdrawalDetail],
    },
    [ROUTES.complaintsDetail]: {
      parent: ROUTES.complaints,
      label: ROUTE_TITLES[ROUTES.complaintsDetail],
    },
    [ROUTES.addNotification]: {
      parent: ROUTES.notifications,
      label: ROUTE_TITLES[ROUTES.addNotification],
    },
  };

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [toggleLang, setToggleLang] = useState(false);

  const currentLocale = pathname.split("/")[1] as Locale;
  const localeOptions: Locale[] = ["en", "fr"];

  const displayLanguage = currentLocale === "fr" ? "Français" : "English";

  const breadcrumb = useMemo(() => {
    const routeEntry = Object.entries(BREADCRUMB_ROUTES).find(([key]) =>
      pathname.startsWith(key),
    );

    if (routeEntry) {
      const { parent, label } = routeEntry[1];
      return (
        <div className="flex gap-3">
          <Link href={parent} className="text-[#8B8D97]">
            {ROUTE_TITLES[parent]}
          </Link>
          <p className="mx-1">/</p>
          <p className="cursor-default">{label}</p>
        </div>
      );
    }

    const defaultTitle = ROUTE_TITLES[pathname] || "Dashboard";
    return <p className="cursor-default">{defaultTitle}</p>;
  }, [pathname]);

  useEffect(() => {
    const info = localStorage.getItem("userInfo");
    if (info) setUserInfo(JSON.parse(info));
  }, []);

  const changeLanguage = (locale: Locale) => {
    if (locale === currentLocale) return;
    router.push(`/${locale}${pathname.substring(3)}`);
  };

  const navigateToProfile = () => {
    router.push("/profile");
  };

  return (
    <header className="sticky top-0 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.dashboard}>
          <Image src={home} alt="Home icon" width={16} height={16} />
        </Link>
        <p className="text-xs text-[#8B8D97]">/</p>
        <h1 className="text-xs font-normal text-[#8B8D97]">{breadcrumb}</h1>
      </div>

      <div className="flex items-center gap-8">
        {/* Language Selector */}
        <div className="relative">
          <div
            onClick={() => setToggleLang((prev) => !prev)}
            className="flex cursor-pointer items-center gap-2"
          >
            <Image src={languageIcon} alt="Language" width={24} height={24} />
            <p className="text-sm capitalize text-[#646464]">
              {displayLanguage}
            </p>
            <ChevronDown className="size-4" />
          </div>

          {toggleLang && (
            <div className="absolute right-0 mt-2 rounded-md bg-white p-2 shadow-md">
              {localeOptions.map((loc) => (
                <button
                  key={loc}
                  onClick={() => changeLanguage(loc)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {loc === "fr" ? "Français" : "English"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <div
            onClick={navigateToProfile}
            className="h-7 w-7 cursor-pointer overflow-hidden rounded-full border bg-gray-200"
          >
            {userInfo?.profile_image ? (
              <Image
                src={userInfo.profile_image}
                alt="Profile"
                width={28}
                height={28}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
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
