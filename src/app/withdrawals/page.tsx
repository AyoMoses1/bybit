"use client";
import SearchComponent from "@/components/SearchComponent";
import WithdrawalTable from "@/containers/withdrawals";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import React, { useState } from "react";

const Withdrawals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="mt-6">
      <p className="px-5 text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
        Withdrawals
      </p>
      <div className="mb-3 flex items-center justify-end px-5">
        <div className="flex items-center gap-4">
          <SearchComponent
            value={searchTerm}
            importTable={true}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table*/}
      <WithdrawalTable search={searchTerm} />
    </div>
  );
};

export default ProtectedRoute(Withdrawals);
