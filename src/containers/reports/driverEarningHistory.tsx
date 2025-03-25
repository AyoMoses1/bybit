import { CustomTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useDriversReports } from "@/lib/api/hooks/reports";

type DriverReport = {
  year: number;
  month: string;
  driverName: string;
  total_rides: number;
  driverVehicleNo: string;
  driverShare: number;
};

type UserInfo = {
  id: string;
  usertype: string;
};

const DriverEarningHistory = ({ search }: { search?: string }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { data: reports, isLoading } = useDriversReports(
    userInfo?.usertype ?? "",
    userInfo?.id ?? "",
    search,
  );

  const columns: ColumnDef<DriverReport>[] = [
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
      accessorKey: "driverName",
      header: "Driver Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "total_rides",
      header: "Booking Count",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "driverVehicleNo",
      header: "VIN",
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "driverShare",
      header: "Earning Amount",
      cell: ({ getValue }) => "CFA" + getValue() || "N/A",
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = localStorage.getItem("userInfo");
      if (info) {
        setUserInfo(JSON.parse(info));
      }
    }
  }, []);

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

export default DriverEarningHistory;
