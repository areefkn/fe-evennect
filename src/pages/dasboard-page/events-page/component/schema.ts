import * as Yup from "yup";

export const createEventSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  Pay: Yup.boolean().required("Required"),
  start_date: Yup.date().required("Required"),
  end_date: Yup.date()
    .required("Required")
    .min(Yup.ref("start_date"), "End date must be after start date"),
  available_seats: Yup.number()
    .required("Required")
    .min(1, "Must be at least 1"),
});

export const editEventSchema = Yup.object({
  name: Yup.string().required("Event name is required"),
  location: Yup.string().required("Location is required"),
  start_date: Yup.date().required("Start date is required"),
  end_date: Yup.date()
    .min(Yup.ref("start_date"), "End date must be after start date")
    .required("End date is required"),
});
