"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

const ProtectedRoute = <P extends object>(WrappedComponent: FC<P>) => {
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
