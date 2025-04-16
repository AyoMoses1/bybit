"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetPromoById, useUpdatePromo } from "@/lib/api/hooks/usePromo";
import { Button } from "@/components/ui/button";
import { PromoData } from "@/lib/api/apiHandlers/promoService";
import TextInput from "@/components/TextInput";
import { ChevronDown } from "lucide-react";

type PromoFormData = Omit<PromoData, "id" | "tableData">;

const UpdatePromo: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: promo, isLoading } = useGetPromoById(id);
  const updatePromoMutation = useUpdatePromo();

  const [formData, setFormData] = useState<PromoFormData>({
    promo_name: "",
    promo_description: "",
    promo_discount_type: "percentage",
    promo_code: "",
    promo_discount_value: 0,
    max_promo_discount_value: 0,
    min_order: 0,
    promo_validity: undefined,
    promo_usage_limit: 0,
    promo_show: true,
    user_avail: 0,
  });

  const toLocalDateTimeInputValue = (timestamp: number) => {
    const date = new Date(timestamp);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localNow = new Date(now.getTime() - offset * 60000);
  const minDateTime = localNow.toISOString().slice(0, 16);

  useEffect(() => {
    if (promo) {
      setFormData({
        promo_name: promo.promo_name || "",
        promo_description: promo.promo_description || "",
        promo_discount_type: promo.promo_discount_type || "percentage",
        promo_code: promo.promo_code || "",
        promo_discount_value: promo.promo_discount_value || 0,
        max_promo_discount_value: promo.max_promo_discount_value || 0,
        min_order: promo.min_order || 0,
        promo_validity: promo.promo_validity,
        promo_usage_limit: promo.promo_usage_limit || 0,
        promo_show: promo.promo_show ?? true,
        user_avail: promo.user_avail || 0,
        createdAt: promo.createdAt,
      });
    }
  }, [promo]);

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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      console.error("No promo ID provided");
      return;
    }

    // Convert string values to numbers where needed
    const processedData: Partial<PromoData> = {
      ...formData,
      promo_discount_value: Number(formData.promo_discount_value),
      max_promo_discount_value: Number(formData.max_promo_discount_value),
      min_order: Number(formData.min_order),
      promo_usage_limit: Number(formData.promo_usage_limit),
    };

    updatePromoMutation.mutate(
      { id, updatedData: processedData },
      {
        onSuccess: () => {
          router.push("/promos");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <p className="pb-6 text-[32px] font-semibold text-[#202224]">
        {"Update Promo"}
      </p>
      <div className="flex gap-6">
        <div className="w-[85%] rounded-lg bg-white px-8 pb-12 shadow-md">
          <div className="px-6 pt-8">
            <form onSubmit={handleSubmit} className="">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <TextInput
                    className="w-full"
                    id="promo_name"
                    value={formData.promo_name}
                    placeholder="Enter promo name"
                    label="Promo Name"
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        promo_name: event.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    id="promo_description"
                    value={formData.promo_description || ""}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        promo_description: event.target.value,
                      }))
                    }
                    placeholder="Enter description"
                    label="Description"
                  />
                </div>

                <div>
                  {/* 2 */}
                  <div className="w-full">
                    <label className="block font-[Roboto] text-sm font-normal text-[#21272A]">
                      Type
                    </label>
                    <div className="relative w-full">
                      <select
                        value={formData.promo_discount_type}
                        onChange={(e) =>
                          handleSelectChange(
                            "promo_discount_type",
                            e.target.value,
                          )
                        }
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
                  </div>
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    id="promo_code"
                    value={formData.promo_code}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        promo_code: event.target.value,
                      }))
                    }
                    placeholder="Enter promo code"
                    label="Promo Code"
                  />
                </div>

                <div>
                  <TextInput
                    id="promo_discount_value"
                    type="number"
                    value={formData.promo_discount_value.toString()}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        promo_discount_value: parseFloat(event.target.value),
                      }))
                    }
                    placeholder={`Enter discount value ${formData.promo_discount_type === "percentage" ? "%" : "$"}`}
                    label={` Discount Value
                    ${
                      formData.promo_discount_type === "percentage"
                        ? "(%)"
                        : "($)"
                    }`}
                  />
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    id="max_promo_discount_value"
                    type="number"
                    value={formData.max_promo_discount_value.toString()}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        max_promo_discount_value: parseFloat(
                          event.target.value,
                        ),
                      }))
                    }
                    placeholder="Enter max discount allowed"
                    label=" Max Discount Allowed ($)"
                  />
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    id="min_order"
                    type="number"
                    value={formData.min_order.toString()}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        min_order: parseFloat(event.target.value),
                      }))
                    }
                    placeholder="Enter minimum order value"
                    label="Minimum Order Value ($)"
                  />
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    type="datetime-local"
                    id="promo_validity"
                    value={
                      formData.promo_validity
                        ? toLocalDateTimeInputValue(formData.promo_validity)
                        : ""
                    }
                    min={minDateTime}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        promo_validity: selectedDate.getTime(),
                      }));
                    }}
                    placeholder="Select end date"
                    label="Validity End Date"
                  />
                </div>

                <div>
                  <TextInput
                    className="w-full"
                    id="promo_usage_limit"
                    type="number"
                    value={formData.promo_usage_limit.toString()}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        promo_usage_limit: parseFloat(e.target.value),
                      }));
                    }}
                    placeholder="Enter usage limit"
                    label="Usage Limit"
                  />
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <Button
                  type="submit"
                  className="w-[287px] py-[10px] disabled:opacity-70"
                  size={"default"}
                >
                  {updatePromoMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePromo;
