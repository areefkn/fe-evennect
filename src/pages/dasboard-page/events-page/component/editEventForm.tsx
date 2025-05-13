"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { EditEventFormValues } from "./types";
import { editEventSchema } from "./schema";
import Swal from "sweetalert2";

interface Props {
  eventId: string;
  initialData: EditEventFormValues;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEventForm({
  eventId,
  initialData,
  onClose,
  onSuccess,
}: Props) {
  const handleSubmit = async (values: EditEventFormValues) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((c) => c.startsWith("access_token="))
        ?.split("=")[1];

      const formData = new FormData();

      for (const key in values) {
        if (key !== "image") {
          formData.append(
            key,
            String(values[key as keyof EditEventFormValues])
          );
        }
      }

      // Append file explicitly as "file"
      if (values.image) {
        formData.append("file", values.image);
      }
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${eventId}`,
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
        title: "Event updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      onSuccess();
    } catch (error) {
      console.error("Failed to update event:", error);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Formik
      initialValues={initialData}
      validationSchema={editEventSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <div>
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <Field name="name" className="w-full border rounded p-2" />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Field name="location" className="w-full border rounded p-2" />
            <ErrorMessage
              name="location"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Field
              type="date"
              name="start_date"
              className="w-full border rounded p-2"
            />
            <ErrorMessage
              name="start_date"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <Field
              type="date"
              name="end_date"
              className="w-full border rounded p-2"
            />
            <ErrorMessage
              name="end_date"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* ✅ Input gambar yang benar */}
          <Field name="image">
            {({ form }: any) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    form.setFieldValue("image", file);
                  }}
                  className="mt-1 block w-full text-sm text-gray-600"
                />
              </div>
            )}
          </Field>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
