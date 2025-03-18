export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatDateTimeStamp = (timestamp: number) => {
  if (timestamp > 9999999999999) {
    timestamp = Math.floor(timestamp / 1000);
  }
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
