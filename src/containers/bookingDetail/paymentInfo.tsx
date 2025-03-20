import React from "react";
import { BookingType } from "./bookingTypes";

const PaymentInformation = ({ booking }: { booking: BookingType }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Payment Information
      </h2>

      <div className="grid grid-cols-2">
        {/* Left column */}
        <div className="mr-0 border-r border-gray-200 pr-4">
          <div className="border-b border-gray-200 py-4">
            <div className="flex justify-between">
              <p className="text-gray-500">Trip Cost</p>
              <p>
                {booking.trip_cost ? `CFA ${booking.trip_cost}` : "CFA 23,000"}
              </p>
            </div>
          </div>

          {/* Discount Amount */}
          <div className="border-b border-gray-200 py-4">
            <div className="flex justify-between">
              <p className="text-gray-500">Discount Amount</p>
              <p>{booking.discount ? `CFA ${booking.discount}` : "CFA 0"}</p>
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
              <p className="capitalize">{booking.payment_mode || "Wallet"}</p>
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
  );
};

export default PaymentInformation;
