"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { forgotPasswordSchema } from "./components/schema";

export default function ForgotPasswordPage() {
  const initialValues = { email: "" };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm, setSubmitting }: any
  ) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/forgot-password`,
        { email: values.email }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Check your email for reset link",
      });

      resetForm();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send reset link",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <Field
              type="email"
              name="email"
              placeholder="Your email"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
