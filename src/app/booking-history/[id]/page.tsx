"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBookingById } from "@/lib/api/hooks/useBooking";
import { useToast } from "@/hooks/use-toast";
import RideInformation from "@/containers/bookingDetail/rideInfo";
import PaymentInformation from "@/containers/bookingDetail/paymentInfo"; 
import DriverInformation from "@/containers/bookingDetail/driverInfo";
import CustomerInformation from "@/containers/bookingDetail/customerInfo";
import { LoadingState } from "@/containers/bookingDetail/loadingError";
import { BookingType } from "@/containers/bookingDetail/bookingTypes";


const BookingDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const id = params.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : "";

  useEffect(() => {
    console.log("Booking detail page received id from params:", id);
    if (!id) {
      toast({
        title: "Error",
        description: "Invalid booking ID",
        variant: "destructive",
      });
    }
  }, [id, toast]);

  // Fetch booking data with proper error handling
  const { data, isLoading, error } = useBookingById(id);

  // Add debugging for query result
  useEffect(() => {
    if (data) {
      console.log("Booking data received:", data);
    }
    if (error) {
      console.error("Error fetching booking:", error);
      toast({
        title: "Error",
        description: "Failed to load booking details. Please try again.",
        variant: "destructive",
      });
    }
  }, [data, error, toast]);

  // Go back to bookings list
  const handleGoBack = () => {
    router.push("/booking-history");
  };

  if (isLoading) {
    return <LoadingState />;
  }

  // if (error || !data) {
  //   return <ErrorState onGoBack={handleGoBack} />;
  // }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">Booking Detail</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RideInformation booking={data as BookingType} />
          <PaymentInformation booking={data as BookingType} />
        </div>

        <div className="md:col-span-1">
          <DriverInformation driver={data as BookingType} />
          <CustomerInformation customer={data as BookingType} />
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
