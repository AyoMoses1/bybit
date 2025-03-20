import React, { useState, useEffect } from "react";
import { ArrowRight, X, SearchIcon, Download } from "lucide-react";
import { CustomTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/utils/formatDate";
import { Input } from "@/components/ui/input";
import { useBookings } from "@/lib/api/hooks/useBooking";

interface BookingHistoryTableProps {
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

  // Load user info on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Try finding user info in both possible storage keys
        let user = null;
        const storedUser = localStorage.getItem("user");
        const storedUserInfo = localStorage.getItem("userInfo");

        if (storedUser) {
          user = JSON.parse(storedUser);
          console.log("Found user info in 'user':", user);
        } else if (storedUserInfo) {
          user = JSON.parse(storedUserInfo);
          console.log("Found user info in 'userInfo':", user);
        }

        if (user) {
          setUserInfo({
            id: user.id,
            usertype: user.usertype || "customer",
          });
        } else {
          console.warn(
            "No user found in localStorage, using default test user",
          );
          // Set a default test user if needed
          setUserInfo({
            id: "testUserId123",
            usertype: "customer",
          });
        }
      } catch (e) {
        console.error("Error getting user from localStorage:", e);
      }
    }
  }, []);

  const { data: bookings, isLoading: bookingsLoading } = useBookings(
    userInfo?.id || "",
    userInfo?.usertype || "",
    searchQuery,
  );

  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange?.(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearchChange?.("");
  };

  // Export to CSV function
  const exportToCSV = () => {
    if (!bookings || bookings.length === 0) return;

    // Create CSV content
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
          formatDate(booking.bookingDate) || "",
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

    // Create and download CSV file
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
            bgColor = "bg-red-100";
            textColor = "text-red-500";
            break;
          case "COMPLETE":
          case "COMPLETED":
            bgColor = "bg-green-100";
            textColor = "text-green-500";
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
            bgColor = "bg-green-100";
            textColor = "text-green-500";
            break;
          case "PICKEDUP":
            bgColor = "bg-blue-100";
            textColor = "text-blue-500";
            break;
          case "ARRIVED":
            bgColor = "bg-amber-100";
            textColor = "text-amber-600";
            break;
          case "PAID":
            bgColor = "bg-green-100";
            textColor = "text-green-500";
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
          <span className="font-medium">
            {row.original.trip_cost ? `CFA ${row.original.trip_cost}` : "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const booking = row.original;

        return (
          <div className="flex w-full">
            <div className="grid w-full grid-cols-2 overflow-hidden rounded-md border border-gray-300">
              <button
                className="flex items-center justify-center border-r border-gray-200 p-2 hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Cancel clicked for booking:", booking.id);
                  if (onCancelBooking) {
                    onCancelBooking(booking);
                  }
                }}
              >
                <X size={20} className="text-red-500" />
              </button>
              <button
                className="flex items-center justify-center p-2 hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("View details clicked for booking:", booking.id);
                  if (onViewDetails) {
                    onViewDetails(booking);
                  }
                }}
              >
                <ArrowRight size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h2 className="mb-6 pl-4 text-2xl font-semibold text-gray-800">
        Booking History
      </h2>

      <div className="mb-6 flex items-center justify-end">
        <div className="relative flex items-center overflow-hidden rounded-full border border-gray-200 bg-white">
          <Input
            placeholder="Search in table..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border-none pl-10 pr-12 shadow-none focus:ring-0"
          />

          <div className="pointer-events-none absolute left-3">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>

          {searchQuery && (
            <button
              className="absolute right-10 flex items-center"
              onClick={handleClearSearch}
            >
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <div className="flex h-full items-center justify-center border-l border-gray-200 px-3">
          <button
            onClick={exportToCSV}
            className="text-gray-500"
            disabled={!bookings || bookings.length === 0}
            title="Export to CSV"
          >
            <Download size={26} />
          </button>
        </div>
      </div>

      {isLoading || bookingsLoading ? (
        <div className="flex h-40 items-center justify-center rounded-md bg-white shadow">
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      ) : (
        <CustomTable columns={columns} data={bookings || []} />
      )}
    </div>
  );
};

export default BookingHistoryTable;
