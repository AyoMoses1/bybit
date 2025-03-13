"use client";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const AddFleetAdmin = () => {
  const [selectedValue, setSelectedValue] = useState("");
  return (
    <div className="p-6">
      <p className="pb-6 text-2xl font-semibold text-[#202224]">
        Add Fleet Admin
      </p>

      <div className="rounded-lg bg-white px-10 py-12 shadow-md">
        <div className="">
          {/* Form Fields */}
          <div className="w-full">
            <div className="flex w-full justify-between gap-16">
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  First Name
                </label>
                <input
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="John"
                />
              </div>
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Last Name
                </label>
                <input
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="Last"
                />
              </div>
            </div>

            <div className="mt-4 flex w-full justify-between gap-16">
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="+352 232323"
                />
              </div>
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="email@vasas.com"
                />
              </div>
            </div>

            <div className="mt-4 flex w-full justify-between gap-16">
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Approval Status
                </label>
                <div className="relative w-full">
                  <select
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    className={`mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 outline-none transition-colors ${selectedValue === "" ? "text-[#697077]" : "text-[#21272A]"}`}
                  >
                    <option value="" disabled className="text-[#697077]">
                      Select an option
                    </option>
                    <option value="approved" className="text-[#21272A]">
                      Approved
                    </option>
                    <option value="not-approved" className="text-[#21272A]">
                      Not Approved
                    </option>
                  </select>

                  {/* Custom Dropdown Icon */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 top-1 flex items-center text-gray-500">
                    <ChevronDown className="size-5" />
                  </div>
                </div>
              </div>
              <div className="w-full"></div>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-12 flex justify-center">
          <Button className="w-[287px] py-[10px]" size={"default"}>
            Add Admin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(AddFleetAdmin);
