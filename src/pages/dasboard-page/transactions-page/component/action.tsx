"use client";

import axios from "axios";
import Swal from "sweetalert2";

interface Props {
  id: string;
  disabled: boolean;
  onReload: () => void;
}

export default function TransactionAction({ id, disabled, onReload }: Props) {
  const handleAction = async (action: "approve" | "reject") => {
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Success", `Transaction ${action}d!`, "success");
      onReload();
    } catch (err) {
      Swal.fire("Error", "Failed to update transaction", "error");
    }
  };

  if (disabled) return null;

  return (
    <div className="flex gap-2 justify-center">
      <button
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
        onClick={() => handleAction("approve")}
      >
        Approve
      </button>
      <button
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        onClick={() => handleAction("reject")}
      >
        Reject
      </button>
    </div>
  );
}
