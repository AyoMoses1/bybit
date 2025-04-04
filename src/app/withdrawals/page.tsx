"use client";
import SearchComponent from "@/components/SearchComponent";
import WithdrawalTable from "@/containers/withdrawals";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const Withdrawals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clickExport, setClickExport] = useState(false);
  const [toggleSelect, setToggleSelect] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<boolean | null>(null);

  return (
    <div className="mt-6">
      <p className="px-5 text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
        Withdrawals
      </p>
      <div className="mb-3 flex items-center justify-end px-5">
        <div className="flex items-center gap-3">
          <SearchComponent
            value={searchTerm}
            onClick={() => setClickExport(!clickExport)}
            importTable={true}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="relative">
            <div
              onClick={() => setToggleSelect(!toggleSelect)}
              className="relative flex h-[38px] w-fit cursor-pointer items-center gap-2 rounded-[19px] border-[0.6px] border-[#D5D5D5] bg-[#FAFAFA] px-4"
            >
              <p className="font-nunito text-sm font-normal text-[#00000080]">
                {selectedMenu === true
                  ? "Pending"
                  : selectedMenu === false
                    ? "Processed"
                    : "Filter by Status"}
              </p>
              <ChevronDown className="size-[18px] text-[#1D1D1F8C]" />
            </div>

            {toggleSelect && (
              <div className="absolute z-[20] mt-1 w-full cursor-pointer rounded-lg bg-white px-3 py-2 shadow-sm">
                <p
                  onClick={() => {
                    setSelectedMenu(null);
                    setToggleSelect(false);
                  }}
                  className="py-2 font-inter text-sm font-normal text-[#21272A] opacity-25"
                >
                  Filter by Status
                </p>
                <p
                  onClick={() => {
                    setSelectedMenu(true);
                    setToggleSelect(false);
                  }}
                  className="py-2 font-inter text-sm font-normal text-[#21272A]"
                >
                  Pending
                </p>
                <p
                  onClick={() => {
                    setSelectedMenu(false);
                    setToggleSelect(false);
                  }}
                  className="py-2 font-inter text-sm font-normal text-[#21272A]"
                >
                  Processed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table*/}
      <WithdrawalTable
        selectedMenu={selectedMenu}
        search={searchTerm}
        clickExport={clickExport}
      />
    </div>
  );
};

export default ProtectedRoute(Withdrawals);
