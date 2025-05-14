'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { format } from 'date-fns';
import { ImyTicket } from './components/types';
import { getCookie } from "cookies-next";

export default function MyTicketMain() {
  const [tickets, setTickets] = useState<ImyTicket[]>([]);
const access_token = getCookie("access_token") as string;

  useEffect(() => {
    if (!access_token) return;
    axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions/my`, {
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    })
    .then(res => setTickets(res.data.transactions))
    .catch(err => console.error(err));
  }, [access_token]);

  const isPastEvent = (endDate: string) => new Date(endDate) < new Date();

  const activeTickets = tickets.filter(trx => !isPastEvent(trx.ticket_type.event.end_date));
  const pastTickets = tickets.filter(trx => isPastEvent(trx.ticket_type.event.end_date));

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tiket Saya</h1>

      {tickets.length === 0 && <p className="text-center text-gray-500">Belum ada tiket yang dibeli.</p>}

      {activeTickets.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">Tiket Aktif</h2>
          <div className="grid gap-4 mb-6">
            {activeTickets.map((trx) => (
              <div key={trx.id} className="border rounded-lg p-4 shadow-sm bg-white flex flex-col sm:flex-row gap-4">
                <Image
                  src={trx.ticket_type.event.image || '/placeholder.jpg'}
                  alt={trx.ticket_type.event.name}
                  width={100}
                  height={80}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{trx.ticket_type.event.name}</h2>
                  <p className="text-sm text-gray-600">
                    Total: Rp{trx.total_price.toLocaleString('id-ID')} - Status: {trx.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    Dibeli pada: {format(new Date(trx.created_at), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {pastTickets.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2 mt-6">Riwayat Tiket</h2>
          <div className="grid gap-4">
            {pastTickets.map((trx) => (
              <div key={trx.id} className="border rounded-lg p-4 shadow-sm bg-white flex flex-col sm:flex-row gap-4">
                <Image
                  src={trx.ticket_type.event.image || '/placeholder.jpg'}
                  alt={trx.ticket_type.event.name}
                  width={100}
                  height={80}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{trx.ticket_type.event.name}</h2>
                  <p className="text-sm text-gray-600">
                    Total: Rp{trx.total_price.toLocaleString('id-ID')} - Status: {trx.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    Dibeli pada: {format(new Date(trx.created_at), 'dd MMM yyyy')}
                  </p>
                  {trx.status === 'DONE' && !trx.review && (
                    <a
                      href={`/review/${trx.ticket_type.event.id}`}
                      className="text-sm mt-2 inline-block text-indigo-600 hover:underline"
                    >
                      Beri Review
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
