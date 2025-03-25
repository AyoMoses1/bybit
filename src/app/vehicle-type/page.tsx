"use client";
import SearchComponent from "@/components/SearchComponent";
import { Button } from "@/components/ui/button";
import VehiclesTable from "@/containers/vehicle";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import ExportButton from "@/components/ui/exportButton";

const VehicleTypePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input changes
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [],
  );

  // Handle export to CSV
  const handleExportToCSV = useCallback(() => {
    console.log("Exporting to CSV...");
    // You could implement the actual CSV export logic here
    // or connect it to your VehiclesTable's export function
  }, []);

  return (
    <div className="mt-6">
      <p className="px-5 text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
        Vehicle Table
      </p>
      <div className="mb-3 flex items-center justify-between px-5">
        <div></div>
        <div className="flex items-center gap-4">
          <ExportButton exportToCSV={handleExportToCSV} disabled={false} />
          <SearchComponent value={searchTerm} onChange={handleSearchChange} />
          <Link href="/add-vehicle">
            <Button className="w-[174px] py-2" size={"default"}>
              <span className="pr-1">
                <Plus className="size-3 font-semibold" />
              </span>
              Add Vehicle Type
            </Button>
          </Link>
        </div>
      </div>

      <VehiclesTable search={searchTerm} />
    </div>
  );
};

export default ProtectedRoute(VehicleTypePage);
