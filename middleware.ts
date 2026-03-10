import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/planner', '/trips', '/preferences', '/settings', '/analytics'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow login/register pages for everyone
  if (pathname === '/login' || pathname === '/register') {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      // Redirect to dashboard if already logged in
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/planner', '/trips', '/preferences', '/settings', '/analytics', '/login', '/register'],
};
