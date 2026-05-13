import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productId, sizeId, qty, status } = body;

        // Validation
        if (!productId || !sizeId || qty === undefined || !status) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const stock = await db.stock.upsert({
            where: {
                productId_sizeId: {
                    productId: productId,
                    sizeId: sizeId,
                },
            },
            update: {
                qty: parseInt(qty),
                status: status,
            },
            create: {
                productId,
                sizeId,
                qty: parseInt(qty),
                status: status,
            },
        });

        return NextResponse.json(stock, { status: 201 });
    } catch (error) {
        console.error("[STOCK_POST_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}