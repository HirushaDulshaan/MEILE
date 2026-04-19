import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),

    // ✅ Email Regex Update
    email: z.string()
        .min(1, "Email is required")
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email address (e.g., name@example.com)"
        ),

    // ✅ Contact Regex Update (ලංකාවේ 07X සහ +947X වලට ගැළපෙන ලෙස)
    contact: z.string()
        .regex(/^(?:\+94|0)7[0-9]{8}$/, "Invalid Sri Lankan contact number"),

    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});