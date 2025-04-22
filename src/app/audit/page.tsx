"use client";
import SearchComponent from "@/components/SearchComponent";
import AuditTable from "@/containers/audit";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const Audit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clickExport, setClickExport] = useState(false);
  const [filter, setFilter] = useState<string>("");
  // const [customDateRange, setCustomDateRange] = useState<{
  //   from: string;
  //   to: string;
  // }>({ from: "", to: "" });

  const [filter, setFilter] = useState<string>("");
  // const [customDateRange, setCustomDateRange] = useState<{
  //   from: string;
  //   to: string;
  // }>({ from: "", to: "" });

  return (
    <div className="mt-6">
      <p className="px-5 text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
        Audits
      </p>
      <div className="mb-3 flex items-center justify-between px-5">
        <div></div>
        <div className="flex items-center gap-4">
          <SearchComponent
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setClickExport(!clickExport)}
            importTable={true}
          />

          {/* Filter UI */}
          <div className="relative flex cursor-pointer gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="relative flex h-[38px] w-fit cursor-pointer appearance-none items-center gap-2 rounded-[19px] border-[0.6px] border-[#D5D5D5] bg-[#FAFAFA] px-3 pr-10 text-sm text-[#6E7079] outline-none"
            >
              <option value="">All</option>
              <option value="today">Today</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
              {/* <option value="custom">Custom</option> */}
            </select>
            {/* Custom dropdown icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <ChevronDown className="size-4 text-gray-500" />
            </div>

            {/* {filter === "custom" && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={customDateRange.from}
                  onChange={(e) =>
                    setCustomDateRange((prev) => ({
                      ...prev,
                      from: e.target.value,
                    }))
                  }
                  className="rounded border p-2"
                />
                <input
                  type="date"
                  value={customDateRange.to}
                  onChange={(e) =>
                    setCustomDateRange((prev) => ({
                      ...prev,
                      to: e.target.value,
                    }))
                  }
                  className="rounded border p-2"
                />
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* TAB CONTENT */}
      <AuditTable
        search={searchTerm}
        clickExport={clickExport}
        setClickExport={setClickExport}
        filter={filter}
      />
    </div>
  );
};

export default ProtectedRoute(Audit);
