import { CustomTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useGetUserById } from "@/lib/api/hooks/user";
import {
  UpdateCarPayload,
  useCars,
  useDeleteCar,
  useUpdateCar,
} from "@/lib/api/hooks/cars";
import DeleteConfirmation from "@/components/deleteConfirmation";

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

type UserInfo = {
  id: string;
  usertype: string;
};

const CarsTable = ({ search }: { search?: string }) => {
  const deleteMutation = useDeleteCar();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { data: cars, isLoading } = useCars(
    userInfo?.usertype ?? "",
    userInfo?.id ?? "",
    search,
  );

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const DriverCell = ({ driverId }: { driverId: string }) => {
    const { data: driver, isLoading } = useGetUserById(driverId);
    if (isLoading) return <span>Loading...</span>;
    return (
      <span>
        {driver?.firstName ?? "N/A"} {driver?.lastName ?? ""}
      </span>
    );
  };

  const ActiveStatusCell = ({ car }: { car: CarType }) => {
    const mutation = useUpdateCar();
    const [isChecked, setIsChecked] = React.useState(car.active);

    const handleToggle = (checked: boolean) => {
      mutation.mutate(
        { id: car.id, updatedData: { active: checked } as UpdateCarPayload },
        {
          onError: () => setIsChecked(!checked),
        },
      );
    };

    return <Switch checked={isChecked} onCheckedChange={handleToggle} />;
  };

  const ApprovedStatusCell = ({ car }: { car: CarType }) => {
    const mutation = useUpdateCar();
    const [isChecked, setIsChecked] = React.useState(car.approved);

    const handleToggle = (checked: boolean) => {
      mutation.mutate(
        { id: car.id, updatedData: { approved: checked } as UpdateCarPayload },
        {
          onError: () => setIsChecked(!checked),
        },
      );
    };

    return <Switch checked={isChecked} onCheckedChange={handleToggle} />;
  };

  const columns: ColumnDef<CarType>[] = [
    {
      accessorKey: "driver",
      header: "Driver",
      cell: ({ getValue }) => (
        <DriverCell driverId={String(getValue() || "")} />
      ),
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
      cell: ({ row }) => <ActiveStatusCell car={row.original} />,
    },
    {
      accessorKey: "approved",
      header: "Approved",
      cell: ({ row }) => <ApprovedStatusCell car={row.original} />,
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
              className="flex w-fit items-center rounded-md border-[1px] border-[#D5D5D5] bg-[#FAFBFD] p-2"
            >
              <Link href={`/cars/${row.original.id}`}>
                <div className="cursor-pointer pr-2">
                  <ArrowRight className="size-4 text-gray-600" />
                </div>
              </Link>

              <DeleteConfirmation
                onClick={() => handleDelete(row.original.id)}
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
              empty="You currently have no registered car"
              data={Array.isArray(cars) ? cars : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CarsTable;
