import { AuditAction, AuditLog } from "@/lib/api/apiHandlers/auditService";
import { useProcessAuditLog } from "@/lib/api/hooks/audit";
import { useEffect, useState } from "react";

export const generateUniqueId = (): string => {
  return `${Date.now()}${Math.floor(100 + Math.random() * 900)}`.slice(-6);
};

export const useAuditLog = () => {
  const auditMutation = useProcessAuditLog();
  const [ipAddress, setIpAddress] = useState<string>("Unknown");
  const [userInfo, setUserInfo] = useState<{
    id: string;
    usertype: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = localStorage.getItem("userInfo");
      if (info) {
        setUserInfo(JSON.parse(info));
      }
    }

    fetch("https://api64.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip))
      .catch(() => setIpAddress("Unknown"));
  }, []);

  const handleAudit = (
    entity: string, // User affected
    entityId: string, // Id of the user affected
    action: AuditAction, // The action can only be CREATE/UPDATE/DELETE which is an AuditAction type
    description: string, //Brief description of what is created/edited/deleted
  ) => {
    if (!userInfo) return;

    const auditData: AuditLog = {
      id: generateUniqueId(),
      action: action,
      entity: entity,
      entityId: entityId,
      userId: userInfo?.id ?? "",
      userRole: userInfo?.usertype ?? "",
      timestamp: new Date().toISOString(),
      ipAddress: ipAddress,
      description: description,
    };

    auditMutation.mutate(
      { data: auditData },
      {
        onError: () => {},
        onSuccess: async () => {},
      },
    );
  };

  return { handleAudit };
};
