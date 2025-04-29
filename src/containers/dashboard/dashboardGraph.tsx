import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AreaChart } from "recharts";
import { Area } from "recharts";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useEarningReports } from "@/lib/api/hooks/reports";

const DashboardGraph = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [toggleSelect, setToggleSelect] = useState(false);
  const { data: reports } = useEarningReports("");

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

    const filteredReports = reports.filter(
      (report) => report.year === selectedYear,
    );

    const groupedByMonth = filteredReports.reduce<Record<number, Report>>(
      (acc, report) => {
        const existingMonth = acc[report.month];
        if (!existingMonth || report.total_rides > existingMonth.total_rides) {
          acc[report.month] = report;
        }
        return acc;
      },
      {},
    );

    return Object.values(groupedByMonth);
  };

  const filteredData = Array.isArray(reports)
    ? getFilteredData(reports, selectedYear)
    : [];

  const formatDataForChart = (
    filteredData: Report[],
  ): { name: string; bookingCount: number; myEarning: string }[] => {
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
      Record<number, { total_rides: number; myEarning: string }>
    >((acc, item) => {
      acc[item.month] = {
        total_rides: item.total_rides,
        myEarning: item.driverShare,
      };
      return acc;
    }, {});

    return monthNames.map((month, index) => ({
      name: month,
      bookingCount: dataMap[index + 1]?.total_rides || 0,
      myEarning: dataMap[index + 1]?.myEarning || "0",
    }));
  };

  const formattedData = formatDataForChart(filteredData);

  console.log(reports);

  return (
    <div>
      {" "}
      <div className="w-fullrounded-lg mb-6 h-full bg-white px-3 py-4 shadow-sm">
        {/* SELECT */}
        <div className="flex items-center justify-between pb-4">
          <p className="font-nunito text-2xl font-bold text-[#202224]">
            Booking Chart
          </p>
          <div className="relative">
            <div
              onClick={() => setToggleSelect(!toggleSelect)}
              className="flex cursor-pointer items-center justify-between gap-2 rounded-md border border-[#00000033] px-[6px] py-[2px]"
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
                        ? "bg-gray-100 text-black"
                        : "text-[#646464]"
                    } `}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* GRAPH */}
        <div className="h-[400] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={774}
              height={350}
              data={formattedData}
              margin={{
                top: 10,
                right: 0,
                left: 0,
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
              <YAxis
                type="number"
                axisLine={false}
                tickLine={false}
                allowDataOverflow={true}
                // domain={[0, 100]}
                // ticks={[0, 20, 40, 60, 80, 100]}
              />
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const { myEarning, bookingCount } = payload[0].payload;
                    return (
                      <div
                        style={{
                          backgroundColor: "#6C2860",
                          color: "#FFFFFF",
                          padding: "8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontFamily: "Inter",
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          {" "}
                          Gross Profit: CFA{myEarning || 0}
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
                content={() => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          backgroundColor: "#68B752",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span
                        style={{
                          color: "#2B303466",
                          fontSize: "12px",
                          fontFamily: "Inter",
                        }}
                      >
                        Booking Count
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          backgroundColor: "#D8394C",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span
                        style={{
                          color: "#2B303466",
                          fontSize: "12px",
                          fontFamily: "Inter",
                        }}
                      >
                        Gross Profit
                      </span>
                    </div>
                  </div>
                )}
              />

              <Area
                type="monotone"
                dataKey="bookingCount"
                stackId="1"
                stroke="#6C2860"
                fill="#6C2860"
                dot
              />
              <Area
                type="monotone"
                dataKey="myEarning"
                stackId="1"
                stroke="#D8394C"
                fill="#D8394C"
                dot
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardGraph;
