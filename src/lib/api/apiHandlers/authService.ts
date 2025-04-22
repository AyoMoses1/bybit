import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

interface Credentials {
  email: string;
  password: string;
}
export const login = (credentials: Credentials): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const auth = getAuth();

      signInWithEmailAndPassword(
        auth,
        credentials?.email,
        credentials?.password,
      )
        .then(() => {
          resolve();
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/network-request-failed":
              toast.error("Network Request Error. Try again later");
              break;
            case "auth/invalid-credential":
              toast.error("Invalid Credentials");
              break;
            case "auth/user-disabled":
              toast.error("This account has been disabled");
              break;
            case "auth/user-not-found":
              toast.error("Invalid Credentials");
              break;
            case "auth/invalid-email":
              toast.error("Invalid Credentials");
              break;
            case "auth/too-many-requests":
              toast.error("Too many failed attempts. Try again later");
              break;
            default:
              toast.error("An error occurred during login");
          }
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
