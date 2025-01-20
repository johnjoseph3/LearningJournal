import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// import { handlers } from "@/auth.ts"
// import { getToken } from "next-auth/jwt";
// import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
    // console.log("handlers", handlers)
  //   console.log("process.env.NEXTAUTH_SECRET ", process.env.NEXTAUTH_SECRET)
//   const token = await getToken({ req, secret: process.env.AUTH_SECRET })
//   console.log("token", token)/

  //   if (!token) {
  //     const url = req.nextUrl.clone();
  //     url.pathname = "/auth/login";
  //     return NextResponse.redirect(url);
  //   const session = await auth()
  //   console.log("hello", session, "problem")
  //   if (!session?.user) {
  //   }

  return NextResponse.next()
}

// export const config = {
//   matcher: ["/((?!api|_next|static|favicon.ico).*)"]
// }
