"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface EventStats {
  event_id: string;
  event_name: string;
  totalSales: number;
  totalTicketSold: number;
  avgRating: number | null;
  reviewCount: number;
}

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<EventStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((c) => c.startsWith("access_token="))
        ?.split("=")[1];

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/dashboard/organizer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard Organizer</h1>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="border rounded-lg p-4 shadow bg-white"
            >
              <h2 className="text-lg font-semibold mb-2">{event.event_name}</h2>
              <p>
                Total Sales:{" "}
                <strong>Rp {event.totalSales.toLocaleString()}</strong>
              </p>
              <p>Tickets Sold: {event.totalTicketSold}</p>
              <p>Average Rating: {event.avgRating ?? "-"}</p>
              <p>Total Reviews: {event.reviewCount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
