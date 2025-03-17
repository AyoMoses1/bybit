"use client";
import CustomersBankDetails from "@/containers/users/customers/customerBankDetails";
import CustomerInfo from "@/containers/users/customers/customerInfo";
import CustomersRides from "@/containers/users/customers/customerRides";
import CustomerWallet from "@/containers/users/customers/customerWallet";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Customer = () => {
  const { id } = useParams();
  const tabsData = [
    { key: 1, title: "Info", info: "Customer Information" },
    { key: 2, title: "Rides", info: "Customer’s Rides" },
    { key: 3, title: "Wallet", info: "" },
    { key: 4, title: "Bank Details", info: "" },
  ];
  const [selectedTab, setSelectedTab] = useState({
    key: 1,
    title: "Info",
    info: "Customer Information",
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
      {selectedTab?.title === "Info" ? (
        <div>
          <CustomerInfo />
        </div>
      ) : selectedTab?.title === "Rides" ? (
        <div>
          <CustomersRides id={id ?? ""} />
        </div>
      ) : selectedTab?.title === "Admins" ? (
        <div>
          {" "}
          <div>
            <CustomerWallet />
          </div>
        </div>
      ) : selectedTab?.title === "Bank Details" ? (
        <div>
          <CustomersBankDetails />
        </div>
      ) : null}
    </div>
  );
};

export default ProtectedRoute(Customer);
