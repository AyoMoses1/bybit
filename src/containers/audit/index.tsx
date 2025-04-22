import { CustomTable } from "@/components/ui/data-table";
import React, { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useAudit } from "@/lib/api/hooks/audit";
import moment from "moment";
import { AuditLog } from "@/lib/api/apiHandlers/auditService";
import Papa from "papaparse";

const AuditTable = ({
  search,
  clickExport,
  setClickExport,
  filter,
}: {
  search?: string;
  clickExport?: boolean;
  setClickExport: (value: boolean) => void;
  filter: string;
}) => {
  const { data: audit, isLoading } = useAudit(search, filter);

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "entity",
      header: "Entity",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "entityId",
      header: "Entity Id",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "userRole",
      header: "User Role",
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "timestamp",
      header: "Created Date/Time",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return moment(value).format("LLL");
      },
    },
    {
      accessorKey: "ipAddress",
      header: "Ip Address",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => getValue() || "N/A",
    },
  ];

  const exportToCSV = (data: AuditLog[]) => {
    const csvData = data.map((item) => ({
      Id: item.id || "N/A",
      Action: item.action || "N/A",
      Entity: item.entity || "N/A",
      "Entity Id": item.entityId || "N/A",
      "User ID": item.userId || "N/A",
      "User Role": item.userRole || "N/A",
      "Created Date/Time": moment(item.timestamp).format("LLL") || "N/A",
      "Ip Address": item.ipAddress || "N/A",
      Description: item.description || "N/A",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "AuditLog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (clickExport) {
      exportToCSV(audit as AuditLog[]);
      setClickExport(false);
    }
  }, [clickExport, audit, setClickExport]);

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
              empty="You currently have no audit"
              data={Array.isArray(audit) ? audit : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AuditTable;
