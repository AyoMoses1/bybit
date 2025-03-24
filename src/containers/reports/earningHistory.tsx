import { CustomTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useDriversReports, useEarningReports } from "@/lib/api/hooks/reports";

const EarningHistory = ({ search }: { search?: string }) => {
  const { data: reports, isLoading } = useEarningReports(search);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "year",
      header: "Year",
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "month",
      header: "Month",
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "total_rides",
      header: "Booking Count",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "tripCost",
      header: "Gross Trip Cost",
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "driverShare",
      header: "Driver Share",
      cell: ({ getValue }) => "CFA" + getValue() || "N/A",
    },
    {
      accessorKey: "cancellationFee",
      header: "Cancellation Fee",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "convenienceFee",
      header: "Convenience Fee",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "discountAmount",
      header: "Discount",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "myEarning",
      header: "Profit",
      cell: ({ getValue }) => getValue() || "N/A",
    },
  ];

  console.log(reports);

  return (
    <div>
      {" "}
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
              empty="You currently have no report history"
              data={Array.isArray(reports) ? reports : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EarningHistory;
