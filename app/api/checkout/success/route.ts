import { db } from "@/lib/db";
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
});

// ... imports ටික ඒ විදිහටම තියන්න

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) return new NextResponse("Missing Session ID", { status: 400 });

    try {
        // 1. කලින් ඕඩර් එකක් මේ ID එකෙන් තියෙනවද බලමු (Duplicate වළක්වන්න)
        const existingOrder = await db.order.findUnique({
            where: { stripeSessionId: sessionId },
            include: { items: true }
        });

        if (existingOrder) return NextResponse.json(existingOrder);

        // 2. Stripe Session එක ගන්නවා
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items.data.price.product'],
        });

        if (session.payment_status !== "paid") {
            return new NextResponse("Payment not completed", { status: 400 });
        }

        const userId = session.metadata?.userId;
        const parsedUserId = Number(userId);

        if (!userId || isNaN(parsedUserId)) return new NextResponse("Invalid User ID", { status: 400 });

        // 🚀 Transaction පටන් ගන්නවා
        const order = await db.$transaction(async (tx) => {

            // ඕඩර් එක ක්‍රියේට් කිරීම
            const newOrder = await tx.order.create({
                data: {
                    stripeSessionId: sessionId,
                    totalAmount: (session.amount_total || 0) / 100,
                    address: session.metadata?.address || "N/A",
                    billingAddress: session.metadata?.billingAddress || "N/A",
                    contact: session.metadata?.phone || "N/A",
                    status: "Processing",
                    user: { connect: { id: parsedUserId } },
                    items: {
                        create: session.line_items?.data.map((item: any) => {
                            const productMetadata = item.price.product.metadata;
                            return {
                                productId: Number(productMetadata.productId),
                                productName: item.description || "Product",
                                productImage: productMetadata.productImage || "",
                                quantity: item.quantity || 1,
                                price: (item.amount_total || 0) / 100 / (item.quantity || 1),
                            };
                        })
                    }
                },
                include: { items: true }
            });

            // 📦 ස්ටොක් අප්ඩේට් කිරීම
            for (const item of session.line_items?.data || []) {
                const productMetadata = (item.price?.product as Stripe.Product).metadata;

                const pId = Number(productMetadata.productId);
                const sId = Number(productMetadata.sizeId);
                const orderQty = item.quantity || 1;

                if (!isNaN(pId) && !isNaN(sId)) {
                    await tx.stock.update({
                        where: {
                            productId_sizeId: {
                                productId: pId,
                                sizeId: sId,
                            }
                        },
                        data: {
                            qty: { decrement: orderQty }
                        }
                    });
                    console.log(`✅ Stock updated: Product ${pId}, Size ${sId}`);
                }
            }

            return newOrder;
        });

        return NextResponse.json(order);

    } catch (error: any) {
        console.error("SUCCESS_ROUTE_ERROR:", error);
        return new NextResponse("Something went wrong processing your order.", { status: 500 });
    }
}