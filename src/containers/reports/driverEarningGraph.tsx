import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LineChart, Line } from "recharts";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useDriversReports } from "@/lib/api/hooks/reports";

const DriverEarningGraph = () => {
  type UserInfo = {
    id: string;
    usertype: string;
  };
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [toggleSelect, setToggleSelect] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { data: reports } = useDriversReports(
    userInfo?.usertype ?? "",
    userInfo?.id ?? "",
    "",
  );

  const getLastThreeYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 3 }, (_, i) => currentYear - i);
  };

  const years = getLastThreeYears();

  type Report = {
    dated: number;
    year: number;
    month: number;
    monthsName: string;
    driverName: string;
    driverShare: string;
    driverVehicleNo: string;
    driverUId: string;
    uniqueKey: string;
    total_rides: number;
  };

  const getFilteredData = (
    reports: Report[] | undefined,
    selectedYear: number,
  ): Report[] => {
    if (!reports) return [];

    // Filter reports by the selected year
    const filteredReports = reports.filter(
      (report) => report.year === selectedYear,
    );

    // Group by month and find the entry with the highest total_rides for each month
    const groupedByMonth = filteredReports.reduce<Record<number, Report>>(
      (acc, report) => {
        const existingMonth = acc[report.month];
        if (!existingMonth || report.total_rides > existingMonth.total_rides) {
          acc[report.month] = report; // Replace with the report having the highest total_rides
        }
        return acc;
      },
      {},
    );

    // Convert the grouped data back into an array
    return Object.values(groupedByMonth);
  };

  const filteredData = Array.isArray(reports)
    ? getFilteredData(reports, selectedYear)
    : [];

  const formatDataForChart = (
    filteredData: Report[],
  ): { name: string; bookingCount: number }[] => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dataMap = filteredData.reduce<
      Record<number, { total_rides: number; driverName: string }>
    >((acc, item) => {
      acc[item.month] = {
        total_rides: item.total_rides,
        driverName: item.driverName,
      };
      return acc;
    }, {});

    return monthNames.map((month, index) => ({
      name: month,
      bookingCount: dataMap[index + 1]?.total_rides || 0,
      driverName: dataMap[index + 1]?.driverName || "N/A",
    }));
  };

  const formattedData = formatDataForChart(filteredData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = localStorage.getItem("userInfo");
      if (info) {
        setUserInfo(JSON.parse(info));
      }
    }
  }, []);

  return (
    <div>
      {" "}
      <div className="mx-4 mb-6 h-full w-[70%] rounded-lg bg-white px-3 py-4 shadow-sm">
        {/* SELECT */}
        <div className="flex items-center justify-between pb-2">
          <p className="font-nunito text-base font-bold text-[#202224]">
            Driver Earning Chart
          </p>
          <div className="relative">
            <div
              onClick={() => setToggleSelect(!toggleSelect)}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-[#00000033] px-2 py-1"
            >
              <p className="font-inter text-sm font-normal text-[#646464]">
                {selectedYear}
              </p>
              {toggleSelect ? (
                <ChevronUp color="#1D1D1F8C" className="h-[16px] w-[16px]" />
              ) : (
                <ChevronDown color="#1D1D1F8C" className="h-[16px] w-[16px]" />
              )}
            </div>
            {toggleSelect && (
              <div className="absolute left-0 top-full z-[80] mt-1 w-full rounded-lg bg-white shadow-lg">
                {years.map((year) => (
                  <div
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setToggleSelect(false);
                    }}
                    className={`cursor-pointer px-4 py-2 text-sm ${
                      selectedYear === year
                        ? "bg-[#DA4CBF] text-white"
                        : "text-[#646464]"
                    } hover:bg-[#DA4CBF] hover:text-white`}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* GRAPH */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={774}
              height={234}
              data={formattedData}
              margin={{
                top: 10,
                right: 0,
                left: -32,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis
                dataKey="name"
                tick={{
                  fill: "#2B303466",
                  fontSize: 12,
                  fontFamily: "Inter",
                  fontWeight: "500",
                }}
                tickMargin={10}
                axisLine={{
                  stroke: "#2B303466",
                  strokeWidth: 1.5,
                }}
                tickLine={false}
              />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const { driverName, bookingCount } = payload[0].payload;
                    return (
                      <div
                        style={{
                          backgroundColor: "#68B752",
                          color: "#FFFFFF",
                          padding: "8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontFamily: "Inter",
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          {" "}
                          Driver&apos;s Name: {driverName}
                        </p>
                        <p style={{ margin: 0 }}>
                          Booking count: {bookingCount}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                formatter={() => (
                  <span
                    style={{
                      color: "#000000B2",
                      font: "Inter",
                      fontSize: "12px",
                    }}
                  >
                    Driver Earning History
                  </span>
                )}
              />

              <defs>
                <filter
                  id="shadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="3"
                    stdDeviation="3"
                    floodColor="#68B75266"
                  />
                  <feDropShadow
                    dx="0"
                    dy="6"
                    stdDeviation="9"
                    floodColor="#68B75266"
                  />
                  <feDropShadow
                    dx="0"
                    dy="9"
                    stdDeviation="18"
                    floodColor="#68B75266"
                  />
                </filter>
              </defs>

              <Line
                type="monotone"
                dataKey="bookingCount"
                stroke="#68B752"
                strokeWidth={1.2}
                filter="url(#shadow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DriverEarningGraph;
