import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Promise එකක් ලෙස Define කරන්න
) {
    try {
        // Hirusha, params එක unwrap කරගන්න ඕනේ මෙහෙම
        const { id } = await params;

        const product = await db.product.findUnique({
            where: { id: Number(id) },
            include: {
                category: true,
                section: true,
                images: true,
                colors: true,
                sizes: true,
                stocks: { include: { size: true } }
            }
        });

        if (!product) return new NextResponse("Product not found", { status: 404 });

        return NextResponse.json(product);
    } catch (error) {
        console.error("[PRODUCT_GET_BY_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}