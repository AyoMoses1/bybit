import { CustomTable } from "@/components/ui/data-table";
import React from "react";
import { ArrowRight, User } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import Image from "next/image";
import { useDeleteUser, useUpdateUser, useUser } from "@/lib/api/hooks/user";
import { formatDate } from "@/utils/formatDate";
import DeleteConfirmation from "@/components/deleteConfirmation";

interface FleetAdminUser {
  id: string;
  createdAt?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  profile_image?: string;
  approved?: boolean;
}

const FleetAdmin = ({ search }: { search?: string }) => {
  const deleteMutation = useDeleteUser();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const ActiveStatusToggle = ({ user }: { user: FleetAdminUser }) => {
    const [isChecked, setIsChecked] = React.useState(user.approved);
    const mutation = useUpdateUser();

    const handleToggle = async (checked: boolean) => {
      mutation.mutate(
        { id: user.id, updatedData: { approved: checked } },
        {
          onError: () => setIsChecked(!checked),
        },
      );
    };

    return <Switch checked={isChecked} onCheckedChange={handleToggle} />;
  };

  const columns: ColumnDef<FleetAdminUser>[] = [
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
              <Image
                width={32}
                height={32}
                src={imageUrl}
                alt="Profile"
                className="h-8 w-8 rounded-full"
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
        return <ActiveStatusToggle user={row.original} />;
      },
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
              <Link href={`/update-fleet-admin/${row.original.id}`}>
                <div className="px-1 py-2">
                  <ArrowRight className="size-4 text-gray-600" />
                </div>
              </Link>
              {/* Divider */}
              <div className="h-8 w-[1px] translate-y-0 bg-[#979797]" />
              <div className="px-1 py-2">
                <DeleteConfirmation
                  onClick={() => handleDelete(row.original.id)}
                  text={`Are you sure you want to delete this user (${row.original.firstName + " " + row.original.lastName})? This action can not be undone`}
                />
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const { data: user, isLoading } = useUser("fleetadmin", search);

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
              data={Array.isArray(user) ? user : []}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FleetAdmin;
