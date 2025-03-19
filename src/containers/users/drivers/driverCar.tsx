import { CustomTable } from "@/components/ui/data-table";
import React, { useMemo, useState } from "react";
import { Search, TrendingDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useGetUserById, useUserWalletHistory } from "@/lib/api/hooks/user";
import { formatDate } from "@/utils/formatDate";

type User = {
  walletBalance: string;
};

const DriverCar = ({ id }: { id: string | string[] }) => {
  const userId = Array.isArray(id) ? id[0] : id;
  const { data: user } = useGetUserById(userId ?? "") as {
    data: User | undefined;
  };
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="px-1">
      {/* <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-6 shadow-md">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="mb-3 text-xl font-semibold">Active Car</h2>
            <CarCard {...carData} active />
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold">Other Cars</h2>
            <CarCard {...carData} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DriverCar;
