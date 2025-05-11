'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // local Storage
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      // simpan ke localStorage
      const prev = JSON.parse(localStorage.getItem('recentSearch') || '[]');
      const updated = [searchTerm.trim(), ...prev.filter((i: string) => i !== searchTerm.trim())].slice(0, 5);
      localStorage.setItem('recentSearch', JSON.stringify(updated));
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
      <div className="relative w-full max-w-md mx-auto sm:max-w-sm md:max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Search event..."
          className="w-full py-2 pl-4 pr-20 h-10 rounded-md border-2 border-gray-50 focus:outline-none focus:ring-1 focus:ring-purple-500"
          autoComplete="off"
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-14 top-2 px-2 py-0 text-red-50 hover:text-gray-700"
          >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          </button>
        )}

        <button
          onClick={handleSearch}
          className="absolute right-1 top-2 text-sm text-white hover:bg-gradient-to-r from-violet-500 to-indigo-600 px-3 py-0 rounded-md hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>

        </button>
      </div>

  );
};

export default SearchInput;
