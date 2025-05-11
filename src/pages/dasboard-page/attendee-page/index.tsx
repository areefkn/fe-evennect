"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Attendee {
  event_id: string;
  event_name: string;
  attendees: {
    first_name: string;
    last_name: string;
  }[];
}

export default function AttendeePage() {
  const [data, setData] = useState<Attendee[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Attendee | null>(null);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const token = getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/dashboard/attendees`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch attendees:", error);
      }
    };

    fetchAttendees();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Attendees Per Event</h1>
      {data.map((item) => (
        <div
          key={item.event_id}
          className="mb-4 border p-4 rounded bg-white shadow flex justify-between items-center"
        >
          <h2 className="text-lg font-semibold">{item.event_name}</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setSelectedEvent(item)}
          >
            View Attendees
          </button>
        </div>
      ))}

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Attendees of {selectedEvent.event_name}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-800 text-lg"
                onClick={() => setSelectedEvent(null)}
              >
                &times;
              </button>
            </div>
            {selectedEvent.attendees.length === 0 ? (
              <p className="text-gray-500">No attendees yet.</p>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {selectedEvent.attendees.map((user, index) => (
                  <li key={index}>
                    {user.first_name} {user.last_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
