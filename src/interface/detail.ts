export interface IEvent {
  id: string;
  name: string;
  category?: string;
  location?: string;
  description?: string;
  start_date: string;
  end_date: string;
  available_seats?: number;
  image?: string;
  ticket_types?: {
    id: string;
    name?: string;
    price: number;
  }[];
  organizer?: {
    first_name: string;
    last_name: string;
    avatar?: string;
  };
}
