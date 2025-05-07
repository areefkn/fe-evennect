"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import { resetPasswordSchema } from "./components/schema";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  if (!token) {
    return <p className="text-red-500">Token tidak ditemukan di URL.</p>;
  }

  const initialValues = { new_password: "" };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/reset-password`,
        {
          token,
          new_password: values.new_password,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Password Reset",
        text: "Password reset successful. Redirecting to login...",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Reset failed or token expired.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={resetPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <Field
              type="password"
              name="new_password"
              placeholder="New password"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="new_password"
              component="div"
              className="text-red-500 text-sm"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
