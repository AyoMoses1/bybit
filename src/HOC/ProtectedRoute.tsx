"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const userAuthenticated =
        localStorage.getItem("authenticated") === "true";

      if (!userAuthenticated) {
        router.replace("/");
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default ProtectedRoute;
