import React, { useState } from "react";
import { useRouter } from "next/router";
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
import { useCreatePromo } from "@/lib/api/hooks/usePromo";
import { DatePicker } from "@/components/ui/datePicker";

type PromoFormData = Omit<PromoData, "id">;

const AddPromo: React.FC = () => {
  const router = useRouter();
  const createPromoMutation = useCreatePromo();

  const [formData, setFormData] = useState<PromoFormData>({
    promoName: "",
    description: "",
    type: "Percentage", // Default type
    code: "",
    promoValue: 0,
    maxDiscountAllowed: 0,
    minimumOrderValue: 0,
    endDate: undefined,
    promoCountAvailable: 0,
    showInList: true,
    usedByCount: 0,
  });

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
      endDate: date ? date.getTime() : undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert string values to numbers where needed
    const processedData: PromoFormData = {
      ...formData,
      promoValue: Number(formData.promoValue),
      maxDiscountAllowed: Number(formData.maxDiscountAllowed),
      minimumOrderValue: Number(formData.minimumOrderValue),
      promoCountAvailable: Number(formData.promoCountAvailable),
    };

    createPromoMutation.mutate(processedData, {
      onSuccess: () => {
        router.push("/promos");
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-6 text-2xl font-semibold">Add New Promo</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Promo Name
            </label>
            <Input
              name="promoName"
              value={formData.promoName}
              onChange={handleChange}
              placeholder="Enter promo name"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Type
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage">Percentage</SelectItem>
                <SelectItem value="Flat">Flat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Promo Code
            </label>
            <Input
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter promo code"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Promo Value
            </label>
            <Input
              name="promoValue"
              type="number"
              value={formData.promoValue.toString()}
              onChange={handleChange}
              placeholder="Enter promo value"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Max Discount Allowed
            </label>
            <Input
              name="maxDiscountAllowed"
              type="number"
              value={formData.maxDiscountAllowed.toString()}
              onChange={handleChange}
              placeholder="Enter max discount allowed"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Minimum Order Value
            </label>
            <Input
              name="minimumOrderValue"
              type="number"
              value={formData.minimumOrderValue.toString()}
              onChange={handleChange}
              placeholder="Enter minimum order value"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              End Date
            </label>
            <DatePicker
              selected={formData.endDate ? new Date(formData.endDate) : null}
              onChange={handleDateChange}
              placeholderText="Select end date"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Promo Count Available
            </label>
            <Input
              name="promoCountAvailable"
              type="number"
              value={formData.promoCountAvailable.toString()}
              onChange={handleChange}
              placeholder="Enter available count"
              required
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
            disabled={createPromoMutation.isPending}
          >
            {createPromoMutation.isPending ? "Publishing..." : "Publish Promo"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPromo;
