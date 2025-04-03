"use client";
import { WithdrawalType } from "@/containers/withdrawals";
import { useWithdrawals } from "@/lib/api/hooks/withdrawals";
import { formatDate } from "@/utils/formatDate";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const WithdrawalInfo = () => {
  const { id } = useParams();
  const [withdrawal, setWithdrawal] = useState<WithdrawalType | null>(null);
  const withdrawalId = Array.isArray(id) ? id[0] : id;
  const { data: withdrawals } = useWithdrawals();

  useEffect(() => {
    if (Array.isArray(withdrawals)) {
      setWithdrawal(withdrawals?.find((data) => data.id === withdrawalId));
    }
  }, [withdrawals, withdrawalId]);

  return (
    <div className="font-source">
      <div className="mb-2 p-6">
        <h2 className="mb-4 mt-2 font-source text-2xl font-semibold tracking-[-0.11px] text-[#202224]">
          Withdrawal ID:
          <span className="font-normal"> {withdrawalId}</span>
        </h2>
      </div>

      <div className="flex items-center gap-6 px-6">
        <div className="w-[70%]">
          <div className="rounded-[14px] bg-white px-6 pb-12 pt-8 shadow-sm">
            <h2 className="mb-6 font-source text-[22px] font-semibold text-[#202224]">
              Transcation Information
            </h2>
            <div className="flex justify-between gap-7">
              {/* 1 */}
              <div className="flex w-full flex-col gap-6">
                {/* 1 */}
                <div className="flex items-center justify-between border-b border-b-[#E1E1E1] pb-2 font-roboto">
                  <p className="text-base font-normal text-[#697077]">ID</p>
                  <p className="text-base font-normal text-[#697077]">
                    {withdrawalId}
                  </p>
                </div>

                {/* 2 */}
                <div className="flex items-center justify-between border-b border-b-[#E1E1E1] pb-2 font-roboto">
                  <p className="text-base font-normal text-[#697077]">
                    Request Date
                  </p>
                  <p className="text-base font-normal text-[#697077]">
                    {formatDate(Number(withdrawal?.date))}
                  </p>
                </div>

                {/* 3 */}
                <div className="flex items-center justify-between border-b border-b-[#E1E1E1] pb-2 font-roboto">
                  <p className="text-base font-normal text-[#697077]">Status</p>
                  <p className="text-base font-normal text-[#697077]">
                    <span
                      className={`badge capitalize ${
                        withdrawal?.processed === true
                          ? "badge-processed"
                          : withdrawal?.processed === false
                            ? "badge-pending"
                            : ""
                      }`}
                    >
                      {withdrawal?.processed === true
                        ? "Processed"
                        : withdrawal?.processed === false
                          ? "Pending"
                          : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
              {/* Divider */}
              <div className="h-[150px] w-[1px] translate-y-0 bg-[#E1E1E1]" />
              {/* 2 */}
              <div className="flex w-full flex-col gap-6">
                {/* 1 */}
                <div className="flex items-center justify-between border-b border-b-[#E1E1E1] pb-2 font-roboto">
                  <p className="text-base font-normal text-[#697077]">Amount</p>
                  <p className="text-base font-normal text-[#697077]">
                    {"CFA" + withdrawal?.amount || "N/A"}
                  </p>
                </div>

                {/* 2 */}
                <div className="flex items-center justify-between border-b border-b-[#E1E1E1] pb-2 font-roboto">
                  <p className="text-base font-normal text-[#697077]">
                    Process Date
                  </p>
                  <p className="text-base font-normal text-[#697077]">
                    {formatDate(Number(withdrawal?.processDate))}
                  </p>
                </div>

                {/* 3 */}
                <div className="flex items-center justify-between border-b border-b-[#E1E1E1] pb-2 font-roboto">
                  <p className="text-base font-normal text-[#697077]">
                    Driver Name
                  </p>
                  <p className="text-base font-normal text-[#697077]">
                    {withdrawal?.name || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%]">
          <div className="rounded-[14px] bg-white px-6 pb-12 pt-8 shadow-sm">
            <h2 className="mb-6 font-source text-[22px] font-semibold text-[#202224]">
              Bank Information
            </h2>
            <div className="flex flex-col gap-6">
              {/* 1 */}
              <div className="flex items-center justify-between border-b border-b-[#E1E1E1] pb-2 font-roboto">
                <p className="text-base font-normal text-[#697077]">
                  Bank Name
                </p>
                <p className="text-base font-normal text-[#697077]">
                  {" "}
                  {withdrawal?.bankName || "N/A"}
                </p>
              </div>

              {/* 2 */}
              <div className="flex items-center justify-between border-b border-b-[#E1E1E1] pb-2 font-roboto">
                <p className="text-base font-normal text-[#697077]">
                  Bank Code
                </p>
                <p className="text-base font-normal text-[#697077]">
                  {" "}
                  {withdrawal?.bankCode || "N/A"}
                </p>
              </div>

              {/* 3 */}
              <div className="flex items-center justify-between border-b border-b-[#E1E1E1] pb-2 font-roboto">
                <p className="text-base font-normal text-[#697077]">
                  Account Number
                </p>
                <p className="text-base font-normal text-[#697077]">
                  {" "}
                  {withdrawal?.bankAccount || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalInfo;
