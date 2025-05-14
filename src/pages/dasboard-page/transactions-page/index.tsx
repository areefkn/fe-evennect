"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TransactionTable from "./component/table";

export default function OrganizerTransactions() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((c) => c.startsWith("access_token="))
        ?.split("=")[1];

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions/organizer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        All Transactions
      </h1>
      <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
        <TransactionTable data={transactions} onReload={fetchTransactions} />
      </div>
    </div>
  );
}
