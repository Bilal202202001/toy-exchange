

import { NextResponse } from "next/server";

export function middleware(request) {

  const path = request.nextUrl.pathname;

  if (!path.startsWith("/toybox")) {

    return NextResponse.next();

  }

  const token = request.cookies.get("tb_token")?.value;

  if (!token)

    return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();

}

export const config = {

  matcher: ["/toybox/:path*"],

};

