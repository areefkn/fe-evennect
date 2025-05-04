"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import TicketForm from "./component/form";

export default function TicketPage() {
  const router = useRouter();
  const { id } = router.query;
  const [tickets, setTickets] = useState<any[]>([]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/ticket-types?event_id=${id}`
      );
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  };

  useEffect(() => {
    if (id) fetchTickets();
  }, [id]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Ticket Type</h1>

      <TicketForm eventId={id as string} onCreated={fetchTickets} />

      <hr className="my-6" />

      <h2 className="text-lg font-semibold mb-2">Ticket List</h2>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Quota</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td className="border p-2">{t.name}</td>
                <td className="border p-2">Rp {t.price.toLocaleString()}</td>
                <td className="border p-2">{t.quota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
