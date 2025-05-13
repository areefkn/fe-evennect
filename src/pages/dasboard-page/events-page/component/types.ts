export interface CreateEventPayload {
  name: string;
  description: string;
  category: string;
  location: string;
  Pay: boolean;
  start_date: string;
  end_date: string;
  available_seats: number;
  image: File | null;
}

export interface EditEventFormValues {
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  image: File | null;
}
