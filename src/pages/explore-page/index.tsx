'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import CardEvents from '@/components/CardEvents';
import EventFilter from './components/eventFilter';
import { IEvent } from '../../interface/type';

export default function ExploreEvents() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/explore`,
          {
            params: { category, location },
          }
        );
        setEvents(res.data.data || []);
      } catch (err) {
        // console.error('🔥 ERROR FETCHING EVENTS:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category, location]);

  return (
    <div className="max-w-screen-lg mx-auto px-4 pb-20">
      <EventFilter
        category={category}
        setCategory={setCategory}
        location={location}
        setLocation={setLocation}
      />

      {loading ? (
        <p className="text-center mt-8 text-gray-500">Loading...</p>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {events.map((item) => (
            <CardEvents
              key={item.id}
              title={item.name || 'Tanpa Judul'}
              date={new Date(item.start_date).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
              price={item.ticket_types?.[0]?.price ?? 0}
              imageUrl={item.image?.trim() || '/placeholder.jpg'}
              organizerName={`${item.organizer?.first_name ?? ''} ${item.organizer?.last_name ?? ''}`.trim()}
              organizerLogo={item.organizer?.avatar?.trim() || '/no-photo.jpg'}
              href={`/detail/${item.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-500">
          <p className="text-lg font-semibold">Ups, tidak ada event ditemukan</p>
          <p className="text-sm">Coba gunakan filter lain atau periksa ejaannya.</p>
        </div>
      )}
    </div>
  );
}
