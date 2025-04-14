"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { useCreateUser } from "@/lib/api/hooks/user";
import toast from "react-hot-toast";

const AddAdmin = () => {
  const mutation = useCreateUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    firstName: z.string().min(2, "Name must be at least 3 characters"),
    lastName: z.string().min(2, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    mobile: z.string().min(5, "Must be a valid phone number"),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    const updatedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      usertype: "admin",
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
          toast.success("Driver created successfully");
          router.push("/users");
        },
      },
    );
  };

  return (
    <div className="p-6">
      <p className="pb-6 text-2xl font-semibold text-[#202224]">Add Admin</p>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="rounded-lg bg-white px-10 py-12 shadow-md">
          <div className="flex w-full justify-between gap-16">
            <div className="flex w-full flex-wrap gap-4">
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="Last"
                />
                {errors.lastName && (
                  <p className="text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-wrap gap-4">
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  {...register("mobile")}
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="+352 232323"
                />
                {errors.mobile && (
                  <p className="text-red-500">{errors.mobile.message}</p>
                )}
              </div>
              <div className="w-full">
                <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="mt-1 h-[48px] w-full border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] px-4 py-2 outline-none"
                  placeholder="email@vasas.com"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="mt-12 flex justify-center">
            <Button
              disabled={!isValid || !errors || loading}
              type="submit"
              className="w-[287px] py-[10px] disabled:opacity-70"
              size={"default"}
            >
              {loading ? "Loading..." : "  Add Admin"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProtectedRoute(AddAdmin);
