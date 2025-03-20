"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import BookingHistoryTable from "@/containers/bookingHistory/bookingHistoryTable";
import useUserInfo from "@/containers/bookingHistory/useUserInfo";
import useBookingActions from "@/containers/bookingHistory/useBookingActions";

const BookingHistoryPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const { userInfo } = useUserInfo();
  const { search, handleSearchChange, handleCancelBooking, handleViewDetails } =
    useBookingActions(userInfo, toast, router);

  return (
    <div className="container py-4">
      <BookingHistoryTable
        search={search}
        onSearchChange={handleSearchChange}
        onCancelBooking={handleCancelBooking}
        onViewDetails={handleViewDetails}
        isLoading={false}
      />
    </div>
  );
};

export default ProtectedRoute(BookingHistoryPage);
