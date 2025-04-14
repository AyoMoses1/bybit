"use client";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/api/hooks/user";
import { updateCustomerProfileImage } from "@/lib/api/apiHandlers/userService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import Image from "next/image";
import camera from "../../assets/svgs/Group 1.svg";
import TextInput from "@/components/TextInput";
import { useAddCar, useCarTypes } from "@/lib/api/hooks/cars";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuditAction } from "@/lib/api/apiHandlers/auditService";
import { useAuditLog } from "@/utils/useAuditLog";
interface User {
  id: string;
  lastName: string;
}

const AddCar = () => {
  const router = useRouter();
  const mutation = useAddCar();
  const { handleAudit } = useAuditLog();
  const { data: users = [], isLoading } = useUser("driver") as {
    data: { id: string; firstName: string; lastName: string }[];
    isLoading: boolean;
  };

  const { data: carTypes } = useCarTypes() as {
    data: { id: string; name: string }[];
  };
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedVehicleType] = useState("");
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error] = useState<string | null>(null);

  const filteredDrivers = users?.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const formSchema = z.object({
    vehicleNumber: z
      .string()
      .min(6, "Vehicle registration number must be at least 6 characters"),
    vehicleModel: z
      .string()
      .min(3, "Vehicle model number must be at least 6 characters"),
    vehicleMake: z.string().min(3, "Brand Name must be at least 6 characters"),
    other_info: z.string().min(3, "Other info must be at least 6 characters"),
    driver: z.string().nonempty("Driver is required"),
    vehicleType: z.string().nonempty("Vehicle type is required"),
  });
  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const selectedDriver = watch("driver");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const info = localStorage.getItem("userInfo");
    const userId = JSON.parse(info ?? "");

    try {
      let passportURL;
      if (file instanceof File) {
        passportURL = await updateCustomerProfileImage(file, userId?.id ?? "");
      } else {
        passportURL = file;
      }

      const car = {
        vehicleNumber: data.vehicleNumber,
        vehicleModel: data.vehicleModel,
        vehicleMake: data.vehicleMake,
        other_info: data?.other_info,
        driver: selectedDriver,
        carType: data.vehicleType,
        createdAt: Date.now(),
        ...(passportURL && { car_image: passportURL }),
      };

      mutation.mutate(
        {
          ...car,
        },
        {
          onError: () => {
            setLoading(false);
          },
          onSuccess: () => {
            setLoading(false);
            router.push("/cars");
            handleAudit(
              "Cars",
              selectedDriver ?? "",
              AuditAction.CREATE,
              `A new car was created for driver ${selectedDriver ?? ""}`,
            );
          },
        },
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="p-6">
      <p className="pb-6 text-[32px] font-semibold text-[#202224]">Add Car</p>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="rounded-lg bg-white px-8 pb-12 shadow-md">
          <p className="py-8 text-2xl font-semibold text-[#202224]">
            Add a car to your account
          </p>
          <div className="px-6">
            {/* Form Fields */}
            <div className="flex w-full justify-between gap-16">
              <div className="flex w-full flex-wrap gap-0">
                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Vehicle Registration Number"
                    placeholder="232323"
                    {...register("vehicleNumber")}
                  />
                  {errors.vehicleNumber && (
                    <p className="text-red-500">
                      {errors.vehicleNumber.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Vehicle Model No"
                    placeholder="32323"
                    {...register("vehicleModel")}
                  />
                  {errors.vehicleModel && (
                    <p className="text-red-500">
                      {errors.vehicleModel.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                    Driver
                  </label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <button className="mt-1 flex h-[48px] w-full items-center justify-between border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-3 text-[#21272A] outline-none transition-colors">
                        {selectedDriver
                          ? (users?.find((user) => user.id === selectedDriver)
                              ?.firstName ??
                            "" +
                              "" +
                              " " +
                              users?.find(
                                (user: User) => user.id === selectedDriver,
                              )?.lastName)
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
                          <p className="p-2 text-sm text-gray-500">
                            Loading...
                          </p>
                        ) : filteredDrivers.length > 0 ? (
                          filteredDrivers.map((user) => (
                            <div
                              key={user.id}
                              onClick={() => {
                                setValue("driver", user.id, {
                                  shouldValidate: true,
                                });
                                setSearch("");
                                setOpen(false);
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
                  {errors.driver && (
                    <p className="text-red-500">{errors.driver.message}</p>
                  )}
                </div>

                <div className="w-full">
                  <div className="flex items-center gap-3">
                    {/* Image Preview Box */}
                    <div className="flex h-[100px] w-[100px] items-center justify-center rounded-[5px] border bg-[#E2E6EC]">
                      {preview ? (
                        <Image
                          src={preview}
                          alt="Preview"
                          width={40}
                          height={40}
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
                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Vehicle Make / Brand Name"
                    placeholder="Last"
                    {...register("vehicleMake")}
                  />
                  {errors.vehicleMake && (
                    <p className="text-red-500">{errors.vehicleMake.message}</p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Other Vehicle or Driver Info"
                    placeholder="Brand New"
                    {...register("other_info")}
                  />
                  {errors.other_info && (
                    <p className="text-red-500">{errors.other_info.message}</p>
                  )}
                </div>

                <div className="w-full">
                  <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                    Vehicle Type
                  </label>
                  <div className="relative w-full">
                    <select
                      {...register("vehicleType")}
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
                  {errors.vehicleType && (
                    <p className="text-red-500">{errors.vehicleType.message}</p>
                  )}
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
              disabled={!isValid || !errors || loading}
              type="submit"
              className="w-[287px] py-[10px] disabled:opacity-70"
              size={"default"}
            >
              {loading ? "Loading..." : "Add Car"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProtectedRoute(AddCar);
