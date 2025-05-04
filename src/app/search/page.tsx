// app/search/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/events`, {
          params: { q: query },
        });
        setResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Hasil pencarian: "{query}"</h1>
      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <ul className="space-y-2">
          {results.map((item: any, idx: number) => (
            <li key={idx} className="p-4 border rounded hover:bg-gray-100">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600">{item.category}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Tidak ada hasil ditemukan.</p>
      )}
    </div>
  );
};

export default SearchPage;
