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

export const fetchAudits = (
  search?: string,
  filter?: string | null,
  customDateRange?: { from: string; to: string },
) => {
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
          const now = new Date();

          const arr = Object.keys(data || {})
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((user) => {
              // Search filter
              const matchesSearch =
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
                user?.timestamp?.toLowerCase().includes(search.toLowerCase());

              // Date filter
              const timestamp = new Date(user.timestamp);
              let matchesFilter = true;

              if (filter === "today") {
                matchesFilter = timestamp.toDateString() === now.toDateString();
              } else if (filter === "thisMonth") {
                matchesFilter =
                  timestamp.getFullYear() === now.getFullYear() &&
                  timestamp.getMonth() === now.getMonth();
              } else if (filter === "lastMonth") {
                const lastMonth = new Date(
                  now.getFullYear(),
                  now.getMonth() - 1,
                  1,
                );
                matchesFilter =
                  timestamp.getFullYear() === lastMonth.getFullYear() &&
                  timestamp.getMonth() === lastMonth.getMonth();
              } else if (filter === "last3Months") {
                const threeMonthsAgo = new Date(
                  now.getFullYear(),
                  now.getMonth() - 3,
                  1,
                );
                matchesFilter = timestamp >= threeMonthsAgo;
              } else if (filter === "custom" && customDateRange) {
                const from = new Date(customDateRange.from);
                const to = new Date(customDateRange.to);
                matchesFilter = timestamp >= from && timestamp <= to;
              }

              return matchesSearch && matchesFilter;
            });

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
      console.error("Fetch Audits Error:", error);
      reject(error);
    }
  });
};
