import { getDatabase, ref as dbRef, get } from "firebase/database";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  usertype?: string;
}

// Fetch users function with proper typing
export const fetchUsers = async (): Promise<User[]> => {
  const db = getDatabase();
  const usersRef = dbRef(db, "users");

  try {
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const usersData = snapshot.val();

      // Transform the object into an array of User objects
      const users: User[] = Object.keys(usersData).map((key) => {
        const userData = usersData[key];
        return {
          id: key,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          mobile: userData.mobile,
          usertype: userData.usertype,
        };
      });

      return users;
    }

    return [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Get single user
export const fetchUser = async (uid: string): Promise<User | null> => {
  const db = getDatabase();
  const userRef = dbRef(db, `users/${uid}`);

  try {
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      return {
        id: uid,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        mobile: userData.mobile,
        usertype: userData.usertype,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
