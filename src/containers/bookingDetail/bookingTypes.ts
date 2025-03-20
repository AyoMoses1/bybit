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