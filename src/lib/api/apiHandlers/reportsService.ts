import firebase from "@/lib/firebase";
import { get } from "firebase/database";

export const fetchDriversEarningReport = async (
  userType: string,
  uid: string,
  search?: string,
) => {
  const { bookingListRef, settingsRef } = firebase;

  const settingsdata = await get(settingsRef);
  const settings = settingsdata.val();

  const snapshot = await get(bookingListRef(uid, userType));

  if (!snapshot.exists()) {
    return "No data available.";
  }

  const mainArr = snapshot.val();
  const monthsName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderobj: Record<string, any> = {};

  Object.keys(mainArr).forEach((j) => {
    if (
      (mainArr[j].status === "PAID" || mainArr[j].status === "COMPLETE") &&
      mainArr[j].driver_share !== undefined
    ) {
      const bdt = new Date(mainArr[j].tripdate);
      const uniqueKey =
        bdt.getFullYear() + "_" + bdt.getMonth() + "_" + mainArr[j].driver;

      if (renderobj[uniqueKey] && renderobj[uniqueKey].driverShare > 0) {
        renderobj[uniqueKey].driverShare = (
          parseFloat(renderobj[uniqueKey].driverShare) +
          parseFloat(mainArr[j].driver_share)
        ).toFixed(settings.decimal);
        renderobj[uniqueKey]["total_rides"] =
          renderobj[uniqueKey]["total_rides"] + 1;
      } else {
        renderobj[uniqueKey] = {
          dated: mainArr[j].tripdate,
          year: bdt.getFullYear(),
          month: bdt.getMonth(),
          monthsName: monthsName[bdt.getMonth()],
          driverName: mainArr[j].driver_name,
          driverShare: parseFloat(mainArr[j].driver_share).toFixed(
            settings.decimal,
          ),
          driverVehicleNo: mainArr[j].vehicle_number,
          driverUId: mainArr[j].driver,
          uniqueKey: uniqueKey,
          total_rides: 1,
        };
      }
    }
  });

  let results = Object.values(renderobj).map((item) => ({
    ...item,
    driverShare: parseFloat(item.driverShare).toFixed(settings.decimal),
  }));

  if (search) {
    const lowerCaseSearch = search.toLowerCase();
    results = results.filter(
      (item) =>
        item.year.toString().includes(lowerCaseSearch) ||
        item.month.toString().includes(lowerCaseSearch) ||
        item.driverName.toLowerCase().includes(lowerCaseSearch) ||
        item.total_rides.toString().includes(lowerCaseSearch) ||
        item.driverVehicleNo.toLowerCase().includes(lowerCaseSearch) ||
        item.driverShare.toString().includes(lowerCaseSearch),
    );
  }

  return results.length > 0 ? results : "No matching results.";
};

