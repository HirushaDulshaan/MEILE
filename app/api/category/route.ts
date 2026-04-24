import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// 1. GET Method
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sectionId = searchParams.get("sectionId");

        const categories = await db.category.findMany({
            where: {
                // Dan sectionId eka Int nisa query parameter ekath Number() karanna ona
                ...(sectionId ? { sectionId: Number(sectionId) } : {})
            },
            include: { section: true },
            orderBy: { id: 'asc' }
        });

        return NextResponse.json(categories);
    } catch (err) {
        console.error("[CATEGORY_GET]", err);
        return new NextResponse("Error getting categories", { status: 500 });
    }
}

// 2. POST Method (Updated with name check)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { categoryName, sectionId } = body;

        if (!categoryName || !sectionId) {
            return new NextResponse("Missing fields", { status: 400 });
        }


        const existing = await db.category.findFirst({
            where: { name: categoryName }
        });

        if (existing) {
            return new NextResponse("Category name already exists", { status: 400 });
        }

        const newCategory = await db.category.create({
            data: {
                name: categoryName,
                sectionId: Number(sectionId)
            }
        });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (err) {
        console.error("[CATEGORY_POST]", err);
        return new NextResponse("Error creating category", { status: 500 });
    }
}

// 3. PUT Method
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, categoryName, sectionId } = body;

        const updated = await db.category.update({
            where: { id: Number(id) }, // ID eka Number kala
            data: {
                name: categoryName,
                sectionId: Number(sectionId) // Relation ID eka Number kala
            }
        });
        return NextResponse.json(updated);
    } catch (err) {
        console.error("[CATEGORY_PUT]", err);
        return new NextResponse("Error updating category", { status: 500 });
    }
}