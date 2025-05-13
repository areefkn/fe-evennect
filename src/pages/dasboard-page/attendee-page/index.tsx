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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Attendees Per Event</h1>

      {data.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((item) => (
            <div
              key={item.event_id}
              className="border border-gray-200 p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                {item.event_name}
              </h2>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md transition"
                onClick={() => setSelectedEvent(item)}
              >
                View Attendees
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Attendees of {selectedEvent.event_name}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {selectedEvent.attendees.length === 0 ? (
              <p className="text-gray-500">No attendees yet.</p>
            ) : (
              <ul className="space-y-2">
                {selectedEvent.attendees.map((user, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 bg-gray-50 rounded-md shadow-sm text-gray-700"
                  >
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
