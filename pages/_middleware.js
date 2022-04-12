// import { NextResponse } from "next/server";
// import { verifyToken } from "../lib/utils";

// export async function middleware(req, ev) {
//   const token = req ? req.cookies.token : null;
//   const userId = await verifyToken(token);
//   const { pathname } = req.nextUrl; // check if /login

//   if (
//     (token && userId) ||
//     pathname.includes("/api/login") ||
//     pathname.includes("/static")
//   ) {
//     // console.log("here");
//     // check the token
//     // if token Valid, next()
//     // if the page is /login
//     return NextResponse.next();
//   }
//   // if no token
//   if (!token && pathname !== "/login") {
//     // console.log({ pathname });
//     // console.log("redirected");
//     // redirect to login
//     const url = req.nextUrl.clone();
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }
// }
import { NextResponse } from "next/server";
import { verifyToken } from "../lib/utils";

export async function middleware(req) {
  const token = req ? req.cookies?.token : null;
  const userId = await verifyToken(token);

  const { pathname } = req.nextUrl;

  if (
    pathname.includes("/api/login") ||
    userId ||
    pathname.includes("/static")
  ) {
    return NextResponse.next();
  }

  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
