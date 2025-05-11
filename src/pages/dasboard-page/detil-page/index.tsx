"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface DashboardData {
  event_id: string;
  event_name: string;
  totalSales: number;
  totalTicketSold: number;
  avgRating: number | null;
  reviewCount: number;
}

export default function StatisticPage() {
  const [dashboard, setDashboard] = useState<DashboardData[]>([]);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/dashboard/organizer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDashboard(res.data.dashboard);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard Summary</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboard.map((item) => (
          <div
            key={item.event_id}
            className="border rounded-xl p-4 shadow-sm bg-white"
          >
            <h2 className="text-xl font-semibold mb-2">{item.event_name}</h2>
            <p>Total Sales: Rp{item.totalSales.toLocaleString()}</p>
            <p>Tickets Sold: {item.totalTicketSold}</p>
            <p>
              Avg Rating:{" "}
              {item.avgRating !== null ? item.avgRating.toFixed(1) : "N/A"}
            </p>
            <p>Total Reviews: {item.reviewCount}</p>
          </div>
        ))}
      </div>
    </>
  );
}
