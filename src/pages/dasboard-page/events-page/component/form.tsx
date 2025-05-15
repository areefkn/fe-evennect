"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { createEventSchema } from "../component/schema";
import { CreateEventPayload } from "../component/types";
import axios from "axios";
import Swal from "sweetalert2";

const getToken = () =>
  document.cookie
    .split("; ")
    .find((c) => c.startsWith("access_token="))
    ?.split("=")[1];

export default function CreateEventForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const initialValues: CreateEventPayload = {
    name: "",
    description: "",
    category: "",
    location: "",
    Pay: false,
    start_date: "",
    end_date: "",
    available_seats: 1,
    image: null,
  };

  const handleSubmit = async (values: CreateEventPayload) => {
    try {
      const token = getToken();
      const formData = new FormData();

      for (const key in values) {
        if (key !== "image") {
          formData.append(key, String(values[key as keyof CreateEventPayload]));
        }
      }

      if (values.image) {
        formData.append("file", values.image);
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/events`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Event Created",
        text: "Your event has been successfully created!",
      });
      onSuccess();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to create event. Please try again!",
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createEventSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-4 p-6 bg-white border rounded-lg shadow-md">
          {[
            { label: "Name", name: "name" },
            { label: "Description", name: "description" },
            { label: "Category", name: "category" },
            { label: "Location", name: "location" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block font-medium mb-1">{label}</label>
              <Field
                name={name}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage
                name={name}
                component="div"
                className="text-sm text-red-500 mt-1"
              />
            </div>
          ))}

          <div>
            <label className="block font-medium mb-1">Start Date</label>
            <Field
              name="start_date"
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="start_date"
              component="div"
              className="text-sm text-red-500 mt-1"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">End Date</label>
            <Field
              name="end_date"
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <ErrorMessage
              name="end_date"
              component="div"
              className="text-sm text-red-500 mt-1"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Available Seats</label>
            <Field
              name="available_seats"
              type="number"
              min={1}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center">
            <Field
              name="Pay"
              type="checkbox"
              className="mr-2 w-4 h-4 accent-blue-600"
            />
            <label className="font-medium">Paid Event</label>
          </div>

          <div>
            <label className="block font-medium mb-1">Event Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] || null;
                setFieldValue("image", file);
              }}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Create Event
          </button>
        </Form>
      )}
    </Formik>
  );
}
