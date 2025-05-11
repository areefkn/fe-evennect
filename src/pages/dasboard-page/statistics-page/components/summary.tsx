"use client";
import { useEffect, useState } from "react";

interface SummaryData {
  totalEvents: number;
  totalRevenue: number;
  totalTicketsSold: number;
  totalTransactions: number;
}

export default function StatisticsSummary() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/dashboard/statistics/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await res.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Loading summary...</p>;
  if (!data) return <p>Summary data not available.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-white shadow rounded">
        <h4 className="text-sm text-gray-500">Total Events</h4>
        <p className="text-xl font-bold">{data.totalEvents}</p>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h4 className="text-sm text-gray-500">Transactions</h4>
        <p className="text-xl font-bold">{data.totalTransactions}</p>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h4 className="text-sm text-gray-500">Tickets Sold</h4>
        <p className="text-xl font-bold">{data.totalTicketsSold}</p>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h4 className="text-sm text-gray-500">Revenue</h4>
        <p className="text-xl font-bold">
          Rp{data.totalRevenue.toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
}
