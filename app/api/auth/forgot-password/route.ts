import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { sendOTP } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // 1. යූසර් කෙනෙක් ඉන්නවද බලනවා
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        // 2. OTP එක හදනවා
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        // 3. VerificationToken table එකේ සේව් කරනවා
        await db.verificationToken.upsert({
            where: { email },
            update: { token: otp, expires },
            create: { email, token: otp, expires }
        });

        // 4. ඊමේල් එක යවනවා
        await sendOTP(email, otp);

        return NextResponse.json({ message: "OTP Sent" });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}