"use client";

import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  DatabaseReference,
  Query,
} from "firebase/database";
import {
  initializeAuth,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
  unlink,
  updatePhoneNumber,
  linkWithPhoneNumber,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  Auth,
  UserCredential,
} from "firebase/auth";
import { getStorage, ref as stRef, StorageReference } from "firebase/storage";

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env
    .NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase service interface
interface FirebaseService {
  app: any;
  config: FirebaseConfig;
  database: any;
  auth: Auth;
  storage: any;
  authRef: () => Auth;
  googleProvider: GoogleAuthProvider;
  appleProvider: OAuthProvider;
  phoneProvider: PhoneAuthProvider;
  RecaptchaVerifier: typeof RecaptchaVerifier;
  signInWithPhoneNumber: typeof signInWithPhoneNumber;
  updatePhoneNumber: typeof updatePhoneNumber;
  unlink: typeof unlink;
  googleCredential: (idToken: string, accessToken: string) => UserCredential;
  linkWithPhoneNumber: typeof linkWithPhoneNumber;
  mobileAuthCredential: (
    verificationId: string,
    code: string,
  ) => UserCredential;
  usersRef: DatabaseReference;
  bookingRef: DatabaseReference;
  cancelreasonRef: DatabaseReference;
  settingsRef: DatabaseReference;
  smtpRef: DatabaseReference;
  smsRef: DatabaseReference;
  carTypesRef: DatabaseReference;
  carTypesEditRef: (id: string) => DatabaseReference;
  carDocImage: (id: string) => StorageReference;
  promoRef: DatabaseReference;
  promoEditRef: (id: string) => DatabaseReference;
  notifyRef: DatabaseReference;
  notifyEditRef: (id: string) => DatabaseReference;
  addressRef: (uid: string, id: string) => DatabaseReference;
  addressEditRef: (uid: string) => DatabaseReference;
  singleUserRef: (uid: string) => DatabaseReference;
  profileImageRef: (uid: string) => StorageReference;
  verifyIdImageRef: (uid: string) => StorageReference;
  bookingImageRef: (bookingId: string, imageType: string) => StorageReference;
  driversRef: Query;
  driverDocsRef: (uid: string) => StorageReference;
  driverDocsRefBack: (uid: string) => StorageReference;
  singleBookingRef: (bookingKey: string) => DatabaseReference;
  requestedDriversRef: (bookingKey: string) => DatabaseReference;
  referralIdRef: (referralId: string) => Query;
  trackingRef: (bookingId: string) => DatabaseReference;
  tasksRef: () => Query;
  singleTaskRef: (uid: string, bookingId: string) => DatabaseReference;
  bookingListRef: (uid: string, role: string) => Query | DatabaseReference;
  chatRef: (bookingId: string) => DatabaseReference;
  withdrawRef: DatabaseReference;
  languagesRef: DatabaseReference;
  languagesEditRef: (id: string) => DatabaseReference;
  langEditRef: (id: string) => DatabaseReference;
  walletHistoryRef: (uid: string) => DatabaseReference;
  userNotificationsRef: (uid: string) => DatabaseReference;
  userRatingsRef: (uid: string) => DatabaseReference;
  carsRef: (uid: string, role: string) => Query | DatabaseReference;
  carAddRef: DatabaseReference;
  carEditRef: (id: string) => DatabaseReference;
  carImage: (id: string) => StorageReference;
  allLocationsRef: DatabaseReference;
  userLocationRef: (uid: string) => DatabaseReference;
  sosRef: DatabaseReference;
  editSosRef: (id: string) => DatabaseReference;
  complainRef: DatabaseReference;
  editComplainRef: (id: string) => DatabaseReference;
  paymentSettingsRef: DatabaseReference;
  usedreferralRef: DatabaseReference;
}

// Initialize empty Firebase service object
let firebase: FirebaseService;

