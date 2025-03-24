import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CarType } from "./vehicleTypes";
import { useEditCarType } from "@/lib/api/hooks/useVehicle";
import { toast } from "react-hot-toast";
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
    mutation.mutate(
      {
        cartype: {
          ...updatedVehicleType,
          cancellationSlabs: undefined,
          cancelSlab: undefined,
        },
        method: "Edit",
      },
      {
        onSuccess: () => {
          // toast.success("Cancellation slab updated successfully");
          if (onUpdateVehicleType) {
            onUpdateVehicleType(updatedVehicleType);
          }
        },
        onError: (error) => {
          toast.error("Failed to update cancellation slab");
        },
      },
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white shadow-lg">
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
