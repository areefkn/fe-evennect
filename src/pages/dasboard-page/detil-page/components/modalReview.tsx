"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface ModalReviewProps {
  event_id: string | null;
  open: boolean;
  onClose: () => void;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
  };
}

export default function ModalReview({
  event_id,
  open,
  onClose,
}: ModalReviewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

  useEffect(() => {
    const fetchReviews = async () => {
      if (!event_id || !open) return;

      try {
        const token = getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/reviews/event/${event_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(res.data.reviews);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchReviews();
  }, [event_id, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4 md:px-8">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 relative shadow-xl transition-transform transform">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Event Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-800">
                    {review.user.first_name} {review.user.last_name}
                  </div>
                  <div className="text-sm text-yellow-600 font-medium">
                    Rating: {review.rating} ⭐
                  </div>
                </div>
                <div className="text-sm text-gray-700 mt-2">
                  {review.comment}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
