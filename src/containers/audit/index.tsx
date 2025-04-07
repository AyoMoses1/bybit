import { CustomTable } from "@/components/ui/data-table";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useAudit } from "@/lib/api/hooks/audit";
import moment from "moment";

type CarType = {
  id: string;
  driver?: string;
  carType?: string;
  vehicleNumber?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  other_info?: string;
  active?: boolean;
  approved?: boolean;
};

const AuditTable = ({ search }: { search?: string; clickExport?: boolean }) => {
  const { data: audit, isLoading } = useAudit(search);

  const columns: ColumnDef<CarType>[] = [
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
