export interface ImyTicket {
  id: string;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
  ticket_type: {
    id: string;
    name: string;
    price: number;
    event: {
      id: string;
      name: string;
      image: string;
      location: string;
      end_date: string;
    };
  };
  review?: { id: string } | null;
}
