import {
  getDatabase,
  ref as dbRef,
  get,
  update
} from "firebase/database";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  usertype: string;
  verifyId?: string;
  profile_image?: string;
  lang?: {
    langLocale: string;
    dateLocale: string;
  };
}

export interface UserExistsResult {
  users?: Array<Record<string, unknown>>;
  error?: string;
}

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const db = getDatabase();
    console.log("Fetching profile for user ID:", userId);
    
    const snapshot = await get(dbRef(db, `users/${userId}`));
    // console.log("Firebase snapshot exists:", snapshot.exists());
    
    if (!snapshot.exists()) {
      throw new Error("Profile not found");
    }

    const userData = snapshot.val();
    // console.log("Raw user data from Firebase:", userData);
    
    return {
      uid: userId,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      mobile: userData.mobile || "",
      usertype: userData.usertype || "",
      verifyId: userData.verifyId || "",
      profile_image: userData.profile_image || "",
      lang: userData.lang || null
    };
  } catch (error) {
    // console.error("Fetch User Profile Error:", error);
    throw error;
  }
};

export const updateProfileData = async (
  userId: string,
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    const db = getDatabase();
    // console.log("Updating profile for user ID:", userId, "with data:", profileData);
    await update(dbRef(db, `users/${userId}`), profileData);
    return;
  } catch (error) {
    console.error("Update Profile Error:", error);
    throw error;
  }
};

export const uploadProfileImage = async (
  userId: string,
  imageFile: File
): Promise<string> => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `users/${userId}/profileImage`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);
    
    // console.log("Profile image uploaded for user ID:", userId, "URL:", imageUrl);
   
    const db = getDatabase();
    await update(dbRef(db, `users/${userId}`), { profile_image: imageUrl });
    
    return imageUrl;
  } catch (error) {
    console.error("Upload Profile Image Error:", error);
    throw error;
  }
};

export const checkUserExists = async (
  params: { email?: string; mobile?: string }
): Promise<UserExistsResult> => {
  try {
    const db = getDatabase();
    console.log("Checking if user exists with params:", params);
    
    const snapshot = await get(dbRef(db, 'users'));
    
    if (!snapshot.exists()) {
      return { users: [] };
    }
    
    const data = snapshot.val();
    const users: Array<Record<string, unknown>> = [];
    
    // Check if any user has the email or mobile
    for (const key in data) {
      const user = data[key];
      if ((params.email && user.email === params.email) || 
          (params.mobile && user.mobile === params.mobile)) {
        users.push({
          ...user,
          id: key
        });
      }
    }
    
    console.log("Found users:", users.length > 0 ? users : "None");
    return { users };
  } catch (error) {
    console.error("Check User Exists Error:", error);
    return { error: "Error checking user existence" };
  }
};