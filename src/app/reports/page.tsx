"use client";
import SearchComponent from "@/components/SearchComponent";
import DriverEarningGraph from "@/containers/reports/driverEarningGraph";
import DriverEarningHistory from "@/containers/reports/driverEarningHistory";
import EarningHistory from "@/containers/reports/earningHistory";
import EarningReportGraph from "@/containers/reports/earningReportGraph";
import FleetEarningHistory from "@/containers/reports/fleetEarningHistory";

import React, { useState } from "react";

const Reports = () => {
  const [clickExport, setClickExport] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Driver Earning History");
  const [searchTerm, setSearchTerm] = useState("");

  const tabsData = [
    { key: 1, title: "Driver Earning History" },
    { key: 2, title: "Earning Reports" },
    { key: 3, title: "Admins Earning Reports" },
  ];

  return (
    <div>
      {" "}
      {/* TABS */}
      <div className="m-4 flex w-fit cursor-pointer pb-2 pt-2">
        {tabsData?.map((tab) => {
          return (
            <div
              key={tab.key}
              onClick={() => setSelectedTab(tab.title)}
              className={`${selectedTab === tab.title ? "border-b border-b-[#DA4CBF] pb-4 text-[#DA4CBF]" : "border-b border-b-[#DDE1E6] text-[#64748B]"} pl-4 pr-4 text-center font-[Roboto] text-sm font-normal`}
            >
              <p className="">{tab?.title}</p>
            </div>
          );
        })}
      </div>
      {/* GRAPH SECTION */}
      {selectedTab === "Driver Earning History" ? (
        <div>
          <DriverEarningGraph />
        </div>
      ) : selectedTab === "Earning Reports" ? (
        <div>
          <EarningReportGraph />
        </div>
      ) : null}
      {/* TAB HEADER */}
      <div className="mb-2 flex items-center justify-between px-5">
        <div>
          <p className="text-2xl font-semibold tracking-[-0.11px] text-[#202224]">
            {selectedTab}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SearchComponent
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            importTable={true}
            onClick={() => setClickExport(!clickExport)}
          />
        </div>
      </div>
      {/* TAB CONTENT */}
      <div className="mt-5 px-[2px]">
        {selectedTab === "Driver Earning History" ? (
          <div>
            <DriverEarningHistory
              search={searchTerm}
              clickExport={
                selectedTab === "Driver Earning History" ? clickExport : false
              }
              setClickExport={setClickExport}
            />
          </div>
        ) : selectedTab === "Earning Reports" ? (
          <div>
            {" "}
            <EarningHistory
              search={searchTerm}
              clickExport={
                selectedTab === "Earning Reports" ? clickExport : false
              }
              setClickExport={setClickExport}
            />
          </div>
        ) : selectedTab === "Admins Earning Reports" ? (
          <div>
            <FleetEarningHistory search={searchTerm} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Reports;
