"use client";
import { Button } from "@/components/ui/button";
import CarsTable from "@/containers/cars";
import Admin from "@/containers/users/admin";
import Customers from "@/containers/users/customers/customers";
import Drivers from "@/containers/users/drivers/drivers";
import FleetAdmin from "@/containers/users/fleetAdmin";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Cars = () => {
  const [userInfo, setUserInfo] = useState<any>();
  const [selectedTab, setSelectedTab] = useState("Customers");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = localStorage.getItem("userInfo");
      if (info) {
        setUserInfo(JSON.parse(info));
      }
    }
  }, []);

  return (
    <div className="mt-6">
      <p className="px-5 text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
        Cars
      </p>
      <div className="mb-3 flex items-center justify-between px-5">
        <div></div>
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
          <Link href="/add-car">
            <Button className="w-[174px] py-2" size={"default"}>
              <span className="pr-1">
                <Plus className="size-3 font-semibold" />
              </span>
              Add Car
            </Button>
          </Link>
        </div>
      </div>

      {/* TAB CONTENT */}
      <CarsTable search={searchTerm} />
    </div>
  );
};

export default ProtectedRoute(Cars);
