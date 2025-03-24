import {
  onValue,
  ref,
  getDatabase,
  update,
  set,
  off,
  orderByChild,
  equalTo,
  query,
  remove,
  push,
} from "firebase/database";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import firebase from "@/lib/firebase";

export const fetchCars = (userType: string, uid: string, search?: string) => {
  return new Promise<any[]>((resolve, reject) => {
    try {
      const db = getDatabase();
      const carRef =
        userType === "admin"
          ? ref(db, "cars")
          : query(ref(db, "cars"), orderByChild(userType), equalTo(uid));

      onValue(
        carRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            resolve([]);
            return;
          }
          const data = snapshot.val();
          const arr = Object.keys(data || {})
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter(
              (user) =>
                !search ||
                user.carType?.toLowerCase().includes(search.toLowerCase()) ||
                user.vehicleNumber
                  ?.toLowerCase()
                  .includes(search.toLowerCase()) ||
                user.vehicleMake
                  ?.toLowerCase()
                  .includes(search.toLowerCase()) ||
                user.vehicleModel
                  ?.toLowerCase()
                  .includes(search.toLowerCase()) ||
                user.other_info?.toLowerCase().includes(search.toLowerCase()),
            );
          resolve(arr.reverse());
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
        { onlyOnce: true },
      );
    } catch (error) {
      console.error("Fetch Cars Error:", error);
      reject(error);
    }
  });
};

export const updateCars = (id: string, updatedData: Record<string, any>) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const db = getDatabase();
      const carsRef = ref(db, `cars/${id}`);

      update(carsRef, updatedData)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error("Error updating car:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Update Car Error:", error);
      reject(error);
    }
  });
};

export const deleteCar = (id: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const db = getDatabase();
      const carRef = ref(db, `cars/${id}`);

      remove(carRef)
        .then(() => {
          console.log("Car deleted successfully!");
          resolve();
        })
        .catch((error) => {
          console.error("Error deleting car:", error);
          reject(error);
        });
    } catch (error) {
      // console.error("Delete Car Error:", error);
      reject(error);
    }
  });
};

export const fetchCarById = (id: string) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `cars/${id}`);

      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            resolve({ id: id, ...data });
          } else {
            resolve(null);
          }
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Fetch User Error:", error);
      reject(error);
    }
  });
};

export const fetchCarTypes = () => {
  return new Promise<any[]>((resolve, reject) => {
    try {
      const db = getDatabase();
      const carRef = ref(db, "cartypes");

      onValue(
        carRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            resolve([]);
            return;
          }
          let data = snapshot.val();
          const arr = Object.keys(data).map((i) => {
            data[i].id = i;
            return data[i];
          });
          resolve(arr.reverse());
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
        { onlyOnce: true },
      );
    } catch (error) {
      console.error("Fetch Cars Error:", error);
      reject(error);
    }
  });
};

export const addCar = (car: Record<string, any>) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const db = getDatabase();
      const carAddRef = ref(db, "cars");

      push(carAddRef, car)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error("Error adding car:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Add Car Error:", error);
      reject(error);
    }
  });
};
