import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import logger from "@/lib/logger"; // 👈 Logger එක import කරන්න

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Zod Validation
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            logger.warn(`Validation failed for registration attempt: ${JSON.stringify(validation.error.format())}`);
            return new NextResponse("Invalid data provided", { status: 400 });
        }

        const { email, firstName, lastName, contact, password } = validation.data;

        // 2. Email සහ Contact Number පරීක්ෂාව
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { contact: contact }
                ]
            }
        });

        if (existingUser) {
            const reason = existingUser.email === email ? "Email already registered" : "Contact already in use";
            logger.info(`Registration blocked: ${reason} (${email})`); // 👈 දැනට තියෙන දත්ත නිසා බ්ලොක් වූ බව ලොග් කිරීම
            return new NextResponse(reason, { status: 400 });
        }

        // 3. User සෑදීම
        const user = await db.user.create({
            data: {
                email,
                firstName,
                lastName,
                contact,
                password,
            },
        });

        // ✅ සාර්ථක රෙජිස්ට්‍රේෂන් එකක් ලොග් කිරීම
        logger.info(`New user created: ${email} | Name: ${firstName} ${lastName}`);

        return NextResponse.json(user);

    } catch (error: any) {
        // ❌ සර්වර් එකේ ඇතිවන errors ලොග් ෆයිල් එකට සේව් කිරීම
        logger.error(`REGISTER_API_ERROR: ${error.message}`, { stack: error.stack });
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}