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
  extra_info?: string;
  pos?: number;
  seat_capacity?: number;
  active?: boolean;
  approved?: boolean;
  cancelSlab?: CancellationSlab[];
}

export interface CancellationSlab {
  id?: string;
  minsDelayed: string;
  amount: string;
}

export type EditCarTypeParams = {
  id?: string;
  updatedData?: {
    [key: string]: string | number | boolean | null | undefined | Record<string, unknown>;
  };
};
