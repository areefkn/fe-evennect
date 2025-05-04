"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface IEvent {
  id: string;
  name: string;
  category: string;
  location: string;
  start_date: string;
  end_date: string;
}

export default function EventListPage() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((c) => c.startsWith("access_token="))
          ?.split("=")[1];

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">My Events</h1>
        <Link
          href="/dashboard/events/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white shadow p-4 rounded">
              <h2 className="font-bold text-lg">{event.name}</h2>
              <p className="text-sm text-gray-600">{event.category}</p>
              <p className="text-sm">
                {new Date(event.start_date).toLocaleDateString()} -{" "}
                {new Date(event.end_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">{event.location}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
