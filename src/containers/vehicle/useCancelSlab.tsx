import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CancellationSlab, CarType } from "./vehicleTypes";
import deleteIcon from "../../assets/svgs/Vector (1).svg";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const useCancellationSlabsTable = (
  vehicleType: CarType | null,
  onEditSlab?: (slab: CancellationSlab) => void,
  onDeleteSlab?: (slabId: string) => void,
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [slabs, setSlabs] = useState<CancellationSlab[]>([]);

  useEffect(() => {
    if (vehicleType && vehicleType.cancelSlab) {
      setSlabs(vehicleType.cancelSlab);
      setSearchQuery("");
    } else {
      setSlabs([]);
    }
  }, [vehicleType]);

  const filteredSlabs = slabs.filter((slab) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase().trim();
    return (
      slab.minsDelayed?.toLowerCase().includes(searchLower) ||
      slab.amount?.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const exportToCSV = () => {
    if (!slabs || slabs.length === 0) return;

    const headers = ["Minutes Delayed", "Amount"];

    const csvRows = [
      headers.join(","),
      ...slabs.map((slab) => {
        return [slab.minsDelayed || "", slab.amount || ""]
          .map((value) => `"${value}"`)
          .join(",");
      }),
    ];

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "cancellation_slabs.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<CancellationSlab>[] = [
    {
      accessorKey: "minsDelayed",
      header: "Minutes Delayed",
      cell: ({ row }) => (
        <div className="py-3 pl-4">
          <span className="text-gray-700">
            {row.getValue("minsDelayed") || "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="py-3">
          <span className="text-gray-700">
            {row.getValue("amount") || "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="pr-8 text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end py-2 pr-4">
          <div className="flex rounded-lg border border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onEditSlab) {
                  onEditSlab(row.original);
                }
              }}
              className="flex h-10 w-10 items-center justify-center border-r border-gray-200 hover:bg-gray-50"
            >
              <ArrowRight />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDeleteSlab) {
                  onDeleteSlab(row.original.id || "");
                }
              }}
              className="flex h-10 w-10 items-center justify-center text-red-500 hover:bg-gray-50"
            >
              <Image
                src={deleteIcon}
                alt="Delete Icon"
                width={10}
                height={10}
              />
            </button>
          </div>
        </div>
      ),
    },
  ];

  return {
    searchQuery,
    setSearchQuery,
    slabs: filteredSlabs,
    columns,
    handleSearchChange,
    handleClearSearch,
    exportToCSV,
    isLoading: false,
  };
};
