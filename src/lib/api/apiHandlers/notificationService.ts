import { getApp } from "firebase/app";
import { getDatabase, onValue, set, push, remove, ref as dbRef } from "firebase/database";

type NotificationValue = string | number | boolean | Record<string, unknown> | Date | undefined;

export interface AppNotification {
  id?: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  createdAt?: number;
  usertype?: string;
  devicetype?: string;
  [key: string]: NotificationValue | NotificationValue[];
}

export const fetchUserNotifications = (userId: string): Promise<AppNotification[]> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const notificationsRef = dbRef(db, `users/${userId}/notifications`);

      onValue(
        notificationsRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            resolve([]);
            return;
          }
          const data = snapshot.val();
          const arr = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).reverse();
          resolve(arr);
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        }
      );
    } catch (error) {
      console.error("Fetch User Notifications Error:", error);
      reject(error);
    }
  });
};

export const fetchAllNotifications = (): Promise<AppNotification[]> => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const notificationsRef = dbRef(db, 'notifications');

      onValue(
        notificationsRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            console.log("No notifications found in the database"); 
            resolve([]);
            return;
          }
          const data = snapshot.val();
          const arr = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          console.log("Fetched notifications:", arr.length);
          resolve(arr);
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        }
      );
    } catch (error) {
      console.error("Fetch All Notifications Error:", error);
      reject(error);
    }
  });
};

export const editNotification = async (notification: AppNotification, method: 'Add' | 'Delete' | 'Edit'): Promise<void> => {
  try {
    const db = getDatabase();

    if (method === 'Add') {
      const newNotificationRef = push(dbRef(db, 'notifications'));
      await set(newNotificationRef, {
        ...notification,
        createdAt: Date.now()
      });
      console.log(`Notification added with ID: ${newNotificationRef.key}`);
    } 
    else if (method === 'Delete' && notification.id) {
      await remove(dbRef(db, `notifications/${notification.id}`));
      console.log(`Notification deleted with ID: ${notification.id}`);
    } 
    else if (method === 'Edit' && notification.id) {
      await set(dbRef(db, `notifications/${notification.id}`), {
        ...notification,
        updatedAt: Date.now()
      });
      console.log(`Notification updated with ID: ${notification.id}`);
    } 
    else {
      throw new Error(`Invalid operation: ${method} or missing required data`);
    }
  } catch (error) {
    console.error(`Error in editNotification (${method}):`, error);
    throw error;
  }
};

export const sendPushNotification = async (
  notification: Omit<AppNotification, 'id'>,
): Promise<void> => {
  try {
    const firebaseConfig = getApp().options;
    const projectId = firebaseConfig.projectId;
    
    const region = 'us-central1'; 
    const url = `https://${region}-${projectId}.cloudfunctions.net/send_notification`;

    // First, add the notification to the Firebase database
    const db = getDatabase();
    const newNotificationRef = push(dbRef(db, 'notifications'));
    
    // Add the notification to the database with additional metadata
    await set(newNotificationRef, {
      ...notification,
      createdAt: Date.now()
    });
    console.log(`Added notification to database with ID: ${newNotificationRef.key}`);
    
    // Then send it via the cloud function
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notification: {
          ...notification,
          msg: notification.body,
          createdAt: Date.now()
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Notification sent successfully:', responseData);
    
  } catch (error) {
    console.error("Send Notification Error:", error);
    throw error;
  }
};