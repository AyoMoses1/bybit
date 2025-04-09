"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import TextInput from "@/components/TextInput";
import TextArea from "@/components/TextArea";
import {
  Complaint,
  useGetComplaintById,
  useUpdateComplaint,
} from "@/lib/api/hooks/complaints";
import { formatDate } from "@/utils/formatDate";
import { Switch } from "@/components/ui/switch";

const ComplaintInfo = () => {
  const { id } = useParams();
  const complaintId = Array.isArray(id) ? id[0] : id;
  const { data: complaint } = useGetComplaintById(complaintId ?? "") as {
    data: Complaint | undefined;
  };
  const [toggleStates, setToggleStates] = React.useState<
    Record<string, boolean>
  >({});

  const [data, setData] = useState<{
    id: string;
    complainDate: string;
    firstName: string;
    lastName: string;
    role: string;
    subject: string;
    processDate: string;
    message: string;
    mobile: string;
    email: string;
    check: boolean;
  }>({
    id: "",
    complainDate: "",
    firstName: "",
    lastName: "",
    role: "",
    subject: "",
    processDate: "",
    message: "",
    mobile: "",
    email: "",
    check: false,
  });
  const userType = ["driver", "admin", "fleetadmin", "customer"];
  const mutation = useUpdateComplaint();

  const [selectedVehicleType, setSelectedVehicleType] = useState("");

  const handleToggle = (id: string, checked: boolean) => {
    setToggleStates((prev) => ({ ...prev, [id]: checked }));

    mutation.mutate(
      { id, updatedData: { check: checked } },
      {
        onError: () => setToggleStates((prev) => ({ ...prev, [id]: !checked })),
      },
    );
  };

  useEffect(() => {
    setData({
      complainDate: complaint?.complainDate ?? "",
      firstName: complaint?.firstName ?? "",
      lastName: complaint?.lastName ?? "",
      role: complaint?.role ?? "",
      subject: complaint?.subject ?? "",
      processDate: complaint?.processDate ?? "",
      message: complaint?.body ?? "",
      mobile: complaint?.mobile ?? "",
      email: complaint?.email ?? "",
      check: complaint?.check ?? false,
      id: complaint?.id ?? "",
    });
    setSelectedVehicleType(complaint?.role ?? "");
  }, [complaint]);

  return (
    <div className="p-6">
      <p className="pb-6 text-[32px] font-semibold text-[#202224]">
        {"Complaint"}
      </p>
      <div className="flex gap-6">
        <div className="w-[85%] rounded-lg bg-white px-8 pb-12 shadow-md">
          <div className="px-6 pt-8">
            {/* Form Fields */}
            <div className="flex w-full flex-col gap-8">
              {/* 1 */}
              <div className="flex w-full items-center gap-16">
                <div className="w-1/2">
                  {" "}
                  <TextInput
                    className="w-full"
                    type="text"
                    label="Created Date"
                    placeholder="John"
                    value={formatDate(Number(data?.complainDate))}
                    onChange={() => {}}
                  />
                </div>
                <div className="w-1/2">
                  <TextInput
                    type="text"
                    className="w-full"
                    label="Process Date"
                    placeholder="Last"
                    value={formatDate(Number(data?.processDate))}
                    onChange={() => {}}
                  />
                </div>
              </div>

              {/* 2 */}
              <div className="flex w-full items-center gap-16">
                <div className="w-1/2">
                  {" "}
                  <TextInput
                    type="text"
                    label="First Name"
                    placeholder="John"
                    value={data.firstName}
                    onChange={() => {}}
                  />
                </div>
                <div className="w-1/2">
                  <TextInput
                    type="text"
                    label="Last Name"
                    placeholder="Last"
                    value={data.lastName}
                    onChange={() => {}}
                  />
                </div>
              </div>

              {/* 3 */}
              <div className="flex w-full items-center gap-16">
                <div className="w-1/2">
                  {" "}
                  <TextInput
                    type="tel"
                    label="Mobile Number"
                    placeholder="tel"
                    value={data.mobile}
                    onChange={() => {}}
                  />
                </div>
                <div className="w-1/2">
                  <TextInput
                    type="email"
                    label="Email"
                    placeholder="Last"
                    value={data.email}
                    onChange={() => {}}
                  />
                </div>
              </div>

              {/* 4 */}
              <div className="flex w-full gap-16">
                <div className="w-1/2">
                  {" "}
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
                        {userType?.map((type, index) => {
                          return (
                            <option
                              key={index}
                              value={type}
                              className="text-[#21272A]"
                            >
                              {type}
                            </option>
                          );
                        })}
                      </select>

                      {/* Custom Dropdown Icon */}
                      {/* <div className="pointer-events-none absolute inset-y-0 right-3 top-1 flex items-center text-gray-500">
                      <ChevronDown className="size-5" />
                    </div> */}
                    </div>
                  </div>
                </div>
                <div className="w-1/2">
                  <TextArea
                    label="Subject"
                    placeholder="Subject"
                    value={data.subject}
                    onChange={() => {}}
                  />
                </div>
              </div>

              {/* 5 */}
              <div className="flex w-full gap-16">
                <div className="w-1/2">
                  <TextArea
                    label="Message"
                    placeholder="Message"
                    value={data.message}
                    onChange={() => {}}
                  />
                </div>
                <div className="w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-fit w-[15%] flex-col gap-2 rounded-lg bg-white px-3 py-5 shadow-md">
          <p className="font-source text-base font-semibold text-[#202224]">
            {"Status"}
          </p>
          <div className="h-[1px] bg-[#E1E1E1]"></div>
          <div className="flex items-center justify-between gap-2">
            <p className="font-roboto text-base font-normal text-[#21272A]">
              {data.check ? "Resolved" : "Unresolved"}
            </p>
            <Switch
              checked={toggleStates[data.id] ?? data.check}
              onCheckedChange={(checked) => handleToggle(data.id, checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(ComplaintInfo);
