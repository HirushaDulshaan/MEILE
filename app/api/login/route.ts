import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            console.warn(`Invalid login format attempt: ${body.email}`);
            return new NextResponse("Invalid email or password format", { status: 400 });
        }

        const { email, password } = validation.data;

        const user = await db.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.info(`Login failed: User not found (${email})`);
            return new NextResponse("User not found", { status: 404 });
        }

        if (user.password !== password) {
            console.warn(`Login failed: Incorrect password attempt for ${email}`);
            return new NextResponse("Invalid credentials", { status: 401 });
        }

        console.info(`User logged in successfully: ${email}`);

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
        console.error("LOGIN_API_ERROR:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}