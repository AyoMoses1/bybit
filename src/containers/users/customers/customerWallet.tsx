import { C } from "@/components/ui/data-table";
import React, { useState } from "react";
import { Search, TrendingDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useGetUserById, useUserWalletHistory } from "@/store/user/user";
import { formatDate } from "@/utils/formatDate";

type User = {
  walletBalance: string;
};

const CustomerWallet = ({ id }: { id: string | string[] }) => {
  const userId = Array.isArray(id) ? id[0] : id;
  const { data: user } = useGetUserById(userId ?? "") as {
    data: User | undefined;
  };

  const { data: walletHistory, isLoading } = useUserWalletHistory(userId ?? "");

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "date",
      header: "Request Date",
      cell: ({ getValue }) => formatDate(Number(getValue())),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) =>
        "CFA " + Number(getValue()).toLocaleString() || "N/A",
    },
    {
      accessorKey: "transaction_id",
      header: "Transaction ID",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ getValue }) => {
        const value = getValue() as string;

        return (
          <span
            className={`badge ${
              value === "Credit"
                ? "badge-success"
                : value === "Debit"
                  ? "badge-error"
                  : ""
            }`}
          >
            {value || "N/A"}
          </span>
        );
      },
    },
  ];

  console.log(walletHistory);

  return (
    <div className="px-1">
      <div>
        {/* Wallet Balance Card */}
        <div className="card-background relative z-0 mb-6 h-[180px] w-72 rounded-2xl border border-[#913B8133] bg-white p-5 font-[Roboto] shadow-sm">
          <h4 className="text-base text-[#606060]">Wallet Balance</h4>
          <h2 className="pt-1 text-[28px] font-bold text-[#202224]">
            CFA{" "}
            {user?.walletBalance
              ? (Number(user?.walletBalance).toLocaleString() ?? "0")
              : "0"}
          </h2>
          <div className="absolute bottom-5 flex items-center font-[Roboto] text-base text-[#F93C65]">
            <span className="pr-[6px]">
              <TrendingDown className="size-[18px]" />
            </span>
            <span className="mr-1">4.3%</span>
            <span className="text-[#606060]"> Down from yesterday</span>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 mt-2 flex items-center justify-between px-0">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.11px] text-[#202224]">
              Transaction History
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex h-[38px] w-[234px] items-center gap-2 rounded-[19px] border-[0.6px] border-[#D5D5D5] bg-[#FAFAFA] px-3">
              <Search className="size-4 text-[#00000080]" />
              <input
                type="text"
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-none bg-transparent text-sm text-[#6E7079] outline-none placeholder:text-[#00000080]"
                placeholder="Search in table..."
              />
            </div>
          </div>
        </div>
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
            <C
              columns={columns}
              data={Array.isArray(walletHistory) ? walletHistory : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerWallet;
