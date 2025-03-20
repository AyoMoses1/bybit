"use client";
import React, { useState, useEffect } from "react";
import { useCancelBooking } from "@/lib/api/hooks/useBooking";
import { useUsersRide } from "@/lib/api/hooks/user";
import BookingHistoryTable from "@/containers/bookingHistory/bookingHistoryTable";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/HOC/ProtectedRoute";

const BookingHistoryPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Get user info from localStorage
  const [userInfo, setUserInfo] = useState<{
    id: string;
    usertype: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = localStorage.getItem("userInfo");
      if (info) {
        setUserInfo(JSON.parse(info));
      }
    }
  }, []);

  // Fetch bookings with the user info
  //   const {
  //     data: bookings,
  //     isLoading,
  //     error,
  //     refetch,
  //   } = useUsersRide(userInfo?.id || "", userInfo?.usertype || "");

  // Debug logs
  //   useEffect(() => {
  //     console.log("Current user info:", userInfo);
  //     console.log("Bookings loading state:", isLoading);

  //     if (error) {
  //       console.error("Error fetching bookings:", error);
  //     }

  //     if (bookings) {
  //       console.log("Fetched bookings:", bookings);
  //     }
  //   }, [userInfo, isLoading, bookings, error]);

  // Handle search change
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  // Create cancel booking mutation
  const cancelBookingMutation = useCancelBooking();

  // Handle booking cancellation
  const handleCancelBooking = (booking: any) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      toast({
        title: "Cancelling booking...",
        description: "Your booking is being cancelled.",
      });

      cancelBookingMutation.mutate(
        {
          bookingId: booking.id,
          reason: "Cancelled by user",
          cancelledBy: userInfo?.usertype || "customer",
        },
        {
          onSuccess: () => {
            toast({
              title: "Booking Cancelled",
              description: `Booking ${booking.id} has been cancelled.`,
            });
            // refetch();
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to cancel booking. Please try again.",
              variant: "destructive",
            });
            console.error("Error cancelling booking:", error);
          },
        },
      );
    }
  };

  // Handle bid selection
  //   const handleSelectBid = (booking: any) => {
  //     router.push(`/bookings/${booking.id}/bids`);
  //   };

  //   Handle view details
  const handleViewDetails = (booking: any) => {
    router.push(`/bookings/${booking.id}`);
  };

  return (
    <div className="container py-4">
      <>
        <BookingHistoryTable
          search={search}
          onSearchChange={handleSearchChange}
          onCancelBooking={handleCancelBooking}
          // onSelectBid={handleSelectBid}
          onViewDetails={handleViewDetails}
          isLoading={false}
        />
      </>
    </div>
  );
};

export default ProtectedRoute(BookingHistoryPage);
