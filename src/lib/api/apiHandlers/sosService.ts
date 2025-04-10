import { getDatabase, onValue, ref } from "firebase/database";
import moment from "moment";

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  EXPORT = "EXPORT",
}
export type SosLog = {
  id: string;
  user_name?: string;
  contact?: string;
  user_type?: string;
  complainDate?: string;
};

export const fetchSos = (search?: string) => {
  return new Promise<SosLog[]>((resolve, reject) => {
    try {
      const db = getDatabase();
      const sosRef = ref(db, "sos");

      onValue(
        sosRef,
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
            .filter((user) => {
              const formattedDate = user.complainDate
                ? moment(user.complainDate).format("DD MMM YYYY - hh:mm a")
                : "";

              return (
                !search ||
                user.description
                  ?.toLowerCase()
                  .includes(search.toLowerCase()) ||
                user?.id?.toLowerCase().includes(search.toLowerCase()) ||
                user?.user_name?.toLowerCase().includes(search.toLowerCase()) ||
                user?.contact?.toLowerCase().includes(search.toLowerCase()) ||
                user?.user_type?.toLowerCase().includes(search.toLowerCase()) ||
                formattedDate.toLowerCase().includes(search.toLowerCase())
              );
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
