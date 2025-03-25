"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCarTypes, useEditCarType } from "@/lib/api/hooks/useVehicle";
import ProtectedRoute from "@/HOC/ProtectedRoute";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import TextInput from "@/components/TextInput";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import camera from "../../../assets/svgs/Group 1.svg";

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

const useCarTypeById = (id: string) => {
  const { data: carTypes, isLoading } = useCarTypes();

  const carType = React.useMemo(() => {
    if (!carTypes || !Array.isArray(carTypes)) return null;
    return carTypes.find((car) => car.id === id) || null;
  }, [carTypes, id]);

  return { data: carType, isLoading };
};

const VehicleTypeEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isEditMode = !!id;
  const { data: vehicle, isLoading } = useCarTypeById(id);
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

  useEffect(() => {
    if (isEditMode && vehicle) {
      setFormData({
        id: vehicle.id,
        name: vehicle.name || "",
        base_fare:
          typeof vehicle.base_fare === "number"
            ? vehicle.base_fare
            : parseFloat(vehicle.base_fare as string) || 0,
        convenience_fees:
          typeof vehicle.convenience_fees === "number"
            ? vehicle.convenience_fees
            : parseFloat(vehicle.convenience_fees as string) || 0,
        convenience_fee_type:
          typeof vehicle.convenience_fee_type === "string"
            ? vehicle.convenience_fee_type
            : "percentage",
        rate_per_hour:
          typeof vehicle.rate_per_hour === "number"
            ? vehicle.rate_per_hour
            : parseFloat(vehicle.rate_per_hour as string) || 0,
        min_fare:
          typeof vehicle.min_fare === "number"
            ? vehicle.min_fare
            : parseFloat(vehicle.min_fare as string) || 0,
        rate_per_unit_distance:
          typeof vehicle.rate_per_unit_distance === "number"
            ? vehicle.rate_per_unit_distance
            : parseFloat(vehicle.rate_per_unit_distance as string) || 0,
        pos:
          typeof vehicle.pos === "number"
            ? vehicle.pos
            : parseFloat(vehicle.pos as string) || 0,
        seat_capacity:
          typeof vehicle.seat_capacity === "number"
            ? vehicle.seat_capacity
            : parseInt(vehicle.seat_capacity as string, 10) || 0,
        image: vehicle.image || "",
      });

      if (typeof vehicle.image === "string") {
        setImagePreview(vehicle.image);
      }
    }
  }, [isEditMode, vehicle]);

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
    const method = isEditMode ? "Edit" : "Add";

    const imageUpdateMethod =
      selectedImage && isEditMode ? "UpdateImage" : method;

    mutation.mutate(
      {
        cartype,
        method: imageUpdateMethod,
      },
      {
        onSuccess: () => {
          setLoading(false);
          router.push("/vehicle-type");
        },
        onError: (error) => {
          setLoading(false);
          toast.error(
            `Failed to ${isEditMode ? "update" : "create"} vehicle type: ${error.message}`,
          );
        },
      },
    );
  };

  if (isLoading && isEditMode) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] px-6">
      <h1 className="mb-6 mt-2 text-2xl font-semibold">
        {isEditMode ? "Update Vehicle Type" : "Add Vehicle Type"}
      </h1>

      <div className="rounded-lg bg-white p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <div className="px-6">
              <div className="mb-4">
                <TextInput
                  label="Name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text"
                />
              </div>

              <div className="mb-4">
                <Label
                  htmlFor="convenience_fee_type"
                  className="mb-2 block font-[Roboto] text-base font-normal text-[#21272A]"
                >
                  Convenience Fees Type
                </Label>
                <div className="relative">
                  <select
                    value={formData.convenience_fee_type}
                    onChange={(e) => handleSelectChange(e.target.value)}
                    className={`mt-1 h-[48px] w-full appearance-none border-b-[1.5px] border-b-[#C1C7CD] bg-[#F8F8F8] py-2 pl-3 pr-10 outline-none transition-colors ${
                      formData.convenience_fee_type === ""
                        ? "text-[#697077]"
                        : "text-[#21272A]"
                    }`}
                  >
                    <option value="" disabled className="text-[#697077]">
                      Select an option
                    </option>
                    <option value="percentage" className="text-[#21272A]">
                      Percentage
                    </option>
                    <option value="flat" className="text-[#21272A]">
                      Flat
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 top-1 flex items-center text-gray-500">
                    <ChevronDown className="size-5" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <TextInput
                  type="number"
                  label="Rate Per Hour"
                  id="rate_per_hour"
                  value={formData.rate_per_hour.toString()}
                  onChange={handleNumberInputChange}
                  placeholder="0.00"
                />
              </div>

              <div className="mb-4">
                <TextInput
                  type="number"
                  label="Distance Rate Per (Km or Mile)"
                  id="rate_per_unit_distance"
                  value={formData.rate_per_unit_distance.toString()}
                  onChange={handleNumberInputChange}
                  placeholder="0.00"
                />
              </div>

              <div className="mb-4">
                <label className="block font-[Roboto] text-base font-normal text-[#21272A]">
                  Upload Vehicle Type Icon
                </label>
                <div className="mt-2 flex items-start space-x-4">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded bg-gray-100">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Image
                          src={camera}
                          alt="Camera"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-[Roboto] text-xs font-[300] italic text-[#000000]">
                      Please upload square image, size less than 100KB
                    </p>
                    <div className="mt-[6px] flex items-center gap-6 bg-[#F8F8F8] px-2 py-3">
                      <>
                        <label className="">
                          <p className="flex min-w-[110px] cursor-pointer items-center rounded-[20px] border border-[#913B81] px-4 py-2 font-semibold text-[#913B81]">
                            Choose File
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                        {imagePreview ? (
                          <>
                            {" "}
                            {imagePreview && (
                              <p className="mt-1 max-w-[80px] truncate text-sm text-gray-600">
                                {selectedImage?.name}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="font-[Roboto] text-sm font-[300] text-[#3C3C3C]">
                            No File Chosen
                          </p>
                        )}
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <TextInput
                type="number"
                label="Base Fare"
                id="base_fare"
                value={formData.base_fare.toString()}
                onChange={handleNumberInputChange}
                placeholder="0.00"
              />
            </div>

            <div className="mb-4">
              <TextInput
                type="number"
                label="Convenience Fees"
                id="convenience_fees"
                value={formData.convenience_fees.toString()}
                onChange={handleNumberInputChange}
                placeholder="0.00"
              />
            </div>

            <div className="mb-4">
              <TextInput
                type="number"
                label="Minimum Fare"
                id="min_fare"
                value={formData.min_fare.toString()}
                onChange={handleNumberInputChange}
                placeholder="0.00"
              />
            </div>

            <div className="mb-4">
              <TextInput
                type="number"
                label="List Position"
                id="pos"
                value={formData.pos.toString()}
                onChange={handleNumberInputChange}
                placeholder="0"
              />
            </div>

            <div className="mb-4">
              <TextInput
                type="number"
                label="Seat Capacity"
                id="seat_capacity"
                value={formData.seat_capacity.toString()}
                onChange={handleNumberInputChange}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-[287px] rounded-full py-4 text-white hover:bg-[#DA4CBF]"
          >
            {loading ? "Saving..." : isEditMode ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(VehicleTypeEditPage);
