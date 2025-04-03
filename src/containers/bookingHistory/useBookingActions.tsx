import { useState } from "react";
import { useCancelBooking } from "@/lib/api/hooks/useBooking";
import { Booking } from "../bookingDetail/bookingTypes";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface UserInfo {
  id: string;
  usertype: string;
}

interface Toast {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

const useBookingActions = (
  userInfo: UserInfo | null,
  toast: (props: Toast) => void,
  router: AppRouterInstance,
) => {
  const [search, setSearch] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const cancelBookingMutation = useCancelBooking();

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  // Handle booking cancellation request - shows confirmation dialog
  const handleCancelBooking = (booking: Booking) => {
    setBookingToCancel(booking);
    setConfirmDialogOpen(true);
  };

  // Handle actual cancellation after confirmation
  const confirmCancellation = async () => {
    if (!bookingToCancel || !userInfo) return;

    toast({
      title: "Cancelling booking...",
      description: "Your booking is being cancelled.",
    });

    try {
      await cancelBookingMutation.mutateAsync({
        bookingId: bookingToCancel.id,
        reason: "Cancelled by admin",
        cancelledBy: userInfo.usertype,
      });

      toast({
        title: "Booking Cancelled",
        description: `Booking ${bookingToCancel.id} has been cancelled.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
      console.error("Error cancelling booking:", error);
    } finally {
      setConfirmDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const handleViewDetails = (booking: Booking) => {
    if (booking && booking.id) {
      console.log("View details for booking ID:", booking.id);
      router.push(`/booking-history/${booking.id}`);
    }
  };

  const CancellationConfirmDialog = () => (
    <Dialog.Root open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="mb-4 text-lg font-semibold text-red-600">
            Confirm Cancellation
          </Dialog.Title>

          <div className="mb-6">
            <p className="text-gray-700">
              Are you sure you want to cancel this booking
              {bookingToCancel ? (
                <span className="font-medium"> (ID: {bookingToCancel.id})</span>
              ) : (
                ""
              )}
              ? This action cannot be undone.
            </p>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <Button type="button" variant="outline">
                No, Keep Booking
              </Button>
            </Dialog.Close>

            <Button
              type="button"
              variant="destructive"
              onClick={confirmCancellation}
            >
              Yes, Cancel Booking
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

  return {
    search,
    handleSearchChange,
    handleCancelBooking,
    handleViewDetails,
    CancellationConfirmDialog,
  };
};

export default useBookingActions;
