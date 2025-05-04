import * as Yup from "yup";

export const eventSchema = Yup.object().shape({
  name: Yup.string().required("Event name is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  location: Yup.string().required("Location is required"),
  Pay: Yup.boolean(),
  start_date: Yup.date().required("Start date is required"),
  end_date: Yup.date().required("End date is required"),
  available_seats: Yup.number()
    .min(1, "Minimum 1 seat")
    .required("Available seats is required"),
});
