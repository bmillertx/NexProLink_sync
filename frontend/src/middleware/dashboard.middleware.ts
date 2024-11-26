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

    // Check if the user has necessary claims/role
    if (!decodedClaims.email_verified && !decodedClaims.admin) {
      return NextResponse.redirect(new URL('/auth/verify-email', request.url));
    }

    // Add user info to headers for the dashboard page
    const response = NextResponse.next();
    response.headers.set('X-User-ID', decodedClaims.uid);
    response.headers.set('X-User-Role', decodedClaims.role || 'client');

    return response;
  } catch (error) {
    console.error('Dashboard middleware error:', error);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
};
