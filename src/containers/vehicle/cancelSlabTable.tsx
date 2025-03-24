import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CustomTable } from "@/components/ui/data-table";
import { CarType, CancellationSlab } from "./vehicleTypes";
import { useCancellationSlabsTable } from "./useCancelSlab";
import { Button } from "@/components/ui/button";
import { Download, Plus, X } from "lucide-react";
import CancellationSlabForm from "./cancelSlabForm";
import SearchComponent from "@/components/SearchComponent";

interface CancellationSlabsTableProps {
  vehicleType: CarType | null;
  onUpdateVehicleType?: (updatedVehicleType: CarType) => void;
}

interface DeleteConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="mb-4 text-lg font-semibold text-red-600">
            Confirm Deletion
          </Dialog.Title>

          <div className="mb-6">
            <p className="text-gray-700">
              Are you sure you want to delete this cancellation slab? This
              action cannot be undone.
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
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Delete
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
  );
};

const CancellationSlabsTable: React.FC<CancellationSlabsTableProps> = ({
  vehicleType,
  onUpdateVehicleType,
}) => {
  const [slabFormOpen, setSlabFormOpen] = useState(false);
  const [editingSlab, setEditingSlab] = useState<CancellationSlab | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [slabToDelete, setSlabToDelete] = useState<string>("");

  const handleEditSlab = (slab: CancellationSlab) => {
    setEditingSlab(slab);
    setSlabFormOpen(true);
  };

  const handleDeleteSlab = (slabId: string) => {
    setSlabToDelete(slabId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!vehicleType || !slabToDelete) return;

    const updatedVehicleType = { ...vehicleType };

    // Update the cancelSlab array
    updatedVehicleType.cancelSlab = Array.isArray(updatedVehicleType.cancelSlab)
      ? updatedVehicleType.cancelSlab.filter((slab) => slab.id !== slabToDelete)
      : [];

    if (onUpdateVehicleType) {
      onUpdateVehicleType(updatedVehicleType);
      //   toast.success("Cancellation slab deleted successfully");
    }
  };

  const handleAddSlab = () => {
    setEditingSlab(null);
    setSlabFormOpen(true);
  };

  const handleSlabSubmit = (data: CancellationSlab) => {
    if (!vehicleType) return;

    const updatedVehicleType = { ...vehicleType };

    if (!updatedVehicleType.cancelSlab) {
      updatedVehicleType.cancelSlab = [];
    }

    if (data.id) {
      updatedVehicleType.cancelSlab = updatedVehicleType.cancelSlab.map(
        (slab) => (slab.id === data.id ? { ...data } : slab),
      );
    } else {
      updatedVehicleType.cancelSlab.push({
        ...data,
        id: Date.now().toString(),
      });
    }

    if (onUpdateVehicleType) {
      onUpdateVehicleType(updatedVehicleType);
    }

    setSlabFormOpen(false);
  };

  const {
    searchQuery,
    slabs,
    columns,
    handleSearchChange,
    exportToCSV,
    isLoading,
  } = useCancellationSlabsTable(vehicleType, handleEditSlab, handleDeleteSlab);

  return (
    <>
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-xl font-semibold">Cancellation Slabs</h2>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={exportToCSV}>
            <Download className="h-5 w-5" />
          </Button>
          <div className="relative">
            <SearchComponent
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button onClick={handleAddSlab} variant="default" size="icon">
            <Plus className="size-3 font-semibold" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-sm font-semibold">Loading...</p>
        </div>
      ) : (
        <CustomTable columns={columns} data={slabs || []} />
      )}

      <CancellationSlabForm
        open={slabFormOpen}
        onOpenChange={setSlabFormOpen}
        editData={editingSlab}
        onSubmit={handleSlabSubmit}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default CancellationSlabsTable;
