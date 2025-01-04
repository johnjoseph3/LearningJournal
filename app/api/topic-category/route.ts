import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const GET = auth(async (req) => {
  if (req.auth) {
    const userId = req.auth.user?.id

    const topicCategories = await prisma.topicCategory.findMany({
      where: {
        userId: userId
      },
    })

    return Response.json({ topicCategories })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
