import { CustomTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
// import { useFleetEarningReports } from "@/lib/api/hooks/reports";
import { useEffect } from "react";

type FleetEarningReport = {
  fleetadmin_id: string;
  fleetadmin_name: string;
  year: number;
  month: string;
  booking_count: number;
  earning_amount: number;
};

const FleetEarningHistory = ({ search }: { search?: string }) => {
  const isLoading = false;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // const [userInfo, setUserInfo] = useState<{
  //   usertype?: string;
  //   id?: string;
  // }>();
  // const { data: fleetreport, isLoading } = useFleetEarningReports(
  //   userInfo?.usertype ?? "",
  //   userInfo?.id ?? "",
  //   search,
  // );
  console.log(search);

  const columns: ColumnDef<FleetEarningReport>[] = [
    {
      accessorKey: "fleetadmin_id",
      header: "Admin ID",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "fleetadmin_name",
      header: "Admin Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "year",
      header: "Year",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "month",
      header: "Month",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const month = parseInt(value, 10);
        return month >= 1 && month <= 12 ? monthNames[month - 1] : "N/A";
      },
    },

    {
      accessorKey: "booking_count",
      header: "Booking Count",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "earning_amount",
      header: "Earning Amount",
      cell: ({ getValue }) => getValue() || "N/A",
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = localStorage.getItem("userInfo");
      if (info) {
        // setUserInfo(JSON.parse(info));
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
              data={[]}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FleetEarningHistory;
