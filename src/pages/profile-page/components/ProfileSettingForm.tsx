"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { changeNameSchema } from "../schema/changeNameSchema";
import { changePasswordSchema } from "../schema/changePasswordSchema";

export default function ProfileSettingForm() {
  const [initialNameValues, setInitialNameValues] = useState({
    first_name: "",
    last_name: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setInitialNameValues({
          first_name: res.data.data.first_name,
          last_name: res.data.data.last_name,
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Failed to load user data", "error");
      });
  }, []);

  const handleUpdateProfile = async (values: any) => {
    const token = getToken();
    if (!token) return;

    const formData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    if (file) formData.append("file", file);

    try {
      setLoadingProfile(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire("Success", "Profile updated successfully", "success");
    } catch (err: any) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (values: any, { resetForm }: any) => {
    const token = getToken();
    if (!token) return;

    try {
      setLoadingPassword(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/password`,
        {
          old_password: values.old_password,
          new_password: values.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire("Success", "Password changed successfully", "success");
      resetForm();
    } catch (err: any) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Password change failed",
        "error"
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="space-y-10 bg-white p-6 rounded shadow">
      {/* Profile Update Form */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
        <Formik
          enableReinitialize
          initialValues={initialNameValues}
          validationSchema={changeNameSchema}
          onSubmit={handleUpdateProfile}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <Field
                  name="first_name"
                  className="mt-1 p-2 border rounded w-full"
                />
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <Field
                  name="last_name"
                  className="mt-1 p-2 border rounded w-full"
                />
                <ErrorMessage
                  name="last_name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={loadingProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingProfile ? "Updating..." : "Update Profile"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Change Password Form */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <Formik
          initialValues={{ old_password: "", new_password: "" }}
          validationSchema={changePasswordSchema}
          onSubmit={handleChangePassword}
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Old Password</label>
              <Field
                type="password"
                name="old_password"
                className="mt-1 p-2 border rounded w-full"
              />
              <ErrorMessage
                name="old_password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">New Password</label>
              <Field
                type="password"
                name="new_password"
                className="mt-1 p-2 border rounded w-full"
              />
              <ErrorMessage
                name="new_password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loadingPassword}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loadingPassword ? "Changing..." : "Change Password"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
