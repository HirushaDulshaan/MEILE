import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// 1. GET: Fetch Products with Optional Filtering
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sectionId = searchParams.get("sectionId");

        const products = await db.product.findMany({
            where: {
                // Hirusha, මෙතනදී sectionId එකක් එව්වොත් විතරක් filter වෙනවා
                ...(sectionId ? { sectionId: Number(sectionId) } : {})
            },
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                section: true,
                images: true,
                colors: true,
                sizes: true
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("[PRODUCTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// 2. POST: Create New Product
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, price, categoryId, sectionId, images, colorIds } = body;

        const product = await db.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                categoryId: Number(categoryId),
                sectionId: Number(sectionId),
                images: {
                    create: images?.map((imgUrl: string) => ({ url: imgUrl })) || []
                },
                colors: {
                    connect: colorIds?.map((id: any) => ({ id: Number(id) })) || []
                }
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("[PRODUCT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// 3. PUT: Update Existing Product
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, description, price, categoryId, sectionId, images, colorIds } = body;

        if (!id) return new NextResponse("Product ID required", { status: 400 });

        // Parana images delete karala aluth ewa danna
        await db.productImage.deleteMany({ where: { productId: Number(id) } });

        const updatedProduct = await db.product.update({
            where: { id: Number(id) },
            data: {
                name,
                description,
                price: parseFloat(price),
                categoryId: Number(categoryId),
                sectionId: Number(sectionId),
                images: {
                    create: images?.map((imgUrl: string) => ({ url: imgUrl })) || []
                },
                colors: {
                    set: colorIds?.map((id: any) => ({ id: Number(id) })) || []
                }
            },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("[PRODUCT_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}