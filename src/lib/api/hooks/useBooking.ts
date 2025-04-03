import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelBooking,
  fetchActiveBookings,
  fetchBookingById,
  fetchBookings,
  updateBooking,
  updateBookingImage
} from "../apiHandlers/bookingService";
import { BookingType } from "@/containers/bookingDetail/bookingTypes";

const BOOKING_STATE_KEY = "bookings";

/**
 * Hook to fetch all bookings for a user
 */
export const useBookings = (userId: string, userType: string, search?: string) => {
  return useQuery({
    queryKey: [BOOKING_STATE_KEY, search],
    queryFn: () => fetchBookings(userId, userType),
    staleTime: Infinity,
    retry: 2,
  });
};

/**
 * Hook to fetch only active bookings for a user
 */
export const useActiveBookings = (userId: string, userType: string) => {
  return useQuery({
    queryKey: [BOOKING_STATE_KEY, 'active', userId, userType],
    queryFn: () => fetchActiveBookings(userId, userType),
    staleTime: Infinity,
    retry: 2,
  });
};

/**
 * Hook to fetch a single booking by ID
 */
export const useBookingById = (id: string) => {
  return useQuery({
    queryKey: [BOOKING_STATE_KEY, 'detail', id],
    queryFn: () => fetchBookingById(id),
    staleTime: Infinity, 
    retry: 2,
    enabled: !!id 
  });
};

/**
 * Hook to update a booking
 */
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: Partial<BookingType> }) =>
      updateBooking(id, updatedData),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [BOOKING_STATE_KEY, 'detail', variables.id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [BOOKING_STATE_KEY] 
      });
    },
    onError: (error) => {
      console.error("Booking update failed:", error);
    },
  });
};

/**
 * Hook to cancel a booking
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, reason, cancelledBy }: 
      { bookingId: string; reason: string; cancelledBy: string }) =>
      cancelBooking(bookingId, reason, cancelledBy),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [BOOKING_STATE_KEY, 'detail', variables.bookingId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [BOOKING_STATE_KEY] 
      });
    },
    onError: (error) => {
      console.error("Booking cancellation failed:", error);
    },
  });
};

/**
 * Hook to update a booking image
 */
export const useUpdateBookingImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      bookingId, 
      imageType, 
      imageBlob 
    }: { 
      bookingId: string; 
      imageType: 'pickup_image' | 'deliver_image'; 
      imageBlob: Blob 
    }) => updateBookingImage(bookingId, imageType, imageBlob),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [BOOKING_STATE_KEY, 'detail', variables.bookingId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [BOOKING_STATE_KEY] 
      });
    },
    onError: (error) => {
      console.error("Booking image update failed:", error);
    },
  });
};