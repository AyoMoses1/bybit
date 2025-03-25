import React from "react";
import { formatDate } from "@/utils/formatDate";
import StatusBadge from "./statusBadge";
import { BookingType } from "./bookingTypes";

const RideInformation = ({ booking }: { booking: BookingType }) => {
  return (
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
              <div>
                <StatusBadge status={booking.status || "Completed"} />
              </div>
            </div>
          </div>

          <div className="mr-4 border-b border-gray-200 py-4 pr-4">
            <div className="flex justify-between">
              <p className="text-gray-500">Trip Start Date</p>
              <p>
                {booking.tripdate
                  ? formatDate(Number(booking.tripdate))
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
              <p>{booking.distance ? `${booking.distance} km` : "76.3 km"}</p>
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
                {booking.dropAddress || booking.drop?.add || "Akobo, Ibadan"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideInformation;
