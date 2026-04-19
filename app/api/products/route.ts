import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// 1. GET: Fetch Products with Optional Filtering
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sectionId = searchParams.get("sectionId");
        const type = searchParams.get("type");

        const includeOptions = {
            category: true,
            section: true,
            images: true,
            colors: true,
            stocks: {
                include: {
                    size: true
                }
            }
        };

        // --- 1. REAL MOST SELLING LOGIC ---
        // --- 1. REAL MOST SELLING LOGIC ---
        if (type === "most-selling") {
            const products = await db.product.findMany({
                where: {
                    ...(sectionId ? { sectionId: Number(sectionId) } : {}),
                },
                include: {
                    ...includeOptions,
                    _count: {
                        select: { orderItems: true }
                    }
                },
                orderBy: [
                    {
                        orderItems: {
                            _count: 'desc' // වැඩිපුරම විකිණෙන ඒවා
                        }
                    },
                    {
                        isFeatured: 'desc' // ඊට පස්සේ Featured ඒවා
                    }
                ],
                take: 5,
            });
            return NextResponse.json(products);
        }

        // --- 2. NEW ARRIVALS LOGIC ---
        if (type === "new-arrivals") {
            const products = await db.product.findMany({
                where: {
                    ...(sectionId ? { sectionId: Number(sectionId) } : {})
                },
                include: includeOptions,
                orderBy: {
                    createdAt: 'desc' // අලුත්ම ඒවා උඩට
                },
                take: 5,
            });
            return NextResponse.json(products);
        }

        // --- 3. NORMAL FETCHING ---
        const products = await db.product.findMany({
            where: {
                ...(sectionId ? { sectionId: Number(sectionId) } : {})
            },
            orderBy: { createdAt: 'desc' },
            include: includeOptions
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