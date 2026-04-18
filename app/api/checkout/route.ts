import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",});

export async function POST(req: Request) {
    try {
        const { items, email } = await req.json();

        const line_items = items.map((item: any) => ({
            price_data: {
                currency: "lkr",
                product_data: {
                    name: `${item.name} (${item.size})`,
                    // images: [item.image],
                },
                unit_amount: item.price * 100, // Stripe එකේ ගණන් ගන්නේ ශත වලින් (LKR 100 = 10000)
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
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}