import { useQuery } from "@tanstack/react-query";
import {
  fetchDriversEarningReport,
  fetchEarningReport,
  fetchFleetEarningReport,
} from "../apiHandlers/reportsService";

const USER_STATE_KEY = "reports";

export const useDriversReports = (
  userType: string,
  uid: string,
  search?: string,
) => {
  return useQuery({
    queryKey: [USER_STATE_KEY, userType, uid, search],
    queryFn: () => fetchDriversEarningReport(userType, uid, search),
    staleTime: Infinity,
    retry: 2,
    enabled: !!userType && !!uid,
  });
};

export const useEarningReports = (search?: string) => {
  return useQuery({
    queryKey: [USER_STATE_KEY, search],
    queryFn: () => fetchEarningReport(search),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useFleetEarningReports = (
  userType: string,
  uid: string,
  search?: string,
) => {
  return useQuery({
    queryKey: ["fleetreport", userType, uid, search],
    queryFn: () => fetchFleetEarningReport(userType, uid, search),
    staleTime: Infinity,
    retry: 2,
    enabled: !!userType && !!uid,
  });
};
