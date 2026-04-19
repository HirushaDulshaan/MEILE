import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: Request) {
    try {
        // 1. Frontend එකෙන් එවන සියලුම දත්ත මෙතනින් ගන්නවා
        const { items, email, userId, address, billingAddress, phone } = await req.json();

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
            // 2. Metadata එකට billingAddress එකත් ඇතුළත් කළා
            metadata: {
                userId: String(userId),
                address: address,         // Shipping Address
                billingAddress: billingAddress || "Same as shipping", // Billing Address
                phone: phone,
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("STRIPE_API_ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}