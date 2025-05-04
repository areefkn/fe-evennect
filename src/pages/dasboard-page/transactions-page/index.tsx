"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TransactionTable from "./component/table";

export default function OrganizerTransactionsPage() {
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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4">All Transactions</h1>
      <TransactionTable data={transactions} onReload={fetchTransactions} />
    </div>
  );
}
