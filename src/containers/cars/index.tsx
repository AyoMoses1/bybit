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
import { AuditAction } from "@/lib/api/apiHandlers/auditService";
import { useAuditLog } from "@/utils/useAuditLog";
import Papa from "papaparse";
import toast from "react-hot-toast";

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

const CarsTable = ({
  search,
  clickExport,
  setClickExport,
}: {
  search?: string;
  clickExport?: boolean;
  setClickExport: (value: boolean) => void;
}) => {
  const deleteMutation = useDeleteCar();
  const { handleAudit } = useAuditLog();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { data: cars, isLoading } = useCars(
    userInfo?.usertype ?? "",
    userInfo?.id ?? "",
    search,
  );

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
    handleAudit("Cars", id, AuditAction.DELETE, `Delete car with id - ${id}`);
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

  const ActiveStatusCell = ({
    car,
    driver,
    approved,
  }: {
    car: CarType;
    driver: string;
    approved: boolean;
  }) => {
    const mutation = useUpdateCar();
    const [isChecked, setIsChecked] = React.useState(car.active);

    const filteredData = cars?.filter((car) => car.driver === driver);

    const handleToggle = (checked: boolean) => {
      const editedData = filteredData?.find((item) => item.active === true);

      if (approved === false) {
        return toast.error("Kindly approve this driver's car to make changes");
      }

      if (checked && editedData) {
        toast.error(
          "This driver currently has an active car. Kindly make previous car inactive to continue",
          {
            style: {
              width: "600px",
            },
          },
        );
        return;
      }

      setIsChecked(!checked);

      mutation.mutate(
        { id: car.id, updatedData: { active: checked } as UpdateCarPayload },
        {
          onError: () => setIsChecked(!checked),
          onSuccess: () => {
            handleAudit(
              "Cars",
              car.id,
              AuditAction.UPDATE,
              `Update active status to ${checked}`,
            );
            toast.success("Updated details successfully");
          },
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
          onSuccess: () => {
            handleAudit(
              "Cars",
              car.id,
              AuditAction.UPDATE,
              `Update approval status to ${checked}`,
            );
            toast.success("Updated details successfully");
          },
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
      cell: ({ row }) => (
        <ActiveStatusCell
          car={row.original}
          driver={row.original.driver ?? ""}
          approved={row.original.approved ?? false}
        />
      ),
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
              className="relative flex w-fit cursor-pointer items-center justify-between gap-3 rounded-md border-[0.6px] border-[#D5D5D5] bg-[#FAFBFD] px-2"
            >
              <Link href={`/cars/${row.original.id}`}>
                <div className="px-1 py-2">
                  <ArrowRight className="size-4 text-gray-600" />
                </div>
              </Link>
              {/* Divider */}
              <div className="h-8 w-[1px] translate-y-0 bg-[#979797]" />
              <div className="px-1 py-2">
                <DeleteConfirmation
                  onClick={() => handleDelete(row.original.id)}
                  text={`Are you sure you want to delete this car (${row.original.vehicleMake})? This action can not be undone`}
                />
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  console.log(cars);

  const exportToCSV = (data: CarType[]) => {
    const csvData = data.map((item) => ({
      ID: item.id || "N/A",
      driver: item.driver || "N/A",
      "Vehicle Type": item.carType || "N/A",
      VRN: item.vehicleNumber || "N/A",
      "Vehicle Brand": item.vehicleMake || "N/A",
      "Vehicle Model No": item.vehicleModel || "N/A",
      "Vehicle Color": item.other_info || "N/A",
      "Active Status": item.active ? "Active" : "Inactive",
      Approved: item.approved ? "Approved" : "Pending Approval",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "cars.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (clickExport) {
      exportToCSV(cars as CarType[]);
      handleAudit("Cars", "", AuditAction.EXPORT, "Exported Cars History");
      setClickExport(false);
    }
  }, [clickExport, cars, handleAudit, setClickExport]);

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