export const fetchEarningReport = async (search?: string) => {
  const { bookingRef, settingsRef } = firebase;

  const settingsdata = await get(settingsRef);
  const settings = settingsdata.val();

  const snapshot = await get(bookingRef);

  if (!snapshot.exists()) {
    return "No data available.";
  }

  const mainArr = snapshot.val();
  const monthsName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderobj: Record<string, any> = {};

  Object.keys(mainArr).map((j) => {
    const status = mainArr[j].status;
    if (
      status === "PAID" ||
      status === "COMPLETE" ||
      (mainArr[j].status === "CANCELLED" &&
        mainArr[j].hasOwnProperty("cancellationFee"))
    ) {
      const bdt = new Date(mainArr[j].tripdate);
      const uniqueKey = bdt.getFullYear() + "_" + bdt.getMonth();
      if (renderobj[uniqueKey]) {
        if (status == "CANCELLED") {
          if (renderobj[uniqueKey].hasOwnProperty("cancellationFee")) {
            renderobj[uniqueKey].cancellationFee = (
              parseFloat(renderobj[uniqueKey].cancellationFee) +
              parseFloat(mainArr[j].cancellationFee)
            ).toFixed(settings.decimal);
          } else {
            renderobj[uniqueKey].cancellationFee = parseFloat(
              mainArr[j].cancellationFee,
            ).toFixed(settings.decimal);
          }
        } else {
          renderobj[uniqueKey].discountAmount = (
            parseFloat(renderobj[uniqueKey].discountAmount) +
            parseFloat(mainArr[j].discount)
          ).toFixed(settings.decimal);
          renderobj[uniqueKey].driverShare = (
            parseFloat(renderobj[uniqueKey].driverShare) +
            parseFloat(mainArr[j].driver_share)
          ).toFixed(settings.decimal);
          renderobj[uniqueKey].customerPaid = (
            parseFloat(renderobj[uniqueKey].customerPaid) +
            parseFloat(
              mainArr[j].customer_paid ? mainArr[j].customer_paid : "0",
            )
          ).toFixed(settings.decimal);
          renderobj[uniqueKey].convenienceFee = (
            parseFloat(renderobj[uniqueKey].convenienceFee) +
            parseFloat(mainArr[j].convenience_fees)
          ).toFixed(settings.decimal);
          renderobj[uniqueKey].tripCost = (
            parseFloat(renderobj[uniqueKey].tripCost) +
            parseFloat(mainArr[j].trip_cost)
          ).toFixed(settings.decimal);
          if (mainArr[j].hasOwnProperty("fleetCommission")) {
            renderobj[uniqueKey].fleetadminFee = (
              parseFloat(renderobj[uniqueKey].fleetadminFee) +
              parseFloat(mainArr[j].fleetCommission)
            ).toFixed(settings.decimal);
          }
        }
        renderobj[uniqueKey]["total_rides"] =
          renderobj[uniqueKey]["total_rides"] + 1;
      } else {
        renderobj[uniqueKey] = {};
        renderobj[uniqueKey]["dated"] = mainArr[j].tripdate;
        renderobj[uniqueKey]["year"] = bdt.getFullYear();
        renderobj[uniqueKey]["month"] = bdt.getMonth();
        renderobj[uniqueKey]["monthsName"] = monthsName[bdt.getMonth()];
        renderobj[uniqueKey]["uniqueKey"] = uniqueKey;
        renderobj[uniqueKey]["total_rides"] = 1;
        if (status == "CANCELLED") {
          renderobj[uniqueKey]["discountAmount"] = (0).toFixed(
            settings.decimal,
          );
          renderobj[uniqueKey]["driverShare"] = (0).toFixed(settings.decimal);
          renderobj[uniqueKey]["customerPaid"] = (0).toFixed(settings.decimal);
          renderobj[uniqueKey]["convenienceFee"] = (0).toFixed(
            settings.decimal,
          );
          renderobj[uniqueKey]["tripCost"] = (0).toFixed(settings.decimal);
          renderobj[uniqueKey]["cancellationFee"] = parseFloat(
            mainArr[j].cancellationFee,
          ).toFixed(settings.decimal);
        } else {
          renderobj[uniqueKey]["discountAmount"] = parseFloat(
            mainArr[j].discount,
          ).toFixed(settings.decimal);
          renderobj[uniqueKey]["driverShare"] = parseFloat(
            mainArr[j].driver_share,
          ).toFixed(settings.decimal);
          renderobj[uniqueKey]["customerPaid"] = parseFloat(
            mainArr[j].customer_paid ? mainArr[j].customer_paid : "0",
          ).toFixed(settings.decimal);
          renderobj[uniqueKey]["convenienceFee"] = parseFloat(
            mainArr[j].convenience_fees,
          ).toFixed(settings.decimal);
          renderobj[uniqueKey]["tripCost"] = parseFloat(
            mainArr[j].trip_cost,
          ).toFixed(settings.decimal);
          renderobj[uniqueKey]["cancellationFee"] = (0).toFixed(
            settings.decimal,
          );
          if (mainArr[j].fleetCommission) {
            renderobj[uniqueKey].fleetadminFee = parseFloat(
              mainArr[j].fleetCommission ? mainArr[j].fleetCommission : "0",
            ).toFixed(settings.decimal);
          } else {
            renderobj[uniqueKey].fleetadminFee = (0).toFixed(settings.decimal);
          }
        }
      }
    }
    return null;
  });

  let results = Object.values(renderobj).map((item) => ({
    ...item,
    myEarning: (
      parseFloat(item.customerPaid) +
      parseFloat(item.cancellationFee) -
      parseFloat(item.driverShare)
    ).toFixed(settings.decimal),
    customerPaid: (
      parseFloat(item.customerPaid) + parseFloat(item.cancellationFee)
    ).toFixed(settings.decimal),
    rideCost: (
      parseFloat(item.tripCost) - parseFloat(item.convenienceFee)
    ).toFixed(settings.decimal),
    driverShare: parseFloat(item.driverShare).toFixed(settings.decimal),
  }));

  if (search) {
    const lowerCaseSearch = search.toLowerCase();
    results = results.filter(
      (item) =>
        item.year.toString().includes(lowerCaseSearch) ||
        item.month.toString().includes(lowerCaseSearch) ||
        item.total_rides.toString().includes(lowerCaseSearch) ||
        item.tripCost.toString().includes(lowerCaseSearch) ||
        item.cancellationFee.toString().includes(lowerCaseSearch) ||
        item.convenienceFee.toString().includes(lowerCaseSearch) ||
        item.discountAmount.toString().includes(lowerCaseSearch) ||
        item.myEarning.toString().includes(lowerCaseSearch) ||
        item.driverShare.toString().includes(lowerCaseSearch),
    );
  }

  return results.length > 0 ? results : "No matching results.";
};

