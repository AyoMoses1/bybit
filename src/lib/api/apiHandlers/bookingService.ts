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

      // Return cleanup function
      return () => {
        off(bookingListRef);
        unsubscribe();
      };
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
    console.log(`Attempting to cancel booking: ${bookingId}, userId: ${userId}, userType: ${userType}`);
    
    if (userType === 'admin') {
      console.log("Admin cancellation flow initiated");
     
      const mainBookingRef = ref(db, `bookings/${bookingId}`);
      const mainSnapshot = await get(mainBookingRef);
      
      if (mainSnapshot.exists()) {
        const bookingData = mainSnapshot.val();
        console.log(`Found booking in main path: bookings/${bookingId}`, bookingData);
        
    
        const updates: Partial<Booking> = {
          status: 'CANCELLED',
          reason,
          cancelledBy,
          updatedAt: Date.now()
        };
        
       
        const updatePromises = [];
        
        updatePromises.push(update(mainBookingRef, updates));
        
    
        if (bookingData.customer) {
          console.log(`Updating customer path for customer ${bookingData.customer}`);
          updatePromises.push(update(ref(db, `bookings/customer/${bookingData.customer}/${bookingId}`), updates));
        }
        
        if (bookingData.driver) {
          console.log(`Updating driver path for driver ${bookingData.driver}`);
          updatePromises.push(update(ref(db, `bookings/driver/${bookingData.driver}/${bookingId}`), updates));
          
          if (['NEW', 'ACCEPTED', 'ARRIVED'].includes(bookingData.status || '')) {
            console.log(`Updating queue status for driver ${bookingData.driver}`);
            updatePromises.push(update(ref(db, `users/driver/${bookingData.driver}`), { queue: false }));
          }
        }
        
        if (bookingData.status === 'NEW') {
          console.log("Cleaning up requested drivers");
          updatePromises.push(remove(ref(db, `requestedDrivers/${bookingId}`)));
        }
        
        await Promise.all(updatePromises);
        console.log("Booking cancelled successfully by admin");
        return;
      }
      
    
      console.log("Booking not found in main path, searching in customer and driver paths");
      
      const customersRef = ref(db, 'bookings/customer');
      const customersSnapshot = await get(customersRef);
      
      if (customersSnapshot.exists()) {
        const customers = customersSnapshot.val();
        
        for (const customerId in customers) {
          const customerBookingRef = ref(db, `bookings/customer/${customerId}/${bookingId}`);
          const snapshot = await get(customerBookingRef);
          
          if (snapshot.exists()) {
            const bookingData = snapshot.val();
            console.log(`Found booking in customer path: bookings/customer/${customerId}/${bookingId}`, bookingData);
         
            const updates: Partial<Booking> = {
              status: 'CANCELLED',
              reason,
              cancelledBy,
              updatedAt: Date.now()
            };
            
           
            await update(customerBookingRef, updates);
            
            
            await update(ref(db, `bookings/${bookingId}`), {
              ...bookingData,
              ...updates
            });
            
            if (bookingData.driver) {
              await update(ref(db, `bookings/driver/${bookingData.driver}/${bookingId}`), updates);
              
              if (['NEW', 'ACCEPTED', 'ARRIVED'].includes(bookingData.status || '')) {
                await update(ref(db, `users/driver/${bookingData.driver}`), { queue: false });
              }
            }
           
            if (bookingData.status === 'NEW') {
              await remove(ref(db, `requestedDrivers/${bookingId}`));
            }
            
            console.log("Booking cancelled successfully by admin");
            return;
          }
        }
      }
      
      const driversRef = ref(db, 'bookings/driver');
      const driversSnapshot = await get(driversRef);
      
      if (driversSnapshot.exists()) {
        const drivers = driversSnapshot.val();
        
        for (const driverId in drivers) {
          const driverBookingRef = ref(db, `bookings/driver/${driverId}/${bookingId}`);
          const snapshot = await get(driverBookingRef);
          
          if (snapshot.exists()) {
            const bookingData = snapshot.val();
            console.log(`Found booking in driver path: bookings/driver/${driverId}/${bookingId}`, bookingData);
           
            const updates: Partial<Booking> = {
              status: 'CANCELLED',
              reason,
              cancelledBy,
              updatedAt: Date.now()
            };
       
            await update(driverBookingRef, updates);
            
            await update(ref(db, `bookings/${bookingId}`), {
              ...bookingData,
              ...updates
            });
           
            if (bookingData.customer) {
              await update(ref(db, `bookings/customer/${bookingData.customer}/${bookingId}`), updates);
            }
          
            if (['NEW', 'ACCEPTED', 'ARRIVED'].includes(bookingData.status || '')) {
              await update(ref(db, `users/driver/${driverId}`), { queue: false });
            }
          
            if (bookingData.status === 'NEW') {
              await remove(ref(db, `requestedDrivers/${bookingId}`));
            }
            
            console.log("Booking cancelled successfully by admin");
            return;
          }
        }
      }
      
      throw new Error(`Booking ${bookingId} not found in any path`);
    } else {
     
      const bookingRef = ref(db, `bookings/${userType}/${userId}/${bookingId}`);
      const snapshot = await get(bookingRef);
      
      if (!snapshot.exists()) {
        throw new Error("Booking not found in user's records");
      }
      
      const bookingData = snapshot.val();
      const updates = {
        status: 'CANCELLED',
        reason,
        cancelledBy,
        updatedAt: Date.now()
      };
      
    
      await update(bookingRef, updates);
      
     
      const mainBookingRef = ref(db, `bookings/${bookingId}`);
      const mainSnapshot = await get(mainBookingRef);
      if (mainSnapshot.exists()) {
        await update(mainBookingRef, updates);
      }
   
      if (bookingData.driver && ['NEW', 'ACCEPTED', 'ARRIVED'].includes(bookingData.status || '')) {
        const driverRef = ref(db, `users/driver/${bookingData.driver}`);
        await update(driverRef, { queue: false });
      }
     
      if (bookingData.status === 'NEW') {
        const requestedDriversRef = ref(db, `requestedDrivers/${bookingId}`);
        await remove(requestedDriversRef);
      }
    }
  } catch (error) {
    console.error("Detailed cancellation error:", {
      bookingId,
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      userType,
      userId
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