"use client";
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { CancellationSlab } from "@/containers/vehicle/vehicleTypes";
import TextInput from "@/components/TextInput";

interface CancellationSlabFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData: CancellationSlab | null;
  onSubmit: (data: CancellationSlab) => void;
}

const CancellationSlabForm: React.FC<CancellationSlabFormProps> = ({
  open,
  onOpenChange,
  editData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CancellationSlab>({
    minsDelayed: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id,
        minsDelayed: editData.minsDelayed,
        amount: editData.amount,
      });
    } else {
      setFormData({
        minsDelayed: "",
        amount: "",
      });
    }
  }, [editData, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.minsDelayed || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    onSubmit(formData);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-white p-6 shadow-xl">
          <div className="mb-5">
            <Dialog.Title className="text-xl font-semibold text-gray-800">
              {editData ? "Edit" : "Add"} Cancellation Slab
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-gray-500">
              {editData ? "Update the" : "Add a new"} cancellation slab for this
              vehicle type.
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <TextInput
                label="Minutes Delayed"
                type="text"
                id="minsDelayed"
                value={formData.minsDelayed}
                onChange={handleInputChange}
                placeholder=""
              />

              <TextInput
                label="Amount"
                type="text"
                id="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder=""
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3 pt-2">
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg px-4 py-2"
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-lg px-4 py-2"
              >
                {loading ? "Saving..." : editData ? "Update" : "Add"}
              </Button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
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

export default CancellationSlabForm;
