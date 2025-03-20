import {
  onValue,
  ref,
  getDatabase,
  update,
  off,
  remove,
  push,
  get,
  query,
  orderByChild,
  equalTo
} from "firebase/database";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebase from "@/lib/firebase";

export const fetchBookings = (userId: string, userType: string, search?: string) => {
  return new Promise<any[]>((resolve, reject) => {
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
            .map(([id, value]: [string, any]) => ({
              id,
              pickupAddress: value.pickup?.add || "",
              dropAddress: value.drop?.add || "",
              discount: value.discount || 0,
              cashPaymentAmount: value.cashPaymentAmount || 0,
              cardPaymentAmount: value.cardPaymentAmount || 0,
              ...value,
            }))
            .filter(booking => {
              if (!search) return true;
              
              const searchLower = search.toLowerCase();
              return (
                (booking.id && booking.id.toLowerCase().includes(searchLower)) || 
                (booking.pickupAddress && booking.pickupAddress.toLowerCase().includes(searchLower)) ||
                (booking.dropAddress && booking.dropAddress.toLowerCase().includes(searchLower)) ||
                (booking.status && booking.status.toLowerCase().includes(searchLower)) ||
                (booking.driver_name && booking.driver_name.toLowerCase().includes(searchLower)) ||
                (booking.carType && booking.carType.toLowerCase().includes(searchLower))
              );
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
  return new Promise<any[]>((resolve, reject) => {
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
            .map(([id, value]: [string, any]) => ({
              id,
              pickupAddress: value.pickup?.add || "",
              dropAddress: value.drop?.add || "",
              ...value,
            }))
            .filter(booking => 
              ['PAYMENT_PENDING', 'NEW', 'ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING', 'PAID']
              .includes(booking.status)
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
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const bookingRef = ref(db, `bookings/${id}`);

      const unsubscribe = onValue(
        bookingRef,
        (snapshot) => {
          const data = snapshot.val();
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

export const updateBooking = (id: string, updatedData: Record<string, any>) => {
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

export const cancelBooking = (bookingId: string, reason: string, cancelledBy: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const db = getDatabase();
      const bookingRef = ref(db, `bookings/${bookingId}`);
      
      // First get the booking to check status and get driver info
      get(bookingRef).then((snapshot) => {
        const booking = snapshot.val();
        
        if (!booking) {
          reject(new Error("Booking not found"));
          return;
        }
        
        // Update the booking status
        update(bookingRef, {
          status: 'CANCELLED',
          reason: reason,
          cancelledBy: cancelledBy
        }).then(() => {
          // If there's a driver and booking status is NEW or ACCEPTED or ARRIVED
          if (booking.driver && 
              (booking.status === 'NEW' || 
               booking.status === 'ACCEPTED' || 
               booking.status === 'ARRIVED')) {
            
            // Update driver queue status
            const driverRef = ref(db, `users/${booking.driver}`);
            update(driverRef, { queue: false })
              .then(() => resolve())
              .catch(reject);
            
            // If driver has token, send notification (this would be implemented separately)
            
          } else {
            resolve();
          }
          
          // If booking status is NEW, remove requested drivers
          if (booking.status === 'NEW') {
            const requestedDriversRef = ref(db, `requestedDrivers/${bookingId}`);
            remove(requestedDriversRef)
              .then(() => resolve())
              .catch(reject);
          }
        }).catch(reject);
      }).catch(reject);
    } catch (error) {
      console.error("Cancel Booking Error:", error);
      reject(error);
    }
  });
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

