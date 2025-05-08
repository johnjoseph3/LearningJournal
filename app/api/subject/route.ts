import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const GET = auth(async (req) => {
  if (req.auth) {
    const userId = req.auth.user?.id

    const subjects = await prisma.subject.findMany({
      where: {
        userId: userId
      }
    })

    return Response.json({ subjects })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
