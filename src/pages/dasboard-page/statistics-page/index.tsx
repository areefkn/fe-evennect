"use client";

import { useEffect, useState } from "react";
import RevenueChart from "./components/charts";
import { RevenueData } from "./components/types";
import StatisticsSummary from "./components/summary";
import axios from "axios";

export default function StatisticsPage() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/dashboard/statistics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch revenue:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Statistics</h1>

      {/* Summary Box */}
      <StatisticsSummary />

      {/* Revenue Chart */}
      {loading ? (
        <p>Loading revenue chart...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">Data tidak ditemukan</p>
      ) : (
        <RevenueChart data={data} />
      )}
    </div>
  );
}
