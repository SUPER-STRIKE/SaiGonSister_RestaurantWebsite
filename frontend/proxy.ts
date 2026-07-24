import { NextResponse, type NextRequest } from "next/server";

const staffAccessCookie = "saigonSisterStaffAccess";

export function proxy(request: NextRequest) {
  const hasStaffAccess = request.cookies.get(staffAccessCookie)?.value === "allowed";

  if (!hasStaffAccess) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
