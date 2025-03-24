"use client";

import { CustomTable } from "@/components/ui/data-table";
import React from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

import { formatDate } from "@/utils/formatDate";
import DeleteConfirmation from "@/components/deleteConfirmation";
import { Button } from "@/components/ui/button";
import { PromoData } from "@/lib/api/apiHandlers/promoService";
import {
  useDeletePromo,
  usePromos,
  useUpdatePromo,
} from "@/lib/api/hooks/usePromo";

const Promos: React.FC = () => {
  const { data: promos, isLoading } = usePromos();
  const updateMutation = useUpdatePromo();

  console.log({ promos });

  const columns: ColumnDef<PromoData>[] = [
    {
      accessorKey: "promoName",
      header: "Promo Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "promoValue",
      header: "Promo Value",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "maxDiscountAllowed",
      header: "Max Discount Allowed",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "minimumOrderValue",
      header: "Minimum Order Value",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const value = row.original.endDate;
        return value ? formatDate(Number(value)) : "N/A";
      },
    },
    {
      accessorKey: "promoCountAvailable",
      header: "Promo Count Available",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "showInList",
      header: "Show in List",
      cell: ({ row }) => {
        const [isChecked, setIsChecked] = React.useState<boolean>(
          row.original.showInList ?? false,
        );

        const handleToggle = async (checked: boolean) => {
          updateMutation.mutate(
            {
              id: row.original.id as string,
              updatedData: { showInList: checked },
            },
            {
              onError: () => setIsChecked(!checked),
            },
          );
        };

        return <Switch checked={isChecked} onCheckedChange={handleToggle} />;
      },
    },
    {
      accessorKey: "usedByCount",
      header: "Used by Count",
      cell: ({ getValue }) => getValue() || "0",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const deleteMutation = useDeletePromo();

        const handleDelete = () => {
          if (row.original.id) {
            deleteMutation.mutate(row.original.id);
          }
        };

        return (
          <div
            style={{
              borderWidth: "1px",
              backgroundColor: "#FAFBFD",
            }}
            className="flex w-fit items-center rounded-md border-[1px] border-[#D5D5D5] bg-[#FAFBFD] p-2"
          >
            <Link href={`/promo/${row.original.id}`}>
              <div className="cursor-pointer pr-2">
                <ArrowRight className="size-4 text-gray-600" />
              </div>
            </Link>
            <DeleteConfirmation
              onClick={handleDelete}
              text={`Are you sure you want to delete this promo (${row.original.promoName})? This action cannot be undone.`}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-1">
      <div className="mb-4 flex justify-end">
        <Link href="/promo/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Add New Promo
          </Button>
        </Link>
      </div>
      <div>
        {isLoading ? (
          <div
            style={{ height: "200px", margin: "0px 90px" }}
            className="flex items-center justify-center"
          >
            <p className="text-sm font-semibold">Loading...</p>
          </div>
        ) : (
          <CustomTable
            columns={columns}
            data={Array.isArray(promos) ? promos : []}
          />
        )}
      </div>
    </div>
  );
};

export default Promos;
