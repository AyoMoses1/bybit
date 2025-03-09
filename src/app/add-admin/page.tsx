import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import React from "react";

const AddAdmin = () => {
  return (
    <div className="p-6">
      <p className="pb-6 text-2xl font-semibold text-[#202224]">Add Admin</p>

      <div className="rounded-lg bg-white px-10 py-12 shadow-md">
        <div className="">
          {/* Form Fields */}
          <div className="flex w-full justify-between gap-16">
            <div className="flex w-full flex-wrap gap-4">
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  First Name
                </label>
                <input
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="John"
                />
              </div>
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Last Name
                </label>
                <input
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="Last"
                />
              </div>
            </div>

            <div className="flex w-full flex-wrap gap-4">
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="+352 232323"
                />
              </div>
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="email@vasas.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-12 flex justify-center">
          <Button className="w-[287px] py-[10px]" size={"default"}>
            Add Admin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
