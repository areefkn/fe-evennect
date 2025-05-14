"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CardEvents from "@/components/CardEvents";

const SeachMain = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/events`,
          {
            params: { q: query },
          }
        );
        setResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-20">
      <h1 className="text-xl font-bold mb-6">Hasil pencarian: "{query}"</h1>
      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((event: any) => (
            <CardEvents
              key={event.id}
              imageUrl={
                event.image?.startsWith("http")
                  ? event.image
                  : `${process.env.NEXT_PUBLIC_BASE_API_URL}${event.image || ""}`
              }
              title={event.name}
              date={new Date(event.start_date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              price={event.ticket_types?.[0]?.price || 0}
              organizerLogo={event.organizer?.avatar || "/no-photo.jpg"}
              organizerName={`${event.organizer?.first_name || ""} ${
                event.organizer?.last_name || ""
              }`}
              href={`/detail/${event.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-500">
          <p className="text-lg font-semibold">
            Ups, tidak ada event ditemukan 😥
          </p>
          <p className="text-sm">
            Coba gunakan kata kunci lain atau periksa ejaannya.
          </p>
        </div>
      )}
    </div>
  );
};

export default SeachMain;
