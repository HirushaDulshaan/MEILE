import { NextResponse } from "next/server";
import Stripe from "stripe";
import { checkoutSchema } from "@/lib/validations/auth"; // 👈 කලින් හදපු Schema එක

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, email, userId, address, billingAddress, phone } = body;

        // 🚀 1. Validation Logic
        // Zod පාවිච්චි කරලා දත්ත වල format එක චෙක් කරනවා
        const validation = checkoutSchema.safeParse({
            firstName: body.firstName || "N/A",
            lastName: body.lastName || "N/A",
            email: email,
            address: address,
            city: body.city || "N/A",
            phone: phone
        });

        if (!validation.success) {
            console.log("Validation Failed:", validation.error.format());
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        // 🚀 2. Authentication Check
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 401 });
        }

        // 🚀 3. Cart Items Check
        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        console.log("Processing Checkout for User:", userId);

        const line_items = items.map((item: any) => ({
            price_data: {
                currency: "lkr",
                product_data: {
                    name: `${item.name} (${item.size})`,
                    metadata: {
                        productId: String(item.id),
                        productImage: item.image,
                        sizeId: String(item.sizeId)
                    }
                },
                unit_amount: item.price * 100,
            },
            quantity: item.qty,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
            customer_email: email,
            metadata: {
                userId: String(userId),
                address: address,
                billingAddress: billingAddress || "Same as shipping",
                phone: phone,
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("STRIPE_API_ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}