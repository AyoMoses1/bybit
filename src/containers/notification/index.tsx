"use client";
import { CustomTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  useAllNotifications,
  useEditNotification,
} from "@/lib/api/hooks/useNotification";
import { AppNotification } from "@/lib/api/apiHandlers/notificationService";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import deleteIcon from "../../assets/svgs/Vector (1).svg";
import Image from "next/image";
import { useEffect } from "react";

interface NotificationsTableProps {
  search: string;
}

export default function NotificationsTable({
  search,
}: NotificationsTableProps) {
  const queryClient = useQueryClient();
  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useAllNotifications();
  const { mutate: editNotification } = useEditNotification();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    console.log("Current notifications:", notifications);
  }, [notifications]);

  const sortedNotifications = [...notifications].sort(
    (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0),
  );

  const filteredNotifications = sortedNotifications.filter((notification) => {
    const searchLower = search.toLowerCase();

    return (
      notification.title?.toLowerCase().includes(searchLower) ||
      notification.body?.toLowerCase().includes(searchLower) ||
      notification.devicetype?.toLowerCase().includes(searchLower) ||
      notification.usertype?.toLowerCase().includes(searchLower) ||
      (notification.createdAt &&
        format(new Date(notification.createdAt), "PPPpp")
          .toLowerCase()
          .includes(searchLower))
    );
  });

  const handleDelete = (notification: AppNotification) => {
    editNotification(
      { notification, method: "Delete" },
      {
        onSuccess: () => {
          // Invalidate both query keys
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({ queryKey: ["notifications", "all"] });
          // Force a refetch
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || "Delete Failed");
        },
      },
    );
  };

  const columns: ColumnDef<AppNotification>[] = [
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ getValue }) => {
        const date = getValue() as number | undefined;
        return date ? format(new Date(date), "PPPpp") : "N/A";
      },
    },
    {
      accessorKey: "devicetype",
      header: "Device Type",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const lookup: Record<string, string> = {
          All: "All",
          all: "All",
          ANDROID: "Android",
          android: "Android",
          IOS: "iOS",
          ios: "iOS",
        };
        return (
          <div className="pr-12 text-center text-sm text-gray-600">
            {value ? lookup[value] || value : "--"}
          </div>
        );
      },
    },
    {
      accessorKey: "usertype",
      header: "User Type",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const lookup: Record<string, string> = {
          customer: "Customer",
          driver: "Driver",
        };
        return (
          <div className="pr-16 text-center text-sm text-gray-600">
            {value ? lookup[value] || value : "--"}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: () => (
        <div className="pr-20 text-center text-sm font-semibold">Title</div>
      ),
    },
    {
      accessorKey: "body",
      header: () => (
        <div className="pr-20 text-center text-sm font-semibold">Body</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            className="flex h-9 w-11 items-center justify-center rounded-lg border border-gray-300 p-0"
            onClick={() => handleDelete(row.original)}
          >
            <Image
              src={deleteIcon}
              alt="Delete Icon"
              width={10}
              height={10}
              className="object-contain"
            />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="px-5">
      {isLoading ? (
        <div className="flex justify-center p-8">Loading notifications...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex justify-center p-8">No notifications found</div>
      ) : (
        <CustomTable columns={columns} data={filteredNotifications} />
      )}
    </div>
  );
}
