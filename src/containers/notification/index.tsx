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
import { AuditAction } from "@/lib/api/apiHandlers/auditService";
import { useAuditLog } from "@/utils/useAuditLog";

interface NotificationsTableProps {
  search: string;
  clickExport?: boolean;
  setClickExport?: (value: boolean) => void;
}

const NotificationsTable = ({ search }: NotificationsTableProps) => {
  const queryClient = useQueryClient();
  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useAllNotifications();
  const { mutate: editNotification } = useEditNotification();
  const { handleAudit } = useAuditLog();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const sortedNotifications = [...notifications].sort(
    (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0),
  );

  const filteredNotifications = sortedNotifications.filter((notification) => {
    if (!search) return true;

    const searchLower = search.toLowerCase();
    return (
      notification.title?.toLowerCase().includes(searchLower) ||
      notification.body?.toLowerCase().includes(searchLower) ||
      notification.devicetype?.toLowerCase().includes(searchLower) ||
      notification.usertype?.toLowerCase().includes(searchLower) ||
      (notification.createdAt &&
        format(new Date(notification.createdAt), "PPP")
          .toLowerCase()
          .includes(searchLower))
    );
  });

  const handleDelete = (notification: AppNotification) => {
    editNotification(
      { notification, method: "Delete" },
      {
        onSuccess: () => {
          // toast.success("Notification deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({ queryKey: ["notifications", "all"] });
          refetch();
          if (handleAudit) {
            handleAudit(
              "Notification",
              notification.id || "",
              AuditAction.DELETE,
              "Deleted notification",
            );
          }
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete notification");
        },
      },
    );
  };

  const formatDeviceType = (type?: string): string => {
    if (!type) return "N/A";

    const lookup: Record<string, string> = {
      All: "All",
      all: "All",
      ANDROID: "Android",
      android: "Android",
      IOS: "iOS",
      ios: "iOS",
    };

    return lookup[type] || type;
  };

  // Format user type for display
  const formatUserType = (type?: string): string => {
    if (!type) return "N/A";

    const lookup: Record<string, string> = {
      customer: "Customer",
      driver: "Driver",
      all: "All",
    };

    return lookup[type] || type;
  };

  const columns: ColumnDef<AppNotification>[] = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ getValue }) => {
        const date = getValue() as number | undefined;
        return date ? format(new Date(date), "PPP") : "N/A";
      },
    },
    {
      accessorKey: "devicetype",
      header: "Device Type",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return formatDeviceType(value);
      },
    },
    {
      accessorKey: "usertype",
      header: "User Type",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return formatUserType(value);
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "body",
      header: "Body",
      cell: ({ getValue }) => getValue() || "N/A",
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
              alt="Delete"
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
    <div className="px-1">
      {isLoading ? (
        <div
          style={{ height: "200px", margin: "0px 90px" }}
          className="flex items-center justify-center"
        >
          <p className="text-sm font-semibold">Loading...</p>
        </div>
      ) : (
        <CustomTable
          columns={columns}
          empty="You currently have no notifications"
          data={filteredNotifications}
        />
      )}
    </div>
  );
};

export default NotificationsTable;
