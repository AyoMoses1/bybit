import { useState, useEffect } from "react";

interface UserInfo {
  id: string;
  usertype: string;
}

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const info = localStorage.getItem("userInfo");
        if (info) {
          setUserInfo(JSON.parse(info));
          console.log("User info loaded from localStorage:", JSON.parse(info));
        } else {
          console.warn("No userInfo found in localStorage");
          // Check if "user" is available instead
          const user = localStorage.getItem("user");
          if (user) {
            const parsedUser = JSON.parse(user);
            console.log("Found user in localStorage instead:", parsedUser);
            setUserInfo({
              id: parsedUser.id,
              usertype: parsedUser.usertype || "customer",
            });
          }
        }
      } catch (error) {
        console.error("Error loading user info from localStorage:", error);
      }
    }
  }, []);

  return { userInfo };
};

export default useUserInfo;
