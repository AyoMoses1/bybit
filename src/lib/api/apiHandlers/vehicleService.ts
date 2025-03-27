import { CancellationSlab } from "@/containers/vehicle/vehicleTypes";
import {
  getDatabase,
  onValue,
  push,
  ref as dbRef,
  remove,
  set,
  get,
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
        { onlyOnce: true }
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

  try {
    console.log(
      `${method} operation with data:`,
      JSON.stringify({
        id: cartype.id,
        name: cartype.name,
        hasImage: !!cartype.image,
      })
    );

    if (
      method === "UpdateImage" &&
      cartype.id &&
      cartype.image instanceof File
    ) {
      console.log(
        `Uploading image for vehicle ${cartype.id}, size: ${cartype.image.size} bytes`
      );

      const imageRef = storageRef(storage, `cartypes/${cartype.id}`);

      try {
        const uploadTask = uploadBytesResumable(imageRef, cartype.image);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              console.log(`Upload progress: ${progress}%`);
            },
            (error) => {
              console.error("Upload failed:", error);
              reject(error);
            },
            () => {
              console.log("Upload completed");
              resolve();
            }
          );
        });

        const downloadURL = await getDownloadURL(imageRef);
        // console.log("Image download URL:", downloadURL);

        const vehicleRef = dbRef(db, `cartypes/${cartype.id}`);
        const snapshot = await get(vehicleRef);

        if (snapshot.exists()) {
          const currentData = snapshot.val();
          await set(vehicleRef, {
            ...currentData,
            image: downloadURL,
          });
          console.log("Database updated with new image URL");
        } else {
          console.error("Vehicle record not found for ID:", cartype.id);
          throw new Error("Vehicle record not found");
        }
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        throw uploadError;
      }
    } else if (method === "Add") {
      if (cartype.image instanceof File) {
        const newVehicleRef = push(dbRef(db, "cartypes"));
        const newId = newVehicleRef.key;

        if (!newId) {
          throw new Error("Failed to generate new vehicle ID");
        }

        const imageRef = storageRef(storage, `cartypes/${newId}`);
        await uploadBytesResumable(imageRef, cartype.image);
        const downloadURL = await getDownloadURL(imageRef);

        const cartypeWithoutImage = { ...cartype };
        delete cartypeWithoutImage.image;

        // Update with new image URL
        await set(dbRef(db, `cartypes/${cartype.id}`), {
          ...cartypeWithoutImage,
          image: downloadURL,
        });
      } else {
        await push(dbRef(db, "cartypes"), cartype);
      }
    } else if (method === "Edit" && cartype.id) {
      if (cartype.image instanceof File) {
        const imageRef = storageRef(storage, `cartypes/${cartype.id}`);
        await uploadBytesResumable(imageRef, cartype.image);
        const downloadURL = await getDownloadURL(imageRef);

        const cartypeWithoutImage = { ...cartype };
        delete cartypeWithoutImage.image;
        await set(dbRef(db, `cartypes/${cartype.id}`), {
          ...cartypeWithoutImage,
          image: downloadURL,
        });
      } else {
        await set(dbRef(db, `cartypes/${cartype.id}`), cartype);
      }
    } else if (method === "Delete" && cartype.id) {
      await remove(dbRef(db, `cartypes/${cartype.id}`));
    } else {
      throw new Error(`Invalid operation: ${method} or missing required data`);
    }
  } catch (error) {
    console.error(`Error in editCarType (${method}):`, error);
    throw error;
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
        { onlyOnce: true }
      );
    } catch (error) {
      console.error("Fetch Car Type Error:", error);
      reject(error);
    }
  });
};
