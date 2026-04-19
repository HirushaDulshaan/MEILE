import { db } from "@/lib/db";
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        return new NextResponse("Missing Session ID", { status: 400 });
    }

    try {
        const existingOrder = await db.order.findUnique({
            where: { stripeSessionId: sessionId },
            include: { items: true }
        });

        if (existingOrder) {
            return NextResponse.json(existingOrder);
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items.data.price.product'],
        });

        if (session.payment_status !== "paid") {
            return new NextResponse("Payment not completed", { status: 400 });
        }

        const userId = session.metadata?.userId;
        const parsedUserId = Number(userId);

        if (!userId || isNaN(parsedUserId)) {
            return new NextResponse("Invalid User ID", { status: 400 });
        }

        const order = await db.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    stripeSessionId: sessionId,
                    totalAmount: (session.amount_total || 0) / 100,
                    address: session.metadata?.address || "N/A",
                    billingAddress: session.metadata?.billingAddress || "N/A", // ✅ Billing එක මෙතනට වැටෙනවා
                    contact: session.metadata?.phone || "N/A",
                    status: "Processing",
                    user: { connect: { id: parsedUserId } },
                    items: {
                        create: session.line_items?.data.map((item: any) => {
                            const stripeProduct = item.price!.product as Stripe.Product;
                            return {
                                productId: Number(stripeProduct.metadata.productId),
                                productName: item.description || "Product",
                                productImage: stripeProduct.metadata.productImage || "",
                                quantity: item.quantity || 1,
                                price: (item.amount_total || 0) / 100 / (item.quantity || 1),
                            };
                        })
                    }
                },
                include: { items: true }
            });

            // --- Stock Updating Logic ---
            for (const item of session.line_items?.data || []) {
                const stripeProduct = item.price!.product as Stripe.Product;

                const pId = Number(stripeProduct.metadata.productId);
                const sId = Number(stripeProduct.metadata.sizeId); // 👈 මෙතන තමයි කලින් NaN වුණේ
                const orderQty = item.quantity || 1;

                console.log(`Processing Stock: Product ${pId}, Size ${sId}, Qty ${orderQty}`);

                // ✅ pId සහ sId දෙකම සැබෑ අංක (Numbers) ද කියා පරීක්ෂා කරයි
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
                    console.log(`✅ Success: Stock updated for Product ${pId}`);
                } else {
                    console.error(`❌ Failure: Invalid IDs (pId: ${pId}, sId: ${sId})`);
                }
            }

            return newOrder;
        });

        return NextResponse.json(order);

    } catch (error: any) {
        console.error("SUCCESS_ROUTE_ERROR:", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}