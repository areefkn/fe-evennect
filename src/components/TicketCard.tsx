import Image from 'next/image';
import { format } from 'date-fns';
import { ImyTicket } from '@/pages/my-ticket-page/components/types';

interface TicketCardProps {
  trx: ImyTicket;
  showReviewButton?: boolean;
}

export default function TicketCard({ trx, showReviewButton = false }: TicketCardProps) {
  const imageUrl = trx.ticket_type.event.image
    ? `${process.env.NEXT_PUBLIC_BASE_API_URL}${trx.ticket_type.event.image}`
    : "/placeholder.jpg";

  const eventDate = format(new Date(trx.ticket_type.event.end_date), "dd MMM yyyy");
  const purchaseDate = format(new Date(trx.created_at), "dd MMM yyyy");

  return (
    <div className="rounded-xl overflow-hidden shadow-md border max-w-xl mx-auto bg-white">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-blue-900 text-white">
        <div className="w-24 h-28 relative shrink-0">
          <Image
            src={imageUrl}
            alt={trx.ticket_type.event.name}
            fill
            className="rounded object-cover"
          />
        </div>
        <div className="flex flex-col justify-between text-sm">
          <div>
            <h3 className="text-lg font-bold mb-1 line-clamp-1">
              {trx.ticket_type.event.name}
            </h3>
            <p>Tanggal: <span className="font-semibold">{eventDate}</span></p>
            <p>Lokasi: <span className="font-semibold">{trx.ticket_type.event.location || '-'}</span></p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-yellow-200 p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm">
        <div className="mb-2 sm:mb-0">
          <p className="font-semibold">Kelas Tiket: {trx.ticket_type.name}</p>
          <p>Total: Rp{trx.total_price.toLocaleString("id-ID")}</p>
          <p>Status: {trx.status.replaceAll("_", " ")}</p>
        </div>
        <div>
          <p className="text-xs text-gray-700">Dibeli pada: {purchaseDate}</p>
          {showReviewButton && trx.status === "DONE" && !trx.review && (
            <a
              href={`/review/${trx.ticket_type.event.id}`}
              className="inline-block mt-1 px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
            >
              Beri Review
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
