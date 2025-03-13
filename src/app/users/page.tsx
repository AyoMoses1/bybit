"use client";
import { Button } from "@/components/ui/button";
import Admin from "@/containers/users/admin";
import Customers from "@/containers/users/customers";
import Drivers from "@/containers/users/drivers";
import FleetAdmin from "@/containers/users/fleetAdmin";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Users = () => {
  const tabsData = [
    { key: 1, title: "Customers" },
    { key: 2, title: "Drivers" },
    { key: 3, title: "Admins" },
    { key: 4, title: "Super Admins" },
  ];
  const [selectedTab, setSelectedTab] = useState("Customers");

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
          <Customers />
        </div>
      ) : selectedTab === "Drivers" ? (
        <div>
          <Drivers />
        </div>
      ) : selectedTab === "Admins" ? (
        <div>
          {" "}
          <div>
            <FleetAdmin />
          </div>
        </div>
      ) : selectedTab === "Super Admins" ? (
        <div>
          <Admin />
        </div>
      ) : null}
    </div>
  );
};

export default ProtectedRoute(Users);
