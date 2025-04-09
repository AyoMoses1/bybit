"use client";
import SearchComponent from "@/components/SearchComponent";
import ComplaintsTable from "@/containers/complaints";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import React, { useState } from "react";

const Complaints = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clickExport, setClickExport] = useState(false);

  return (
    <div className="mt-6">
      <p className="px-5 text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
        Complaints
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
        </div>
      </div>

      {/* TAB CONTENT */}
      <ComplaintsTable
        search={searchTerm}
        clickExport={clickExport}
        setClickExport={setClickExport}
      />
    </div>
  );
};

export default ProtectedRoute(Complaints);
