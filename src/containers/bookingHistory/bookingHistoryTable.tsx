import React, { useState, useEffect } from "react";
import { ArrowRight, X, Banknote, Car, SearchIcon } from "lucide-react";
import { CustomTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookings } from "@/lib/api/hooks/useBooking";

interface BookingHistoryTableProps {
  data?: any[];
  search?: string;
  onSearchChange?: (search: string) => void;
  onCancelBooking?: (booking: any) => void;
  onSelectBid?: (booking: any) => void;
  onViewDetails?: (booking: any) => void;
  isLoading?: boolean;
}

const BookingHistoryTable: React.FC<BookingHistoryTableProps> = ({
  search = "",
  onSearchChange,
  onCancelBooking,
  onSelectBid,
  onViewDetails,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(search);
  const [userInfo, setUserInfo] = useState<{
    id: string;
    usertype: string;
  } | null>(null);

  //   const { data } = useBookings("userId", "userType", searchQuery);
  const { data: bookings } = useBookings(
    userInfo?.usertype || "",
    userInfo?.id || "",
  );
  // For debugging
  //   useEffect(() => {
  //     console.log("Data received in table:", data);
  //   }, [data]);

  // Update local search state if prop changes
  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange?.(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    onSearchChange?.("");
  };

  // Format currency
  //   const formatCurrency = (amount: number | string): string => {
  //     if (!amount) return "N/A";
  //     return `$${Number(amount).toFixed(2)}`;
  //   };

  const columns: ColumnDef<any>[] = [
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
      cell: ({ row }) => formatDate(row.original.bookingDate) || "N/A",
    },
    {
      accessorKey: "driver_name",
      header: "Driver Name",
      cell: ({ row }) => {
        const driverName = row.original.driver_name;
        return driverName ? (
          <div className="flex items-center gap-2">
            {row.original.driver_image ? (
              <img
                src={row.original.driver_image}
                alt={driverName}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs">
                {driverName.charAt(0)}
              </div>
            )}
            <span>{driverName}</span>
          </div>
        ) : (
          <span className="italic text-gray-500">Not assigned</span>
        );
      },
    },
    {
      accessorKey: "carType",
      header: "Vehicle Type",
      cell: ({ row }) => row.original.carType || "N/A",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        // Make sure status is a string, not an object
        const status = row.getValue("status");

        // Safety check for status
        if (!status || typeof status !== "string") {
          return <span>N/A</span>;
        }

        // Determine the status style
        let bgColor = "bg-gray-100";
        let textColor = "text-gray-800";

        switch (status.toUpperCase()) {
          case "NEW":
            bgColor = "bg-indigo-100";
            textColor = "text-indigo-700";
            break;
          case "CANCELLED":
            bgColor = "bg-red-200";
            textColor = "text-red-400";
            break;
          case "COMPLETE":
            bgColor = "bg-green-500";
            textColor = "text-white";
            break;
          case "ACCEPTED":
            bgColor = "bg-blue-100";
            textColor = "text-blue-700";
            break;
          case "STARTED":
            bgColor = "bg-yellow-100";
            textColor = "text-yellow-800";
            break;
          case "REACHED":
            bgColor = "bg-green-500";
            textColor = "text-white";
            break;
          case "PICKEDUP":
            bgColor = "bg-blue-500";
            textColor = "text-white";
            break;
          case "ARRIVED":
            bgColor = "bg-amber-700";
            textColor = "text-white";
            break;
          case "PAID":
            bgColor = "bg-green-100";
            textColor = "text-green-800";
            break;
        }

        return (
          <span
            className={`${bgColor} ${textColor} rounded-full px-3 py-1 font-medium`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "trip_cost",
      header: "Trip Cost",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {/* <Banknote size={16} className="text-gray-500" /> */}
          <span className="font-medium">{row.original.trip_cost}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const booking = row.original;
        const status = booking.status?.toUpperCase() || "";

        const hasBids =
          status === "NEW" &&
          booking.driverOffers &&
          Object.keys(booking.driverOffers || {}).length > 0;
        const canCancel = status === "NEW" || status === "ACCEPTED";

        return (
          <div className="flex space-x-2">
            {/* Bid button */}
            {hasBids && (
              <Button
                variant="outline"
                size="sm"
                className="p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectBid) {
                    onSelectBid(booking);
                  }
                }}
                title="Select Bid"
              >
                <Banknote size={16} />
              </Button>
            )}

            {/* Cancel button */}
            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                className="p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onCancelBooking) {
                    onCancelBooking(booking);
                  }
                }}
                title="Cancel Booking"
              >
                <X size={16} />
              </Button>
            )}

            {/* View details button */}
            <Button
              variant="outline"
              size="sm"
              className="p-2"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) {
                  onViewDetails(booking);
                }
              }}
              title="View Details"
            >
              <ArrowRight size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-end pb-4">
        <div className="relative w-64">
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="rounded-full pl-9 pr-8"
          />
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <SearchIcon className="h-4 w-4 text-gray-400" />
          </div>
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={handleClearSearch}
            >
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <CustomTable columns={columns} data={bookings || []} />
    </div>
  );
};

export default BookingHistoryTable;
