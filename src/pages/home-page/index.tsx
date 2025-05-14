"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CardEvents from "@/components/CardEvents";
import { IEvent, IApiResponse } from "./component/type";

export default function HomeMain() {
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<IEvent[]>([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      try {

        const resAll = await axios.get<IApiResponse<IEvent[]>>(`${process.env.NEXT_PUBLIC_BASE_API_URL}/events/show`);
        const resFeatured = await axios.get<IApiResponse<IEvent[]>>(`${process.env.NEXT_PUBLIC_BASE_API_URL}/events/show?featured=true`);
        // console.log("✅ resAll.data:", resAll.data);   //debug
        setUpcomingEvents(resAll.data.data.filter((e: IEvent) => !e.ticket_types || e.ticket_types.length === 0));

        setFeaturedEvents(resFeatured.data.data);
      } catch (error) {
        console.error("❌ Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="home-page container mx-auto px-4 py-8">
      {/* Upcoming Events */}
      <section className="upcoming-events mb-8 bg-gray-100 py-12 px-6 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-6 text-center">Upcoming Events</h2>
        <div className="event-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="event-item bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold truncate">{event.name}</h3>
              <p className="text-gray-600">
                Date: {new Date(event.start_date).toLocaleDateString("id-ID")}
              </p>
              <p className="text-gray-600">Location: {event.location}</p>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-lg">
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events */}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 ">Event Pilihan</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
            {featuredEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="min-w-[280px] max-w-[280px]">
                <CardEvents
                  imageUrl={event.image}
                  title={event.name}
                  date={new Date(event.start_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  price={event.ticket_types[0]?.price || 0}
                  organizerLogo={event.organizer.avatar || "/no-photo.jpg"}
                  organizerName={`${event.organizer.first_name} ${event.organizer.last_name}`}
                  href={`/detail/${event.id}`}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Promo */}
      <section className="promotions">
        <h2 className="text-2xl font-bold mb-4">Promotions & Vouchers</h2>
        <div className="promo-items grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="promo-item bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold">Promo Title</h3>
            <p className="mt-2">Details about the promotion or voucher.</p>
            <button className="mt-4 bg-white text-indigo-600 hover:bg-gray-100 py-2 px-4 rounded font-medium">
              Claim Now
            </button>
          </div>
          <div className="promo-item bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold">Special Offer</h3>
            <p className="mt-2">Limited time discount on premium events.</p>
            <button className="mt-4 bg-white text-pink-600 hover:bg-gray-100 py-2 px-4 rounded font-medium">
              Get Discount
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
