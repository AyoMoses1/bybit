import { C } from "@/components/ui/data-table";
import React, { useState } from "react";
import { ArrowRight, Trash2, User } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import deleteIcon from "../../../assets/svgs/Vector (1).svg";
import Image from "next/image";
import { useUpdateUser, useUser, useUsersRide } from "@/store/user/user";

const CustomersRides = ({ id }: { id: string | string[] }) => {
  const userId = Array.isArray(id) ? id[0] : id;
  const { data: rides, isLoading } = useUsersRide(userId ?? "");

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "bookingStatus",
      header: "Booking Status",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "bookingReference",
      header: "Booking Reference",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ getValue }) => getValue() || "N/A",
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

  console.log(rides);

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
            <C columns={columns} data={Array.isArray(rides) ? rides : []} />
          </>
        )}
      </div>
    </div>
  );
};

export default CustomersRides;
