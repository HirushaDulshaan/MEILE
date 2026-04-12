import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET All Sections
export async function GET() {
    try {
        const sections = await db.section.findMany({
            orderBy: { id: 'asc' } // Integer nisa 1, 2, 3 widiyata ena eka hondayi
        });
        return NextResponse.json(sections);
    } catch (err) {
        return new NextResponse("Failed to fetch sections", { status: 500 });
    }
}

// CREATE Section
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sectionName } = body;

        const newSection = await db.section.create({
            data: { name: sectionName },
        });
        return NextResponse.json(newSection, { status: 201 });
    } catch (err) {
        console.error(err);
        return new NextResponse("Error creating section", { status: 500 });
    }
}

// UPDATE Section
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, sectionName } = body;

        if (!id) return new NextResponse("ID Required", { status: 400 });

        const updatedSection = await db.section.update({
            where: { id: Number(id) }, // ID eka Number ekak kala
            data: { name: sectionName },
        });
        return NextResponse.json(updatedSection);
    } catch (err) {
        console.error(err);
        return new NextResponse("Error updating section", { status: 500 });
    }
}