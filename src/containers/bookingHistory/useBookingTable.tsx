import { useState, useEffect } from "react";
import { useBookings } from "@/lib/api/hooks/useBooking";
import { formatDate } from "@/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import { Booking } from "../bookingDetail/bookingTypes";
import StatusBadge from "../bookingDetail/statusBadge";
import ActionButtons from "../../components/ui/actionButtons";
import useUserInfo from "./useUserInfo";

export const useBookingTableData = (
  initialSearch: string = "",
  onSearchChange?: (search: string) => void,
  onCancelBooking?: (booking: Booking) => void,
  onViewDetails?: (booking: Booking) => void,
) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const { userInfo } = useUserInfo();

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  const { data: bookings, isLoading: bookingsLoading } = useBookings(
    userInfo?.id || "",
    userInfo?.usertype || "",
    searchQuery,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange?.(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearchChange?.("");
  };

  const exportToCSV = () => {
    if (!bookings || bookings.length === 0) return;

    const headers = [
      "Reference",
      "Booking Date",
      "Driver Name",
      "Vehicle Type",
      "Status",
      "Trip Cost",
    ];

    const csvRows = [
      headers.join(","),
      ...bookings.map((booking) => {
        return [
          booking.id || "",
          formatDate(booking.bookingDate ? Number(booking.bookingDate) : 0) ||
            "",
          booking.driver_name || "",
          booking.carType || "",
          booking.status || "",
          booking.trip_cost ? `CFA ${booking.trip_cost}` : "",
        ]
          .map((value) => `"${value}"`)
          .join(",");
      }),
    ];

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "booking_history.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Reference",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("id") || "N/A"}</span>
      ),
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ row }) => formatDate(Number(row.original.bookingDate)) || "N/A",
    },
    {
      accessorKey: "driver_name",
      header: "Driver Name",
      cell: ({ row }) => row.original.driver_name || "N/A",
    },
    {
      accessorKey: "carType",
      header: "Vehicle Type",
      cell: ({ row }) => row.original.carType || "N/A",
    },
    {
      accessorKey: "status",
      header: "Booking Status",
      cell: ({ row }) => (
        <StatusBadge status={row.getValue("status") as string} />
      ),
    },
    {
      accessorKey: "trip_cost",
      header: "Trip Cost",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {row.original.trip_cost ? `CFA ${row.original.trip_cost}` : "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <ActionButtons
          booking={row.original}
          onCancelBooking={onCancelBooking}
          onViewDetails={onViewDetails}
        />
      ),
    },
  ];

  return {
    searchQuery,
    setSearchQuery,
    bookings,
    bookingsLoading,
    columns,
    handleSearchChange,
    handleClearSearch,
    exportToCSV,
    userInfo,
  };
};
