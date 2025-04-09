import { CustomTable } from "@/components/ui/data-table";
import React, { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useSos } from "@/lib/api/hooks/sos";
import { formatDate } from "@/utils/formatDate";
import Papa from "papaparse";
import { AuditAction } from "@/lib/api/apiHandlers/auditService";
import { useAuditLog } from "@/utils/useAuditLog";

type SosType = {
  id: string;
  user_name?: string;
  contact?: string;
  user_type?: string;
  complainDate?: string;
};

const SosTable = ({
  search,
  clickExport,
  setClickExport,
}: {
  search?: string;
  clickExport?: boolean;
  setClickExport: (value: boolean) => void;
}) => {
  const { data: sos, isLoading } = useSos(search);

  const columns: ColumnDef<SosType>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "user_name",
      header: "Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "user_type",
      header: "User Type",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "complainDate",
      header: "Complaint Date",
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return formatDate(value) || "N/A";
      },
    },
  ];

  const { handleAudit } = useAuditLog();
  const exportToCSV = (data: SosType[]) => {
    const csvData = data.map((item) => ({
      ID: item.id || "N/A",
      Name: item.user_name || "N/A",
      Contact: item.contact || "N/A",
      "User Type": item.user_type || "N/A",
      "Complaint Date": item.complainDate || "N/A",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (clickExport) {
      exportToCSV(sos as SosType[]);
      handleAudit("Sos", "", AuditAction.EXPORT, "Exported SOS History");
      setClickExport(false);
    }
  }, [clickExport, sos, handleAudit, setClickExport]);

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
              empty="You currently have no sos"
              data={Array.isArray(sos) ? sos : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SosTable;
