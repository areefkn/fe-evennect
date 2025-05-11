interface IEvent {
  id: string;
  name: string;
  start_date: string;
  image?: string;
  ticket_types?: { price: number }[];
  organizer?: {
    first_name?: string;
    last_name?: string;
    avatar?: string;
  };
}
