"use client";

import React, { FC, useState } from "react";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { useGetUserById } from "@/store/user/user";

type User = {
  bankName: string;
  bankAccount: string;
  bankCode: string;
};

type DriverBankDetailsProps = {
  id: string | string[];
};

const CustomerBankDetails: FC<DriverBankDetailsProps> = ({ id }) => {
  const userId = Array.isArray(id) ? id[0] : id;
  const { data: user } = useGetUserById(userId ?? "") as {
    data: User | undefined;
  };
  return (
    <div className="py-6">
      <div className="rounded-lg bg-white px-10 pb-6 shadow-md">
        <p className="pb-8 pt-5 text-2xl font-semibold text-[#202224]">
          Customer’s Bank Details
        </p>
        <div className="flex w-full justify-between gap-16 px-8">
          <div className="flex w-full flex-wrap gap-4">
            <div className="w-full">
              <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                Bank Name
              </label>
              <input
                type="text"
                disabled
                className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                placeholder="e.g. 4352 232323"
                value={user?.bankName}
              />
            </div>

            <div className="w-full">
              <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                Bank Account
              </label>
              <input
                type="text"
                className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                placeholder="e.g. 4352 232323"
                disabled
                value={user?.bankCode}
              />
            </div>
          </div>

          <div className="flex w-full flex-wrap gap-4">
            <div className="w-full">
              <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                Bank Code
              </label>
              <input
                type="text"
                className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                placeholder="e.g. 4352 232323"
                disabled
                value={user?.bankAccount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(CustomerBankDetails);
