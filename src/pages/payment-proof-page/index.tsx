// app/payment-proof/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface Transaction {
  id: string;
  total_price: number;
  status: string;
  ticket_type: {
    event: {
      name: string;
      image: string;
    };
  };
}

export default function PaymentProofMain() {
  const { id } = useParams() as { id: string };
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions/${id}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      })
      .then((res) => setTransaction(res.data.data))
      .catch(() => setTransaction(null));
  }, [id]);

  const handleUpload = async () => {
    if (!proof) return alert('Silakan pilih file bukti pembayaran');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', proof);

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions/${id}/upload-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      });
      alert('Bukti pembayaran berhasil diunggah!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengunggah bukti pembayaran');
    } finally {
      setLoading(false);
    }
  };

  if (!transaction) return <p className="text-center mt-10">Transaksi tidak ditemukan.</p>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-6">
      <h1 className="text-xl font-semibold mb-4">Unggah Bukti Pembayaran</h1>
      <div className="flex gap-4 items-center mb-4">
        <Image
          src={transaction.ticket_type.event.image || '/placeholder.jpg'}
          alt={transaction.ticket_type.event.name}
          width={100}
          height={100}
          className="rounded object-cover"
        />
        <div>
          <h2 className="text-lg font-bold">{transaction.ticket_type.event.name}</h2>
          <p className="text-sm text-gray-600">Total: Rp{transaction.total_price.toLocaleString('id-ID')}</p>
          <p className="text-sm text-gray-600">Status: {transaction.status}</p>
        </div>
      </div>

      <input type="file" onChange={(e) => setProof(e.target.files?.[0] || null)} className="mb-4" />

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Mengunggah...' : 'Unggah Bukti Pembayaran'}
      </button>

      <p className="text-xs text-gray-500 mt-4">
        Pastikan Anda mengunggah bukti transfer ke rekening yang telah ditentukan oleh penyelenggara event.
      </p>

      <Link href="/" className="block mt-4 text-sm text-indigo-500 hover:underline">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
