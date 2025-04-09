"use client";
import { ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import TextInput from "@/components/TextInput";
import { useCarTypes, useGetCarById } from "@/lib/api/hooks/cars";

type Car = {
  vehicleNumber: string;
  vehicleModel: string;
  vehicleMake: string;
  other_info: string;
  car_image?: string;
  carType?: string;
  driver: string;
};

const Complaint = () => {
  const { id } = useParams();
  const carId = Array.isArray(id) ? id[0] : id;
  const { data: car } = useGetCarById(carId ?? "") as {
    data: Car | undefined;
  };
  // const { data: users = [], isLoading } = useUser("driver") as {
  //   data: User[];
  //   isLoading: boolean;
  // };

  const { data: carTypes } = useCarTypes();
  const [data, setData] = useState({
    vehicleNumber: "",
    vehicleModel: "",
    vehicleMake: "",
    other_info: "",
  });

  const [selectedVehicleType, setSelectedVehicleType] = useState("");

  useEffect(() => {
    setData({
      vehicleNumber: car?.vehicleNumber ?? "",
      vehicleModel: car?.vehicleModel ?? "",
      vehicleMake: car?.vehicleMake ?? "",
      other_info: car?.other_info ?? "",
    });
    setSelectedVehicleType(car?.carType ?? "");
  }, [car]);

  console.log(car);

  return (
    <div className="p-6">
      <p className="pb-6 text-[32px] font-semibold text-[#202224]">
        {id ?? "Complaint Id"}
      </p>
      <div className="rounded-lg bg-white px-8 pb-12 shadow-md">
        <div className="px-6 pt-8">
          {/* Form Fields */}
          <div className="flex w-full justify-between gap-16">
            <div className="flex w-full flex-wrap gap-0">
              <TextInput
                type="text"
                label="Created Date"
                placeholder="John"
                value={data.vehicleNumber}
                onChange={(event) =>
                  setData((prev) => ({
                    ...prev,
                    vehicleNumber: event.target.value,
                  }))
                }
              />

              <TextInput
                type="text"
                label="First Name"
                placeholder="John"
                value={data.vehicleNumber}
                onChange={(event) =>
                  setData((prev) => ({
                    ...prev,
                    vehicleNumber: event.target.value,
                  }))
                }
              />

              <TextInput
                type="tel"
                label="Mobile Number"
                placeholder="tel"
                value={data.vehicleNumber}
                onChange={(event) =>
                  setData((prev) => ({
                    ...prev,
                    vehicleNumber: event.target.value,
                  }))
                }
              />

              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  User Type
                </label>
                <div className="relative w-full">
                  <select
                    value={selectedVehicleType}
                    onChange={(e) => setSelectedVehicleType(e.target.value)}
                    className={`mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 outline-none transition-colors ${selectedVehicleType === "" ? "text-[#697077]" : "text-[#21272A]"}`}
                  >
                    <option value="" disabled className="text-[#697077]">
                      Select an option
                    </option>
                    {carTypes?.map((type, index) => {
                      return (
                        <option
                          key={index}
                          value={type.name}
                          className="text-[#21272A]"
                        >
                          {type.name}
                        </option>
                      );
                    })}
                  </select>

                  {/* Custom Dropdown Icon */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 top-1 flex items-center text-gray-500">
                    <ChevronDown className="size-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-wrap gap-6">
              <TextInput
                type="text"
                label="Vehicle Make / Brand Name"
                placeholder="Last"
                value={data.vehicleMake}
                onChange={(event) =>
                  setData((prev) => ({
                    ...prev,
                    vehicleMake: event.target.value,
                  }))
                }
              />

              <TextInput
                type="email"
                label="Other Vehicle or Driver Info"
                placeholder="Brand New"
                value={data.other_info}
                onChange={(event) =>
                  setData((prev) => ({
                    ...prev,
                    other_info: event.target.value,
                  }))
                }
              />

              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Vehicle Type
                </label>
                <div className="relative w-full">
                  <select
                    value={selectedVehicleType}
                    onChange={(e) => setSelectedVehicleType(e.target.value)}
                    className={`mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 outline-none transition-colors ${selectedVehicleType === "" ? "text-[#697077]" : "text-[#21272A]"}`}
                  >
                    <option value="" disabled className="text-[#697077]">
                      Select an option
                    </option>
                    {carTypes?.map((type, index) => {
                      return (
                        <option
                          key={index}
                          value={type.name}
                          className="text-[#21272A]"
                        >
                          {type.name}
                        </option>
                      );
                    })}
                  </select>

                  {/* Custom Dropdown Icon */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 top-1 flex items-center text-gray-500">
                    <ChevronDown className="size-5" />
                  </div>
                </div>
              </div>

              <div
                className="h-[130px] w-full"
                style={{ visibility: "hidden" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(Complaint);
