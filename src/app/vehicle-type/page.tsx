"use client";
import SearchComponent from "@/components/SearchComponent";
import { Button } from "@/components/ui/button";
import VehiclesTable from "@/containers/vehicle";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ExportButton from "@/components/ui/exportButton";

const VehicleTypePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="mt-6">
      <p className="px-5 text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
        Vehicle Table
      </p>
      <div className="mb-3 flex items-center justify-between px-5">
        <div></div>
        <div className="flex items-center gap-4">
          <ExportButton
            exportToCSV={() => {
              console.log("Exporting to CSV...");
            }}
            disabled={false}
          />
          <SearchComponent
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
