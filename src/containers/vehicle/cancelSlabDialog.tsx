import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CarType } from "./vehicleTypes";
import { useEditCarType } from "@/lib/api/hooks/useVehicle";
import CancellationSlabsTable from "./cancelSlabTable";

interface CancellationSlabsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleType: CarType | null;
  onUpdateVehicleType?: (updatedVehicleType: CarType) => void;
}

const CancellationSlabsDialog: React.FC<CancellationSlabsDialogProps> = ({
  open,
  onOpenChange,
  vehicleType,
  onUpdateVehicleType,
}) => {
  const mutation = useEditCarType();

  if (!vehicleType) {
    return null;
  }

  const handleUpdateVehicleType = (updatedVehicleType: CarType) => {
    // Create a clean copy while PRESERVING cancelSlab data
    const cleanedVehicleType = JSON.parse(
      JSON.stringify({
        ...updatedVehicleType,
        // Don't remove the cancelSlab property anymore
      }),
    );

    // Check if we have valid cancellation slab data
    console.log("Saving vehicle type with data:", cleanedVehicleType);

    mutation.mutate(
      {
        cartype: cleanedVehicleType,
        method: "Edit",
      },
      {
        onSuccess: () => {
          if (onUpdateVehicleType) {
            onUpdateVehicleType(updatedVehicleType);
          }
        },
        onError: (error) => {
          console.error("Failed to update with error:", error);
        },
      },
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-5/12 max-w-[900px] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-0 shadow-lg">
          <Dialog.Title className="sr-only">Cancellation Slabs</Dialog.Title>
          <CancellationSlabsTable
            vehicleType={vehicleType}
            onUpdateVehicleType={handleUpdateVehicleType}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CancellationSlabsDialog;
