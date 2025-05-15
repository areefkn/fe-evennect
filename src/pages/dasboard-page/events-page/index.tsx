"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateEventModal from "./component/CreateEventModal";
import CreateTicketTypeForm from "./[id]/tickets-page/component/form";
import EditEventForm from "./component/editEventForm";
import CreateVoucherForm from "./component/CreateVoucherForm";

interface Event {
  id: string;
  name: string;
  image?: string;
  category: string;
  location: string;
  available_seats: number;
  start_date: string;
  end_date: string;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  quota: number;
}

interface Voucher {
  id: string;
  code: string;
  discount: number;
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
  const [ticketTypesMap, setTicketTypesMap] = useState<
    Record<string, TicketType[]>
  >({});
  const [voucherMap, setVoucherMap] = useState<Record<string, Voucher[]>>({});
  const [selectedVoucherEventId, setSelectedVoucherEventId] = useState<
    string | null
  >(null);

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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(Array.isArray(res.data) ? res.data : res.data.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const fetchTicketTypes = async (eventId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/ticket-types?event_id=${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setTicketTypesMap((prev) => ({ ...prev, [eventId]: data }));
    } catch (error) {
      console.error(
        `Failed to fetch ticket types for event ${eventId}:`,
        error
      );
    }
  };

  const fetchVouchers = async (eventId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/vouchers/by-event?event_id=${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setVoucherMap((prev) => ({ ...prev, [eventId]: data }));
    } catch (error) {
      console.error(`Failed to fetch vouchers for event ${eventId}:`, error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    events.forEach((event) => {
      fetchTicketTypes(event.id);
      fetchVouchers(event.id);
    });
  }, [events]);

  const handleTicketModalClose = () => setSelectedTicketEventId(null);
  const handleEditModalClose = () => setSelectedEditEvent(null);
  const handleVoucherModalClose = () => setSelectedVoucherEventId(null);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">My Events</h1>

      <div className="mb-8">
        <CreateEventModal onSuccess={fetchEvents} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
          >
            {event.image && (
              <img
                src={process.env.NEXT_PUBLIC_BASE_API_URL + event.image}
                alt={event.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {event.name}
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Category:</span> {event.category}
              </p>
              <p>
                <span className="font-medium">Location:</span> {event.location}
              </p>
              <p>
                <span className="font-medium">Available Seats:</span>{" "}
                {event.available_seats}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(event.start_date).toLocaleDateString()} -{" "}
                {new Date(event.end_date).toLocaleDateString()}
              </p>
            </div>

            {/* Daftar Ticket Types */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 text-sm mb-1">
                Tickets:
              </h4>
              {ticketTypesMap[event.id] &&
              ticketTypesMap[event.id].length > 0 ? (
                <ul className="text-sm text-gray-600 space-y-1">
                  {ticketTypesMap[event.id].map((ticket) => (
                    <li
                      key={ticket.id}
                      className="border p-2 rounded bg-gray-50"
                    >
                      🎫 <strong>{ticket.name}</strong> — Rp
                      {ticket.price.toLocaleString()} (Quota: {ticket.quota})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-gray-400">No tickets yet.</p>
              )}
            </div>
            {/* Voucher Section */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 text-sm mb-1">
                Vouchers:
              </h4>
              {voucherMap[event.id] && voucherMap[event.id].length > 0 ? (
                <ul className="text-sm text-gray-600 space-y-1">
                  {voucherMap[event.id].map((voucher) => (
                    <li
                      key={voucher.id}
                      className="border p-2 rounded bg-green-50"
                    >
                      🏷️ <strong>{voucher.code}</strong> — {voucher.discount}{" "}
                      off
                      <br />
                      Valid: {new Date(
                        voucher.start_date
                      ).toLocaleDateString()}{" "}
                      - {new Date(voucher.end_date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-gray-400">No vouchers yet.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => setSelectedTicketEventId(event.id)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                + Add Ticket
              </button>
              <button
                onClick={() => setSelectedVoucherEventId(event.id)}
                className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline"
              >
                + Add Voucher
              </button>
              <button
                onClick={() => setSelectedEditEvent(event)}
                className="text-sm font-medium text-yellow-600 hover:text-yellow-700 hover:underline"
              >
                ✎ Edit Event
              </button>
            </div>

            {/* Modal Add Ticket */}
            {selectedTicketEventId === event.id && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                  <button
                    onClick={handleTicketModalClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                  <h3 className="text-lg font-bold mb-4">Create Ticket Type</h3>
                  <CreateTicketTypeForm
                    eventId={event.id}
                    onSuccess={() => {
                      handleTicketModalClose();
                      fetchTicketTypes(event.id); // refresh ticket types
                    }}
                  />
                </div>
              </div>
            )}

            {/* Modal Create Voucher */}
            {selectedVoucherEventId === event.id && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                  <button
                    onClick={handleVoucherModalClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                  <h3 className="text-lg font-bold mb-4">Create Voucher</h3>
                  <CreateVoucherForm
                    eventId={event.id}
                    onSuccess={() => {
                      handleVoucherModalClose();
                      fetchVouchers(event.id);
                    }}
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
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
                image: null,
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
