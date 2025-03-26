'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useGetPromoById, useUpdatePromo } from "@/lib/api/hooks/usePromo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PromoData } from "@/lib/api/apiHandlers/promoService";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datePicker";

type PromoFormData = Omit<PromoData, "id" | "tableData">;

const UpdatePromo: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: promo, isLoading } = useGetPromoById(id as string);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      promo_validity: date ? date.getTime() : undefined,
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
      { id: id as string, updatedData: processedData },
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
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-6 text-2xl font-semibold">Update Promo</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="promo_name">Promo Name</Label>
            <Input
              id="promo_name"
              name="promo_name"
              value={formData.promo_name}
              onChange={handleChange}
              placeholder="Enter promo name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="promo_description">Description</Label>
            <Input
              id="promo_description"
              name="promo_description"
              value={formData.promo_description || ""}
              onChange={handleChange}
              placeholder="Enter description"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="promo_discount_type">Type</Label>
            <Select
              value={formData.promo_discount_type}
              onValueChange={(value) =>
                handleSelectChange("promo_discount_type", value)
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="promo_code">Promo Code</Label>
            <Input
              id="promo_code"
              name="promo_code"
              value={formData.promo_code}
              onChange={handleChange}
              placeholder="Enter promo code"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="promo_discount_value">
              Discount Value{" "}
              {formData.promo_discount_type === "percentage" ? "(%)" : "($)"}
            </Label>
            <Input
              id="promo_discount_value"
              name="promo_discount_value"
              type="number"
              value={formData.promo_discount_value.toString()}
              onChange={handleChange}
              placeholder={`Enter discount value ${formData.promo_discount_type === "percentage" ? "%" : "$"}`}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="max_promo_discount_value">
              Max Discount Allowed ($)
            </Label>
            <Input
              id="max_promo_discount_value"
              name="max_promo_discount_value"
              type="number"
              value={formData.max_promo_discount_value.toString()}
              onChange={handleChange}
              placeholder="Enter max discount allowed"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="min_order">Minimum Order Value ($)</Label>
            <Input
              id="min_order"
              name="min_order"
              type="number"
              value={formData.min_order.toString()}
              onChange={handleChange}
              placeholder="Enter minimum order value"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="promo_validity">Validity End Date</Label>
            <div className="mt-1">
              <DatePicker
                selected={
                  formData.promo_validity
                    ? new Date(formData.promo_validity)
                    : null
                }
                onChange={handleDateChange}
                placeholderText="Select end date"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="promo_usage_limit">Usage Limit</Label>
            <Input
              id="promo_usage_limit"
              name="promo_usage_limit"
              type="number"
              value={formData.promo_usage_limit.toString()}
              onChange={handleChange}
              placeholder="Enter usage limit"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/promos")}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700"
            disabled={updatePromoMutation.isPending}
          >
            {updatePromoMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePromo;
