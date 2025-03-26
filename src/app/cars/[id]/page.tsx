"use client";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/api/hooks/user";
import { updateCustomerProfileImage } from "@/lib/api/apiHandlers/userService";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import Image from "next/image";
import camera from "../../../assets/svgs/Group 1.svg";
import TextInput from "@/components/TextInput";
import { useCarTypes, useGetCarById, useUpdateCar } from "@/lib/api/hooks/cars";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

type Car = {
  vehicleNumber: string;
  vehicleModel: string;
  vehicleMake: string;
  other_info: string;
  car_image?: string;
  carType?: string;
  driver: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

const UpdateCar = () => {
  const router = useRouter();
  const { id } = useParams();
  const mutation = useUpdateCar();
  const carId = Array.isArray(id) ? id[0] : id;
  const { data: car } = useGetCarById(carId ?? "") as {
    data: Car | undefined;
  };
  const { data: users = [], isLoading } = useUser("driver") as {
    data: User[];
    isLoading: boolean;
  };

  const { data: carTypes } = useCarTypes();
  const [data, setData] = useState({
    vehicleNumber: "",
    vehicleModel: "",
    vehicleMake: "",
    other_info: "",
  });
  const [search, setSearch] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error] = useState<string | null>(null);

  const filteredDrivers = users?.filter((user: User) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      let passportURL;
      if (file instanceof File) {
        passportURL = await updateCustomerProfileImage(file, carId ?? "");
      } else {
        passportURL = file;
      }

      const updatedData = {
        vehicleNumber: data.vehicleNumber ?? "",
        vehicleModel: data.vehicleModel ?? "",
        vehicleMake: data.vehicleMake ?? "",
        other_info: data?.other_info ?? "",
        driver: selectedDriver ?? "",
        carType: selectedVehicleType ?? "",
        ...(passportURL && { car_image: passportURL ?? "" }),
      };

      mutation.mutate(
        {
          id: carId ?? "",
          updatedData,
        },
        {
          onError: () => {
            setLoading(false);
          },
          onSuccess: () => {
            setLoading(false);
            router.push("/cars");
          },
        },
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    setData({
      vehicleNumber: car?.vehicleNumber ?? "",
      vehicleModel: car?.vehicleModel ?? "",
      vehicleMake: car?.vehicleMake ?? "",
      other_info: car?.other_info ?? "",
    });
    setSelectedDriver(car?.driver ?? "");
    setSelectedVehicleType(car?.carType ?? "");
    setPreview(car?.car_image ?? "");
  }, [car]);

  console.log(car);

  return (
    <div className="p-6">
      <p className="pb-6 text-[32px] font-semibold text-[#202224]">
        Update Car
      </p>
      <div className="rounded-lg bg-white px-8 pb-12 shadow-md">
        <p className="py-8 text-2xl font-semibold text-[#202224]">
          Update existing car detail
        </p>
        <div className="px-6">
          {/* Form Fields */}
          <div className="flex w-full justify-between gap-16">
            <div className="flex w-full flex-wrap gap-0">
              <TextInput
                type="text"
                label="Vehicle Registration Number"
                placeholder="232323"
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
                label="Vehicle Model No"
                placeholder="32323"
                value={data.vehicleModel}
                onChange={(event) =>
                  setData((prev) => ({
                    ...prev,
                    vehicleModel: event.target.value,
                  }))
                }
              />

              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Driver
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="mt-1 flex h-[48px] w-full items-center justify-between border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-3 text-[#21272A] outline-none transition-colors">
                      {selectedDriver
                        ? users?.find(
                            (user: User) => user.id === selectedDriver,
                          )?.firstName +
                          "" +
                          " " +
                          users?.find(
                            (user: User) => user.id === selectedDriver,
                          )?.lastName
                        : "Search for a driver"}
                      <ChevronDown className="size-5 text-gray-500" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="mt-2 w-full rounded-md border bg-white p-2 shadow-lg lg:w-[130%] xl:w-[200%]"
                    align="start"
                  >
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 size-5 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search driver..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border px-8 py-2 outline-none"
                      />
                    </div>

                    <div className="mt-2 max-h-60 w-full overflow-y-auto">
                      {isLoading ? (
                        <p className="p-2 text-sm text-gray-500">Loading...</p>
                      ) : filteredDrivers?.length > 0 ? (
                        filteredDrivers.map((user: User) => (
                          <div
                            key={user.id}
                            onClick={() => {
                              setSelectedDriver(user.id);
                              setSearch("");
                            }}
                            className="cursor-pointer rounded-md px-3 py-2 hover:bg-gray-100"
                          >
                            {user.firstName} {user.lastName}
                          </div>
                        ))
                      ) : (
                        <p className="p-2 text-sm text-gray-500">
                          No drivers found
                        </p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="w-full">
                <div className="flex items-center gap-3">
                  {/* Image Preview Box */}
                  <div className="flex h-[100px] w-[100px] items-center justify-center rounded-[5px] border bg-[#E2E6EC]">
                    {preview ? (
                      <Image
                        src={preview}
                        width={40}
                        height={40}
                        alt="Preview"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-[100px] w-[100px] items-center justify-center rounded-[5px] bg-[#E2E6EC]">
                        <Image
                          src={camera}
                          alt="Camera"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* File Input Section */}
                  <div className="flex flex-col">
                    <p className="font-[Roboto] text-xs font-[300] italic text-[#000000]">
                      Please upload square image, size less than 100KB
                    </p>
                    <div className="mt-[6px] flex items-center gap-6 bg-[#F8F8F8] px-2 py-3">
                      <>
                        <label className="">
                          <p className="flex min-w-[110px] cursor-pointer items-center rounded-[20px] border border-[#913B81] px-4 py-2 font-semibold text-[#913B81]">
                            Choose File
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                        {file ? (
                          <>
                            {" "}
                            {file && (
                              <p className="mt-1 max-w-[80px] truncate text-sm text-gray-600">
                                {file.name}
                              </p>
                            )}
                            {error && (
                              <p className="mt-1 text-sm text-red-500">
                                {error}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="font-[Roboto] text-sm font-[300] text-[#3C3C3C]">
                            No File Chosen
                          </p>
                        )}
                      </>
                    </div>
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

        {/* Update Button */}
        <div className="mt-12 flex justify-center">
          <Button
            disabled={loading}
            onClick={handleUpdate}
            className="w-[250px] py-[10px]"
            size={"default"}
          >
            {loading ? "Loading..." : "Update Car"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(UpdateCar);
