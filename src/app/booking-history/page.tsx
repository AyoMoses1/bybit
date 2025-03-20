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
      try {
        const info = localStorage.getItem("userInfo");
        if (info) {
          setUserInfo(JSON.parse(info));
          console.log("User info loaded from localStorage:", JSON.parse(info));
        } else {
          console.warn("No userInfo found in localStorage");
          // Check if "user" is available instead
          const user = localStorage.getItem("user");
          if (user) {
            const parsedUser = JSON.parse(user);
            console.log("Found user in localStorage instead:", parsedUser);
            setUserInfo({
              id: parsedUser.id,
              usertype: parsedUser.usertype || "customer",
            });
          }
        }
      } catch (error) {
        console.error("Error loading user info from localStorage:", error);
      }
    }
  }, []);

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

  // In your BookingHistoryPage component
  const handleViewDetails = (booking: any) => {
    if (booking && booking.id) {
      console.log("View details for booking ID:", booking.id);

      // Use the exact path that matches your folder structure
      router.push(`/booking-history/${booking.id}`);
    }
  };

  return (
    <div className="container py-4">
      <>
        <BookingHistoryTable
          search={search}
          onSearchChange={handleSearchChange}
          onCancelBooking={handleCancelBooking}
          onViewDetails={handleViewDetails}
          isLoading={false}
        />
      </>
    </div>
  );
};

export default ProtectedRoute(BookingHistoryPage);
