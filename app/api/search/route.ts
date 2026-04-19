import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function GET(req:Request){
    try {
        const {searchParams} = new URL(req.url);
        const query = searchParams.get("q");

        if (!query) return NextResponse.json([]);

        const products = await db.product.findMany({
            where: {
                OR:[
                    {name:{contains:query, mode:'insensitive'}},
                    {description:{contains:query, mode:'insensitive'}},
                    { category: { name: { contains: query, mode: 'insensitive' } } }                ]
            },
            include:{
                images:true,
                category:true,
            },
            take:5,
        });
        return NextResponse.json(products);


    }catch (error){
        return  new NextResponse("Search Error", {status:500});
        console.error(error);
    }
}