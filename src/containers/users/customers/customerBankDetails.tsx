"use client";

import React, { FC } from "react";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { useGetUserById } from "@/lib/api/hooks/user";
import TextInput from "@/components/TextInput";

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
            <TextInput
              type="text"
              label="Bank Name"
              disabled
              placeholder="e.g. 4352 232323"
              value={user?.bankName}
            />
            <TextInput
              type="text"
              label="Bank Account"
              disabled
              placeholder="e.g. 4352 232323"
              value={user?.bankCode}
            />
          </div>

          <div className="flex w-full flex-wrap gap-4">
            <TextInput
              type="text"
              label="Bank Code"
              disabled
              placeholder="e.g. 4352 232323"
              value={user?.bankAccount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(CustomerBankDetails);
