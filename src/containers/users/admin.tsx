import { C } from "@/components/ui/data-table";
import React from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

const Admin = () => {
  const handleStatusChange = (rowData: any, isActive: any) => {
    console.log(
      `User: ${rowData.FirstName}, Status: ${isActive ? "Active" : "Inactive"}`,
    );
    // TODO: Send update request to API
  };

  const handleDelete = (rowData: number) => {
    console.log(`Deleting user: ${rowData}`);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "FirstName",
      header: "First Name",
    },
    {
      accessorKey: "LastName",
      header: "Last Name",
    },
    {
      accessorKey: "MobileNumber",
      header: "Mobile",
    },
    {
      accessorKey: "Email",
      header: "Email",
    },
    {
      accessorKey: "ProfileImage",
      header: "Profile",
      cell: ({ getValue }) => {
        const imageUrl = String(getValue() || "https://via.placeholder.com/40");
        return (
          <img src={imageUrl} alt="Profile" className="h-8 w-8 rounded-full" />
        );
      },
    },

    {
      accessorKey: "ActiveStatus",
      header: "Active Status",
      cell: ({ row }) => (
        <Switch
          checked={row.original.ActiveStatus === "Active"}
          onCheckedChange={(checked) =>
            handleStatusChange(row.original, checked)
          }
        />
      ),
    },
    {
      accessorKey: "Actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center rounded-md border-[0.4px] border-[#979797] bg-[#FAFBFD] p-2">
          <Link href="/update-admin">
            <div className="pr-2">
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </div>
          </Link>
          <div className="border-l border-l-[#979797] px-2">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
        </div>
      ),
    },
  ];

  const data = [
    {
      FirstName: "Alice",
      LastName: "Johnson",
      MobileNumber: "123-456-7890",
      Email: "alice.johnson@example.com",
      ProfileImage: "https://randomuser.me/api/portraits/women/1.jpg",
      ActiveStatus: true,
      Actions: "",
    },
    {
      FirstName: "Bob",
      LastName: "Smith",
      MobileNumber: "987-654-3210",
      Email: "bob.smith@example.com",
      ProfileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      ActiveStatus: false,
      Actions: "",
    },
  ];
  return (
    <div>
      {" "}
      <C columns={columns} data={data} />
    </div>
  );
};

export default Admin;
