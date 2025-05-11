import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const GET = auth(async (req, context) => {
  if (req.auth) {
    const userId = req.auth.user?.id

    const cursor = req.nextUrl.searchParams.get("cursor")
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10)

    const topics = await prisma.topic.findMany({
      where: {
        userId: userId
      },
      include: {
        page: true,
        subject: true
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor, 10) } : undefined,
      orderBy: {
        createdAt: "desc"
      }
    })

    const nextCursor =
      topics.length === limit ? topics[topics.length - 1].id : null

    return Response.json({ topics, nextCursor })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
