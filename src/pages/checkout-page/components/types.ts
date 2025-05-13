export interface ICheckout {
  id: string;
  name: string;
  image: string;
  location: string;
  category: string;
  description: string;
  start_date: string;
  end_date: string;
  available_seats: number;
  ticket_types: {
    id: string;
    price: number;
  }[];
}
