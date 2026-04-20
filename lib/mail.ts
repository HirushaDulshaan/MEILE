import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOTP = async (email: string, otp: string) => {
    const mailOptions = {
        from: '"MEILI CLOTHING" <addseyowa@gmail.com>',
        to: email,
        subject: "Verify Your Account - MEILI",
        html: `
            <div style="font-family: 'Helvetica', sans-serif; max-width: 500px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; text-align: center;">
                <h1 style="color: #0f172a; text-transform: uppercase; letter-spacing: 2px; font-size: 24px; font-weight: 900;">MEILI</h1>
                <p style="color: #64748b; font-size: 14px; font-weight: 600; margin-top: 20px;">Your Verification Code</p>
                <div style="background: #f8fafc; padding: 30px; border-radius: 16px; margin: 20px 0; font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #2563eb;">
                    ${otp}
                </div>
                <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold;">
                    This code is valid for 10 minutes only.
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("EMAIL_SEND_ERROR:", error);
        return false;
    }
};