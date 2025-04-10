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
import { useAuditLog } from "@/utils/useAuditLog";
import { AuditAction } from "@/lib/api/apiHandlers/auditService";

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
  const mutation = useUpdateComplaint();

  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const { handleAudit } = useAuditLog();
  const handleToggle = (id: string, checked: boolean) => {
    setToggleStates((prev) => ({ ...prev, [id]: checked }));

    mutation.mutate(
      { id, updatedData: { check: checked, processDate: Date.now() } },
      {
        onError: () => setToggleStates((prev) => ({ ...prev, [id]: !checked })),
        onSuccess: () => {
          handleAudit(
            "Promos",
            id,
            AuditAction.UPDATE,
            `Updated check status to ${checked}`,
          );
        },
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
                    disabled
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
                    disabled
                    placeholder="Last"
                    value={
                      data?.processDate
                        ? formatDate(Number(data?.processDate))
                        : "N/A"
                    }
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
                    disabled
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
                    disabled
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
                    disabled
                  />
                </div>
                <div className="w-1/2">
                  <TextInput
                    type="email"
                    label="Email"
                    placeholder="Last"
                    value={data.email}
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </div>

              {/* 4 */}
              <div className="flex w-full gap-16">
                <div className="w-1/2">
                  <TextInput
                    type="text"
                    label="User Type"
                    placeholder="userType"
                    value={selectedVehicleType}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div className="w-1/2">
                  <TextArea
                    label="Subject"
                    placeholder="Subject"
                    value={data.subject}
                    onChange={() => {}}
                    disabled
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
                    disabled
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
