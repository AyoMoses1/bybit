"use client";
import SearchComponent from "@/components/SearchComponent";
import { Button } from "@/components/ui/button";
import CancellationReasons from "@/containers/settings/cancelReason";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const CancellationReasonsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clickExport, setClickExport] = useState(false);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-5">
        <p className="text-[32px] font-semibold tracking-[-0.11px] text-[#202224]">
          Cancellation Reasons
        </p>
        <div className="flex items-center gap-4">
          <SearchComponent
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setClickExport(!clickExport)}
            importTable={true}
          />
          <Link href="/add-cancellation-reason">
            <Button className="flex items-center gap-2 py-2" size={"default"}>
              <Plus className="h-4 w-4" />
              <span>New Reason</span>
            </Button>
          </Link>
        </div>
      </div>

      <CancellationReasons
        search={searchTerm}
        clickExport={clickExport}
        setClickExport={setClickExport}
      />
    </div>
  );
};

export default CancellationReasonsPage;
