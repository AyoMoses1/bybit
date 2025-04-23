import {
  onValue,
  ref,
  getDatabase,
  update,
  remove,
  push,
  get,
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

export const fetchCars = async (
  userType: string,
  uid: string,
  search?: string,
): Promise<Car[]> => {
  try {
    const db = getDatabase();
    const [carSnapshot, userSnapshot] = await Promise.all([
      get(ref(db, "cars")),
      get(ref(db, "users")), // assuming driver/user data is under "users"
    ]);

    if (!carSnapshot.exists()) return [];

    const carData = carSnapshot.val();
    const userData = userSnapshot.exists() ? userSnapshot.val() : {};

    const cars: Car[] = Object.keys(carData).map((key) => ({
      id: key,
      ...carData[key],
    }));

    const filtered = cars.filter((car) => {
      const driver = userData[car.driver];
      const driverFullName = driver
        ? `${driver.firstName ?? ""} ${driver.lastName ?? ""}`.toLowerCase()
        : "";

      return (
        !search ||
        car.carType?.toLowerCase().includes(search.toLowerCase()) ||
        car.vehicleNumber?.toLowerCase().includes(search.toLowerCase()) ||
        car.vehicleMake?.toLowerCase().includes(search.toLowerCase()) ||
        car.vehicleModel?.toLowerCase().includes(search.toLowerCase()) ||
        car.other_info?.toLowerCase().includes(search.toLowerCase()) ||
        driverFullName.includes(search.toLowerCase())
      );
    });

    return filtered.reverse();
  } catch (error) {
    console.error("Fetch Cars Error:", error);
    throw error;
  }
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
      reject(error);
    }
  });
};
