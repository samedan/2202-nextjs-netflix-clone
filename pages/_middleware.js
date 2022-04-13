import { NextResponse } from "next/server";
import { verifyToken } from "../lib/utils";

export async function middleware(req) {
  const token = req ? req.cookies.token : null;
  const userId = await verifyToken(token);
  const { pathname } = req.nextUrl;
  console.log({ pathname });

  if (
    (token && userId) ||
    pathname.includes("/api/login") ||
    pathname.includes("/static")
  ) {
    return NextResponse.next();
  }
  if (!token && pathname !== "/login") {
    const url = req.nextUrl.clone();
    // const url = `${process.env.DEPLOY_VERCEL_URL}/login`;
    // console.log({ url });
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  }
}
