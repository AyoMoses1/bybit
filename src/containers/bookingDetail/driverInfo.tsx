import React from "react";
import { BookingType } from "./bookingTypes";

const DriverInformation = ({ driver }: { driver: BookingType }) => {
  return (
    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Driver Information
      </h2>

      <div className="mb-6 flex flex-col items-center">
        <div className="mb-3 h-20 w-20 overflow-hidden rounded-full bg-gray-200">
          {driver.driver_image ? (
            <img
              src={driver.driver_image}
              alt={driver.driver_name || "Driver"}
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
            <p>{driver.driver_name || "HRUQOA"}</p>
          </div>
        </div>
        <div className="border-b py-4">
          <div className="flex justify-between">
            <p className="text-gray-500">Vehicle Type</p>
            <p className="capitalize">{driver.carType || "Economy"}</p>
          </div>
        </div>
        <div className="py-4">
          <div className="flex justify-between">
            <p className="text-gray-500">Cancelation Reason</p>
            <p>{driver.reason || "dffghty fdtnr"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverInformation;
