export interface ImyTicket {
  id: string;
  created_at: string;
  total_price: number;
  status: string;
  review?: { id: string } | null;
  ticket_type: {
    name: string;
    event: {
      id: string;
      name: string;
      image: string;
      location: string;
      end_date: string;
    };
  };
}
