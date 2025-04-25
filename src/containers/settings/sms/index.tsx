"use client";
import TextInput from "@/components/TextInput";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSettings, useEditSettings } from "@/lib/api/apiHandlers/smsService";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Controller } from "react-hook-form";

const formSchema = z.object({
  apiUrl: z.string().min(2, "API URL must be at least 2 characters"),
  contentType: z.string().min(2, "Content Type must be at least 2 characters"),
  method: z.string().min(2, "Method is required"),
  body: z.string().min(5, "Body is required"),
  authorization: z
    .string()
    .min(8, "Authorization must be at least 8 characters"),
  customMobileOTP: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

const SmsSettings = () => {
  const [loading, setLoading] = useState(false);
  const { data: settings, isLoading } = useSettings();
  const { mutateAsync: editSettings } = useEditSettings();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      apiUrl: "",
      contentType: "",
      method: "",
      body: "",
      authorization: "",
      customMobileOTP: "",
    },
  });

  const formValues = watch();
  const allowEdits = settings?.AllowCriticalEditsAdmin ?? false;

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = async (data: FormData) => {
    if (!allowEdits) {
      toast.error("Demo mode");
      return;
    }

    try {
      setLoading(true);
      await editSettings({
        ...data,
        AllowCriticalEditsAdmin: settings?.AllowCriticalEditsAdmin,
      });
    } catch {
      toast.error("Failed to submit settings.");
    } finally {
      setLoading(false);
    }
  };

  const getFieldValue = (fieldName: keyof FormData) => {
    return allowEdits ? formValues[fieldName] || "" : "Hidden for demo";
  };

  return (
    <div className="p-6">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="w-4/5">
          <div className="rounded-lg bg-white px-10 py-10 shadow-md">
            <div className="space-y-6">
              <div className="flex flex-col gap-16 md:flex-row">
                <div className="w-full md:w-1/2">
                  <TextInput
                    type="text"
                    label="API URL"
                    placeholder="https://api.example.com/send"
                    {...register("apiUrl")}
                    value={getFieldValue("apiUrl")}
                    disabled={!allowEdits}
                  />
                  {errors.apiUrl && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.apiUrl.message}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-1/2">
                  <TextInput
                    type="text"
                    label="Content-Type"
                    placeholder="application/json"
                    {...register("contentType")}
                    value={getFieldValue("contentType")}
                    disabled={!allowEdits}
                  />
                  {errors.contentType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.contentType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-16 md:flex-row">
                <div className="w-full md:w-1/2">
                  <TextInput
                    type="text"
                    label="Method"
                    placeholder="POST"
                    {...register("method")}
                    value={getFieldValue("method")}
                    disabled={!allowEdits}
                  />
                  {errors.method && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.method.message}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-1/2">
                  <TextInput
                    type="text"
                    label="Body"
                    placeholder="Hello World"
                    {...register("body")}
                    value={getFieldValue("body")}
                    disabled={!allowEdits}
                  />
                  {errors.body && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.body.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-16 md:flex-row">
                <div className="w-full md:w-1/2">
                  <TextInput
                    type="text"
                    label="Authorization"
                    placeholder="Bearer xxxxxx"
                    {...register("authorization")}
                    value={getFieldValue("authorization")}
                    disabled={!allowEdits}
                  />
                  {errors.authorization && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.authorization.message}
                    </p>
                  )}
                </div>
                <div className="flex w-full items-center gap-4 md:w-1/2">
                  <label className="text-sm font-medium text-gray-700">
                    Enable Custom Mobile OTP
                  </label>
                  <Controller
                    name="customMobileOTP"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={allowEdits ? !!field.value : false}
                        onCheckedChange={field.onChange}
                        disabled={!allowEdits}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-center pt-10">
                <Button
                  disabled={!isValid || loading || !allowEdits}
                  type="submit"
                  className="w-[287px] py-[10px] disabled:opacity-70"
                >
                  {loading ? "Submitting" : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default SmsSettings;
