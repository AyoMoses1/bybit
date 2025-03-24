import React from "react";

const StatusBadge = ({ status }: { status: string }) => {
  if (!status) return null;

  let bgColor = "bg-green-100";
  let textColor = "text-green-500";
  let displayText = status;

  switch (status?.toUpperCase()) {
    case "CANCELLED":
      bgColor = "bg-red-200";
      textColor = "text-red-500";
      displayText = "Cancelled";
      break;
    case "PENDING":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-700";
      displayText = "Pending";
      break;
    case "COMPLETED":
    case "COMPLETE":
      bgColor = "bg-green-100";
      textColor = "text-green-500";
      displayText = "Completed";
      break;
    case "NEW":
      bgColor = "bg-indigo-100";
      textColor = "text-indigo-700";
      displayText = "New";
      break;
    case "ACCEPTED":
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
      displayText = "Accepted";
      break;
    case "STARTED":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      displayText = "Started";
      break;
  }

  return (
    <span
      className={`${bgColor} ${textColor} rounded-full px-3 py-1 text-sm font-medium`}
    >
      {displayText}
    </span>
  );
};

export default StatusBadge;
