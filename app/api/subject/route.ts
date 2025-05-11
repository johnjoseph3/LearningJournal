import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const GET = auth(async (req) => {
  if (req.auth) {
    const userId = req.auth.user?.id
    const cursor = req.nextUrl.searchParams.get("cursor")
    const limit = req.nextUrl.searchParams.get("limit") || "10"

    const subjects = await prisma.subject.findMany({
      where: {
        userId: userId
      },
      take: parseInt(limit as string),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: {
        id: "desc"
      }
    })

    const nextCursor =
      subjects.length === parseInt(limit)
        ? subjects[subjects.length - 1].id
        : null

    return Response.json({ subjects, nextCursor })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
