export interface IEvent {
  id: string;
  name: string;
  start_date: string;
  location: string;
  image: string;
  ticket_types: {
    price: number;
  }[];
  organizer: {
    first_name: string;
    last_name: string;
    avatar?: string;
  };
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
}
