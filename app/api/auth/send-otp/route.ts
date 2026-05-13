import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { sendOTP } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const expires = new Date(Date.now() + 10 * 60 * 1000);

        await db.verificationToken.upsert({
            where: { email },
            update: { token: otp, expires },
            create: { email, token: otp, expires }
        });

        const isSent = await sendOTP(email, otp);

        if (isSent) {
            return NextResponse.json({ message: "OTP sent successfully" });
        } else {
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}