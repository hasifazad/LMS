import * as yup from "yup";

export const trainerLoginSchema = yup.object({
    email: yup
        .string()
        .email("Enter a valid email address")
        .required("Email is required"),

    password: yup
        .string()
        .required("Password is required"),
});