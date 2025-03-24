import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CustomTable } from "@/components/ui/data-table";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useCarTypes, useEditCarType } from "@/lib/api/hooks/useVehicle";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import deleteIcon from "../../assets/svgs/Vector (1).svg";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { CarType } from "./vehicleTypes";
import CancellationSlabsDialog from "./cancelSlabDialog";

interface VehiclesTableProps {
  search?: string;
}

const VehiclesTable: React.FC<VehiclesTableProps> = ({ search }) => {
  const mutation = useEditCarType();
  const deleteMutation = useEditCarType();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [profileModal, setProfileModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<CarType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
  const [currentVehicleType, setCurrentVehicleType] = useState<CarType | null>(
    null,
  );

  const { data: carTypes, isLoading, refetch } = useCarTypes();

  const filteredCarTypes = React.useMemo(() => {
    if (!carTypes || !Array.isArray(carTypes)) return [];

    if (!search) return carTypes;

    const searchLower = search.toLowerCase().trim();
    return carTypes.filter((carType) => {
      return (
        (carType.name && carType.name.toLowerCase().includes(searchLower)) ||
        (carType.extra_info &&
          carType.extra_info.toLowerCase().includes(searchLower)) ||
        (carType.base_fare !== undefined &&
          carType.base_fare.toString().includes(searchLower)) ||
        (carType.rate_per_unit_distance !== undefined &&
          carType.rate_per_unit_distance.toString().includes(searchLower)) ||
        (carType.rate_per_hour !== undefined &&
          carType.rate_per_hour.toString().includes(searchLower))
      );
    });
  }, [carTypes, search]);

  const handleImageClick = (rowData: CarType): void => {
    setImageData(typeof rowData.image === "string" ? rowData.image : null);
    setProfileModal(true);
    setUserData(rowData);
  };

  const handleSetProfileImage = (e: React.FormEvent): void => {
    e.preventDefault();
    if (selectedImage && userData && userData.id) {
      setLoading(true);

      const cartype: CarType = {
        ...userData,
        image: selectedImage,
      };

      mutation.mutate(
        {
          cartype,
          method: "UpdateImage",
        },
        {
          onSuccess: () => {
            setProfileModal(false);
            setSelectedImage(null);
            setLoading(false);
            toast.success("Vehicle image updated successfully");
          },
          onError: (error) => {
            setLoading(false);
            toast.error("Failed to update vehicle image");
          },
        },
      );
    }
  };

  const openCancellationSlabs = (vehicleType: CarType) => {
    setCurrentVehicleType(vehicleType);
    setCancellationDialogOpen(true);
  };

  const handleVehicleTypeUpdate = (updatedVehicleType: CarType) => {
    setCurrentVehicleType(updatedVehicleType);
    refetch();
  };

  const confirmDelete = (id: string, name: string): void => {
    setVehicleToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = (): void => {
    if (!vehicleToDelete) return;

    setDeleteDialogOpen(false);

    const cartype: CarType = {
      id: vehicleToDelete.id,
      name: "",
    };

    deleteMutation.mutate(
      {
        cartype,
        method: "Delete",
      },
      {
        onError: (error) => {
          toast.error("Failed to delete vehicle type", { id: "delete-toast" });
        },
      },
    );
  };

  const columns: ColumnDef<CarType>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.getValue("name") || "N/A",
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.getValue("image");
        return typeof imageUrl === "string" ? (
          <button
            onClick={() => handleImageClick(row.original)}
            className="overflow-hidden rounded-md"
          >
            <img
              src={imageUrl}
              alt="Vehicle Type"
              className="h-12 w-12 object-cover"
            />
          </button>
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200">
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
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        );
      },
    },
    {
      accessorKey: "base_fare",
      header: "Base Fare",
      cell: ({ row }) => {
        const value = row.getValue("base_fare");
        return typeof value === "number" ? `${value.toFixed(2)}` : "N/A";
      },
    },
    {
      accessorKey: "rate_per_unit_distance",
      header: "Rate per km",
      cell: ({ row }) => {
        const value = row.getValue("rate_per_unit_distance");
        return typeof value === "number" ? `${value.toFixed(2)}` : "N/A";
      },
    },
    {
      accessorKey: "rate_per_hour",
      header: "Rate per hour",
      cell: ({ row }) => {
        const value = row.getValue("rate_per_hour");
        return typeof value === "number" ? `${value.toFixed(2)}` : "N/A";
      },
    },
    {
      accessorKey: "min_fare",
      header: "Minimum fare",
      cell: ({ row }) => {
        const value = row.getValue("min_fare");
        return typeof value === "number" ? `${value.toFixed(2)}` : "N/A";
      },
    },
    {
      accessorKey: "convenience_fees",
      header: "Convenience fees",
      cell: ({ row }) => {
        const value = row.getValue("convenience_fees");
        return typeof value === "number" ? `${value.toFixed(2)}` : "N/A";
      },
    },
    {
      accessorKey: "convenience_fee_type",
      header: "Convenience fees type",
      cell: ({ row }) => {
        const value = row.getValue("convenience_fee_type");
        return value
          ? String(value).charAt(0).toUpperCase() + String(value).slice(1)
          : "N/A";
      },
    },
    {
      accessorKey: "seat_capacity",
      header: "Seat Capacity",
      cell: ({ row }) => {
        const value = row.getValue("seat_capacity");
        return value || "N/A";
      },
    },
    {
      accessorKey: "extra_info",
      header: "Extra Info",
      cell: ({ row }) => {
        const value = row.getValue("extra_info");
        return value || "N/A";
      },
    },
    {
      accessorKey: "pos",
      header: "List Position",
      cell: ({ row }) => {
        const value = row.getValue("pos");
        return value !== undefined ? value : "N/A";
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const vehicle = row.original;

        return (
          <div className="relative">
            <div className="flex w-fit overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <button
                className="flex h-12 w-12 items-center justify-center border-r border-gray-200 hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  openCancellationSlabs(vehicle);
                }}
              >
                <X />
              </button>

              <Link href={`/vehicle-type/${vehicle.id}`}>
                <button
                  className="flex h-12 w-12 items-center justify-center border-r border-gray-200 hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ArrowRight />
                </button>
              </Link>

              <button
                className="flex h-12 w-12 items-center justify-center hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(vehicle.id || "", vehicle.name);
                }}
              >
                <Image
                  src={deleteIcon}
                  alt="Delete Icon"
                  width={10}
                  height={10}
                  className="rounded-full"
                />
              </button>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="px-1">
      <div>
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm font-semibold">Loading...</p>
          </div>
        ) : (
          <CustomTable
            columns={columns}
            data={Array.isArray(filteredCarTypes) ? filteredCarTypes : []}
          />
        )}
      </div>

      {/* Image Upload Modal */}
      <Dialog.Root open={profileModal} onOpenChange={setProfileModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="mb-4 text-lg font-semibold">
              Upload Vehicle Type Image
            </Dialog.Title>

            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex items-center gap-2">
                <span>Choose Image:</span>
                <input
                  type="file"
                  className="text-sm"
                  onChange={(event) => {
                    if (event.target.files && event.target.files[0]) {
                      setSelectedImage(event.target.files[0]);
                    }
                  }}
                />
              </div>

              {selectedImage ? (
                <img
                  alt="Vehicle preview"
                  className="h-48 w-48 object-contain"
                  src={URL.createObjectURL(selectedImage)}
                />
              ) : imageData ? (
                <img
                  alt="Current vehicle"
                  className="h-48 w-48 object-contain"
                  src={imageData}
                />
              ) : null}
            </div>

            <div className="mt-6 flex justify-between">
              <Dialog.Close asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="button"
                disabled={!selectedImage || loading}
                onClick={handleSetProfileImage}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>

            <Dialog.Close asChild>
              <button
                className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg">
            <Dialog.Title className="mb-4 text-lg font-semibold text-red-600">
              Confirm Deletion
            </Dialog.Title>

            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete this vehicle type{" "}
                {vehicleToDelete ? (
                  <span className="font-medium">({vehicleToDelete.name})</span>
                ) : (
                  ""
                )}
                ? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteConfirmed}
              >
                Delete
              </Button>
            </div>

            <Dialog.Close asChild>
              <button
                className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
                aria-label="Close"
              >
                <X />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <CancellationSlabsDialog
        open={cancellationDialogOpen}
        onOpenChange={setCancellationDialogOpen}
        vehicleType={currentVehicleType}
        onUpdateVehicleType={handleVehicleTypeUpdate}
      />
    </div>
  );
};

export default VehiclesTable;
