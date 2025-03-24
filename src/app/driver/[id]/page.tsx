"use client";
import CustomersBankDetails from "@/containers/users/customers/customerBankDetails";
import CustomerWallet from "@/containers/users/customers/customerWallet";
import DriverBankDetails from "@/containers/users/drivers/driverBankDetails";
import DriverCar from "@/containers/users/drivers/driverCar";
import DriverInfo from "@/containers/users/drivers/driverInfo";
import DriverRides from "@/containers/users/drivers/driverRides";
import DriverWallet from "@/containers/users/drivers/driverWallet";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Driver = () => {
  const { id } = useParams();
  const tabsData = [
    { key: 1, title: "Info", info: "Driver Information" },
    { key: 2, title: "Rides", info: "Driver’s Rides" },
    { key: 3, title: "Cars", info: "" },
    { key: 4, title: "Wallet", info: "" },
    { key: 5, title: "Bank Details", info: "" },
  ];
  const [selectedTab, setSelectedTab] = useState({
    key: 1,
    title: "Info",
    info: "Driver Information",
  });

  return (
    <div className="p-6">
      {/* TABS */}
      <div className="flex w-fit cursor-pointer pb-8">
        {tabsData?.map((tab) => {
          return (
            <div
              key={tab.key}
              onClick={() => setSelectedTab(tab)}
              className={`${selectedTab.title === tab.title ? "border-b border-b-[#DA4CBF] pb-4 text-[#DA4CBF]" : "border-b border-b-[#DDE1E6] text-[#64748B]"} pl-6 pr-6 text-center font-[Roboto] text-sm font-normal`}
            >
              <p className="">{tab?.title}</p>
            </div>
          );
        })}
      </div>
      {selectedTab.info.length !== 0 && (
        <p className="pb-6 text-2xl font-semibold text-[#202224]">
          {selectedTab.info || ""}
        </p>
      )}
      {/* SELECTED TABS */}
      <div className="relative">
        {selectedTab?.title === "Info" ? (
          <div>
            <DriverInfo />
          </div>
        ) : selectedTab?.title === "Rides" ? (
          <div>
            <DriverRides id={id ?? ""} />
          </div>
        ) : selectedTab?.title === "Wallet" ? (
          <div>
            {" "}
            <div>
              <DriverWallet id={id ?? ""} />
            </div>
          </div>
        ) : selectedTab?.title === "Cars" ? (
          <div>
            {" "}
            <div>
              <DriverCar id={id ?? ""} />
            </div>
          </div>
        ) : selectedTab?.title === "Bank Details" ? (
          <div>
            <DriverBankDetails id={id ?? ""} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProtectedRoute(Driver);
