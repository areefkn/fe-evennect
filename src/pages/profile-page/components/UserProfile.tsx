"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  end_date: string;
}

interface User {
  first_name: string;
  last_name: string;
  email: string;
  profile_pict: string | null;
  referral_code: string;
  point: number;
  coupons: Coupon[];
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

    if (!token) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.data))
      .catch((err) => {
        console.error(err);
        Swal.fire("Failed", "Failed to load profile", "error");
      });
  }, []);

  if (!user)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded shadow-sm mt-4">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 text-center sm:text-left">
        <img
          src={
            user.profile_pict
              ? `${process.env.NEXT_PUBLIC_BASE_API_URL}${user.profile_pict}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border shadow"
        />
        <div className="mt-4 sm:mt-0">
          <h2 className="text-2xl font-bold">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Referral Code</p>
          <p className="font-semibold text-lg">{user.referral_code}</p>
        </div>
        <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Points</p>
          <p className="font-semibold text-lg">{user.point}</p>
        </div>
      </div>

      {/* Coupons Section */}
      <div>
        <h3 className="text-xl font-semibold mb-3">My Coupons</h3>
        {user.coupons && user.coupons.length > 0 ? (
          <ul className="space-y-3">
            {user.coupons.map((coupon) => (
              <li
                key={coupon.id}
                className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm"
              >
                <p className="font-bold text-green-800">Code: {coupon.code}</p>
                <p className="text-sm text-gray-700">
                  Discount: {coupon.discount}
                </p>
                <p className="text-sm text-gray-500">
                  Expires at:{" "}
                  {new Date(coupon.end_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">
            You don't have any coupons yet.
          </p>
        )}
      </div>
    </div>
  );
}
