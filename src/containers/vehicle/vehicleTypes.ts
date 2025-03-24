export interface CarType {
  id?: string;
  name: string;
  image?: string | File;
  base_fare?: number;
  rate_per_unit_distance?: number;
  rate_per_hour?: number;
  min_fare?: number;
  convenience_fees?: number;
  convenience_fee_type?: "flat" | "percentage";
  fleet_admin_fee?: number;
  seat_capacity?: number;
  extra_info?: string;
  pos?: number;
  active?: boolean;
  approved?: boolean;
  [key: string]: string | number | boolean | File | CancellationSlab[] | undefined;
  cancelSlab?: CancellationSlab[];
}

export interface CancellationSlab {
  id?: string;
  minsDelayed: string;
  amount: string;
}

export type EditCarTypeParams = {
  id?: string;
  cartype: CarType;
  method: "Add" | "Delete" | "UpdateImage" | "Edit";
  updatedData?: {
    [key: string]: string | number | boolean | undefined;
  };
};
