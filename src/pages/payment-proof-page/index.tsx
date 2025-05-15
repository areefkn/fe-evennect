'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { ITransaction } from './components/types';
import Swal from 'sweetalert2';

export default function PaymentProofMain() {
  const { id } = useParams() as { id: string };
  const [transaction, setTransaction] = useState<ITransaction | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState<number>(2 * 60 * 60); // 2 jam
  const access_token = getCookie('access_token') as string;
  const [isFetchingTransaction, setIsFetchingTransaction] = useState(true);


  // Fetch transaction detail
useEffect(() => {
  if (!id) return;

  setIsFetchingTransaction(true);

  axios
    .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions/${id}`, {
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    })
    .then((res) => setTransaction(res.data.transaction))
    .catch(() => setTransaction(null))
    .finally(() => setIsFetchingTransaction(false)); // TANPA ; di catch
}, [id]);

  // Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format 2 jam ke jam:menit:detik
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Upload file bukti pembayaran
  const handleUpload = async () => {
    if (!proof) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Silakan pilih file bukti pembayaran terlebih dahulu!',
    });
    return;
  }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', proof);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions/${id}/upload-proof`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + access_token,
          },
        }
      );
       Swal.fire({
      icon: 'success',
      title: 'Success...',
      text: 'Bukti pembayaran berhasil diunggah!',
    });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengunggah bukti pembayaran');
    } finally {
      setLoading(false);
    }
  };

if (isFetchingTransaction) {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
      <p className="text-sm text-gray-700 font-medium">Memuat data transaksi...</p>
    </div>
  );
}

if (!transaction) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-gray-500">Transaksi tidak ditemukan.</p>
    </div>
  );
}


  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded-2xl h-90 mt-6">
      <h1 className="text-xl font-semibold mb-4">Unggah Bukti Pembayaran</h1>

      {/* Informasi Event */}
      <div className="flex gap-4 items-center mb-4">
        <Image
          src={
            transaction.ticket_type.event.image
              ? `${process.env.NEXT_PUBLIC_BASE_API_URL}${transaction.ticket_type.event.image}`
              : '/placeholder.jpg'
          }
          alt={transaction.ticket_type.event.name}
          width={100}
          height={100}
          className="rounded object-cover"
        />
        <div>
          <h2 className="text-lg font-bold">{transaction.ticket_type.event.name}</h2>
          <p className="text-sm text-gray-600">
            Total: Rp{transaction.total_price.toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-gray-600">Status: {transaction.status}</p>
          <p className="text-sm text-red-500 mt-1">Waktu tersisa: {formatTime(countdown)}</p>
        </div>
      </div>

      {/* Informasi rekening organizer */}
      {transaction.ticket_type.event.organizer?.payment_proof && (
        <div className="bg-yellow-50 border border-yellow-300 p-3 mb-4 rounded text-sm">
          <p className="font-medium text-gray-800 mb-1">Transfer ke rekening:</p>
          <p>{transaction.ticket_type.event.organizer.payment_proof}</p>
        </div>
      )}

      {/* Input bukti */}
      <div className="flex w-80">
        <input
          type="file"
          onChange={(e) => setProof(e.target.files?.[0] || null)}
          className="mb-4 border rounded w-80"
        />
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      {/* Tombol upload */}
      <button
        onClick={handleUpload}
        disabled={loading || countdown === 0}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Mengunggah...' : 'Unggah Bukti Pembayaran'}
      </button>

      <p className="text-xs text-gray-500 mt-4">
        Pastikan Anda mengunggah bukti transfer ke rekening yang telah ditentukan oleh
        penyelenggara event.
      </p>

      <Link href="/" className="block mt-4 text-sm text-indigo-500 hover:underline">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
