import * as Yup from "yup";

export const resetPasswordSchema = Yup.object({
  new_password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
});
