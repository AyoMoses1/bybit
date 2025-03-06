"use client";

import { useEffect, useState } from "react";
import { useFirebase } from "../contexts/FirebaseContext";
import { onValue } from "firebase/database";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

export default function UsersPage() {
  const firebase = useFirebase();
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // First check authentication state
    const unsubAuth = onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        signInWithEmailAndPassword(
          firebase.auth,
          "info@valonconsultinggroup.com",
          "SecurePassword@123!",
        )
          .then(() => setAuthenticated(true))
          .catch((err) => setError("Authentication failed: " + err.message));
      }
    });

    return () => unsubAuth();
  }, [firebase.auth]);

  useEffect(() => {
    // Only fetch users when authenticated
    if (!authenticated) return;

    try {
      const userRef = firebase.usersRef;
      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const usersArray = Object.entries(data).map(([key, value]) => ({
              id: key,
              ...(value as any),
            }));
            setUsers(usersArray);
          }
        },
        (error) => {
          setError(error.message);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      setError((error as Error).message);
    }
  }, [firebase, authenticated]);

  if (error) return <div>Error: {error}</div>;
  if (!authenticated) return <div>Authenticating...</div>;

  return (
    <div>
      <h1>Users</h1>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name || user.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
