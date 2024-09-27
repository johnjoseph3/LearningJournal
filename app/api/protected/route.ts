import { auth } from "@/auth.ts"

export const GET = auth((req) => {
  console.log
  if (req.auth) {
    return Response.json({ data: "Protected data" })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any // TODO: Fix `auth()` return type
