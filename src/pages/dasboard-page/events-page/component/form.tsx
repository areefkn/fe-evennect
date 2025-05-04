"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { eventSchema } from "./schema";
import { ICreateEvent } from "./types";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export default function CreateEventForm() {
  const router = useRouter();

  const initialValues: ICreateEvent = {
    name: "",
    description: "",
    category: "",
    location: "",
    Pay: false,
    start_date: "",
    end_date: "",
    available_seats: 0,
  };

  const handleSubmit = async (values: ICreateEvent) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((c) => c.startsWith("access_token="))
        ?.split("=")[1];

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/events`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Success", "Event created", "success");
      router.push(`/dashboard/events/${res.data.id}/tickets`);
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={eventSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-4 max-w-2xl mx-auto p-4">
        <div>
          <label>Event Name</label>
          <Field name="name" className="input" />
          <ErrorMessage
            name="name"
            className="text-red-500 text-sm"
            component="div"
          />
        </div>

        <div>
          <label>Description</label>
          <Field name="description" as="textarea" className="input" />
          <ErrorMessage
            name="description"
            className="text-red-500 text-sm"
            component="div"
          />
        </div>

        <div>
          <label>Category</label>
          <Field name="category" className="input" />
          <ErrorMessage
            name="category"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label>Location</label>
          <Field name="location" className="input" />
          <ErrorMessage
            name="location"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <div>
          <label>Available Seats</label>
          <Field name="available_seats" type="number" className="input" />
          <ErrorMessage
            name="available_seats"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Field name="Pay" type="checkbox" />
          <label>Paid Event?</label>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label>Start Date</label>
            <Field name="start_date" type="date" className="input" />
            <ErrorMessage
              name="start_date"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div className="flex-1">
            <label>End Date</label>
            <Field name="end_date" type="date" className="input" />
            <ErrorMessage
              name="end_date"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Event
        </button>
      </Form>
    </Formik>
  );
}