export const fetchFleetEarningReport = async (
  userType: string,
  uid: string,
  search?: string,
) => {
  const { bookingListRef, settingsRef, singleUserRef } = firebase;

  // Fetch settings
  const settingsData = await get(settingsRef);
  const settings = settingsData.val();

  // Fetch booking list
  const snapshot = await get(bookingListRef(uid, userType));
  if (!snapshot.exists()) {
    return "No data available.";
  }

  const mainArr = snapshot.val();
  const monthsName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderobj: Record<string, any> = {};
  const fleetAdminIds = new Set<string>();

  Object.keys(mainArr).forEach((j) => {
    const trip = mainArr[j];

    if (
      (trip.status === "PAID" || trip.status === "COMPLETE") &&
      trip.fleetCommission !== undefined &&
      trip.fleetCommission > 0
    ) {
      const tripDate = new Date(trip.tripdate);
      const uniqueKey = `${tripDate.getFullYear()}_${tripDate.getMonth()}_${trip.fleetadmin}`;

      if (!renderobj[uniqueKey]) {
        renderobj[uniqueKey] = {
          dated: trip.tripdate,
          year: tripDate.getFullYear(),
          month: tripDate.getMonth(),
          monthsName: monthsName[tripDate.getMonth()],
          fleetCommission: parseFloat(trip.fleetCommission).toFixed(
            settings.decimal,
          ),
          fleetUId: trip.fleetadmin,
          uniqueKey,
          total_rides: 1,
          fleetadminName: "", // Placeholder for async user fetching
        };
        fleetAdminIds.add(trip.fleetadmin);
      } else {
        renderobj[uniqueKey].fleetCommission = (
          parseFloat(renderobj[uniqueKey].fleetCommission) +
          parseFloat(trip.fleetCommission)
        ).toFixed(settings.decimal);
        renderobj[uniqueKey].total_rides += 1;
      }
    }
  });

  // Fetch fleet admin names asynchronously
  const userPromises = Array.from(fleetAdminIds).map(async (fleetUId) => {
    const userSnapshot = await get(singleUserRef(fleetUId));
    const user = userSnapshot.val();
    if (user) {
      Object.keys(renderobj).forEach((key) => {
        if (renderobj[key].fleetUId === fleetUId) {
          renderobj[key].fleetadminName = `${user.firstName} ${user.lastName}`;
        }
      });
    }
  });

  await Promise.all(userPromises);

  let results = Object.values(renderobj).map((item) => ({
    ...item,
    fleetCommission: parseFloat(item.fleetCommission).toFixed(settings.decimal),
    driverShare: item.driverShare
      ? parseFloat(item.driverShare).toFixed(settings.decimal)
      : "0.00",
  }));

  if (search) {
    const lowerCaseSearch = search.toLowerCase();
    results = results.filter(
      (item) =>
        item.year.toString().includes(lowerCaseSearch) ||
        item.month.toString().includes(lowerCaseSearch) ||
        item.fleetadminName.toLowerCase().includes(lowerCaseSearch),
    );
  }

  return results.length > 0 ? results : "No matching results.";
};
