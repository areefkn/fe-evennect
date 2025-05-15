'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { format } from 'date-fns';
import { getCookie } from 'cookies-next';
import { ImyTicket } from './components/types';

export default function MyTicketMain() {
  const [tickets, setTickets] = useState<ImyTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const access_token = getCookie('access_token') as string;

  useEffect(() => {
    if (!access_token) return;
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions/my`, {
          headers: {
            Authorization: 'Bearer ' + access_token,
          },
        });

        const fetched = res.data?.transactions ?? [];
        setTickets(fetched);
      } catch (err: any) {
        setError('Gagal mengambil data tiket.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [access_token]);

  const isPastEvent = (endDate: string) => new Date(endDate) < new Date();

  const activeTickets = Array.isArray(tickets)
    ? tickets.filter(trx => trx.ticket_type?.event?.end_date && !isPastEvent(trx.ticket_type.event.end_date))
    : [];

  const pastTickets = Array.isArray(tickets)
    ? tickets.filter(trx => trx.ticket_type?.event?.end_date && isPastEvent(trx.ticket_type.event.end_date))
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">Tiket Saya</h1>

      {loading && <p className="text-center text-gray-500">Memuat data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && Array.isArray(tickets) && tickets.length === 0 && (
        <p className="text-center text-gray-500">Belum ada tiket yang dibeli.</p>
      )}

      {activeTickets.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Tiket Aktif</h2>
          <div className="space-y-4">
            {activeTickets.map((trx) => (
              <TicketCard key={trx.id} trx={trx} />
            ))}
          </div>
        </section>
      )}

      {pastTickets.map((trx) => {
        console.log("🧾 Past Ticket Check:", {
          id: trx.id,
          status: trx.status,
          review: trx.review,
        });

        return <TicketCard key={trx.id} trx={trx} showReviewButton />;
      })}
          </div>
        );
      }

function TicketCard({ trx, showReviewButton = false }: { trx: ImyTicket; showReviewButton?: boolean }) {
  console.log("🧾 Ticket Data:", trx); // debug
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white border shadow-sm rounded-xl p-4 hover:shadow-md transition">
      <div className="w-full sm:w-40 h-28 relative">
        <Image
          src={trx.ticket_type.event.image
            ? `${process.env.NEXT_PUBLIC_BASE_API_URL}${trx.ticket_type.event.image}`
            : '/placeholder.jpg'}
          alt={trx.ticket_type.event.name}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {trx.ticket_type.event.name}
          </h2>
          <p className="text-sm text-gray-600">
            Total: Rp{trx.total_price.toLocaleString('id-ID')} - Status: {trx.status.replaceAll('_', ' ')}
          </p>
          <p className="text-xs text-gray-500">
            Dibeli pada: {format(new Date(trx.created_at), 'dd MMM yyyy')}
          </p>
        </div>
        {showReviewButton  && trx.status === 'DONE' && !trx.review?.id && ( 
          <a
            href={`/reviewers/${trx.ticket_type.event.id}?transaction_id=${trx.id}&image=${trx.ticket_type.event.image}&name=${trx.ticket_type.event.name}`}
            className="text-sm mt-2 inline-block text-indigo-600 hover:underline"
          >
            Beri Review
          </a>
        )}
        
      </div>
    </div>
  );
}
