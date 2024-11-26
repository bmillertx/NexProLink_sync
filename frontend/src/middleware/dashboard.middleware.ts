import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function middleware(request: NextRequest) {
  try {
    // Get the Firebase session cookie
    const session = request.cookies.get('session')?.value;

    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Verify the session cookie and get the user
    const decodedClaims = await auth.verifySessionCookie(session, true);

    // Check if the user has completed their profile
    if (!decodedClaims.role) {
      return NextResponse.redirect(new URL('/auth/complete-profile', request.url));
    }

    // Get the requested path
    const path = request.nextUrl.pathname;

    // Role-based routing
    if (path.startsWith('/dashboard/consultant')) {
      if (decodedClaims.role !== 'consultant') {
        return NextResponse.redirect(new URL('/dashboard/client', request.url));
      }
    } else if (path.startsWith('/dashboard/client')) {
      if (decodedClaims.role !== 'client') {
        return NextResponse.redirect(new URL('/dashboard/consultant', request.url));
      }
    }

    // Add user info to headers for the dashboard page
    const response = NextResponse.next();
    response.headers.set('X-User-ID', decodedClaims.uid);
    response.headers.set('X-User-Role', decodedClaims.role);
    response.headers.set('X-User-Email-Verified', String(decodedClaims.email_verified));

    return response;
  } catch (error) {
    console.error('Dashboard middleware error:', error);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/consultant/:path*',
    '/client/:path*'
  ]
};
