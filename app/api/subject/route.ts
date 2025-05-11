import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const GET = auth(async (req) => {
  if (req.auth) {
    const userId = req.auth.user?.id
    const cursor = req.nextUrl.searchParams.get("cursor")
    const limit = req.nextUrl.searchParams.get("limit")

    const queryOptions: any = {
      where: {
        userId: userId
      },
      orderBy: {
        id: "desc"
      }
    }

    if (limit) {
      queryOptions.take = parseInt(limit)
      queryOptions.skip = cursor ? 1 : 0
      queryOptions.cursor = cursor ? { id: parseInt(cursor) } : undefined
    }

    const subjects = await prisma.subject.findMany(queryOptions)

    const nextCursor =
      limit && subjects.length === parseInt(limit)
        ? subjects[subjects.length - 1].id
        : null

    return Response.json({ subjects, nextCursor })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
