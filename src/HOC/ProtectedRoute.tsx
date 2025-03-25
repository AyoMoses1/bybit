"use client";

import { useRouter } from "next/navigation";
import { ComponentType, useEffect, useState } from "react";

const ProtectedRoute = <P extends object>(
  WrappedComponent: ComponentType<P>,
) => {
  const Wrapper = (props: P) => {
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
    }, [router]);

    if (loading) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default ProtectedRoute;
