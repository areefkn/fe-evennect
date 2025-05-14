export interface ImyTicket {
  id: string;
  status: string;
  total_price: number;
  created_at: string;
  ticket_type: {
    event: {
      id: string;
      name: string;
      image: string;
      end_date: string;
    };
  };
  review?: {
    id: string;
  };
}
