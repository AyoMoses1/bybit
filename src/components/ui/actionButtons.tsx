import React from "react";
import { ArrowRight, X } from "lucide-react";
import { Booking } from "../../containers/bookingDetail/bookingTypes";

interface ActionButtonsProps {
  booking: Booking;
  onCancelBooking?: (booking: Booking) => void;
  onViewDetails?: (booking: Booking) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  booking,
  onCancelBooking,
  onViewDetails,
}) => {
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
};

export default ActionButtons;
