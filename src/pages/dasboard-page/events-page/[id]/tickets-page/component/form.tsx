"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { ticketSchema } from "./schema";
import { ITicketForm } from "./types";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

interface Props {
  eventId: string;
  onCreated?: () => void;
}

export default function TicketForm({ eventId, onCreated }: Props) {
  const initialValues: ITicketForm = {
    name: "",
    price: 0,
    quota: 0,
  };

  const handleSubmit = async (values: ITicketForm) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((c) => c.startsWith("access_token="))
        ?.split("=")[1];

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/ticket-types`,
        { ...values, event_id: eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", "Ticket created", "success");
      onCreated?.();
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ticketSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-4">
        <div>
          <label>Ticket Name</label>
          <Field name="name" className="input" />
          <ErrorMessage
            name="name"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
        <div>
          <label>Price</label>
          <Field name="price" type="number" className="input" />
          <ErrorMessage
            name="price"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
        <div>
          <label>Quota</label>
          <Field name="quota" type="number" className="input" />
          <ErrorMessage
            name="quota"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Ticket
        </button>
      </Form>
    </Formik>
  );
}
