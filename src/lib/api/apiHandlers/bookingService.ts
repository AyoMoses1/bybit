import {
  onValue,
  ref,
  getDatabase,
  update,
  off,
  remove,
  get
} from "firebase/database";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebase from "@/lib/firebase";

interface Location {
  add?: string;
  lat?: number;
  lng?: number;
}

interface Booking {
  id: string;
  reference?: string;
  pickup?: Location;
  drop?: Location;
  pickupAddress: string;
  dropAddress: string;
  discount: number;
  cashPaymentAmount: number;
  cardPaymentAmount: number;
  bookingDate?: string;
  status?: string;
  driver_name?: string;
  carType?: string;
  driver?: string;
  pickup_image?: string;
  deliver_image?: string;
  reason?: string;
  cancelledBy?: string;
  trip_cost?: string | number;
  [key: string]: unknown;
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

export const fetchBookings = (userId: string, userType: string) => {
  return new Promise<Booking[]>((resolve, reject) => {
    try {
      const db = getDatabase();
      const bookingListRef = ref(db, `bookings/${userType}/${userId}`);

      off(bookingListRef);

      const unsubscribe = onValue(
        bookingListRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            resolve([]);
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

          resolve(bookings);
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Fetch Bookings Error:", error);
      reject(error);
    }
  });
};

export const fetchUserRides = (userId: string, userType: string) => {
  return fetchBookings(userId, userType);
};

export const fetchActiveBookings = (userId: string, userType: string) => {
  return new Promise<Booking[]>((resolve, reject) => {
    try {
      const db = getDatabase();
      const bookingListRef = ref(db, `bookings/${userType}/${userId}`);

      off(bookingListRef);

      const unsubscribe = onValue(
        bookingListRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            resolve([]);
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
            .filter(booking => 
              ['PAYMENT_PENDING', 'NEW', 'ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING', 'PAID']
              .includes(booking.status || '')
            )
            .sort((a, b) => {
              // Sort by date (newest first)
              const dateA = a.bookingDate ? new Date(a.bookingDate).getTime() : 0;
              const dateB = b.bookingDate ? new Date(b.bookingDate).getTime() : 0;
              return dateB - dateA;
            });

          resolve(bookings);
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Fetch Active Bookings Error:", error);
      reject(error);
    }
  });
};

export const fetchBookingById = (id: string) => {
  return new Promise<Booking | null>((resolve, reject) => {
    try {
      const db = getDatabase();
      const bookingRef = ref(db, `bookings/${id}`);

      const unsubscribe = onValue(
        bookingRef,
        (snapshot) => {
          const data = snapshot.val() as BookingData | null;
          if (data) {
            resolve({ 
              id, 
              pickupAddress: data.pickup?.add || "",
              dropAddress: data.drop?.add || "",
              discount: data.discount || 0,
              cashPaymentAmount: data.cashPaymentAmount || 0,
              cardPaymentAmount: data.cardPaymentAmount || 0,
              ...data 
            });
          } else {
            resolve(null);
          }
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Fetch Booking Error:", error);
      reject(error);
    }
  });
};

export const updateBooking = (id: string, updatedData: Record<string, unknown>) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const db = getDatabase();
      const bookingRef = ref(db, `bookings/${id}`);

      update(bookingRef, updatedData)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error("Error updating booking:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Update Booking Error:", error);
      reject(error);
    }
  });
};

export const cancelBooking = async (
  bookingId: string,
  reason: string,
  cancelledBy: string,
  userType: string,
  userId: string
) => {
  try {
    const db = getDatabase();
    console.log(`Attempting to cancel booking: ${bookingId}`); // Debug log
    
    // Correct path to the booking
    const bookingRef = ref(db, `bookings/${userType}/${userId}/${bookingId}`);
    console.log(`Booking path: bookings/${userType}/${userId}/${bookingId}`); // Debug log

    // Get the current booking data
    const snapshot = await get(bookingRef);
    const booking = snapshot.val() as BookingData | null;
    
    if (!booking) {
      console.error("Booking not found at path:", `bookings/${userType}/${userId}/${bookingId}`);
      throw new Error("Booking not found");
    }

    console.log("Current booking status:", booking.status); // Debug log

    // Prepare updates
    const updates: Record<string, unknown> = {
      status: 'CANCELLED',
      reason,
      cancelledBy,
      updatedAt: Date.now()
    };

    // Update the booking
    console.log("Updating booking with:", updates); // Debug log
    await update(bookingRef, updates);
    console.log("Booking status updated successfully"); // Debug log

    // Handle driver-related updates if needed
    if (booking.driver && ['NEW', 'ACCEPTED', 'ARRIVED'].includes(booking.status || '')) {
      console.log("Updating driver queue status for driver:", booking.driver); // Debug log
      const driverRef = ref(db, `users/${booking.driver}`);
      await update(driverRef, { queue: false });
    }

    // Clean up requested drivers if needed
    if (booking.status === 'NEW') {
      console.log("Cleaning up requested drivers for booking:", bookingId); // Debug log
      const requestedDriversRef = ref(db, `requestedDrivers/${bookingId}`);
      await remove(requestedDriversRef);
    }

    console.log("Booking cancellation completed successfully"); // Debug log
  } catch (error) {
    console.error("Detailed cancellation error:", {
      bookingId,
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
};

export const updateBookingImage = async (
  bookingId: string,
  imageType: 'pickup_image' | 'deliver_image',
  imageBlob: Blob
) => {
  try {
    const { bookingImageRef } = firebase;
    
    // Upload the image
    const uploadTask = uploadBytesResumable(bookingImageRef(bookingId, imageType), imageBlob);
    await uploadTask;

    // Get the download URL
    const imageUrl = await getDownloadURL(bookingImageRef(bookingId, imageType));
    
    // Update the booking with the image URL
    const db = getDatabase();
    const bookingRef = ref(db, `bookings/${bookingId}`);
    const updateData = imageType === 'pickup_image' 
      ? { pickup_image: imageUrl } 
      : { deliver_image: imageUrl };
    
    await update(bookingRef, updateData);
    
    return imageUrl;
  } catch (error) {
    console.error(`Error updating ${imageType}:`, error);
    throw error;
  }
};