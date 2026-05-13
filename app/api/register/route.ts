import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { sendOTP } from "@/lib/mail";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) return new NextResponse("Invalid data", { status: 400 });

        const { email, contact } = validation.data;

        const existingUser = await db.user.findFirst({
            where: { OR: [{ email }, { contact }] }
        });

        if (existingUser) return new NextResponse("Email or Contact already in use", { status: 400 });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        await db.verificationToken.upsert({
            where: { email },
            update: { token: otp, expires },
            create: { email, token: otp, expires }
        });

        const emailSent = await sendOTP(email, otp);
        if (!emailSent) return new NextResponse("Failed to send OTP", { status: 500 });

        return NextResponse.json({ message: "OTP Sent" });

    } catch (error: any) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}