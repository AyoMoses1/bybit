import { useState, useEffect, useMemo } from "react";
import { useBookings } from "@/lib/api/hooks/useBooking";
import { formatDate } from "@/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import { Booking } from "../bookingDetail/bookingTypes";
import StatusBadge from "../bookingDetail/statusBadge";
import ActionButtons from "../../components/ui/actionButtons";
import useUserInfo from "./useUserInfo";
import { debounce } from "lodash";

export const useBookingTableData = (
  initialSearch: string = "",
  onSearchChange?: (search: string) => void,
  onCancelBooking?: (booking: Booking) => void,
  onViewDetails?: (booking: Booking) => void,
) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [inputValue, setInputValue] = useState(initialSearch);
  const { userInfo } = useUserInfo();

  const { data: allBookings, isLoading: bookingsLoading } = useBookings(
    userInfo?.id || "",
    userInfo?.usertype || "",
  );

  const filteredBookings = useMemo(() => {
    if (!allBookings) return [];
    if (!searchQuery) return allBookings;

    const searchLower = searchQuery.toLowerCase();
    return allBookings.filter((booking) => {
      const fieldsToSearch = [
        booking.id,
        booking.reference,
        booking.pickupAddress,
        booking.dropAddress,
        booking.status,
        booking.driver_name,
        booking.carType,
        booking.trip_cost?.toString(),
      ];

      return fieldsToSearch.some((field) =>
        field?.toLowerCase().includes(searchLower),
      );
    });
  }, [allBookings, searchQuery]);

  const transformedBookings = useMemo(() => {
    return filteredBookings.map((booking) => {
      return {
        id: booking.id,
        pickupAddress: booking.pickupAddress || "",
        dropAddress: booking.dropAddress || "",
        discount: booking.discount || 0,
        cashPaymentAmount: booking.cashPaymentAmount || 0,
        cardPaymentAmount: booking.cardPaymentAmount || 0,
        bookingDate: booking.bookingDate,
        status: booking.status,
        driver_name: booking.driver_name,
        carType: booking.carType,
        driver: booking.driver,
        pickup_image: booking.pickup_image,
        deliver_image: booking.deliver_image,
        reason: booking.reason,
        cancelledBy: booking.cancelledBy,
        reference: booking.reference,
        trip_cost: booking.trip_cost,
      };
    });
  }, [filteredBookings]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        onSearchChange?.(value);
      }, 300),
    [onSearchChange],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    onSearchChange?.("");
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    setInputValue(initialSearch);
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  const exportToCSV = () => {
    if (!transformedBookings || transformedBookings.length === 0) return;

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
      ...transformedBookings.map((booking) => {
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
    searchQuery: inputValue,
    setSearchQuery,
    bookings: transformedBookings,
    bookingsLoading,
    columns,
    handleSearchChange,
    handleClearSearch,
    exportToCSV,
    userInfo,
  };
};