// Create full Firebase structure
const createFullStructure = (
  app: any,
  db: any,
  auth: Auth,
  storage: any,
  config: FirebaseConfig,
): FirebaseService => {
  return {
    app,
    config,
    database: db,
    auth,
    storage,
    authRef: getAuth,
    googleProvider: new GoogleAuthProvider(),
    appleProvider: new OAuthProvider("apple.com"),
    phoneProvider: new PhoneAuthProvider(auth),
    RecaptchaVerifier,
    signInWithPhoneNumber,
    updatePhoneNumber,
    unlink,
    googleCredential: (idToken: string, accessToken: string) =>
      GoogleAuthProvider.credential(
        idToken,
        accessToken,
      ) as unknown as UserCredential,
    linkWithPhoneNumber,
    mobileAuthCredential: (verificationId: string, code: string) =>
      PhoneAuthProvider.credential(
        verificationId,
        code,
      ) as unknown as UserCredential,
    usersRef: ref(db, "users"),
    bookingRef: ref(db, "bookings"),
    cancelreasonRef: ref(db, "cancel_reason"),
    settingsRef: ref(db, "settings"),
    smtpRef: ref(db, "smtpdata"),
    smsRef: ref(db, "smsConfig"),
    carTypesRef: ref(db, "cartypes"),
    carTypesEditRef: (id: string) => ref(db, "cartypes/" + id),
    carDocImage: (id: string) => stRef(storage, `cartypes/${id}`),
    promoRef: ref(db, "promos"),
    promoEditRef: (id: string) => ref(db, "promos/" + id),
    notifyRef: ref(db, "notifications/"),
    notifyEditRef: (id: string) => ref(db, "notifications/" + id),
    addressRef: (uid: string, id: string) =>
      ref(db, "savedAddresses/" + uid + "/" + id),
    addressEditRef: (uid: string) => ref(db, "savedAddresses/" + uid),
    singleUserRef: (uid: string) => ref(db, "users/" + uid),
    profileImageRef: (uid: string) =>
      stRef(storage, `users/${uid}/profileImage`),
    verifyIdImageRef: (uid: string) =>
      stRef(storage, `users/${uid}/verifyIdImage`),
    bookingImageRef: (bookingId: string, imageType: string) =>
      stRef(storage, `bookings/${bookingId}/${imageType}`),
    driversRef: query(
      ref(db, "users"),
      orderByChild("usertype"),
      equalTo("driver"),
    ),
    driverDocsRef: (uid: string) => stRef(storage, `users/${uid}/license`),
    driverDocsRefBack: (uid: string) =>
      stRef(storage, `users/${uid}/licenseBack`),
    singleBookingRef: (bookingKey: string) => ref(db, "bookings/" + bookingKey),
    requestedDriversRef: (bookingKey: string) =>
      ref(db, "bookings/" + bookingKey + "/requestedDrivers"),
    referralIdRef: (referralId: string) =>
      query(ref(db, "users"), orderByChild("referralId"), equalTo(referralId)),
    trackingRef: (bookingId: string) => ref(db, "tracking/" + bookingId),
    tasksRef: () =>
      query(ref(db, "bookings"), orderByChild("status"), equalTo("NEW")),
    singleTaskRef: (uid: string, bookingId: string) =>
      ref(db, "bookings/" + bookingId + "/requestedDrivers/" + uid),
    bookingListRef: (uid: string, role: string) =>
      role == "customer"
        ? query(ref(db, "bookings"), orderByChild("customer"), equalTo(uid))
        : role == "driver"
          ? query(ref(db, "bookings"), orderByChild("driver"), equalTo(uid))
          : role == "fleetadmin"
            ? query(
                ref(db, "bookings"),
                orderByChild("fleetadmin"),
                equalTo(uid),
              )
            : ref(db, "bookings"),
    chatRef: (bookingId: string) => ref(db, "chats/" + bookingId + "/messages"),
    withdrawRef: ref(db, "withdraws/"),
    languagesRef: ref(db, "languages"),
    languagesEditRef: (id: string) => ref(db, "languages/" + id),
    langEditRef: (id: string) => ref(db, `languages/${id}/keyValuePairs/`),
    walletHistoryRef: (uid: string) => ref(db, "walletHistory/" + uid),
    userNotificationsRef: (uid: string) => ref(db, "userNotifications/" + uid),
    userRatingsRef: (uid: string) => ref(db, "userRatings/" + uid),
    carsRef: (uid: string, role: string) =>
      role == "driver"
        ? query(ref(db, "cars"), orderByChild("driver"), equalTo(uid))
        : role == "fleetadmin"
          ? query(ref(db, "cars"), orderByChild("fleetadmin"), equalTo(uid))
          : ref(db, "cars"),
    carAddRef: ref(db, "cars"),
    carEditRef: (id: string) => ref(db, "cars/" + id),
    carImage: (id: string) => stRef(storage, `cars/${id}`),
    allLocationsRef: ref(db, "locations"),
    userLocationRef: (uid: string) => ref(db, "locations/" + uid),
    sosRef: ref(db, "sos"),
    editSosRef: (id: string) => ref(db, "sos/" + id),
    complainRef: ref(db, "complain"),
    editComplainRef: (id: string) => ref(db, "complain/" + id),
    paymentSettingsRef: ref(db, "payment_settings"),
    usedreferralRef: ref(db, "usedreferral"),
  };
};

// Initialize Firebase
function initializeFirebase(): FirebaseService {
  if (!getApps().length) {
    try {
      const app = initializeApp(firebaseConfig);
      const auth = initializeAuth(app, {
        persistence: browserLocalPersistence,
        popupRedirectResolver: browserPopupRedirectResolver,
      });
      const database = getDatabase(app);
      const storage = getStorage(app);

      return createFullStructure(app, database, auth, storage, firebaseConfig);
    } catch (error) {
      console.error("Error initializing app:", error);
      throw error;
    }
  } else {
    const app = getApp();
    const auth = getAuth(app);
    const database = getDatabase(app);
    const storage = getStorage(app);

    return createFullStructure(app, database, auth, storage, firebaseConfig);
  }
}

// Initialize firebase only on the client side
if (typeof window !== "undefined") {
  firebase = initializeFirebase();
} else {
  // Just create a placeholder for server-side rendering that will be replaced on client
  firebase = {} as FirebaseService;
}

export default firebase;
