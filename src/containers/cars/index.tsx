import { CustomTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useGetUserById } from "@/lib/api/hooks/user";
import { useCars, useDeleteCar, useUpdateCar } from "@/lib/api/hooks/cars";
import DeleteConfirmation from "@/components/deleteConfirmation";

const CarsTable = ({ search }: { search?: string }) => {
  const mutation = useUpdateCar();
  const [userInfo, setUserInfo] = useState<any>();
  const { data: cars, isLoading } = useCars(
    userInfo?.usertype,
    userInfo?.id,
    search,
  );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "driver",
      header: "Driver",
      cell: ({ getValue }) => {
        const id = String(getValue() || "");

        const { data: driver, isLoading } = useGetUserById(id);

        if (isLoading) return <span>Loading...</span>;
        if (!driver || Object.keys(driver).length === 0)
          return <span>N/A</span>;

        return (
          <span>
            {driver.firstName ? (
              <>
                {" "}
                {driver.firstName ?? "N/A"} {driver.lastName ?? ""}
              </>
            ) : (
              "N/A"
            )}
          </span>
        );
      },
    },

    {
      accessorKey: "carType",
      header: "Vehicle Type",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "vehicleNumber",
      header: "VRN",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "vehicleMake",
      header: "Vehicle Brand",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "vehicleModel",
      header: "Vehicle Model No",
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "other_info",
      header: "Vehicle Color",
      cell: ({ getValue }) => getValue() || "N/A",
    },

    {
      accessorKey: "active",
      header: "Active Status",
      cell: ({ row }) => {
        const [isChecked, setIsChecked] = React.useState(
          row.original.active ?? false,
        );

        const handleToggle = async (checked: boolean) => {
          mutation.mutate(
            { id: row.original.id, updatedData: { active: checked } },
            {
              onError: () => setIsChecked(!checked),
            },
          );
        };

        return <Switch checked={isChecked} onCheckedChange={handleToggle} />;
      },
    },

    {
      accessorKey: "approved",
      header: "Approved",
      cell: ({ row }) => {
        const [isChecked, setIsChecked] = React.useState(
          row.original.approved ?? false,
        );

        const handleToggle = async (checked: boolean) => {
          mutation.mutate(
            { id: row.original.id, updatedData: { approved: checked } },
            {
              onError: () => setIsChecked(!checked),
            },
          );
        };

        return <Switch checked={isChecked} onCheckedChange={handleToggle} />;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const deleteMutation = useDeleteCar();

        const handleDelete = () => {
          deleteMutation.mutate(row.original.id);
        };

        return (
          <div>
            <div
              style={{
                borderWidth: "1px",
                backgroundColor: "#FAFBFD",
              }}
              className="flex w-fit items-center rounded-md border-[1px] border-[#D5D5D5] bg-[#FAFBFD] p-2"
            >
              <Link href={`/cars/${row.original.id}`}>
                <div className="cursor-pointer pr-2">
                  <ArrowRight className="size-4 text-gray-600" />
                </div>
              </Link>

              <DeleteConfirmation
                onClick={handleDelete}
                text={`Are you sure you want to delete this car (${row.original.vehicleMake})? This action can not be undone`}
              />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = localStorage.getItem("userInfo");
      if (info) {
        setUserInfo(JSON.parse(info));
      }
    }
  }, []);

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
              data={Array.isArray(cars) ? cars : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CarsTable;
