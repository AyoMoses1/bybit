import { C } from "@/components/ui/data-table";
import React, { useState } from "react";
import { ArrowRight, Trash2, User } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import deleteIcon from "../../../assets/svgs/Vector (1).svg";
import Image from "next/image";
import { useUpdateUser, useUser } from "@/store/user/user";
import { formatDate } from "@/utils/formatDate";

const Drivers = ({ search }: { search?: string }) => {
  const mutation = useUpdateUser();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ getValue }) => formatDate(Number(getValue())),
    },
    {
      accessorKey: "firstName",
      header: "First Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "mobile",
      header: "Mobile Number",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "profile_image",
      header: "Profile Image",
      cell: ({ getValue }) => {
        const imageUrl = String(getValue() || "");
        return (
          <>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                <User className="size-4" />
              </div>
            )}
          </>
        );
      },
    },

    {
      accessorKey: "approved",
      header: "Active Status",
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
      cell: ({ row }) => (
        <div>
          <div
            style={{
              borderWidth: "1px",
              backgroundColor: "#FAFBFD",
            }}
            className="flex w-fit items-center rounded-md border-[1px] border-[#D5D5D5] bg-[#FAFBFD] p-2"
          >
            <Link href={`/driver/${row.original.id}`}>
              <div className="cursor-pointer pr-2">
                <ArrowRight className="size-4 text-gray-600" />
              </div>
            </Link>
            <div className="cursor-pointer border-l border-l-[#979797] px-2">
              <Image
                src={deleteIcon}
                alt="Delete Icon"
                width={10}
                height={10}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const { data: user, isLoading } = useUser("driver", search);

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
            <C columns={columns} data={Array.isArray(user) ? user : []} />
          </>
        )}
      </div>
    </div>
  );
};

export default Drivers;
