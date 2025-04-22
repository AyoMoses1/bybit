import { CustomTable } from "@/components/ui/data-table";
import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import DeleteConfirmation from "@/components/deleteConfirmation";
import { AuditAction } from "@/lib/api/apiHandlers/auditService";
import { useAuditLog } from "@/utils/useAuditLog";
import Papa from "papaparse";
import {
  useDeletePromo,
  usePromos,
  useUpdatePromo,
} from "@/lib/api/hooks/usePromo";
import { formatDate } from "@/utils/formatDate";
import { PromoData } from "@/lib/api/apiHandlers/promoService";
import toast from "react-hot-toast";

const PromosTable = ({
  search,
  clickExport,
  setClickExport,
}: {
  search?: string;
  clickExport?: boolean;
  setClickExport: (value: boolean) => void;
}) => {
  const deleteMutation = useDeletePromo();
  const { handleAudit } = useAuditLog();

  const { data: promos, isLoading } = usePromos(search);

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
    handleAudit(
      "Promos",
      id,
      AuditAction.DELETE,
      `Delete promo with id - ${id}`,
    );
  };

  const ActiveStatusCell = ({
    promos,
    usageLimit,
  }: {
    promos: PromoData;
    usageLimit: number;
  }) => {
    const mutation = useUpdatePromo();
    const [isChecked, setIsChecked] = React.useState(promos.promo_show);

    const handleToggle = (checked: boolean) => {
      const now = new Date();
      const promoValidity = promos.promo_validity
        ? new Date(promos.promo_validity)
        : null;
      const isExpired = promoValidity && promoValidity <= now;
      if (isExpired) {
        toast.error("This promo has expired");
        return;
      }

      if (usageLimit < 1) {
        toast.error("This promo has been exhausted");
      } else {
        mutation.mutate(
          { id: promos.id, updatedData: { promo_show: checked } },
          {
            onError: () => setIsChecked(!checked),
            onSuccess: () => {
              handleAudit(
                "Promos",
                promos.id,
                AuditAction.UPDATE,
                `Update promo show status to ${checked}`,
              );
            },
          },
        );
      }
    };

    return <Switch checked={isChecked} onCheckedChange={handleToggle} />;
  };

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
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "promo_validity",
      header: "End Date",
      cell: ({ getValue }) => formatDate(Number(getValue())),
    },
    {
      accessorKey: "promo_usage_limit",
      header: "Promo Count Available",
      cell: ({ getValue }) => getValue() || "0",
    },
    {
      accessorKey: "promo_show",
      header: "Show in List",
      cell: ({ row }) => (
        <ActiveStatusCell
          promos={row.original}
          usageLimit={row.original.promo_usage_limit}
        />
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div>
            <div
              style={{
                borderWidth: "1px",
                backgroundColor: "#FAFBFD",
              }}
              className="relative flex w-fit cursor-pointer items-center justify-between gap-3 rounded-md border-[0.6px] border-[#D5D5D5] bg-[#FAFBFD] px-2"
            >
              <Link href={`/update-promo/${row.original.id}`}>
                <div className="px-1 py-2">
                  <ArrowRight className="size-4 text-gray-600" />
                </div>
              </Link>
              {/* Divider */}
              <div className="h-8 w-[1px] translate-y-0 bg-[#979797]" />
              <div className="px-1 py-2">
                <DeleteConfirmation
                  onClick={() => handleDelete(row.original.id)}
                  iconStylesWidth={search ? 10 : 12}
                  iconStylesHeight={search ? 10 : 12}
                  text={`Are you sure you want to delete this promo (${row.original.promo_name})? This action can not be undone`}
                />
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const exportToCSV = (data: PromoData[]) => {
    const csvData = data.map((item) => ({
      ID: item.id || "N/A",
      "Promo Name": item.promo_name || "N/A",
      Code: item.promo_code || "N/A",
      Description: item.promo_description || "N/A",
      Type: item.promo_discount_type || "N/A",
      "Promo Value": item.promo_discount_value || "N/A",
      "Max Discount Allowed": item.max_promo_discount_value || "N/A",
      "Minimum Order Value": item.min_order || "N/A",
      "End Date": formatDate(Number(item.promo_validity)),
      "Promo Count Available": item.promo_usage_limit || "N/A",
      "Show in List": item.promo_show ? "Active" : "Inactive",
      "Used by Count": item.user_avail || "0",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "promos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (clickExport) {
      exportToCSV(promos as PromoData[]);
      handleAudit("Promos", "", AuditAction.EXPORT, "Exported Promo History");
      setClickExport(false);
    }
  }, [clickExport, promos, handleAudit, setClickExport]);

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
              empty="You currently have no promo registered"
              data={Array.isArray(promos) ? promos : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PromosTable;
