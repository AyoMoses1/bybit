import { CustomTable } from "@/components/ui/data-table";
import React from "react";
import { ArrowRight, User } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useDeleteUser, useUpdateUser, useUser } from "@/lib/api/hooks/user";
import { formatDate } from "@/utils/formatDate";
import DeleteConfirmation from "@/components/deleteConfirmation";
import Image from "next/image";

type Customer = {
  id: string;
  createdAt: number;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  profile_image?: string;
  approved: boolean;
};

const Customers = ({ search }: { search?: string }) => {
  const mutation = useUpdateUser();

  const deleteMutation = useDeleteUser();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  const [toggleStates, setToggleStates] = React.useState<
    Record<string, boolean>
  >({});

  const handleToggle = (id: string, checked: boolean) => {
    setToggleStates((prev) => ({ ...prev, [id]: checked }));

    mutation.mutate(
      { id, updatedData: { approved: checked } },
      {
        onError: () => setToggleStates((prev) => ({ ...prev, [id]: !checked })),
      },
    );
  };

  const columns: ColumnDef<Customer>[] = [
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
                src={imageUrl}
                alt="Profile"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                <User className="size-5" />
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
        return (
          <Switch
            checked={toggleStates[row.original.id] ?? row.original.approved}
            onCheckedChange={(checked) =>
              handleToggle(row.original.id, checked)
            }
          />
        );
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
              <Link href={`/customer/${row.original.id}`}>
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

  const { data: user, isLoading } = useUser("customer", search);

  const customers: Customer[] = Array.isArray(user)
    ? user.map((user) => ({
        id: user.id,
        createdAt: user.createdAt ? Number(user.createdAt) : Date.now(),
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        mobile: user.mobile || "",
        email: user.email || "",
        profile_image: user.profile_image || "",
        approved: Boolean(user?.approved),
      }))
    : [];

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
            <CustomTable columns={columns} data={customers} />
          </>
        )}
      </div>
    </div>
  );
};

export default Customers;
