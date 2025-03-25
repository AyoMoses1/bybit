import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
