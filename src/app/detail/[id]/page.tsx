'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    id: string;
    name: string;
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
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'tiket'>('deskripsi');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

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

  const handleCheckout = () => {
    if (!event || !selectedTicket) return;
    router.push(`/checkout/${event.id}`);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10 text-gray-500">Event tidak ditemukan.</p>;

  return (
    <div className="max-w-6xl mx-auto rounded-2xl p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kiri: Gambar & Tab */}
        <div className="lg:col-span-2 bg-white rounded shadow">
          <img
            src={event.image || "/placeholder.jpg"}
            alt={event.name}
            className="w-full h-[300px] md:h-[400px] object-cover rounded-t"
          />

          {/* Tabs */}
          <div className="flex space-x-4 border-b mt-4 px-6">
            <button
              onClick={() => setActiveTab('deskripsi')}
              className={`pb-2 font-semibold ${
                activeTab === 'deskripsi' ? 'border-b-2 border-violet-600 text-violet-600' : 'text-gray-500'
              }`}
            >
              Deskripsi
            </button>
            <button
              onClick={() => setActiveTab('tiket')}
              className={`pb-2 font-semibold ${
                activeTab === 'tiket' ? 'border-b-2 border-violet-600 text-violet-600' : 'text-gray-500'
              }`}
            >
              Tiket
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'deskripsi' && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{event.name}</h2>
                <p className="text-gray-600">{event.description}</p>
                <p><strong>Tanggal:</strong> {formatTanggal(event.start_date)} – {formatTanggal(event.end_date)}</p>
                <p><strong>Lokasi:</strong> {event.location}</p>
                <p><strong>Kapasitas:</strong> {event.available_seats} kursi</p>
              </div>
            )}

            {activeTab === 'tiket' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tiket Tersedia</h3>
                {event.ticket_types.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket.id)}
                    className={`cursor-pointer border rounded-xl p-4 bg-gray-50 ${
                      selectedTicket === ticket.id ? 'ring-2 ring-violet-600' : ''
                    }`}
                  >
                    <p className="font-medium">{ticket.name}</p>
                    <p className="text-sm text-gray-600">Harga: Rp{ticket.price.toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kanan: Ringkasan */}
        <div className="bg-gray-50 p-6 rounded shadow space-y-4 h-fit">
          <h2 className="text-xl font-semibold">{event.name}</h2>
          <p className="text-sm text-gray-500">{event.category}</p>
          <p className="text-sm">
            {formatTanggal(event.start_date)} – {formatTanggal(event.end_date)}
          </p>
          <div className="flex items-center space-x-3">
            <img
              src={event.organizer.avatar || "/no-photo.jpg"}
              alt="Penyelenggara"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">{event.organizer.first_name} {event.organizer.last_name}</p>
              <p className="text-xs text-gray-500">Penyelenggara</p>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={!selectedTicket}
            className="w-full bg-violet-600 cursor-pointer hover:bg-violet-700 text-white py-2 px-4 rounded-xl disabled:opacity-50"
          >
            {selectedTicket ? 'Beli Tiket' : 'Pilih Tiket Terlebih Dahulu'}
          </button>
        </div>
      </div>
    </div>
  );
}
