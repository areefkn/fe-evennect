"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ModalReview from "./components/modalReview";

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
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

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

  const handleOpenModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setOpenReviewModal(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Dashboard Summary
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboard.map((item) => (
          <div
            key={item.event_id}
            className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {item.event_name}
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Total Sales:</span> Rp{" "}
                {item.totalSales.toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Tickets Sold:</span>{" "}
                {item.totalTicketSold}
              </p>
              <p>
                <span className="font-medium">Avg Rating:</span>{" "}
                {item.avgRating !== null ? item.avgRating.toFixed(1) : "N/A"}
              </p>
              <p>
                <span className="font-medium">Total Reviews:</span>{" "}
                {item.reviewCount}
              </p>
            </div>
            <button
              className="mt-4 w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-all"
              onClick={() => handleOpenModal(item.event_id)}
            >
              View Reviews
            </button>
          </div>
        ))}
      </div>
      <ModalReview
        key={selectedEventId}
        event_id={selectedEventId}
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
      />
    </div>
  );
}
