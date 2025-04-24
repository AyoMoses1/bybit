import { onValue, ref, getDatabase, update } from "firebase/database";
import toast from "react-hot-toast";

export interface SettingsType {
  AllowCountrySelection: boolean;
  AllowCriticalEditsAdmin: boolean;
  AppleLoginEnabled: boolean;
  AppleStoreLink: string;
  CarHornRepeat: boolean;
  CompanyAddress: string;
  CompanyName: string;
  CompanyPhone: string;
  CompanyTermCondition: string;
  CompanyTerms: string;
  CompanyWebsite: string;
  FacebookHandle: string;
  FacebookLoginEnabled: boolean;
  InstagramHandle: string;
  PlayStoreLink: string;
  RiderWithDraw: boolean;
  TwitterHandle: string;
  appName: string;
  autoDispatch: boolean;
  bank_fields: boolean;
  bidprice: number;
  bonus: number;
  carApproval: boolean;
  carType_required: boolean;
  code: string;
  contact_email: string;
  convert_to_mile: boolean;
  country: string;
  coustomerBidPrice: boolean;
  coustomerBidPriceType: string;
  customMobileOTP: boolean;
  decimal: number;
  disable_online: boolean;
  disablesystemprice: boolean;
  driverRadius: number;
  driver_approval: boolean;
  emailLogin: boolean;
  horizontal_view: boolean;
  imageIdApproval: boolean;
  license_image_required: boolean;
  mapLanguage: string;
  mobileLogin: boolean;
  negativeBalance: boolean;
  otp_secure: boolean;
  panic: string;
  prepaid: boolean;
  realtime_drivers: boolean;
  restrictCountry: string;
  showLiveRoute: boolean;
  socialLogin: boolean;
  swipe_symbol: boolean;
  symbol: string;
  term_required: boolean;
  useDistanceMatrix: boolean;
}
export interface SMTPDataType {
  fromEmail: string;
  smtpDetails: {
    auth: {
      pass: string;
      user: string;
    };
    host: string;
    port: number;
    secure: boolean;
  };
}

export const fetchAppInfo = () => {
  return new Promise<SettingsType>((resolve, reject) => {
    try {
      const db = getDatabase();
      const carRef = ref(db, "settings");

      onValue(
        carRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            resolve({} as SettingsType);
            return;
          }
          const data = snapshot.val();

          resolve(data);
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
        { onlyOnce: true },
      );
    } catch (error) {
      console.error("Fetch Cars Error:", error);
      reject(error);
    }
  });
};

export const updateSettings = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updatedData: Record<string, any>,
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const db = getDatabase();
      const settingsRef = ref(db, `settings`);

      update(settingsRef, updatedData)
        .then(() => {
          toast.success("Settings updated successfully");
          resolve();
        })
        .catch((error) => {
          console.error("Error updating settings:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Update Settings Error:", error);
      reject(error);
    }
  });
};

export const fetchSMTPData = () => {
  return new Promise<SMTPDataType>((resolve, reject) => {
    try {
      const db = getDatabase();
      const carRef = ref(db, "smtpdata");

      onValue(
        carRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            resolve({} as SMTPDataType);
            return;
          }
          const data = snapshot.val();

          resolve(data);
        },
        (error) => {
          console.error("Firebase error:", error);
          reject(error);
        },
        { onlyOnce: true },
      );
    } catch (error) {
      console.error("Fetch SMTP Error:", error);
      reject(error);
    }
  });
};

export const updateSMTPSettings = (updatedData: SMTPDataType) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const db = getDatabase();
      const SMTPRef = ref(db, `smtpdata`);

      update(SMTPRef, updatedData)
        .then(() => {
          toast.success("SMTP details updated successfully");
          resolve();
        })
        .catch((error) => {
          console.error("Error updating SMTP details:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Update SMTP Details Error:", error);
      reject(error);
    }
  });
};
