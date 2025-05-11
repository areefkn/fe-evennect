// app/events/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams,  useRouter } from 'next/navigation';
import axios from 'axios';


interface IEvent {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  location: string;
  start_date: string;
  end_date: string;
  available_seats: number;
  organizer: {
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  ticket_types: {
    price: number;
  }[];
}

const formatTanggal = (tanggal: string) =>
  new Date(tanggal).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export default function EventDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${id}`);
        setEvent(res.data.event);
      } catch (err) {
        console.error('Error fetching event detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10 text-gray-500">Event tidak ditemukan.</p>;

  return (
     <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gambar */}
        <div>
          <img
            src={event.image || "/placeholder.jpg"}
            alt={event.name}
            className="w-full h-64 md:h-[400px] object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Informasi Detail */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
          <p className="text-sm text-gray-500">{event.category} &mdash; {event.location}</p>

          <p className="text-gray-700 text-justify leading-relaxed">
            {event.description}
          </p>

          <div className="text-gray-700">
            <p><strong>Tanggal:</strong> {formatTanggal(event.start_date)} &ndash; {formatTanggal(event.end_date)}</p>
            <p><strong>Kapasitas:</strong> {event.available_seats} kursi</p>
          </div>

          {/* Penyelenggara */}
          <div className="flex items-center mt-4">
            <img
              src={event.organizer.avatar || "/no-photo.jpg"}
              alt="Organizer"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              {event.organizer.first_name} {event.organizer.last_name}
            </span>
          </div>

          {/* Tombol Beli Tiket */}
        {event.ticket_types?.[0] && (
          <button
            onClick={() => router.push(`/checkout/${event.id}`)}
            className="mt-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            {event.ticket_types[0].price === 0
              ? 'Dapatkan Tiket Gratis'
              : `Beli Tiket - Rp${event.ticket_types[0].price.toLocaleString('id-ID')}`}
          </button>
        )}
        </div>
      </div>
    </div>
  );
}
