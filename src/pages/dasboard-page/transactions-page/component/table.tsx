"use client";

import TransactionAction from "./action";

interface Props {
  data: any[];
  onReload: () => void;
}

export default function TransactionTable({ data, onReload }: Props) {
  return (
    <table className="w-full text-sm text-left border-collapse min-w-[800px]">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="px-4 py-3 border">User</th>
          <th className="px-4 py-3 border">Event</th>
          <th className="px-4 py-3 border">Ticket</th>
          <th className="px-4 py-3 border">Total</th>
          <th className="px-4 py-3 border">Status</th>
          <th className="px-4 py-3 border">Proof</th>
          <th className="px-4 py-3 border text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-6 text-gray-500">
              No transactions found.
            </td>
          </tr>
        ) : (
          data.map((trx) => (
            <tr key={trx.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">
                {trx.user.first_name} {trx.user.last_name}
              </td>
              <td className="px-4 py-2 border">{trx.ticket_type.event.name}</td>
              <td className="px-4 py-2 border">{trx.ticket_type.name}</td>
              <td className="px-4 py-2 border text-gray-700 font-medium">
                Rp {trx.total_price.toLocaleString()}
              </td>
              <td className="px-4 py-2 border capitalize">
                {trx.status.replace("_", " ")}
              </td>
              <td className="px-4 py-2 border">
                {trx.proof ? (
                  <a
                    href={`${process.env.NEXT_PUBLIC_BASE_API_URL}${trx.proof}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No proof</span>
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                <TransactionAction
                  id={trx.id}
                  disabled={trx.status !== "WAITING_CONFIRMATION"}
                  onReload={onReload}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
