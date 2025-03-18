"use client";
import { Button } from "@/components/ui/button";
import Admin from "@/containers/users/admin";
import Customers from "@/containers/users/customers/customers";
import Drivers from "@/containers/users/drivers/drivers";
import FleetAdmin from "@/containers/users/fleetAdmin";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Users = () => {
  const [userInfo, setUserInfo] = useState<any>();
  const [selectedTab, setSelectedTab] = useState("Customers");
  const [searchTerm, setSearchTerm] = useState("");

  const tabsData =
    userInfo?.userType === "fleetAdmin"
      ? [
          { key: 1, title: "Customers" },
          { key: 2, title: "Drivers" },
        ]
      : [
          { key: 1, title: "Customers" },
          { key: 2, title: "Drivers" },
          { key: 3, title: "Admins" },
          { key: 4, title: "Super Admins" },
        ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = localStorage.getItem("userInfo");
      if (info) {
        setUserInfo(JSON.parse(info));
      }
    }
  }, []);

  return (
    <div>
      {/* TABS */}
      <div className="m-4 flex w-fit cursor-pointer pb-2 pt-2">
        {tabsData?.map((tab) => {
          return (
            <div
              key={tab.key}
              onClick={() => setSelectedTab(tab.title)}
              className={`${selectedTab === tab.title ? "border-b border-b-[#DA4CBF] pb-4 text-[#DA4CBF]" : "border-b border-b-[#DDE1E6] text-[#64748B]"} pl-4 pr-4 text-center font-[Roboto] text-sm font-normal`}
            >
              <p className="">{tab?.title}</p>
            </div>
          );
        })}
      </div>

      {/* TAB HEADER */}
      <div className="mb-2 flex items-center justify-between px-5">
        <div>
          <p className="text-2xl font-semibold tracking-[-0.11px] text-[#202224]">
            {selectedTab}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex h-[38px] w-[234px] items-center gap-2 rounded-[19px] border-[0.6px] border-[#D5D5D5] bg-[#FAFAFA] px-3">
            <Search className="size-4 text-[#00000080]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-none bg-transparent text-sm text-[#6E7079] outline-none placeholder:text-[#00000080]"
              placeholder="Search in table..."
            />
          </div>
          <Link
            href={
              selectedTab === "Super Admins"
                ? "/add-super-admin"
                : selectedTab === "Admins"
                  ? "/add-fleet-admin"
                  : ""
            }
          >
            <Button className="w-[194px] py-2" size={"default"}>
              <span className="pr-1">
                <Plus className="size-3 font-semibold" />
              </span>
              Add {selectedTab}
            </Button>
          </Link>
        </div>
      </div>

      {/* TAB CONTENT */}
      {selectedTab === "Customers" ? (
        <div>
          <Customers search={searchTerm} />
        </div>
      ) : selectedTab === "Drivers" ? (
        <div>
          <Drivers search={searchTerm} />
        </div>
      ) : selectedTab === "Admins" ? (
        <div>
          {" "}
          <div>
            <FleetAdmin search={searchTerm} />
          </div>
        </div>
      ) : selectedTab === "Super Admins" ? (
        <div>
          <Admin search={searchTerm} />
        </div>
      ) : null}
    </div>
  );
};

export default ProtectedRoute(Users);
