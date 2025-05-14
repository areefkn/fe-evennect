export interface ITransaction {
  id: string;
  total_price: number;
  status: string;
  ticket_type: {
    event: {
      name: string;
      image: string;
    };
  };
}
