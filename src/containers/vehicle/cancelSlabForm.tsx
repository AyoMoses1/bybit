import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { CancellationSlab } from "./vehicleTypes";

interface CancellationSlabFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData: CancellationSlab | null;
  onSubmit: (data: CancellationSlab) => Promise<void> | void;
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

  // Update form when editing data changes
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.minsDelayed || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save cancellation slab");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
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
              <div className="space-y-2">
                <label
                  htmlFor="minsDelayed"
                  className="block text-sm font-medium text-gray-700"
                >
                  Minutes Delayed
                </label>
                <Input
                  id="minsDelayed"
                  name="minsDelayed"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={formData.minsDelayed}
                  onChange={handleChange}
                  placeholder="Enter minutes delayed"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <Input
                  id="amount"
                  name="amount"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3 pt-2">
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg px-4 py-2"
                  disabled={loading}
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
              disabled={loading}
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
