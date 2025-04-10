import { CustomTable } from "@/components/ui/data-table";
import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { AuditAction } from "@/lib/api/apiHandlers/auditService";
import { useAuditLog } from "@/utils/useAuditLog";
import Papa from "papaparse";
import { formatDate } from "@/utils/formatDate";
import {
  Complaint,
  useComplaints,
  useUpdateComplaint,
} from "@/lib/api/hooks/complaints";

const ComplaintsTable = ({
  search,
  clickExport,
  setClickExport,
}: {
  search?: string;
  clickExport?: boolean;
  setClickExport: (value: boolean) => void;
}) => {
  const { handleAudit } = useAuditLog();
  const [toggleStates, setToggleStates] = React.useState<
    Record<string, boolean>
  >({});

  const { data: complaints, isLoading } = useComplaints(search);
  const mutation = useUpdateComplaint();

  const handleToggle = (id: string, checked: boolean) => {
    setToggleStates((prev) => ({ ...prev, [id]: checked }));

    mutation.mutate(
      { id, updatedData: { check: checked, processDate: Date.now() } },
      {
        onError: () => setToggleStates((prev) => ({ ...prev, [id]: !checked })),
        onSuccess: () => {
          handleAudit(
            "Promos",
            id,
            AuditAction.UPDATE,
            `Updated check status to ${checked}`,
          );
        },
      },
    );
  };

  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "complainDate",
      header: "Created  Date",
      cell: ({ getValue }) => formatDate(Number(getValue())),
    },
    {
      accessorKey: "firstName",
      header: "First Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "role",
      header: "User Type",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "processDate",
      header: "Process Date",
      cell: ({ getValue }) => {
        const value = getValue();

        return value ? formatDate(Number(value)) : "N/A";
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div>
            <div className="relative flex w-fit cursor-pointer items-center justify-between gap-4 rounded-md bg-[#FAFBFD] px-2">
              <Switch
                checked={toggleStates[row.original.id] ?? row.original.check}
                onCheckedChange={(checked) =>
                  handleToggle(row.original.id, checked)
                }
              />
              <Link href={`/complaint/${row.original.id}`}>
                <div className="px-1 py-2">
                  <ArrowRight className="size-4 text-gray-600" />
                </div>
              </Link>
            </div>
          </div>
        );
      },
    },
  ];

  const exportToCSV = (data: Complaint[]) => {
    const csvData = data.map((item) => ({
      ID: item.id || "N/A",
      "Created Date": item.complainDate || "N/A",
      "First Name": item.firstName || "N/A",
      "Last Name": item.lastName || "N/A",
      "User Type": item.role || "N/A",
      Subject: item.subject || "N/A",
      "Process Date": item.processDate || "N/A",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "complaints.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (clickExport) {
      exportToCSV(complaints as Complaint[]);
      handleAudit(
        "Complaints",
        "",
        AuditAction.EXPORT,
        "Exported Complaints History",
      );
      setClickExport(false);
    }
  }, [clickExport, complaints, handleAudit, setClickExport]);

  console.log(complaints);

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
              empty="You currently have no complaint"
              data={Array.isArray(complaints) ? complaints : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ComplaintsTable;
