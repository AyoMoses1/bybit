"use client";
import SearchComponent from "@/components/SearchComponent";
import { Button } from "@/components/ui/button";
import VehiclesTable from "@/containers/vehicle";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback, useMemo } from "react";
import ExportButton from "@/components/ui/exportButton";
import toast from "react-hot-toast";
import { useCarTypes } from "@/lib/api/hooks/useVehicle";

const VehicleTypePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: carTypes, isLoading } = useCarTypes();

  const filteredCarTypes = useMemo(() => {
    if (!carTypes || !Array.isArray(carTypes)) return [];

    if (!searchTerm) {
      return [...carTypes].sort((a, b) => {
        if (a.created_at && b.created_at) {
          return (
            (typeof b.created_at === "string" ||
            typeof b.created_at === "number"
              ? new Date(b.created_at).getTime()
              : 0) -
            (typeof a.created_at === "string" ||
            typeof a.created_at === "number"
              ? new Date(a.created_at).getTime()
              : 0)
          );
        }
        return (a.name || "").localeCompare(b.name || "");
      });
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return carTypes.filter((carType) => {
      return (
        (carType.name && carType.name.toLowerCase().includes(searchLower)) ||
        (carType.extra_info &&
          typeof carType.extra_info === "string" &&
          carType.extra_info.toLowerCase().includes(searchLower)) ||
        carType.base_fare?.toString().includes(searchLower) ||
        carType.rate_per_unit_distance?.toString().includes(searchLower) ||
        carType.rate_per_hour?.toString().includes(searchLower)
      );
    });
  }, [carTypes, searchTerm]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [],
  );

  const handleExportToCSV = useCallback(() => {
    if (!filteredCarTypes || filteredCarTypes.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Get headers from first item
    const headers =
      Object.keys(filteredCarTypes[0])
        .filter((key) => !["image", "cancellation_slabs"].includes(key))
        .join(",") + "\n";

    const rows = filteredCarTypes
      .map((item) => {
        return Object.entries(item)
          .filter(([key]) => !["image", "cancellation_slabs"].includes(key))
          .map((entry) => {
            const value = entry[1];
            if (value === null || value === undefined) return "";
            if (typeof value === "string")
              return `"${value.replace(/"/g, '""')}"`;
            if (typeof value === "object") return JSON.stringify(value);
            return value;
          })
          .join(",");
      })
      .join("\n");

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `vehicle_types_${new Date().toISOString()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredCarTypes]);

  return (
    <div className="mt-6">
      <p className="px-5 text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
        Vehicle Table
      </p>
      <div className="mb-3 flex items-center justify-between px-5">
        <div></div>
        <div className="flex items-center gap-4">
          <ExportButton
            exportToCSV={handleExportToCSV}
            disabled={!filteredCarTypes || filteredCarTypes.length === 0}
          />
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

      <VehiclesTable
        data={filteredCarTypes}
        loading={isLoading}
        search={searchTerm}
      />
    </div>
  );
};

export default ProtectedRoute(VehicleTypePage);
