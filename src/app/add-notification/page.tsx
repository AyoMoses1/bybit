"use client";
import { useForm } from "react-hook-form";
import { useSendPushNotification } from "@/lib/api/hooks/useNotification";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/TextInput";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type NotificationFormInputs = {
  title: string;
  body: string;
  userType: string;
  deviceType: string;
  userId?: string;
};

export default function PushNotificationForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NotificationFormInputs>({
    mode: "onChange",
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const title = watch("title");
  const body = watch("body");
  const selectedUserType = watch("userType");
  const selectedDeviceType = watch("deviceType");

  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const allFieldsFilled =
      !!title && !!body && !!selectedUserType && !!selectedDeviceType;
    setIsFormComplete(allFieldsFilled);
  }, [title, body, selectedUserType, selectedDeviceType]);

  const { mutate: sendNotification } = useSendPushNotification();

  const onSubmit = async (data: NotificationFormInputs) => {
    // Prevent multiple submissions
    if (isSubmittingForm) return;

    setIsSubmittingForm(true);
    // console.log("Submitting notification form with data:", data);

    const notification = {
      title: data.title,
      body: data.body,
      msg: data.body,
      usertype: data.userType.toLowerCase(),
      devicetype:
        data.deviceType === "all" ? "All" : data.deviceType.toUpperCase(),
      ...(data.userId && { userId: data.userId }),
    };

    try {
      sendNotification(
        { notification },
        {
          onSuccess: () => {
            toast.success("Notification sent successfully");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({
              queryKey: ["notifications", "all"],
            });
            queryClient.refetchQueries({ queryKey: ["notifications", "all"] });
            reset();
            router.push("/push-notification");
          },
          onError: (error) => {
            console.error("Error sending notification:", error);
            toast.error(error.message || "Failed to send push notification");
            setIsSubmittingForm(false);
          },
          onSettled: () => {
            setTimeout(() => {
              setIsSubmittingForm(false);
            }, 3000);
          },
        },
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Push Notification
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-4xl grid-cols-1 gap-6 rounded-2xl bg-white p-8 shadow-sm md:grid-cols-2"
      >
        <div>
          <TextInput
            {...register("title", { required: true })}
            placeholder="Enter title"
            label="Title"
            disabled={isSubmittingForm}
          />
          {errors.title && (
            <span className="text-red-500">Title is required</span>
          )}
        </div>

        <div>
          <label className="text-base font-medium text-gray-700">
            User Type
          </label>
          <div className="relative">
            <select
              {...register("userType", { required: true })}
              className={`mt-1 h-12 w-full appearance-none rounded-none border-0 border-b border-gray-300 bg-[#F8F8F8] p-3 pr-10 focus:outline-none focus:ring-0 ${
                selectedUserType ? "text-gray-800" : "text-gray-500"
              }`}
              disabled={isSubmittingForm}
            >
              <option value="">Select User Type</option>
              <option value="driver">Driver</option>
              <option value="customer">Customer</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-2 text-gray-700">
              <ChevronDown className="size-5 text-gray-500" />
            </div>
          </div>
          {errors.userType && (
            <span className="text-red-500">User type is required</span>
          )}
        </div>

        <div>
          <TextInput
            label="Body"
            {...register("body", { required: true })}
            placeholder="Enter message body"
            disabled={isSubmittingForm}
          />
          {errors.body && (
            <span className="text-red-500">Body is required</span>
          )}
        </div>

        <div>
          <label className="text-base font-medium text-gray-700">
            Device Type
          </label>
          <div className="relative">
            <select
              {...register("deviceType", { required: true })}
              className={`bg-gray-50p-3 h-12 w-full appearance-none rounded-none border-0 border-b border-gray-300 bg-[#F8F8F8] p-3 pr-10 focus:outline-none focus:ring-0 ${
                selectedDeviceType ? "text-gray-800" : "text-gray-500"
              }`}
              disabled={isSubmittingForm}
            >
              <option value="">Select Device Type</option>
              <option value="ios">iOS</option>
              <option value="android">Android</option>
              <option value="all">All</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-2">
              <ChevronDown className="size-5 text-gray-500" />
            </div>
          </div>
          {errors.deviceType && (
            <span className="text-red-500">Device type is required</span>
          )}
        </div>

        <div className="col-span-1 mt-6 flex justify-center md:col-span-2">
          <Button
            type="submit"
            disabled={isSubmittingForm || isSubmitting || !isFormComplete}
            className="h-12 w-80 rounded-full font-medium text-white focus:outline-none focus:ring-0 disabled:opacity-50"
          >
            {isSubmittingForm ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Push Notification"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
