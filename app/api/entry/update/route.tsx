import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const POST = auth(async (req) => {
  if (req.auth) {
    const body = await req.json()

    const entry = await prisma.entry.update({
      where: {
        id: body.id
      },
      data: body
    })

    return Response.json({ entry })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
