import { CustomTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEarningReports } from "@/lib/api/hooks/reports";
import { useEffect } from "react";
import Papa from "papaparse";
import { useAuditLog } from "@/utils/useAuditLog";
import { AuditAction } from "@/lib/api/apiHandlers/auditService";

type EarningReport = {
  year: number;
  month: string;
  total_rides: number;
  tripCost: number;
  driverShare: number;
  cancellationFee: number;
  convenienceFee: number;
  discountAmount: number;
  myEarning: number;
};

const EarningHistory = ({
  search,
  clickExport,
  setClickExport,
}: {
  search?: string;
  clickExport: boolean;
  setClickExport: (value: boolean) => void;
}) => {
  const { data: reports, isLoading } = useEarningReports(search);
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

  const columns: ColumnDef<EarningReport>[] = [
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
      accessorKey: "total_rides",
      header: "Booking Count",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "tripCost",
      header: "Gross Trip Cost",
      cell: ({ getValue }) => "CFA" + getValue() || "N/A",
    },

    {
      accessorKey: "driverShare",
      header: "Driver Share",
      cell: ({ getValue }) => "CFA" + getValue() || "N/A",
    },
    {
      accessorKey: "cancellationFee",
      header: "Cancellation Fee",
      cell: ({ getValue }) => "CFA" + getValue() || "N/A",
    },
    {
      accessorKey: "convenienceFee",
      header: "Convenience Fee",
      cell: ({ getValue }) => "CFA" + getValue() || "N/A",
    },
    {
      accessorKey: "discountAmount",
      header: "Discount",
      cell: ({ getValue }) => "CFA" + getValue() || "N/A",
    },
    {
      accessorKey: "myEarning",
      header: "Profit",
      cell: ({ getValue }) => "CFA" + getValue() || "N/A",
    },
  ];
  const { handleAudit } = useAuditLog();
  const exportToCSV = (data: EarningReport[]) => {
    const csvData = data?.map((item) => ({
      Year: item.year || "N/A",
      Month: item.month || "N/A",
      "Booking Count": item.total_rides || "N/A",
      "Trip Cost": `CFA ${item.tripCost}` || "N/A",
      "Cancellation Fee": `CFA ${item.cancellationFee}` || "N/A",
      "Convenience Fee": `CFA ${item.convenienceFee}` || "N/A",
      Discount: `CFA ${item.discountAmount}` || "N/A",
      Profit: `CFA ${item.myEarning}` || "N/A",
      "Driver Share": `CFA ${item.driverShare}` || "N/A",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Earning History.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (clickExport) {
      exportToCSV(reports as EarningReport[]);
      setClickExport(false);
      handleAudit(
        "Earning History",
        "",
        AuditAction.EXPORT,
        "Exported Earning History Report",
      );
    }
  }, [clickExport, reports, setClickExport, handleAudit]);

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
