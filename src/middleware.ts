import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const PUBLIC_PATHS = ["/admin/login"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public admin paths through
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Only protect /admin/* paths
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const token = req.cookies.get("nexura_admin_token")?.value

  if (!token) {
    const loginUrl = new URL("/admin/login", req.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback_nexura_secret_key"
    )
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    const loginUrl = new URL("/admin/login", req.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
