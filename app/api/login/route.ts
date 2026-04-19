import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import logger from "@/lib/logger";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Server-side Validation
        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            logger.warn(`Invalid login format attempt: ${body.email}`);
            return new NextResponse("Invalid email or password format", { status: 400 });
        }

        const { email, password } = validation.data;

        // 2. User Check
        const user = await db.user.findUnique({
            where: { email }
        });

        if (!user) {
            logger.info(`Login failed: User not found (${email})`);
            return new NextResponse("User not found", { status: 404 });
        }

        // 3. Password check (Plain text comparison as requested)
        if (user.password !== password) {
            logger.warn(`Login failed: Incorrect password attempt for ${email}`);
            return new NextResponse("Invalid credentials", { status: 401 });
        }

        // ✅ Log Successful Login
        logger.info(`User logged in successfully: ${email} (Role: ${user.role})`);

        // 4. Return user data (Zustand එකට අවශ්‍ය සියලුම fields සමඟ)
        return NextResponse.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            contact: user.contact,
            address1: user.address1,
            address2: user.address2,
            city: user.city,
            postalCode: user.postalCode,
            role: user.role
        });

    } catch (error: any) {
        // ❌ Error එක logs/error.log එකට සේව් කරනවා
        logger.error(`LOGIN_API_ERROR: ${error.message}`, { stack: error.stack });
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}