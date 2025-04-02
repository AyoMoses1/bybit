import React from "react";
import { BookingType } from "./bookingTypes";

const CustomerInformation = ({ customer }: { customer: BookingType }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Customer Information
      </h2>

      <div className="mb-6 flex flex-col items-center">
        <div className="mb-3 h-20 w-20 overflow-hidden rounded-full bg-gray-200">
          {customer.customer_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={customer.customer_image}
              alt={customer.customer_name || "Customer"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
            <p>{customer.customer || "N/A"}</p>
          </div>
        </div>
        <div className="border-b py-4">
          <div className="flex justify-between">
            <p className="text-gray-500">Name</p>
            <p>{customer.customer_name || "Alex Rider"}</p>
          </div>
        </div>
        <div className="border-b py-4">
          <div className="flex justify-between">
            <p className="text-gray-500">Contact</p>
            <p>{customer.customer_contact || "+2375432245464"}</p>
          </div>
        </div>
        <div className="py-4">
          <div className="flex justify-between">
            <p className="text-gray-500">Email</p>
            <p>{customer.customer_email || "email@mail.com"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInformation;
