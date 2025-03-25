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
          if (error.code === "auth/network-request-failed") {
            toast.error("Network Request Error. Try again later");
          }
          // reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
