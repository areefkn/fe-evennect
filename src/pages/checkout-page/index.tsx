"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { ICheckout } from './components/types';
import { getCookie } from "cookies-next";


export default function CheckoutPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [event, setEvent] = useState<ICheckout | null>(null);
  const [loading, setLoading] = useState(true);
  const [usedPoints, setUsedPoints] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const access_token = getCookie("access_token") as string;

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${id}`)
      .then((res) => setEvent(res.data.event))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  const [voucherId, setVoucherId] = useState<string | null>(null);

  const applyVoucher = async () => {
    if (!voucherCode) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/vouchers/${voucherCode}`
      );
      setVoucherDiscount(res.data.discount);

      setVoucherId(res.data.id); // simpan ID voucher
      alert('Voucher berhasil digunakan!');
    } catch {
      setVoucherDiscount(0);
      setVoucherId(null);
      alert('Voucher tidak valid.');

    }
  };

  

  const handleCheckout = async () => {
    if (!event) return;
    try {

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions`, {
        ticket_type_id: event.ticket_types[0].id,
        used_points: usedPoints,
        voucher_id: typeof voucherId === 'string' ? voucherId : undefined
      },
      { 
        headers:{
      Authorization: 'Bearer ' + access_token
      }
    }
    );

      router.push(`/payment-proof/${res.data.data.id}`);
    } catch (err: any) {
      alert(err.response?.data?.message || "Checkout gagal");
    }
  };

  const formatIDR = (amount: number) =>
    amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

  if (loading) return <p className="text-center">Loading...</p>;
  if (!event) return <p className="text-center">Event tidak ditemukan.</p>;

  const ticketPrice = event.ticket_types?.[0]?.price ?? 0;
  const maxPointsAllowed = Math.floor(ticketPrice * 0.0667);
  const pointsUsed = Math.min(usedPoints, maxPointsAllowed);
  const total = Math.max(ticketPrice - voucherDiscount - pointsUsed, 0);

  return (
    <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Detail Pemesanan</h2>
        <div className="flex gap-4">
          <Image
            src={
              event.image
                ? `${process.env.NEXT_PUBLIC_BASE_API_URL}${event.image}`
                : "/placeholder.jpg"
            }
            alt={event.name}
            width={200}
            height={120}
            className="rounded-md object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{event.name}</h3>
            <p className="text-sm text-gray-600">
              {event.category} &mdash; {event.location}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(event.start_date).toLocaleDateString("id-ID")} -{" "}
              {new Date(event.end_date).toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block font-medium mb-1">Kode Voucher</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Masukkan kode voucher"
              />
              <button
                onClick={applyVoucher}
                className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Gunakan
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Gunakan Poin</label>
            <input
              type="number"
              value={usedPoints}
              onChange={(e) => setUsedPoints(Number(e.target.value))}
              max={maxPointsAllowed}
              className="w-full border rounded p-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maksimal potongan {formatIDR(maxPointsAllowed)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Ringkasan Pembayaran</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Harga Tiket</span>
            <span>{formatIDR(ticketPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Diskon Voucher</span>
            <span>-{formatIDR(voucherDiscount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Potongan Poin</span>
            <span>-{formatIDR(pointsUsed)}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold">
            <span>Total Bayar</span>
            <span>{formatIDR(total)}</span>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <label className="flex gap-2 items-start">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            Saya setuju dengan syarat & ketentuan
          </label>
        </div>

        <button
          onClick={handleCheckout}
          disabled={!agreed}
          className="mt-6 w-full py-2 bg-green-600 cursor-pointer text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {ticketPrice === 0 ? "Dapatkan Tiket Gratis" : "Bayar Sekarang"}
        </button>
      </div>
    </div>
  );
}
