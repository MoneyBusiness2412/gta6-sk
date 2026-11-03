// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kontrola, či požiadavka smeruje do administrácie
  if (pathname.includes('/admin')) {
    const session = request.cookies.get('admin_session');

    // Ak chýba overovacia cookie, presmerujeme používateľa na /login
    if (!session || session.value !== 'true') {
      const lang = pathname.split('/')[1] || 'sk';
      return NextResponse.redirect(new URL(`/${lang}/login`, request.url));
    }
  }

  return NextResponse.next();
}

// Middleware sa aplikuje na všetky adresy administrácie
export const config = {
  matcher: ['/:lang/admin/:path*'],
};