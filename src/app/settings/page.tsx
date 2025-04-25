"use client";
import AppInformation from "@/containers/settings/appInformation";
import CancellationReasonsPage from "@/app/cancel-reason/page";
import SmsSettings from "@/containers/settings/sms";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import React, { JSX, useState } from "react";

const Settings = () => {
  type TabTitle =
    | "App Information"
    | "General Settings"
    | "Languages"
    | "SMTP"
    | "SMS Settings"
    | "Cancellation Reason";

  const [selectedTab, setSelectedTab] = useState<TabTitle>("App Information");

  //  TAB CONTENT
  const tabContent: Record<TabTitle, JSX.Element> = {
    "App Information": (
      <div>
        <AppInformation />
      </div>
    ),
    "General Settings": <div>General Settings Content</div>,
    Languages: (
      <div>
        <div>Languages Content</div>
      </div>
    ),
    SMTP: <div>SMTP Content</div>,
    "SMS Settings": <SmsSettings />,
    "Cancellation Reason": (
      <div>
        <CancellationReasonsPage />
      </div>
    ),
  };

  return (
    <div>
      {/* TABS */}
      <div className="m-4 flex w-fit cursor-pointer pb-2 pt-2">
        {Object.keys(tabContent).map((title) => (
          <div
            key={title}
            onClick={() => setSelectedTab(title as TabTitle)}
            className={`${
              selectedTab === title
                ? "border-b border-b-[#DA4CBF] pb-4 text-[#DA4CBF]"
                : "border-b border-b-[#DDE1E6] text-[#64748B]"
            } pl-4 pr-4 text-center font-[Roboto] text-sm font-normal`}
          >
            <p>{title}</p>
          </div>
        ))}
      </div>

      {/* TAB HEADER */}
      <div className="mb-2 flex items-center justify-between px-5">
        <div>
          <p className="text-2xl font-semibold tracking-[-0.11px] text-[#202224]">
            {selectedTab}
          </p>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div>{tabContent[selectedTab]}</div>
    </div>
  );
};

export default ProtectedRoute(Settings);
