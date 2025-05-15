"use client";

import { Formik, Form, Field, FormikProps } from "formik";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import RegisterSchema from "./schema";
import IRegister from "./type";

export default function RegisterForm() {
  const router = useRouter();
  const initialValues: IRegister = {
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "", // Default role
    referral_code: "",
  };

  const register = async (values: IRegister) => {
    try {
      console.log("Registering with values:", values);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`,
        {
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          password: values.password,
          role: values.role,
          referral_code: values.referral_code || undefined,
        }
      );

      Swal.fire({
        title: data.message,
        icon: "success",
        confirmButtonText: "OK",
        timer: 1000,
      }).then(() => {
        // Setelah alert selesai, arahkan ke halaman login
        router.push("/login");
      });
    } catch (err: any) {
      console.error("Register error:", err);
      Swal.fire({
        title: "Error!",
        text:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    //   const { data } = await axios.get(
    //     `http://localhost:5050/user?email=${values.email}`
    //   );

    //   if (data.length > 0) throw new Error("Email sudah terdaftar");

    //   // Prepare data for server-side password hashing and JWT handling
    //   const userData = {
    //     ...values,
    //     password: values.password, // Password will be hashed server-side
    //   };

    //   await axios.post("http://localhost:5050/user", userData);

    //   alert("Register Success");

    //   router.push("/login");
    // } catch (err) {
    //   alert((err as any).message);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="bg-white p-4  rounded-lg shadow-lg max-w-md w-80">
        <Formik
          initialValues={initialValues}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { resetForm }) => {
            await register(values);
            resetForm();
          }}
        >
          {(props: FormikProps<IRegister & { role: string }>) => {
            const { values, handleChange, touched, errors } = props;

            return (
              <Form className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label>Email: </label>
                  <Field
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                    className="border border-gray-300 rounded-lg p-2"
                  />
                  {touched.email && errors.email ? (
                    <div className="text-red-500">{errors.email}</div>
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <label>First Name: </label>
                  <Field
                    type="text"
                    name="first_name"
                    onChange={handleChange}
                    value={values.first_name}
                    className="border border-gray-300 rounded-lg p-2"
                  />
                  {touched.first_name && errors.first_name ? (
                    <div className="text-red-500">{errors.first_name}</div>
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <label>Last Name: </label>
                  <Field
                    type="text"
                    name="last_name"
                    onChange={handleChange}
                    value={values.last_name}
                    className="border border-gray-300 rounded-lg p-2"
                  />
                  {touched.last_name && errors.last_name ? (
                    <div className="text-red-500">{errors.last_name}</div>
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <label>Password: </label>
                  <Field
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                    className="border border-gray-300 rounded-lg p-2"
                  />
                  {touched.password && errors.password ? (
                    <div className="text-red-500">{errors.password}</div>
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <label>Role: </label>
                  <Field
                    as="select"
                    name="role"
                    onChange={handleChange}
                    value={values.role}
                    className="border border-gray-300 rounded-lg p-2"
                  >
                    <option value="" disabled hidden>Pilih Role</option>
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ORGANIZER">ORGANIZER</option>
                  </Field>
                </div>
                <div className="flex flex-col">
                  <label>Referral Code:</label>
                  <Field
                    type="text"
                    name="referral_code"
                    onChange={handleChange}
                    value={values.referral_code}
                    className="border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Submit
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
