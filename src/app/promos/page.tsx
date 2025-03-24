"use client";

import { CustomTable } from "@/components/ui/data-table";
import React from "react";
import { ArrowRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

import { formatDate } from "@/utils/formatDate";
import DeleteConfirmation from "@/components/deleteConfirmation";
import { Button } from "@/components/ui/button";
import {
  useDeletePromo,
  usePromos,
  useUpdatePromo,
} from "@/lib/api/hooks/usePromo";
import { PromoData } from "@/lib/api/apiHandlers/promoService";

const Promos: React.FC = () => {
  const { data: promos, isLoading } = usePromos();
  const updateMutation = useUpdatePromo();

  const columns: ColumnDef<PromoData>[] = [
    {
      accessorKey: "promo_name",
      header: "Promo Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "promo_code",
      header: "Code",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "promo_description",
      header: "Description",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "promo_discount_type",
      header: "Type",
      cell: ({ getValue }) => {
        const type = getValue() as string;
        return type ? type.charAt(0).toUpperCase() + type.slice(1) : "N/A";
      },
    },
    {
      accessorKey: "promo_discount_value",
      header: "Promo Value",
      cell: ({ getValue, row }) => {
        const value = getValue() as number;
        const type = row.original.promo_discount_type;
        return type === "percentage" ? `${value}%` : `$${value}`;
      },
    },
    {
      accessorKey: "max_promo_discount_value",
      header: "Max Discount Allowed",
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return `$${value}`;
      },
    },
    {
      accessorKey: "min_order",
      header: "Minimum Order Value",
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return `$${value}`;
      },
    },
    {
      accessorKey: "promo_validity",
      header: "End Date",
      cell: ({ row }) => {
        const value = row.original.promo_validity;
        return value ? formatDate(Number(value)) : "N/A";
      },
    },
    {
      accessorKey: "promo_usage_limit",
      header: "Promo Count Available",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "promo_show",
      header: "Show in List",
      cell: ({ row }) => {
        const [isChecked, setIsChecked] = React.useState<boolean>(
          row.original.promo_show ?? false,
        );

        const handleToggle = async (checked: boolean) => {
          updateMutation.mutate(
            {
              id: row.original.id as string,
              updatedData: { promo_show: checked },
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
      accessorKey: "user_avail",
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
              text={`Are you sure you want to delete this promo (${row.original.promo_name})? This action cannot be undone.`}
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
