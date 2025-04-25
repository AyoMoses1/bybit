import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/ui/data-table";
import { Pen } from "lucide-react";
import DeleteConfirmation from "@/components/deleteConfirmation";
import Link from "next/link";
import {
  useCancelReasons,
  useEditCancelReasons,
} from "@/lib/api/apiHandlers/useCancelReason";

type CancelReason = {
  id: string;
  label: string;
};

const CancellationReasons = ({
  search,
  clickExport,
  setClickExport,
}: {
  search?: string;
  clickExport?: boolean;
  setClickExport: (value: boolean) => void;
}) => {
  const { data, isLoading, error } = useCancelReasons();
  const { mutate } = useEditCancelReasons();

  const filteredData = React.useMemo(
    () =>
      data?.complex?.filter((item) =>
        item.label.toLowerCase().includes(search?.toLowerCase() ?? ""),
      ),
    [data?.complex, search],
  );

  const reasons: CancelReason[] = React.useMemo(
    () =>
      filteredData?.map((item, index) => ({
        id: String(index),
        label: item.label,
      })) || [],
    [filteredData],
  );

  React.useEffect(() => {
    if (clickExport && reasons.length > 0) {
      const headers = Object.keys(reasons[0]).join(",");
      const csvContent = [
        headers,
        ...reasons.map((item) => Object.values(item).join(",")),
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "cancellation_reasons.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset export trigger
      setClickExport(false);
    }
  }, [clickExport, reasons, setClickExport]);

  const handleDelete = (id: string) => {
    if (!data?.complex) return;
    const updatedReasons = data.complex.filter(
      (_, index) => String(index) !== id,
    );
    mutate(updatedReasons);
  };

  const columns: ColumnDef<CancelReason>[] = [
    {
      accessorKey: "label",
      header: () => (
        <div className="pr-14 text-right font-semibold">Reason</div>
      ),
      cell: ({ row }) => (
        <div className="pr-4 text-right text-gray-600">
          {row.original.label}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => (
        <div className="pr-10 text-right font-semibold">Action</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-end pr-4">
            <div className="flex items-center gap-2 rounded-md border border-[#D5D5D5] bg-[#FAFBFD] px-2 py-1">
              <Link href={`/cancel-reason/${row.original.id}`}>
                <div className="cursor-pointer p-1">
                  <Pen className="size-4 text-gray-600" />
                </div>
              </Link>
              <div className="h-6 w-px bg-[#979797]" />
              <div className="cursor-pointer p-1">
                <DeleteConfirmation
                  onClick={() => handleDelete(row.original.id)}
                  text={`Are you sure you want to delete this user (${row.original.label})?`}
                />
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="rounded-lg">
      {isLoading ? (
        <p className="text-gray-500">Loading cancellation reasons...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load cancellation reasons.</p>
      ) : (
        <CustomTable
          columns={columns}
          data={reasons}
          empty="No cancellation reasons available"
        />
      )}
    </div>
  );
};

export default CancellationReasons;
