import { CustomTable } from "@/components/ui/data-table";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import process from "../../assets/svgs/Group.svg";
import cancel from "../../assets/svgs/Vector.svg";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useWithdrawals } from "@/lib/api/hooks/withdrawals";
import { formatDate } from "@/utils/formatDate";

type WithdrawalType = {
  id: string;
  processDate?: string;
  name?: string;
  amount?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  bankName?: string;
  bankCode?: boolean;
  bankAccount?: boolean;
};

const WithdrawalTable = ({ search }: { search?: string }) => {
  const { data: withdrawals, isLoading } = useWithdrawals(search);

  const columns: ColumnDef<WithdrawalType>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "date",
      header: "Request Date",
      cell: ({ getValue }) => formatDate(Number(getValue())),
    },
    {
      accessorKey: "name",
      header: "Driver Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => "CFA" + getValue() || "N/A",
    },
    {
      accessorKey: "processed",
      header: "Status",
      cell: ({ getValue }) => {
        const value = getValue() as boolean;
        return (
          <span
            className={`badge capitalize ${
              value === true
                ? "badge-processed"
                : value === false
                  ? "badge-pending"
                  : ""
            }`}
          >
            {value === true ? "Processed" : value === false ? "Pending" : "N/A"}
          </span>
        );
      },
    },
    {
      accessorKey: "processDate",
      header: "Process Date",
      cell: ({ getValue }) => formatDate(Number(getValue())),
    },
    {
      accessorKey: "bankName",
      header: "Bank Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "bankCode",
      header: "Bank Code",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "bankAccount",
      header: "Acc Number",
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: () => {
        return (
          <div className="w-[88px]">
            <div
              style={{
                borderWidth: "1px",
                backgroundColor: "#FAFBFD",
              }}
              className="relative flex w-fit cursor-pointer items-center justify-between gap-3 rounded-md border-[0.6px] border-[#D5D5D5] bg-[#FAFBFD] px-2"
            >
              {/* PROCESS */}
              <div className="px-1 py-[10px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Image
                      src={process}
                      alt="Process Icon"
                      width={16}
                      height={16}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="z-[80] mt-3 flex w-[70px] items-center justify-center rounded-[8px] bg-[#1C0B19] px-2 py-2 font-inter text-xs font-normal text-white"
                    side="bottom"
                  >
                    Process
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Divider */}
              <div className="h-8 w-[1px] translate-y-0 bg-[#979797]" />
              {/* CANCEL */}
              <div className="px-1 py-[10px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Image
                      src={cancel}
                      alt="Process Icon"
                      width={15}
                      height={15}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="z-[80] mb-3 flex w-[70px] items-center justify-center rounded-[8px] bg-[#1C0B19] px-2 py-2 font-inter text-xs font-normal text-white"
                    side="top"
                  >
                    Cancel
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  console.log(withdrawals);

  return (
    <div className="px-1">
      <div>
        {isLoading ? (
          <div
            style={{ height: "200px", margin: "0px 90px" }}
            className="flex items-center justify-center"
          >
            <p className="text-sm font-semibold">Loading...</p>
          </div>
        ) : (
          <>
            {" "}
            <CustomTable
              columns={columns}
              empty="You currently have no registered car"
              data={Array.isArray(withdrawals) ? withdrawals : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WithdrawalTable;
