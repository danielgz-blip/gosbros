import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect the /admin page and the API routes that modify data (POST, PUT, DELETE)
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  const isProtectedApi = request.nextUrl.pathname.startsWith('/api/') && request.method !== 'GET';

  if (isAdminPage || isProtectedApi) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
      });
    }

    // Basic Auth header is base64 encoded: "Basic [base64(user:password)]"
    const authString = authHeader.split(' ')[1];
    const decodedAuth = Buffer.from(authString, 'base64').toString('utf-8');
    const [user, password] = decodedAuth.split(':');

    // Get the expected credentials from environment variables
    const expectedUser = process.env.ADMIN_USER;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    // If env variables aren't set, block access as a safety measure to prevent unauthorized access
    if (!expectedUser || !expectedPassword) {
      console.error('Missing ADMIN_USER or ADMIN_PASSWORD environment variables');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    // Validate credentials
    if (user === expectedUser && password === expectedPassword) {
      return NextResponse.next();
    }

    // Invalid credentials
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  // Allow all other routes to proceed normally
  return NextResponse.next();
}

// Configure which paths this middleware runs on for performance
export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
