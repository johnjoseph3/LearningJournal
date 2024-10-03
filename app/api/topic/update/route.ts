import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const POST = auth(async (req) => {
  if (req.auth) {
    const body = await req.json()

    const topic = await prisma.topic.update({
      where: {
        id: body.id
      },
      data: body
    })

    return Response.json({ topic })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
