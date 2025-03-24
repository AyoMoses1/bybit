import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const login = (credentials: Record<string, any>) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const auth = getAuth();

      signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        .then((res) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
