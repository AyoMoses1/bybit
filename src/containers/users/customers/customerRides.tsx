import { CustomTable } from "@/components/ui/data-table";
import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useUsersRide } from "@/lib/api/hooks/user";
import { formatDate } from "@/utils/formatDate";
import SearchComponent from "@/components/SearchComponent";

const CustomersRides = ({ id }: { id: string | string[] }) => {
  const userId = Array.isArray(id) ? id[0] : id;
  const { data: usersRide, isLoading } = useUsersRide(userId ?? "", "customer");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRides = useMemo(() => {
    return (Array.isArray(usersRide) ? usersRide : []).filter((ride: any) => {
      const pickup = ride.pickupAddress?.toLowerCase() || "";
      const drop = ride.dropAddress?.toLowerCase() || "";
      const status = ride.status?.toLowerCase() || "";
      const reference = ride.reference?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return (
        pickup.includes(search) ||
        drop.includes(search) ||
        status.includes(search) ||
        reference.includes(search)
      );
    });
  }, [usersRide, searchTerm]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "status",
      header: "Booking Status",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <span
            className={`badge capitalize ${
              value === "COMPLETE"
                ? "badge-success"
                : value === "CANCELLED"
                  ? "badge-error"
                  : ""
            }`}
          >
            {value || "N/A"}
          </span>
        );
      },
    },
    {
      accessorKey: "reference",
      header: "Booking Reference",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ getValue }) => formatDate(Number(getValue())),
    },
    {
      accessorKey: "pickupAddress",
      header: "Pickup Address",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "dropAddress",
      header: "Drop Address",
      cell: ({ getValue }) => getValue() || "N/A",
    },
  ];

  return (
    <div className="px-1">
      <div className="z-90 absolute right-3 top-[-60px] flex items-center gap-4">
        <SearchComponent
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
          <>
            {" "}
            <CustomTable
              columns={columns}
              data={Array.isArray(filteredRides) ? filteredRides : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CustomersRides;
