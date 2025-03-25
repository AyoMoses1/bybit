import React from "react";
import { CustomTable } from "@/components/ui/data-table";
import ExportButton from "../../components/ui/exportButton";
import { useBookingTableData } from "./useBookingTable";
import { LoadingState } from "../bookingDetail/loadingError";
import { BookingHistoryTableProps } from "../bookingDetail/bookingTypes";
import SearchComponent from "@/components/SearchComponent";

const BookingHistoryTable: React.FC<BookingHistoryTableProps> = ({
  search = "",
  onSearchChange,
  onCancelBooking,
  onViewDetails,
  isLoading: externalLoading = false,
}) => {
  const {
    searchQuery,
    bookings,
    bookingsLoading,
    columns,
    handleSearchChange,
    exportToCSV,
  } = useBookingTableData(
    search,
    onSearchChange,
    onCancelBooking,
    onViewDetails,
  );

  return (
    <div>
      <h2 className="mb-6 pl-4 text-2xl font-semibold text-gray-800">
        Booking History
      </h2>

      <div className="mb-6 flex items-center justify-end">
        <SearchComponent value={searchQuery} onChange={handleSearchChange} />
        <ExportButton
          exportToCSV={exportToCSV}
          disabled={!bookings || bookings.length === 0}
        />
      </div>

      {externalLoading || bookingsLoading ? (
        <LoadingState />
      ) : (
        <CustomTable columns={columns} data={bookings || []} />
      )}
    </div>
  );
};

export default BookingHistoryTable;
