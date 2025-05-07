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

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">User Profile</h2>
      <div className="flex items-center space-x-4">
        <img
          src={
            user.profile_pict
              ? `${process.env.NEXT_PUBLIC_BASE_API_URL}${user.profile_pict}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-500">Referral Code</p>
          <p className="font-semibold">{user.referral_code}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-500">Points</p>
          <p className="font-semibold">{user.point}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">My Coupons</h3>
        {user.coupons && user.coupons.length > 0 ? (
          <ul className="space-y-3">
            {user.coupons.map((coupon) => (
              <li key={coupon.id} className="bg-green-100 p-4 rounded shadow">
                <p className="font-bold text-green-800">Code: {coupon.code}</p>
                <p>Discount: {coupon.discount}</p>
                <p>
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
          <p className="text-gray-500">You don't have any coupons yet.</p>
        )}
      </div>
    </div>
  );
}
