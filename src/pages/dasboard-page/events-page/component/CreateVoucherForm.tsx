"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

interface Props {
  eventId: string;
  onSuccess: () => void;
}

const CreateVoucherForm = ({ eventId, onSuccess }: Props) => {
  return (
    <Formik
      initialValues={{
        code: "",
        discount: 0,
        start_date: "",
        end_date: "",
      }}
      validationSchema={Yup.object({
        code: Yup.string().required("Code is required"),
        discount: Yup.number().required("Discount is required"),
        start_date: Yup.date().required("Start date is required"),
        end_date: Yup.date().required("End date is required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const token = document.cookie
            .split("; ")
            .find((c) => c.startsWith("access_token="))
            ?.split("=")[1];

          await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/vouchers`,
            { ...values, event_id: eventId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          Swal.fire("Success", "Voucher created successfully", "success");
          onSuccess();
        } catch (err: any) {
          Swal.fire(
            "Error",
            err?.response?.data?.message || "Error occurred",
            "error"
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700"
          >
            Voucher Code
          </label>
          <Field
            id="code"
            name="code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter voucher code"
          />
          <ErrorMessage
            name="code"
            component="div"
            className="text-sm text-red-500 mt-1"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="discount"
            className="block text-sm font-medium text-gray-700"
          >
            Discount (%)
          </label>
          <Field
            id="discount"
            name="discount"
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 10"
          />
          <ErrorMessage
            name="discount"
            component="div"
            className="text-sm text-red-500 mt-1"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="start_date"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <Field
            id="start_date"
            name="start_date"
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="start_date"
            component="div"
            className="text-sm text-red-500 mt-1"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="end_date"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <Field
            id="end_date"
            name="end_date"
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage
            name="end_date"
            component="div"
            className="text-sm text-red-500 mt-1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Create Voucher
        </button>
      </Form>
    </Formik>
  );
};

export default CreateVoucherForm;
