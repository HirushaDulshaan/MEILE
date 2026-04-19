import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('admin-token');
    const { pathname } = request.nextUrl;

    // 1. ආරක්ෂා කළ යුතු පිටු ලැයිස්තුවක් (Admin routes)
    const adminRoutes = [
        '/dashboard',
        '/orders',
        '/products',
        '/reg',
        '/users',
        '/view-products'
    ];

    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isLoginPage = pathname === '/admin-login';

    // 2. ලොග් නොවී ඇඩ්මින් පේජ් වලට යාම වැළැක්වීම
    if (isAdminRoute && !token) {
        return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    // 3. ලොග් වී සිටී නම් ලොගින් පේජ් එකට යාම වැළැක්වීම
    if (isLoginPage && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // ඇඩ්මින්ට අදාළ හැම route එකක්ම මෙතන දාන්න ඕනේ
    matcher: [
        '/dashboard/:path*',
        '/orders/:path*',
        '/products/:path*',
        '/reg/:path*',
        '/users/:path*',
        '/view-products/:path*',
        '/admin-login'
    ],
};