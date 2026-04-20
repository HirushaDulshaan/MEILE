import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { email, firstName, lastName, contact, password, otp } = await request.json();

        // 1. OTP එක DB එකේ තියෙනවද සහ කල් ඉකුත් වී ඇත්දැයි බලමු
        const record = await db.verificationToken.findFirst({
            where: { email, token: otp }
        });

        if (!record || record.expires < new Date()) {
            return new NextResponse("Invalid or expired OTP", { status: 400 });
        }

        // 2. User කෙනෙක් දැනටමත් ඉන්නවද කියලා තව පාරක් check කරමු (Safety check)
        const existingUser = await db.user.findFirst({
            where: { OR: [{ email }, { contact }] }
        });

        if (existingUser) {
            return new NextResponse("User already exists with this email or contact", { status: 400 });
        }

        // 3. User ව Create කරනවා (id එක දෙන්න එපා, ඒක auto-increment වෙනවා)
        const user = await db.user.create({
            data: {
                email,
                firstName,
                lastName,
                contact,
                password,
                role: "USER"
            }
        });

        // 4. පාවිච්චි කරපු Token එක Delete කරමු
        // සටහන: VerificationToken එකේ email එක @unique නැත්නම් deleteMany භාවිතා කරන්න
        await db.verificationToken.deleteMany({
            where: { email }
        });

        return NextResponse.json(user);

    } catch (error: any) {
        console.error("VERIFY_OTP_ERROR:", error);

        // P2002 error එක (Unique constraint) ආවොත් මෙතැනින් අහුවෙනවා
        if (error.code === 'P2002') {
            return new NextResponse("Account already exists with these details", { status: 400 });
        }

        return new NextResponse("Internal Server Error", { status: 500 });
    }
}