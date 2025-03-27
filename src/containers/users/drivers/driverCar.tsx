import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Car, useCars } from "@/lib/api/hooks/cars";
import { UserInfo } from "@/containers/bookingDetail/bookingTypes";
import { useParams } from "next/navigation";

const DriverCar = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { data: cars } = useCars(userInfo?.usertype ?? "", userInfo?.id ?? "");
  const [driversCars, setDriversCars] = useState<Car[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = localStorage.getItem("userInfo");
      if (info) {
        setUserInfo(JSON.parse(info));
      }
    }
  }, []);

  useEffect(() => {
    if (cars) {
      const driverCars = cars?.filter((car) => car.driver === id);
      setDriversCars(driverCars ?? []);
    }
  }, [id, cars]);

  console.log(driversCars);

  return (
    <div className="px-0 py-2 font-source">
      <div className="mx-auto flex justify-between rounded-[14px] bg-white px-7 shadow-md">
        {/* Active Car */}
        <div className="pb-10 pr-4 pt-3">
          <h2 className="mb-6 text-2xl font-semibold tracking-[-0.11px] text-[#202224]">
            Active Car
          </h2>
          <div className="w-[200px] rounded-lg border border-[#34C759] bg-white px-6 py-6 shadow-md lg:w-[200px] xl:w-[450px]">
            <div className="flex items-center justify-between gap-10 md:flex-wrap lg:flex-row">
              {driversCars[0]?.car_image ? (
                <Image
                  src={driversCars[0].car_image}
                  alt="Car"
                  height={100}
                  width={185}
                  className="h-[100px] w-[185px] rounded-sm object-cover"
                />
              ) : null}
              <div className="">
                <h3 className="mb-1 font-roboto text-sm font-normal text-[#697077]">
                  Tags
                </h3>
                <div className="mt-1 flex flex-col gap-2 font-inter">
                  <span className="rounded-[20px] bg-[#00B69B29] px-3 py-[2px] text-[10px] font-medium text-[#00B69B]">
                    Approved
                  </span>
                  <span className="rounded-[20px] bg-[#E0D4FC] px-3 py-[2px] text-[10px] font-medium text-[#6226EF]">
                    Exclusive
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm">
              <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                <span className="font-normal">Vehicle Make / Brand Name</span>
                <span>{driversCars[0]?.vehicleMake ?? ""}</span>
              </p>
              <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                <span className="font-normal">Vehicle Model No</span>
                <span>{driversCars[0]?.vehicleModel ?? ""}</span>
              </p>
              <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                <span className="font-normal">Vehicle Number</span>
                <span>{driversCars[0]?.vehicleNumber ?? ""}</span>
              </p>
              <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                <span className="font-normal">Create Date</span>
                <span>{driversCars[0]?.date ?? "N/A"}</span>
              </p>
              <p className="flex justify-between font-roboto text-sm text-[#697077]">
                <span className="font-normal">Other Info</span>
                <span>COLOR: {driversCars[0]?.other_info ?? "N/A"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center Divider */}
        <div className="w-[1px] translate-y-[0.5] bg-[#D1D1D6]"></div>

        {/* Other Cars */}
        <div className="pb-10 pl-4 pt-3">
          <h2 className="mb-6 text-2xl font-semibold tracking-[-0.11px] text-[#202224]">
            Other Car
          </h2>
          <div className="flex flex-col gap-6">
            {driversCars?.slice(1).map((car, index) => {
              return (
                <div
                  key={index}
                  className="w-[200px] rounded-lg border border-[#34C759] bg-white px-6 py-6 shadow-md lg:w-[200px] xl:w-[450px]"
                >
                  <div className="flex items-center justify-between gap-10 md:flex-wrap lg:flex-row">
                    {car?.car_image ? (
                      <Image
                        src={car.car_image}
                        alt="Car"
                        height={100}
                        width={185}
                        className="h-[100px] w-[185px] rounded-sm object-cover"
                      />
                    ) : (
                      <div className="flex h-[100px] w-[185px] items-center justify-center rounded-sm border-[0.6px] object-cover text-xs">
                        No Image Found
                      </div>
                    )}
                    <div className="">
                      <h3 className="mb-1 font-roboto text-sm font-normal text-[#697077]">
                        Tags
                      </h3>
                      <div className="mt-1 flex flex-col gap-2 font-inter">
                        <span
                          className={`rounded-[20px] bg-[#00B69B29] px-3 py-[2px] text-[10px] font-medium ${car?.approved ? "text-[#00B69B]" : "text-red-500"} `}
                        >
                          {car?.approved ? "Approved" : "Not Approved"}
                        </span>

                        <span className="w-fit rounded-[20px] bg-[#E0D4FC] px-3 py-[2px] text-[10px] font-medium text-[#6226EF]">
                          {car?.carType || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm">
                    <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                      <span className="font-normal">
                        Vehicle Make / Brand Name
                      </span>
                      <span>{car.vehicleMake ?? ""}</span>
                    </p>
                    <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                      <span className="font-normal">Vehicle Model No</span>
                      <span>{car.vehicleModel ?? ""}</span>
                    </p>
                    <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                      <span className="font-normal">Vehicle Number</span>
                      <span>{car.vehicleNumber ?? ""}</span>
                    </p>
                    <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                      <span className="font-normal">Create Date</span>
                      <span>{car?.date ?? "N/A"}</span>
                    </p>
                    <p className="flex justify-between font-roboto text-sm text-[#697077]">
                      <span className="font-normal">Other Info</span>
                      <span>COLOR: {car?.other_info ?? "N/A"}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverCar;
