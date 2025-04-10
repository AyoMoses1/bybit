import moment from "moment";

export const formatDate = (timestamp: number) => {
  return moment(timestamp).format("DD MMM YYYY - hh:mm a");
};
