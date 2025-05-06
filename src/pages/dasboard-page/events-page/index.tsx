"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateEventModal from "./component/CreateEventModal";
import CreateTicketTypeForm from "./[id]/tickets-page/component/form";
import EditEventForm from "./component/editEventForm";

interface Event {
  id: string;
  name: string;
  category: string;
  location: string;
  available_seats: number;
  start_date: string;
  end_date: string;
}

export default function MyEvent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedTicketEventId, setSelectedTicketEventId] = useState<
    string | null
  >(null);
  const [selectedEditEvent, setSelectedEditEvent] = useState<Event | null>(
    null
  );

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

  const fetchEvents = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEvents(Array.isArray(res.data) ? res.data : res.data.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleTicketModalClose = () => setSelectedTicketEventId(null);
  const handleEditModalClose = () => setSelectedEditEvent(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Events</h1>

      {/* Tambahkan Form Create Event */}
      <div className="mb-8">
        <CreateEventModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative border p-4 rounded-lg shadow bg-white"
          >
            <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
            <p>Category: {event.category}</p>
            <p>Location: {event.location}</p>
            <p>Available Seats: {event.available_seats}</p>
            <p>
              Date: {new Date(event.start_date).toLocaleDateString()} -{" "}
              {new Date(event.end_date).toLocaleDateString()}
            </p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setSelectedTicketEventId(event.id)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition"
              >
                + Add Ticket
              </button>
              <button
                onClick={() => setSelectedEditEvent(event)}
                className="text-sm font-medium text-yellow-600 hover:text-yellow-700 hover:underline transition"
              >
                ✎ Edit Event
              </button>
            </div>

            {/* Modal Add Ticket */}
            {selectedTicketEventId === event.id && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                  <button
                    onClick={handleTicketModalClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                  <h3 className="text-lg font-bold mb-4">Create Ticket Type</h3>
                  <CreateTicketTypeForm
                    eventId={event.id}
                    onSuccess={handleTicketModalClose}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Edit Event */}
      {selectedEditEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              onClick={handleEditModalClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4">Edit Event</h3>
            <EditEventForm
              eventId={selectedEditEvent.id}
              initialData={{
                name: selectedEditEvent.name,
                location: selectedEditEvent.location,
                start_date: selectedEditEvent.start_date,
                end_date: selectedEditEvent.end_date,
              }}
              onClose={handleEditModalClose}
              onSuccess={() => {
                handleEditModalClose();
                fetchEvents(); // Refresh data
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
