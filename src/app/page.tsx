"use client";

import { useEffect, useState } from "react";
import { useFirebase } from "../contexts/FirebaseContext";
import { onValue } from "firebase/database";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Define types for user data
interface UserData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  createdAt?: number | string;
  [key: string]: any; // Allow for other properties
}

export default function UsersPage() {
  const firebase = useFirebase();
  const [users, setUsers] = useState<UserData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Theme management effect
  useEffect(() => {
    // Initialize based on system preference or saved preference
    const savedTheme = localStorage.getItem("theme");

    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

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
          .catch((err: Error) =>
            setError("Authentication failed: " + err.message),
          );
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
        (error: Error) => {
          setError(error.message);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      setError((error as Error).message);
    }
  }, [firebase, authenticated]);

  if (error) return <div className="p-4">Error: {error}</div>;
  if (!authenticated) return <div className="p-4">Authenticating...</div>;

  return (
    <div className="min-h-screen bg-background p-4 transition-colors duration-300">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className="rounded-md"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {users.length === 0 ? (
        <p className="text-foreground">No users found</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle>{user.name || "User"}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.phone && <p className="text-sm">📱 {user.phone}</p>}
                  {user.role && (
                    <p className="text-sm">
                      🔑 Role: <span className="font-medium">{user.role}</span>
                    </p>
                  )}
                  {user.createdAt && (
                    <p className="text-sm">
                      📅 Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
