import * as Yup from "yup";

export const ticketSchema = Yup.object().shape({
  name: Yup.string().required("Ticket name is required"),
  price: Yup.number().min(0, "Min price is 0").required("Price is required"),
  quota: Yup.number().min(1, "Min quota is 1").required("Quota is required"),
});
