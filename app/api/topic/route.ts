import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const GET = auth(async (req, context) => {
  if (req.auth) {
    const userId = req.auth.user?.id

    const topics = await prisma.topic.findMany({
      where: {
        userId: userId
      },
      include: {
        page: {},
        category: {}
      }
    })

    if (!topics.length) {
      return Response.json({ message: "No topics available" }, { status: 500 })
    }

    return Response.json({ topics })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
