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
import {
  onValue,
  ref,
  getDatabase,
  off,
} from "firebase/database";
import { useEffect } from "react";

interface Location {
  add?: string;
  lat?: number;
  lng?: number;
}

interface BookingData {
  pickup?: Location;
  drop?: Location;
  discount?: number;
  cashPaymentAmount?: number;
  cardPaymentAmount?: number;
  bookingDate?: string;
  status?: string;
  driver_name?: string;
  carType?: string;
  driver?: string;
  reference?: string;
  trip_cost?: string | number;
  [key: string]: unknown;
}

const BOOKING_STATE_KEY = "bookings";

/**
 * Hook to fetch all bookings for a user
 */
export const useBookings = (userId: string, userType: string, search?: string) => {
  return useQuery({
    queryKey: [BOOKING_STATE_KEY, search],
    queryFn: () => fetchBookings(userId, userType),
    staleTime: Infinity,
    // refetchInterval: 1000 * 60,
    retry: 2,
  });
};

/**
 *  Realtime subscription hook
 */
export const useRealtimeBookings = (userId: string, userType: string) => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const db = getDatabase();
    const bookingListRef = ref(db, `bookings/${userType}/${userId}`);
    
    const unsubscribe = onValue(bookingListRef, (snapshot) => {
      if (!snapshot.exists()) {
        queryClient.setQueryData([BOOKING_STATE_KEY], []);
        return;
      }

      const data = snapshot.val();
      const bookings = Object.entries(data)
        .map(([id, value]) => {
          const bookingData = value as BookingData;
          return {
            id,
            pickupAddress: bookingData.pickup?.add || "",
            dropAddress: bookingData.drop?.add || "",
            discount: bookingData.discount || 0,
            cashPaymentAmount: bookingData.cashPaymentAmount || 0,
            cardPaymentAmount: bookingData.cardPaymentAmount || 0,
            ...bookingData,
          };
        })
        .sort((a, b) => {
          const dateA = a.bookingDate ? new Date(a.bookingDate).getTime() : 0;
          const dateB = b.bookingDate ? new Date(b.bookingDate).getTime() : 0;
          return dateB - dateA;
        });

      queryClient.setQueryData([BOOKING_STATE_KEY], bookings);
    });

    return () => {
      off(bookingListRef);
      unsubscribe();
    };
  }, [userId, userType, queryClient]);
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
    mutationFn: ({ bookingId, reason, cancelledBy, userType, userId }: 
      { bookingId: string; reason: string; cancelledBy: string; userType: string; userId: string }) => {
      console.log("Cancel booking mutation called with:", { bookingId, reason, cancelledBy, userType, userId });
      return cancelBooking(bookingId, reason, cancelledBy, userType, userId);
    },
    onSuccess: (_, variables) => {
      console.log("Booking cancelled successfully, invalidating queries");
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
      throw error;
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