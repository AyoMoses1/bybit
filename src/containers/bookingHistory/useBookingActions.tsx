import { useState } from "react";
import { useCancelBooking } from "@/lib/api/hooks/useBooking";

interface UserInfo {
  id: string;
  usertype: string;
}

const useBookingActions = (
  userInfo: UserInfo | null,
  toast: any,
  router: any,
) => {
  const [search, setSearch] = useState("");

  // Create cancel booking mutation
  const cancelBookingMutation = useCancelBooking();

  // Handle search change
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

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

  // Handle view details
  const handleViewDetails = (booking: any) => {
    if (booking && booking.id) {
      console.log("View details for booking ID:", booking.id);
      router.push(`/booking-history/${booking.id}`);
    }
  };

  return {
    search,
    handleSearchChange,
    handleCancelBooking,
    handleViewDetails,
  };
};

export default useBookingActions;
