"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditCarType } from "@/lib/api/hooks/useVehicle";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

interface FormData {
  id?: string;
  name: string;
  base_fare: number;
  convenience_fees: number;
  convenience_fee_type: string;
  rate_per_hour: number;
  min_fare: number;
  rate_per_unit_distance: number;
  pos: number;
  seat_capacity: number;
  image?: string | File;
}

const AddVehicleTypePage = () => {
  const router = useRouter();
  const mutation = useEditCarType();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    base_fare: 0,
    convenience_fees: 0,
    convenience_fee_type: "percentage",
    rate_per_hour: 0,
    min_fare: 0,
    rate_per_unit_distance: 0,
    pos: 0,
    seat_capacity: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, convenience_fee_type: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);

    const cartype = {
      ...formData,
      image: selectedImage || formData.image,
    };

    mutation.mutate(
      {
        cartype,
        method: "Add",
      },
      {
        onSuccess: () => {
          setLoading(false);
          router.push("/vehicle-type");
        },
        onError: (error) => {
          setLoading(false);
          toast.error(`Failed to create vehicle type: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="max-w-[1000px] pl-4">
      <h1 className="mb-6 mt-4 text-2xl font-semibold">Add Vehicle Type</h1>

      <div className="rounded-lg bg-white p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <div className="mb-4">
              <Label htmlFor="name" className="mb-1 block">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="rounded-md"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="convenience_fee_type" className="mb-1 block">
                Convenience Fees Type
              </Label>
              <Select
                value={formData.convenience_fee_type}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="rounded-md">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label htmlFor="rate_per_hour" className="mb-1 block">
                Rate Per Hour
              </Label>
              <Input
                id="rate_per_hour"
                type="number"
                value={formData.rate_per_hour}
                onChange={handleNumberInputChange}
                className="rounded-md"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="rate_per_unit_distance" className="mb-1 block">
                Distance Rate Per (Km or Mile)
              </Label>
              <Input
                id="rate_per_unit_distance"
                type="number"
                value={formData.rate_per_unit_distance}
                onChange={handleNumberInputChange}
                className="rounded-md"
              />
            </div>

            <div className="mb-4">
              <Label className="mb-1 block">Upload Vehicle Type Icon</Label>
              <div className="flex items-center space-x-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Vehicle icon"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-500">
                    Please upload square image, size less than 100KB
                  </p>
                  <div className="flex items-center">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer rounded-full border border-purple-700 px-4 py-1 text-sm text-purple-700"
                    >
                      Choose File
                    </label>
                    <span className="ml-3 text-sm text-gray-500">
                      {selectedImage ? selectedImage.name : "No File Chosen"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <Label htmlFor="base_fare" className="mb-1 block">
                Base Fare
              </Label>
              <Input
                id="base_fare"
                type="number"
                value={formData.base_fare}
                onChange={handleNumberInputChange}
                className="rounded-md"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="convenience_fees" className="mb-1 block">
                Convenience Fees
              </Label>
              <Input
                id="convenience_fees"
                type="number"
                value={formData.convenience_fees}
                onChange={handleNumberInputChange}
                className="rounded-md"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="min_fare" className="mb-1 block">
                Minimum Fare
              </Label>
              <Input
                id="min_fare"
                type="number"
                value={formData.min_fare}
                onChange={handleNumberInputChange}
                className="rounded-md"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="pos" className="mb-1 block">
                List Position
              </Label>
              <Input
                id="pos"
                type="number"
                value={formData.pos}
                onChange={handleNumberInputChange}
                className="rounded-md"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="seat_capacity" className="mb-1 block">
                Seat Capacity
              </Label>
              <Input
                id="seat_capacity"
                type="number"
                value={formData.seat_capacity}
                onChange={handleNumberInputChange}
                className="rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-[180px] rounded-full py-6"
          >
            {loading ? "Saving..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(AddVehicleTypePage);
