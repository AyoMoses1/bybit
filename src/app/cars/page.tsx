"use client";
import SearchComponent from "@/components/SearchComponent";
import { Button } from "@/components/ui/button";
import CarsTable from "@/containers/cars";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Cars = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clickExport, setClickExport] = useState(false);

  return (
    <div className="mt-6">
      <p className="px-5 text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
        Cars
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
      <CarsTable search={searchTerm} clickExport={clickExport} />
    </div>
  );
};

export default ProtectedRoute(Cars);
