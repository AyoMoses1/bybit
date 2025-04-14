"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatePromo } from "@/lib/api/hooks/usePromo";
import { Button } from "@/components/ui/button";
import { PromoData } from "@/lib/api/apiHandlers/promoService";
import TextInput from "@/components/TextInput";
import { ChevronDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

type PromoFormData = Omit<PromoData, "id" | "tableData">;

const AddPromo: React.FC = () => {
  const router = useRouter();
  const createPromoMutation = useCreatePromo();

  const types = [
    {
      name: "Percentage",
      id: "percentage",
    },
    {
      name: "Flat",
      id: "flat",
    },
  ];

  const [formData] = useState<PromoFormData>({
    promo_name: "",
    promo_description: "",
    promo_discount_type: "percentage", // Default type
    promo_code: "",
    promo_discount_value: 0,
    max_promo_discount_value: 0,
    min_order: 0,
    promo_validity: undefined,
    promo_usage_limit: 0,
    promo_show: true,
    user_avail: 0,
    createdAt: Date.now(),
  });

  const formSchema = z.object({
    promo_name: z.string().min(2, "Name must be at least 3 characters"),
    promo_description: z.string().min(2, "Name must be at least 3 characters"),
    promo_discount_type: z.enum(["percentage", "flat"]),
    promo_code: z.string().min(2, "Name must be at least 3 characters"),
    promo_discount_value: z.string(),
    max_promo_discount_value: z.string(),
    min_order: z.string(),
    promo_validity: z.string(),
    promo_usage_limit: z.string(),
    promo_show: z.boolean(),
    user_avail: z.string(),
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
    console.log(data);
    const processedData = {
      ...data,
      promo_validity: data.promo_validity
        ? new Date(data.promo_validity).getTime()
        : undefined,
      promo_discount_value: Number(data.promo_discount_value),
      max_promo_discount_value: Number(data.max_promo_discount_value),
      min_order: Number(data.min_order),
      promo_usage_limit: Number(data.promo_usage_limit),
      user_avail: Number(data.user_avail),
    };

    createPromoMutation.mutate(processedData, {
      onSuccess: () => {
        router.push("/promos");
      },
    });
  };

  return (
    <div className="p-6">
      <p className="pb-6 text-[32px] font-semibold text-[#202224]">
        {"Add New Promo"}
      </p>
      <div className="flex gap-6">
        <div className="w-[85%] rounded-lg bg-white px-8 pb-12 shadow-md">
          <div className="px-6 pt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <TextInput
                    className="w-full"
                    placeholder="Enter promo name"
                    label="Promo Name"
                    {...register("promo_name")}
                    type="text"
                  />
                  <div>
                    {errors.promo_name && (
                      <p className="text-red-500">
                        {errors.promo_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    {...register("promo_description")}
                    placeholder="Enter description"
                    label="Description"
                  />
                  <div>
                    {errors.promo_description && (
                      <p className="text-red-500">
                        {errors.promo_description.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  {/* 2 */}
                  <div className="w-full">
                    <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                      Type
                    </label>
                    <div>
                      <div className="relative w-full">
                        <select
                          {...register("promo_discount_type")}
                          className={`mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 outline-none transition-colors ${formData?.promo_discount_type ? "text-[#21272A]" : "text-[#697077]"}`}
                        >
                          <option value="" disabled className="text-[#697077]">
                            Select Type
                          </option>
                          {types?.map((type, index) => {
                            return (
                              <option
                                key={index}
                                value={type.id}
                                className="text-[#21272A]"
                              >
                                {type.name}
                              </option>
                            );
                          })}
                        </select>

                        {/* Custom Dropdown Icon */}
                        <div className="pointer-events-none absolute inset-y-0 right-3 top-1 flex items-center text-gray-500">
                          <ChevronDown className="size-5" />
                        </div>
                      </div>
                      <div>
                        {errors.promo_discount_type && (
                          <p className="text-red-500">
                            {errors.promo_discount_type.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    {...register("promo_code")}
                    placeholder="Enter promo code"
                    label="Promo Code"
                  />
                  <div>
                    {errors.promo_code && (
                      <p className="text-red-500">
                        {errors.promo_code.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <TextInput
                    type="number"
                    {...register("promo_discount_value")}
                    placeholder={`Enter discount value ${formData.promo_discount_type === "percentage" ? "%" : "$"}`}
                    label={` Discount Value
                    ${
                      formData.promo_discount_type === "percentage"
                        ? "(%)"
                        : "($)"
                    }`}
                  />
                  <div>
                    {errors.promo_discount_value && (
                      <p className="text-red-500">
                        {errors.promo_discount_value.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    type="number"
                    {...register("max_promo_discount_value")}
                    placeholder="Enter max discount allowed"
                    label=" Max Discount Allowed ($)"
                  />
                  <div>
                    {errors.max_promo_discount_value && (
                      <p className="text-red-500">
                        {errors.max_promo_discount_value.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    type="number"
                    {...register("min_order")}
                    placeholder="Enter minimum order value"
                    label="Minimum Order Value ($)"
                  />
                  <div>
                    {errors.min_order && (
                      <p className="text-red-500">{errors.min_order.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    type="date"
                    {...register("promo_validity")}
                    placeholder="Select end date"
                    label="Validity End Date"
                  />
                  <div>
                    {errors.promo_validity && (
                      <p className="text-red-500">
                        {errors.promo_validity.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    type="number"
                    {...register("promo_usage_limit")}
                    placeholder="Enter usage limit"
                    label="Usage Limit"
                  />
                </div>
                <div>
                  {errors.promo_usage_limit && (
                    <p className="text-red-500">
                      {errors.promo_usage_limit.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <Button
                  disabled={!isValid || !errors}
                  type="submit"
                  className="w-[287px] py-[10px] disabled:opacity-70"
                  size={"default"}
                >
                  {createPromoMutation.isPending
                    ? "Publishing..."
                    : "Publish Promo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPromo;
