"use client";

import TransactionAction from "./action";

interface Props {
  data: any[];
  onReload: () => void;
}

export default function TransactionTable({ data, onReload }: Props) {
  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">User</th>
          <th className="border p-2">Event</th>
          <th className="border p-2">Ticket</th>
          <th className="border p-2">Total</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Proof</th>
          <th className="border p-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((trx) => (
          <tr key={trx.id}>
            <td className="border p-2">
              {trx.user.first_name} {trx.user.last_name}
            </td>
            <td className="border p-2">{trx.ticket_type.event.name}</td>
            <td className="border p-2">{trx.ticket_type.name}</td>
            <td className="border p-2">
              Rp {trx.total_price.toLocaleString()}
            </td>
            <td className="border p-2">{trx.status}</td>
            <td className="border p-2">
              {trx.proof ? (
                <a
                  href={`${process.env.NEXT_PUBLIC_BASE_API_URL}${trx.proof}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  View
                </a>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </td>
            <td className="border p-2 text-center">
              <TransactionAction
                id={trx.id}
                disabled={trx.status !== "WAITING_CONFIRMATION"}
                onReload={onReload}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
