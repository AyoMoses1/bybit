"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { SMTPDataType } from "@/lib/api/apiHandlers/settingsService";
import { useSMTPInfo, useUpdateSMTPInfo } from "@/lib/api/hooks/settings";
import { Switch } from "@/components/ui/switch";

const SMTPSettings = () => {
  const mutation = useUpdateSMTPInfo();
  const { data: SMTP }: { data: SMTPDataType | undefined } = useSMTPInfo();

  const [data, setData] = useState<{
    email: string;
    host: string;
    port: number;
    username: string;
    password: string;
    secure: boolean;
  }>({
    email: "",
    host: "",
    port: 0,
    username: "",
    password: "",
    secure: false,
  });

  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const updatedData = {
        fromEmail: data.email,
        smtpDetails: {
          auth: {
            pass: data.password,
            user: data.username,
          },
          host: data.host,
          port: data.port,
          secure: data.secure,
        },
      };

      mutation.mutate(
        { updatedData },
        {
          onError: () => {
            setLoading(false);
          },
          onSuccess: () => {
            setLoading(false);
          },
        },
      );
    } catch (error) {
      console.error("Error updating smtp details:", error);
    }
  };

  useEffect(() => {
    setData({
      email: SMTP?.fromEmail ?? "",
      host: SMTP?.smtpDetails?.host ?? "",
      port: SMTP?.smtpDetails?.port ?? 0,
      username: SMTP?.smtpDetails?.auth?.user ?? "",
      password: SMTP?.smtpDetails?.auth?.pass ?? "",
      secure: SMTP?.smtpDetails?.secure ?? false,
    });
  }, [SMTP]);

  console.log(SMTP);

  return (
    <div className="px-6 py-3">
      <div className="rounded-lg bg-white px-8 py-12 shadow-md">
        <div className="flex justify-between gap-8">
          {/* Form Fields */}
          <div className="flex w-full justify-between gap-16">
            <div className="flex w-full flex-wrap gap-4">
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  From Email
                </label>
                <input
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="email"
                  value={data.email}
                  onChange={(event) =>
                    setData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Host
                </label>
                <input
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="Host"
                  value={data.host}
                  onChange={(event) =>
                    setData((prev) => ({
                      ...prev,
                      host: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Port
                </label>
                <input
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="Port"
                  value={data.port}
                  onChange={(event) =>
                    setData((prev) => ({
                      ...prev,
                      port: Number(event.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex w-full flex-wrap gap-4">
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Username
                </label>
                <input
                  type="tel"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none disabled:bg-muted disabled:text-[#697077]"
                  placeholder="+352 232323"
                  value={data.username}
                  onChange={(event) =>
                    setData((prev) => ({
                      ...prev,
                      username: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Password
                </label>
                <input
                  type="password"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none disabled:bg-muted disabled:text-[#697077]"
                  placeholder="email@vasas.com"
                  value={data.password}
                  onChange={(event) =>
                    setData((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex h-[70px] w-full items-center">
                <div className="mt-4 flex items-center gap-3 pl-2">
                  <p className="font-roboto text-base font-normal text-[#21272A]">
                    Secure
                  </p>
                  <Switch
                    checked={data?.secure}
                    onCheckedChange={(checked) =>
                      setData((prev) => ({
                        ...prev,
                        secure: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-12 flex justify-center">
          <Button
            disabled={loading}
            onClick={handleUpdate}
            className="w-[287px] py-[10px]"
            size={"default"}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SMTPSettings;
