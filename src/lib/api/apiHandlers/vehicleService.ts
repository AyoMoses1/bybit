import { CancellationSlab } from "@/containers/vehicle/vehicleTypes";
import {
  getDatabase,
  onValue,
  push,
  ref as dbRef,
  remove,
  set,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

interface CarType {
  [key: string]:
    | string
    | number
    | boolean
    | File
    | CancellationSlab[]
    | undefined;
  id?: string;
  name: string;
  image?: File | string;
}

interface EditCarTypeParams {
  cartype: CarType;
  method: "Add" | "Delete" | "UpdateImage" | "Edit";
}

export const fetchCarTypes = (): Promise<CarType[]> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const carRef = dbRef(db, "cartypes");

      onValue(
        carRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            resolve([]);
            return;
          }
          const data = snapshot.val();
          const arr = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          resolve(arr.reverse());
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
        { onlyOnce: true },
      );
    } catch (error) {
      console.error("Fetch Car Types Error:", error);
      reject(error);
    }
  });
};

export const editCarType = async ({
  cartype,
  method,
}: EditCarTypeParams): Promise<void> => {
  const db = getDatabase();
  const storage = getStorage();

  if (method === "Add") {
    await push(dbRef(db, "cartypes"), cartype);
  } else if (method === "Delete" && cartype.id) {
    await remove(dbRef(db, `cartypes/${cartype.id}`));
  } else if (
    method === "UpdateImage" &&
    cartype.id &&
    cartype.image instanceof File
  ) {
    const imageRef = storageRef(storage, `cartypes/${cartype.id}`);
    await uploadBytesResumable(imageRef, cartype.image);
    const imageUrl = await getDownloadURL(imageRef);
    await set(dbRef(db, `cartypes/${cartype.id}`), {
      ...cartype,
      image: imageUrl,
    });
  } else if (method === "Edit" && cartype.id) {
    await set(dbRef(db, `cartypes/${cartype.id}`), cartype);
  } else {
    throw new Error("Invalid method or missing required fields.");
  }
};

export const fetchCarTypeById = (id: string): Promise<CarType> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const carRef = dbRef(db, `cartypes/${id}`);

      onValue(
        carRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            reject(new Error("Vehicle type not found"));
            return;
          }
          const data = snapshot.val();
          resolve({ id, ...data });
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
        { onlyOnce: true },
      );
    } catch (error) {
      console.error("Fetch Car Type Error:", error);
      reject(error);
    }
  });
};
