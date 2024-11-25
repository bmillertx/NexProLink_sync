import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /admin/dashboard)
  const path = request.nextUrl.pathname

  // If it's an admin route
  if (path.startsWith('/admin')) {
    // Get the token from the cookies
    const token = request.cookies.get('token')?.value

    if (!token) {
      // Redirect to login page if there's no token
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', path)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
