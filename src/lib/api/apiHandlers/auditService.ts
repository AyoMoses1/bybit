import firebase from "@/lib/firebase";
import { child, getDatabase, onValue, ref, set } from "firebase/database";

// new Date().toISOString(), // ISO timestamp
export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  EXPORT = "EXPORT",
}
export type AuditLog = {
  id: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  userId: string;
  userRole: string;
  timestamp: string;
  ipAddress: string;
  description: string;
};

export const audit = (data: AuditLog) => {
  return new Promise((resolve, reject) => {
    try {
      const { auditRef } = firebase;

      set(child(auditRef, data.id), {
        id: data.id,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        userId: data.userId,
        userRole: data.userRole,
        timestamp: data.timestamp,
        ipAddress: data.ipAddress,
        description: data.description,
      });

      resolve("Processed Successfully");
    } catch (error) {
      console.error("Audit Log Error:", error);
      reject(error);
    }
  });
};

export const fetchAudits = (search?: string) => {
  return new Promise<AuditLog[]>((resolve, reject) => {
    try {
      const db = getDatabase();
      const auditRef = ref(db, "audit");

      onValue(
        auditRef,
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
                user.description
                  ?.toLowerCase()
                  .includes(search.toLowerCase()) ||
                user?.id?.toLowerCase().includes(search.toLowerCase()) ||
                user?.action?.toLowerCase().includes(search.toLowerCase()) ||
                user?.entity?.toLowerCase().includes(search.toLowerCase()) ||
                user?.entityId?.toLowerCase().includes(search.toLowerCase()) ||
                user?.userId?.toLowerCase().includes(search.toLowerCase()) ||
                user?.userRole?.toLowerCase().includes(search.toLowerCase()) ||
                user?.timestamp?.toLowerCase().includes(search.toLowerCase()),
            );
          resolve(
            arr.sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
            ),
          );
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
