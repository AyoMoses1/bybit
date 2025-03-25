"use client";
import TextInput from "@/components/TextInput";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { useCreateUser } from "@/lib/api/hooks/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const AddCustomers = () => {
  const mutation = useCreateUser();
  const [selectedValue] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    firstName: z.string().min(2, "Name must be at least 3 characters"),
    lastName: z.string().min(2, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    mobile: z.string().min(5, "Must be a valid phone number"),
    idNumber: z.string().min(8, "Must be at least 8 characters"),
    approvalStatus: z.string().nonempty("Approval status is required"),
  });
  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    const updatedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobile: data.mobile,
      approved: data.approvalStatus === "approved" ? true : false,
      verifyId: data.idNumber,
      usertype: "customer",
      createdAt: new Date().getTime(),
    };
    mutation.mutate(
      {
        updatedData,
      },
      {
        onError: () => {
          setLoading(false);
        },
        onSuccess: () => {
          setLoading(false);
          toast.success("Customer created successfully");
          router.push("/users");
        },
      },
    );
  };

  return (
    <div className="p-6">
      <p className="pb-6 text-2xl font-semibold text-[#202224]">Add Customer</p>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="rounded-lg bg-white px-10 py-12 shadow-md">
          <div className="">
            {/* Form Fields */}
            <div className="w-full">
              <div className="flex w-full gap-16">
                <div className="w-1/2">
                  <TextInput
                    type="text"
                    label="First Name"
                    placeholder="John"
                    {...register("firstName")}
                  />
                  <div>
                    {errors.firstName && (
                      <p className="text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                </div>

                <div className="w-1/2">
                  <TextInput
                    type="text"
                    label="Last Name"
                    placeholder="Last"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex w-full gap-16">
                <div className="w-1/2">
                  <TextInput
                    type="tel"
                    label="Mobile Number"
                    placeholder="+352 232323"
                    {...register("mobile")}
                  />
                  {errors.mobile && (
                    <p className="text-red-500">{errors.mobile.message}</p>
                  )}
                </div>

                <div className="w-1/2">
                  <TextInput
                    type="email"
                    label="Email"
                    placeholder="email@vasas.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex w-full gap-16">
                <div className="w-1/2">
                  <TextInput
                    type="text"
                    label="  Id / Passport Number"
                    placeholder="N/A"
                    {...register("idNumber")}
                  />
                  {errors.idNumber && (
                    <p className="text-red-500">{errors.idNumber.message}</p>
                  )}
                </div>

                <div className="w-1/2">
                  <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                    Approval Status
                  </label>
                  <div className="relative w-full">
                    <select
                      {...register("approvalStatus")}
                      className={`mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 outline-none transition-colors ${selectedValue === "" ? "text-[#697077]" : "text-[#21272A]"}`}
                    >
                      <option value="" className="text-[#697077]">
                        Select an option
                      </option>
                      <option value="approved" className="text-[#21272A]">
                        Approved
                      </option>
                      <option value="not-approved" className="text-[#21272A]">
                        Not Approved
                      </option>
                    </select>

                    {/* Custom Dropdown Icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 top-1 flex items-center text-gray-500">
                      <ChevronDown className="size-5" />
                    </div>
                  </div>
                  {errors.approvalStatus && (
                    <p className="text-red-500">
                      {errors.approvalStatus.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="mt-12 flex justify-center">
            <div className="mt-12 flex justify-center">
              <Button
                disabled={!isValid || !errors || loading}
                type="submit"
                className="w-[287px] py-[10px] disabled:opacity-70"
                size={"default"}
              >
                {loading ? "Loading..." : "  Add Customer"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProtectedRoute(AddCustomers);
