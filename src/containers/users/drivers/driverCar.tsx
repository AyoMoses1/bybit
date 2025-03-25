import React from "react";
import camera from "../../../assets/svgs/Group 1.svg";
import Image from "next/image";

const DriverCar = () => {
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
              <Image
                src={camera}
                alt="Car"
                height={100}
                width={185}
                className="h-[100px] w-[185px] rounded-sm object-cover"
              />
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
                <span>Honda Civic</span>
              </p>
              <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                <span className="font-normal">Vehicle Model No</span>
                <span>123637XSD35</span>
              </p>
              <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                <span className="font-normal">Vehicle Number</span>
                <span>CAL-123-xyz</span>
              </p>
              <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                <span className="font-normal">Create Date</span>
                <span>6 Feb 2025 15:18</span>
              </p>
              <p className="flex justify-between font-roboto text-sm text-[#697077]">
                <span className="font-normal">Other Info</span>
                <span>COLOR: BLACK</span>
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
          <div className="w-[200px] rounded-lg border border-[#34C759] bg-white px-6 py-6 shadow-md lg:w-[200px] xl:w-[450px]">
            <div className="flex items-center justify-between gap-10 md:flex-wrap lg:flex-row">
              <Image
                src={camera}
                alt="Car"
                width={185}
                height={100}
                className="h-[100px] w-[185px] rounded-sm object-cover"
              />
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
                <span>Honda Civic</span>
              </p>
              <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                <span className="font-normal">Vehicle Model No</span>
                <span>123637XSD35</span>
              </p>
              <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                <span className="font-normal">Vehicle Number</span>
                <span>CAL-123-xyz</span>
              </p>
              <p className="mb-3 flex justify-between border-b pb-2 font-roboto text-sm text-[#697077]">
                <span className="font-normal">Create Date</span>
                <span>6 Feb 2025 15:18</span>
              </p>
              <p className="flex justify-between font-roboto text-sm text-[#697077]">
                <span className="font-normal">Other Info</span>
                <span>COLOR: BLACK</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverCar;
