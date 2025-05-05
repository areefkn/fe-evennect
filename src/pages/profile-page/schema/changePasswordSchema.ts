import * as Yup from "yup";

export const changePasswordSchema = Yup.object().shape({
  old_password: Yup.string().required("Old password is required"),
  new_password: Yup.string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
});
