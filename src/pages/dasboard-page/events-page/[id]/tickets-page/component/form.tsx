"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { createTicketTypeSchema } from "./schema";
import { CreateTicketTypePayload } from "./types";
import axios from "axios";
import Swal from "sweetalert2";

const getToken = () =>
  document.cookie
    .split("; ")
    .find((c) => c.startsWith("access_token="))
    ?.split("=")[1];

export default function CreateTicketTypeForm({
  eventId,
  onSuccess,
}: {
  eventId: string;
  onSuccess: () => void;
}) {
  const initialValues: CreateTicketTypePayload = {
    event_id: eventId,
    name: "",
    price: 0,
    quota: 1,
  };

  const handleSubmit = async (values: CreateTicketTypePayload) => {
    try {
      const token = getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/ticket-types`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Ticket Created",
        text: "Ticket type created successfully.",
      });

      onSuccess();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.response?.data?.message || "Failed to create ticket type",
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createTicketTypeSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="space-y-1">
          <label htmlFor="name" className="block font-medium text-gray-700">
            Ticket Name
          </label>
          <Field
            name="name"
            id="name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="name"
            component="div"
            className="text-sm text-red-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="price" className="block font-medium text-gray-700">
            Price
          </label>
          <Field
            name="price"
            id="price"
            type="number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="price"
            component="div"
            className="text-sm text-red-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="quota" className="block font-medium text-gray-700">
            Quota
          </label>
          <Field
            name="quota"
            id="quota"
            type="number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="quota"
            component="div"
            className="text-sm text-red-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Create Ticket Type
        </button>
      </Form>
    </Formik>
  );
}
