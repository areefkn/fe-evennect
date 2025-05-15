'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getCookie } from "cookies-next";

export default function ReviewMain() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams?.get('event_id') ?? '';
  const transactionId = searchParams?.get('transaction_id') ?? '';
  const image = searchParams?.get('image') ?? '';
  const eventName = searchParams?.get('name') ?? '';

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !comment) {
      toast.error('Mohon isi semua bidang.');
      return;
    }

      // ✅ DEBUGGING DI SINI
  console.log("📦 Data yang akan dikirim:", {
    event_id: eventId,
    transaction_id: transactionId,
    rating,
    comment
  });

    try {
      setSubmitting(true);
      const access_token = getCookie("access_token") as string;

      const formData = new FormData();
      formData.append('event_id', eventId);
      formData.append('rating', rating.toString());
      formData.append('comment', comment);
      formData.append('transaction_id', transactionId);
      if (file) formData.append('image', file);

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/reviews`,  {
  event_id: eventId,
  rating,
  comment,
  transaction_id: transactionId,
},{
        headers: {
          Authorization: 'Bearer ' + access_token,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Review berhasil dikirim!');
      router.push('/my-ticket-page');
    } catch (err: any) {
      toast.error('Gagal mengirim review.');
      console.error(err);
      console.error("❌ Error saat mengirim review:", err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white border shadow-lg rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-40 h-28 relative">
            <Image
              src={process.env.NEXT_PUBLIC_BASE_API_URL + image}
              alt={eventName}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-gray-800">{eventName}</h2>
            <p className="text-sm text-gray-600">Berikan ulasan dan rating Anda</p>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating:</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-xl transition-transform duration-200 transform hover:scale-125 ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Komentar:</label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tulis komentar kamu di sini..."
          />
        </div>

        <button
        
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
            
          {submitting ? 'Mengirim...' : 'Kirim Review'}
        </button>
      </div>
    </div>
  );
}