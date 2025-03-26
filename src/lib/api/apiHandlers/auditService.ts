import firebase from "@/lib/firebase";
import { child, set } from "firebase/database";

// new Date().toISOString(), // ISO timestamp
export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
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
