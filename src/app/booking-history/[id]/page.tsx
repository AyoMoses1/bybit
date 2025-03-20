"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBookingById } from "@/lib/api/hooks/useBooking";
import { formatDate } from "@/utils/formatDate";
import { ArrowLeft, User } from "lucide-react";
import moment from "moment/min/moment-with-locales";
import { useToast } from "@/hooks/use-toast";

interface BookingType {
  id?: string;
  reference?: string;
  status?: string;
  distance?: string;
  rating?: number;
  tripdate?: string;
  bookingDate?: string;
  pickupAddress?: string;
  dropAddress?: string;
  reason?: string;
  trip_cost?: string | number;
  convenience_fees?: string | number;
  discount?: string | number;
  payment_mode?: string;
  driver_share?: string | number;
  driver_name?: string;
  driver_image?: string;
  carType?: string;
  customer?: string;
  customer_name?: string;
  customer_image?: string;
  customer_contact?: string;
  customer_email?: string;
  pickup?: {
    add?: string;
    lat?: number;
    lng?: number;
  };
  drop?: {
    add?: string;
    lat?: number;
    lng?: number;
  };
  driverOffers?: Record<string, any>;
}

export default function BookingDetailPage() {
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

  // Get status badge color
  const getStatusBadge = (status: string) => {
    if (!status) return null;

    let bgColor = "bg-green-100";
    let textColor = "text-green-500";
    let displayText = status;

    switch (status?.toUpperCase()) {
      case "CANCELLED":
        bgColor = "bg-red-200";
        textColor = "text-red-500";
        displayText = "Cancelled";
        break;
      case "PENDING":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-700";
        displayText = "Pending";
        break;
      case "COMPLETED":
      case "COMPLETE":
        bgColor = "bg-green-100";
        textColor = "text-green-500";
        displayText = "Completed";
        break;
      case "NEW":
        bgColor = "bg-indigo-100";
        textColor = "text-indigo-700";
        displayText = "New";
        break;
      case "ACCEPTED":
        bgColor = "bg-blue-100";
        textColor = "text-blue-700";
        displayText = "Accepted";
        break;
      case "STARTED":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        displayText = "Started";
        break;
    }

    return (
      <span
        className={`${bgColor} ${textColor} rounded-full px-3 py-1 text-sm font-medium`}
      >
        {displayText}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-5">
        <div className="flex h-64 items-center justify-center">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-5">
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <p className="text-red-500">
            Error loading booking details. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const booking: BookingType = data;

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">Booking Detail</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">
              Ride Information
            </h2>

            <div className="relative grid grid-cols-2">
              <div className="absolute bottom-0 left-1/2 top-0 w-px bg-gray-200"></div>
              {/* Left column */}
              <div>
                <div className="mr-4 border-b border-gray-200 py-4 pr-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Booking ID</p>
                    <p>{booking.id || "OJT-ZJdv-a43-XoHPw"}</p>
                  </div>
                </div>

                <div className="mr-4 border-b border-gray-200 py-4 pr-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Booking Reference</p>
                    <p>{booking.reference || "HRUQOA"}</p>
                  </div>
                </div>

                <div className="mr-4 border-b border-gray-200 py-4 pr-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Booking Status</p>
                    <div>{getStatusBadge(booking.status || "Completed")}</div>
                  </div>
                </div>

                <div className="mr-4 border-b border-gray-200 py-4 pr-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Trip Start Date</p>
                    <p>
                      {booking.tripdate
                        ? moment(booking.tripdate).format("lll")
                        : "HRUQOA"}
                    </p>
                  </div>
                </div>

                <div className="mr-4 py-4 pr-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Cancelation Reason</p>
                    <p>{booking.reason || "HRUQOA"}</p>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="pl-4">
                <div className="border-b border-gray-200 py-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">OTP</p>
                    <p>FALSE</p>
                  </div>
                </div>

                <div className="border-b border-gray-200 py-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Distance</p>
                    <p>
                      {booking.distance ? `${booking.distance} km` : "76.3 km"}
                    </p>
                  </div>
                </div>

                <div className="border-b border-gray-200 py-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Driver Rating</p>
                    <p>{booking.rating || "HRUQOA"}</p>
                  </div>
                </div>

                <div className="border-b border-gray-200 py-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Pickup Address</p>
                    <p className="w-full pl-1 text-right">
                      {booking.pickupAddress || booking.pickup?.add || "Unilag"}
                    </p>
                  </div>
                </div>

                {/* Drop Address */}
                <div className="border-b-0 py-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Drop Address</p>
                    <p className="w-full pl-1 text-right">
                      {booking.dropAddress ||
                        booking.drop?.add ||
                        "Akobo, Ibadan"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">
              Payment Information
            </h2>

            <div className="grid grid-cols-2">
              {/* Left column */}
              <div className="mr-0 border-r border-gray-200 pr-5">
                <div className="border-b border-gray-200 py-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Trip Cost</p>
                    <p>
                      {booking.trip_cost
                        ? `CFA ${booking.trip_cost}`
                        : "CFA 23,000"}
                    </p>
                  </div>
                </div>

                {/* Discount Amount */}
                <div className="border-b border-gray-200 py-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Discount Amount</p>
                    <p>
                      {booking.discount ? `CFA ${booking.discount}` : "CFA 0"}
                    </p>
                  </div>
                </div>

                {/* Driver Share */}
                <div className="py-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Driver Share</p>
                    <p>
                      {booking.driver_share
                        ? `CFA ${booking.driver_share}`
                        : "CFA 23,000"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="pl-4">
                {/* Convenience Fees */}
                <div className="border-b border-gray-200 py-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Convenience Fees</p>
                    <p>
                      {booking.convenience_fees
                        ? `CFA ${booking.convenience_fees}`
                        : "CFA 3000"}
                    </p>
                  </div>
                </div>

                {/* Payment Mode */}
                <div className="border-b border-gray-200 py-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Payment Mode</p>
                    <p className="capitalize">
                      {booking.payment_mode || "Wallet"}
                    </p>
                  </div>
                </div>

                {/* Empty cell to match left column height */}
                <div className="py-4">
                  <div className="flex justify-between">
                    <p className="text-gray-500"></p>
                    <p></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">
              Driver Information
            </h2>

            <div className="mb-6 flex flex-col items-center">
              <div className="mb-3 h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                {booking.driver_image ? (
                  <img
                    src={booking.driver_image}
                    alt={booking.driver_name || "Driver"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <img
                      src="https://placehold.co/80x80"
                      alt="Driver"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="border-b py-4">
                <div className="flex justify-between">
                  <p className="text-gray-500">Name</p>
                  <p>{booking.driver_name || "HRUQOA"}</p>
                </div>
              </div>
              <div className="border-b py-4">
                <div className="flex justify-between">
                  <p className="text-gray-500">Vehicle Type</p>
                  <p className="capitalize">{booking.carType || "Economy"}</p>
                </div>
              </div>
              <div className="py-4">
                <div className="flex justify-between">
                  <p className="text-gray-500">Cancelation Reason</p>
                  <p>{booking.reason || "dffghty fdtnr"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">
              Customer Information
            </h2>

            <div className="mb-6 flex flex-col items-center">
              <div className="mb-3 h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                {booking.customer_image ? (
                  <img
                    src={booking.customer_image}
                    alt={booking.customer_name || "Customer"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <img
                      src="https://placehold.co/80x80"
                      alt="Customer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="border-b py-4">
                <div className="flex justify-between">
                  <p className="text-gray-500">ID</p>
                  <p>{booking.customer || "HRUQOA"}</p>
                </div>
              </div>
              <div className="border-b py-4">
                <div className="flex justify-between">
                  <p className="text-gray-500">Name</p>
                  <p>{booking.customer_name || "Alex Rider"}</p>
                </div>
              </div>
              <div className="border-b py-4">
                <div className="flex justify-between">
                  <p className="text-gray-500">Contact</p>
                  <p>{booking.customer_contact || "+2375432245464"}</p>
                </div>
              </div>
              <div className="py-4">
                <div className="flex justify-between">
                  <p className="text-gray-500">Email</p>
                  <p>{booking.customer_email || "email@mail.com"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
