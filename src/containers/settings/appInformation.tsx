"use client";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/TextInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useAppInfo, useUpdateAppInfo } from "@/lib/api/hooks/settings";
import { SettingsType } from "@/lib/api/apiHandlers/settingsService";
import { AuditAction } from "@/lib/api/apiHandlers/auditService";
import { useAuditLog } from "@/utils/useAuditLog";

const AppInformation = () => {
  const { data: settings }: { data: SettingsType | undefined } = useAppInfo();
  const mutation = useUpdateAppInfo();
  const [loading, setLoading] = useState(false);
  const { handleAudit } = useAuditLog();
  const formSchema = z.object({
    appName: z.string().optional(),
    CompanyName: z.string().optional(),
    CompanyAddress: z.string().optional(),
    CompanyWebsite: z.string().optional(),
    contact_email: z.string().email("Invalid email address").optional(),
    CompanyPhone: z.string().optional(),
    CompanyTerms: z.string().optional(),
    CompanyTermCondition: z.string().optional(),
    FacebookHandle: z.string().optional(),
    TwitterHandle: z.string().optional(),
    InstagramHandle: z.string().optional(),
    AppleStoreLink: z.string().optional(),
    PlayStoreLink: z.string().optional(),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      setLoading(true);
      mutation.mutate(
        { updatedData: data },
        {
          onError: () => {
            setLoading(false);
          },
          onSuccess: () => {
            setLoading(false);
            handleAudit(
              "Settings",
              "",
              AuditAction.UPDATE,
              `Settings details updated`,
            );
          },
        },
      );
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (settings) {
      setValue("appName", settings.appName || "");
      setValue("CompanyName", settings.CompanyName || "");
      setValue("CompanyAddress", settings.CompanyAddress || "");
      setValue("CompanyWebsite", settings.CompanyWebsite || "");
      setValue("contact_email", (settings.contact_email as string) || "");
      setValue("CompanyPhone", settings.CompanyPhone || "");
      setValue("CompanyTerms", settings.CompanyTerms || "");
      setValue("CompanyTermCondition", settings.CompanyTermCondition || "");
      setValue("FacebookHandle", settings.FacebookHandle || "");
      setValue("TwitterHandle", settings.TwitterHandle || "");
      setValue("InstagramHandle", settings.InstagramHandle || "");
      setValue("AppleStoreLink", settings.AppleStoreLink || "");
      setValue("PlayStoreLink", settings.PlayStoreLink || "");
    }
  }, [settings, setValue]);

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="rounded-lg bg-white px-8 pb-12 shadow-md">
          <div className="px-6 py-9">
            {/* Form Fields */}
            <div className="flex w-full justify-between gap-16">
              <div className="flex w-full flex-wrap gap-4">
                <div className="w-full">
                  <TextInput
                    type="text"
                    label="App Name"
                    placeholder="Koloride"
                    {...register("appName")}
                  />
                  {errors.appName && (
                    <p className="text-red-500">{errors.appName.message}</p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Company Name"
                    placeholder="KoloRide"
                    {...register("CompanyName")}
                  />
                  {errors.CompanyName && (
                    <p className="text-red-500">{errors.CompanyName.message}</p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Company Address"
                    placeholder="221B Baker Street"
                    {...register("CompanyAddress")}
                  />
                  {errors.CompanyAddress && (
                    <p className="text-red-500">
                      {errors.CompanyAddress.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Company Website"
                    placeholder="https://example.com"
                    {...register("CompanyWebsite")}
                  />
                  {errors.CompanyWebsite && (
                    <p className="text-red-500">
                      {errors.CompanyWebsite.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="email"
                    label="Contact Email"
                    placeholder="companyname@mail.com"
                    {...register("contact_email")}
                  />
                  {errors.contact_email && (
                    <p className="text-red-500">
                      {errors.contact_email.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Contact Phone"
                    placeholder="+236 6443"
                    {...register("CompanyPhone")}
                  />
                  {errors.CompanyPhone && (
                    <p className="text-red-500">
                      {errors.CompanyPhone.message}
                    </p>
                  )}
                </div>

                <div className="h-[75px] w-full"></div>
              </div>
              {/* 2 */}
              <div className="flex w-full flex-wrap gap-4">
                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Privacy Policy"
                    placeholder="https://example.com/privacy"
                    {...register("CompanyTerms")}
                  />
                  {errors.CompanyTerms && (
                    <p className="text-red-500">
                      {errors.CompanyTerms.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Terms & Conditions"
                    placeholder="https://example.com/terms"
                    {...register("CompanyTermCondition")}
                  />
                  {errors.CompanyTermCondition && (
                    <p className="text-red-500">
                      {errors.CompanyTermCondition.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Facebook Link"
                    placeholder="https://facebook.com/yourpage"
                    {...register("FacebookHandle")}
                  />
                  {errors.FacebookHandle && (
                    <p className="text-red-500">
                      {errors.FacebookHandle.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Twitter Page Link"
                    placeholder="https://twitter.com/yourpage"
                    {...register("TwitterHandle")}
                  />
                  {errors.TwitterHandle && (
                    <p className="text-red-500">
                      {errors.TwitterHandle.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Instagram Page Link"
                    placeholder="https://instagram.com/yourpage"
                    {...register("InstagramHandle")}
                  />
                  {errors.InstagramHandle && (
                    <p className="text-red-500">
                      {errors.InstagramHandle.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Apple Store Link"
                    placeholder="https://apps.apple.com/yourapp"
                    {...register("AppleStoreLink")}
                  />
                  {errors.AppleStoreLink && (
                    <p className="text-red-500">
                      {errors.AppleStoreLink.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <TextInput
                    type="text"
                    label="Play Store Link"
                    placeholder="https://apps.apple.com/yourapp"
                    {...register("PlayStoreLink")}
                  />
                  {errors.PlayStoreLink && (
                    <p className="text-red-500">
                      {errors.PlayStoreLink.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="mt-12 flex justify-center">
            <Button
              disabled={loading}
              type="submit"
              className="w-[287px] py-[10px] disabled:opacity-70"
              size={"default"}
            >
              {loading ? "Loading..." : "Update"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AppInformation;
