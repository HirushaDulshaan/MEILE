import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),

    //  Email Regex Update
    email: z.string()
        .min(1, "Email is required")
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email address (e.g., name@example.com)"
        ),

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

export const profileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    contact: z.string().regex(/^(?:\+94|0)7[0-9]{8}$/, "Invalid Sri Lankan contact number"),
    address1: z.string().min(5, "Address Line 1 is too short"),
    address2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    postalCode: z.string()
        .min(1, "Postal code is required")
        .regex(/^[0-9]+$/, "Postal code must contain only numbers")
        .length(5, "Sri Lankan postal code must be exactly 5 digits"),
});
export const checkoutSchema = z.object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Shipping address is too short"),
    city: z.string().min(2, "City is required"),
    phone: z.string().regex(/^(?:\+94|0)7[0-9]{8}$/, "Invalid Sri Lankan phone number"),
});