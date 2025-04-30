"use client";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import React, { useEffect, useState } from "react";
import customer from "../../assets/icons/Icon.svg";
import driver from "../../assets/icons/Icon (1).svg";
import activeDriver from "../../assets/icons/Group 911.svg";
import Image from "next/image";
import { useBookings, useRealtimeBookings } from "@/lib/api/hooks/useBooking";
import { useAppInfo } from "@/lib/api/hooks/settings";
import { SettingsType } from "@/lib/api/apiHandlers/settingsService";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useUser } from "@/lib/api/hooks/user";
import DashboardGraph from "@/containers/dashboard/dashboardGraph";
import DashboardMap from "@/containers/dashboard/dashboardMap";

const Dashboard = () => {
  const [gross, setGross] = useState({
    daily: "",
    monthly: "",
    total: "",
  });
  const [userInfo, setUserInfo] = useState<{
    id: string;
    usertype: string;
  } | null>(null);

  useRealtimeBookings(userInfo?.id || "", userInfo?.usertype || "");

  const { data: allBookings } = useBookings(
    userInfo?.id || "",
    userInfo?.usertype || "",
  );

  const { data: totalCustomer } = useUser("customer", "");
  const { data: totalDriver } = useUser("driver", "");

  const { data: settings }: { data: SettingsType | undefined } = useAppInfo();

  const formatBigNumber = (value: number) => {
    if (value >= 1e15) return `${(value / 1e15).toFixed(1)}Q`;
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    return value.toLocaleString();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = localStorage.getItem("userInfo");
      if (info) {
        setUserInfo(JSON.parse(info));
      }
    }
  }, []);

  useEffect(() => {
    if (allBookings) {
      const today = new Date();
      let monthlyTotal = 0;
      let yearlyTotal = 0;
      let todayTotal = 0;
      for (let i = 0; i < allBookings.length; i++) {
        if (
          (allBookings[i].status === "PAID" ||
            allBookings[i].status === "COMPLETE") &&
          ((allBookings[i].fleetadmin === userInfo?.id &&
            userInfo?.usertype === "fleetadmin") ||
            userInfo?.usertype === "admin")
        ) {
          const { tripdate, convenience_fees, fleetCommission, discount } =
            allBookings[i];
          const tDate = new Date(
            typeof tripdate === "string" || typeof tripdate === "number"
              ? tripdate
              : "",
          );
          if (
            convenience_fees &&
            parseFloat(String(convenience_fees)) > 0 &&
            userInfo?.usertype === "admin"
          ) {
            if (
              tDate.getDate() === today.getDate() &&
              tDate.getMonth() === today.getMonth() &&
              tDate.getFullYear() === today.getFullYear()
            ) {
              todayTotal =
                todayTotal +
                parseFloat(String(convenience_fees)) -
                parseFloat(String(discount));
            }
            if (
              tDate.getMonth() === today.getMonth() &&
              tDate.getFullYear() === today.getFullYear()
            ) {
              monthlyTotal =
                monthlyTotal +
                parseFloat(String(convenience_fees)) -
                parseFloat(String(discount));
            }
            yearlyTotal =
              yearlyTotal +
              parseFloat(String(convenience_fees)) -
              parseFloat(String(discount));
          }
          if (
            fleetCommission &&
            parseFloat(String(fleetCommission)) > 0 &&
            userInfo?.usertype === "fleetadmin"
          ) {
            if (
              tDate.getDate() === today.getDate() &&
              tDate.getMonth() === today.getMonth() &&
              tDate.getFullYear() === today.getFullYear()
            ) {
              todayTotal = todayTotal + parseFloat(String(fleetCommission));
            }
            if (
              tDate.getMonth() === today.getMonth() &&
              tDate.getFullYear() === today.getFullYear()
            ) {
              monthlyTotal = monthlyTotal + parseFloat(String(fleetCommission));
            }
            yearlyTotal = yearlyTotal + parseFloat(String(fleetCommission));
          }
        }
      }
      setGross({
        daily: parseFloat(String(todayTotal)).toFixed(settings?.decimal),
        monthly: parseFloat(String(monthlyTotal)).toFixed(settings?.decimal),
        total: parseFloat(String(yearlyTotal)).toFixed(settings?.decimal),
      });
    }
  }, [allBookings, userInfo?.id, userInfo?.usertype, settings?.decimal]);

  const filterActiveRiders = totalDriver?.filter(
    (data) => data?.driverActiveStatus === true,
  );

  return (
    <div className="font-source">
      {" "}
      <div className="px-5 py-4">
        <p className="font-source text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
          Gross Earnings
        </p>

        {/* CARDS SECTION */}
        <div className="mt-6 flex gap-7">
          {/* TODAY */}
          <div className="w-1/4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative h-[161px] rounded-lg border border-[#913B8133] bg-[#FAFAFA] px-4 py-3 shadow shadow-[#0000000D]">
                  <p className="text-base text-[#202224]">Today</p>
                  <p className="text-[28px] font-bold tracking-[1px] text-[#202224]">
                    CFA{" "}
                    {gross.daily ? formatBigNumber(parseInt(gross.daily)) : "0"}
                  </p>

                  <div className="absolute bottom-3 flex items-center gap-2">
                    <p className="font-roboto text-sm text-[#606060]">
                      Total income today
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="z-[80] mt-3 flex w-fit items-center justify-center rounded-[8px] bg-[#1C0B19] px-2 py-2 font-inter text-xs font-normal text-white"
                side="bottom"
              >
                Today: {parseInt(gross.daily)?.toLocaleString() || 0}
              </TooltipContent>
            </Tooltip>
          </div>
          {/* THIS MONTH */}
          <div className="w-1/4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative h-[161px] rounded-lg border border-[#913B8133] bg-[#FAFAFA] px-4 py-3 shadow shadow-[#0000000D]">
                  <p className="text-base text-[#202224]">This Month</p>
                  <p className="text-[28px] font-bold tracking-[1px] text-[#202224]">
                    CFA{" "}
                    {gross.monthly
                      ? formatBigNumber(parseInt(gross.monthly))
                      : "0"}
                  </p>

                  <div className="absolute bottom-3 flex items-center gap-2">
                    <p className="font-roboto text-sm text-[#606060]">
                      Total income this month
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="z-[80] mt-3 flex w-fit items-center justify-center rounded-[8px] bg-[#1C0B19] px-2 py-2 font-inter text-xs font-normal text-white"
                side="bottom"
              >
                This Month: {parseInt(gross.monthly)?.toLocaleString()}
              </TooltipContent>
            </Tooltip>
          </div>
          {/* ALL TIME */}
          <div className="w-1/4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative h-[161px] rounded-lg border border-[#007AFF33] bg-[#FAFAFA] px-4 py-3 shadow shadow-[#0000000D]">
                  <p className="text-base text-[#202224]">All Time</p>
                  <p className="text-[28px] font-bold tracking-[1px] text-[#202224]">
                    CFA{" "}
                    {gross.total ? formatBigNumber(parseInt(gross.total)) : "0"}
                  </p>

                  <div className="absolute bottom-3 flex items-center gap-2">
                    <p className="font-roboto text-sm text-[#606060]">
                      Total income of all time
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="z-[80] mt-3 flex w-fit items-center justify-center rounded-[8px] bg-[#1C0B19] px-2 py-2 font-inter text-xs font-normal text-white"
                side="bottom"
              >
                All Time: {parseInt(gross.total)?.toLocaleString()}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="w-1/4">
            <div className="flex flex-col gap-2">
              {/* TOTAL CUSTOMERS */}
              <div className="flex items-center gap-4 rounded-[14px] bg-white px-2 py-1">
                <Image src={customer} height={40} width={40} alt="customer" />
                <p className="font-nunito text-sm text-[#202224]">
                  Total Customers
                </p>
                <p className="font-nunito text-sm font-bold text-[#202224]">
                  {totalCustomer?.length?.toLocaleString() || 0}
                </p>
              </div>

              {/* TOTAL DRIVERS */}
              <div className="flex items-center gap-4 rounded-[14px] bg-white px-2 py-1">
                <Image src={driver} height={40} width={40} alt="customer" />
                <p className="font-nunito text-sm text-[#202224]">
                  Total Drivers
                </p>
                <p className="pl-[25px] font-nunito text-sm font-bold text-[#202224]">
                  {totalDriver?.length?.toLocaleString() || 0}
                </p>
              </div>

              {/* ACTIVE DRIVERS */}
              <div className="flex items-center gap-4 rounded-[14px] bg-white px-2 py-1">
                <Image
                  src={activeDriver}
                  height={40}
                  width={40}
                  alt="customer"
                />
                <p className="font-nunito text-sm text-[#202224]">
                  Active Drivers
                </p>
                <p className="pl-[16px] font-nunito text-sm font-bold text-[#202224]">
                  {filterActiveRiders?.length?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MAP SECTION */}
        <DashboardMap />

        {/* GRAPH SECTION */}
        <DashboardGraph />
      </div>
    </div>
  );
};

export default ProtectedRoute(Dashboard);
