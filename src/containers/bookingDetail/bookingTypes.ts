import { ColumnDef } from "@tanstack/react-table";

export interface BookingType {
  id?: string;
  reference?: string;
  status?: string;
  distance?: string;
  rating?: number;
  tripdate?: string;
  bookingDate?: string;
  pickupAddress?: string;
  dropAddress?: string;
  reason?: string;
  trip_cost?: string | number;
  convenience_fees?: string | number;
  discount?: string | number;
  payment_mode?: string;
  driver_share?: string | number;
  driver_name?: string;
  driver_image?: string;
  carType?: string;
  customer?: string;
  customer_name?: string;
  customer_image?: string;
  customer_contact?: string;
  customer_email?: string;
  pickup?: {
    add?: string;
    lat?: number;
    lng?: number;
  };
  drop?: {
    add?: string;
    lat?: number;
    lng?: number;
  };
  driverOffers?: Record<string, any>;
}

export interface CancelBookingRequest {
  bookingId: string;
  reason: string;
  cancelledBy: string;
}

export interface BookingHistoryTableProps {
  search?: string;
  onSearchChange?: (search: string) => void;
  onCancelBooking?: (booking: any) => void;
  onSelectBid?: (booking: any) => void;
  onViewDetails?: (booking: any) => void;
  isLoading?: boolean;
}

export interface BookingHistoryTableProps {
  search?: string;
  onSearchChange?: (search: string) => void;
  onCancelBooking?: (booking: any) => void;
  onSelectBid?: (booking: any) => void;
  onViewDetails?: (booking: any) => void;
  isLoading?: boolean;
}

export interface Booking {
  id: string;
  bookingDate?: string;
  driver_name?: string;
  carType?: string;
  status?: string;
  trip_cost?: string | number;
  reference?: string;
  [key: string]: any;
}

export interface SearchBarProps {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
}

export interface ExportButtonProps {
  exportToCSV: () => void;
  disabled: boolean;
}

export interface UserInfo {
  id: string;
  usertype: string;
}