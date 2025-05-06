import * as Yup from "yup";

export const createTicketTypeSchema = Yup.object({
  event_id: Yup.string().required("Event ID is required"),
  name: Yup.string().required("Ticket name is required"),
  price: Yup.number().min(0).required("Price is required"),
  quota: Yup.number().min(1).required("Quota is required"),
});
