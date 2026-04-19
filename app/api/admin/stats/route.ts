import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // 1. මූලික සංඛ්‍යාලේඛන (Basic Stats)
        const totalRevenue = await db.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: "Delivered" }
        });

        const totalOrders = await db.order.count();
        const totalUsers = await db.user.count();
        const totalProducts = await db.product.count();

        // 2. ප්‍රස්ථාරයට අවශ්‍ය දත්ත (Chart Data - Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const chartDataRaw = await db.order.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo },
                status: "Delivered"
            },
            select: {
                totalAmount: true,
                createdAt: true
            }
        });

        // දත්ත දින අනුව group කිරීම
        const chartData = chartDataRaw.reduce((acc: any, order) => {
            const date = order.createdAt.toLocaleDateString('en-US', { weekday: 'short' });
            const existing = acc.find((item: any) => item.day === date);
            if (existing) {
                existing.amount += order.totalAmount;
            } else {
                acc.push({ day: date, amount: order.totalAmount });
            }
            return acc;
        }, []);

        // 3. මෑතකදී ආපු ඕඩර්ස් 5 (Recent Orders)
        const recentOrders = await db.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { firstName: true, lastName: true } } }
        });

        // ✅ සියලුම දත්ත එකම NextResponse එකකින් ලබා දීම
        return NextResponse.json({
            revenue: totalRevenue._sum.totalAmount || 0,
            orders: totalOrders,
            users: totalUsers,
            products: totalProducts,
            chartData, // ප්‍රස්ථාරයට
            recentOrders // ලිස්ට් එකට
        });

    } catch (error) {
        console.error("[ADMIN_STATS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}