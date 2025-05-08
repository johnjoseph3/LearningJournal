import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const POST = auth(async (req) => {
  if (req.auth) {
    const body = await req.json()

    const subject = await prisma.subject.update({
      where: {
        id: parseInt(body.id)
      },
      data: {
        name: body.name
      }
    })

    return Response.json({ subject })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
