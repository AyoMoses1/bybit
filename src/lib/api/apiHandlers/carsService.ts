import {
  onValue,
  ref,
  getDatabase,
  update,
  remove,
  push,
} from "firebase/database";

type Car = {
  id: string;
  carType?: string;
  vehicleNumber?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  other_info?: string;
  brand?: string;
  model?: string;
  year?: number;
  type?: string;
  price?: number;
  active: boolean;
  driver: string;
  approved: boolean;
};

type CarType = {
  id: string;
  name: string;
  active: boolean;
  driver: string;
  approved: boolean;
};

export const fetchCars = (userType: string, uid: string, search?: string) => {
  return new Promise<Car[]>((resolve, reject) => {
    try {
      const db = getDatabase();
      const carRef = ref(db, "cars");

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  return new Promise<Car>((resolve, reject) => {
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
            // resolve("Can not get car details");
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
  return new Promise<CarType[]>((resolve, reject) => {
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
          const data = snapshot.val();
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

export const addCar = (car: Record<string, Car>) => {
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
