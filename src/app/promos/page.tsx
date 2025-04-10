"use client";
import SearchComponent from "@/components/SearchComponent";
import { Button } from "@/components/ui/button";
import PromosTable from "@/containers/promos";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Promos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clickExport, setClickExport] = useState(false);

  return (
    <div className="mt-6">
      <p className="px-5 text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
        Promos
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
          <Link href="/add-promo">
            <Button className="w-[174px] py-2" size={"default"}>
              <span className="pr-1">
                <Plus className="size-3 font-semibold" />
              </span>
              Add New Promo
            </Button>
          </Link>
        </div>
      </div>

      {/* TAB CONTENT */}
      <PromosTable
        search={searchTerm}
        clickExport={clickExport}
        setClickExport={setClickExport}
      />
    </div>
  );
};

export default ProtectedRoute(Promos);
