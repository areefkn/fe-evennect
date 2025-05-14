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
  const [preview, setPreview] = useState<string | null>(null);
  const [profilePict, setProfilePict] = useState<string | null>(null);
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
        const user = res.data.data;
        setInitialNameValues({
          first_name: user.first_name,
          last_name: user.last_name,
        });
        setProfilePict(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}${user.profile_pict}`
        );
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Failed to load user data", "error");
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpdateProfile = async (values: any) => {
    const token = getToken();
    if (!token) return;

    const formData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    if (file) formData.append("file", file);

    try {
      setLoadingProfile(true);
      const res = await axios.patch(
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
      setProfilePict(res.data.data.profile_pict || null);
      setPreview(null);
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Success", "Password changed successfully", "success");
      resetForm();
    } catch (err: any) {
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
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-10 max-w-4xl mx-auto mt-8 space-y-10">
      {/* Profile Update Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Update Profile
        </h2>

        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8">
          {(preview || profilePict) && (
            <div className="mb-4 sm:mb-0">
              <img
                src={preview || profilePict || "/no-photo.jpg"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border border-gray-300"
              />
            </div>
          )}

          <Formik
            enableReinitialize
            initialValues={initialNameValues}
            validationSchema={changeNameSchema}
            onSubmit={handleUpdateProfile}
          >
            {() => (
              <Form className="flex-1 w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Field
                    name="first_name"
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Field
                    name="last_name"
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingProfile ? "Updating..." : "Update Profile"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Change Password Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Change Password
        </h2>

        <Formik
          initialValues={{ old_password: "", new_password: "" }}
          validationSchema={changePasswordSchema}
          onSubmit={handleChangePassword}
        >
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Old Password
              </label>
              <Field
                type="password"
                name="old_password"
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500 outline-none"
              />
              <ErrorMessage
                name="old_password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Field
                type="password"
                name="new_password"
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500 outline-none"
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
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingPassword ? "Changing..." : "Change Password"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
