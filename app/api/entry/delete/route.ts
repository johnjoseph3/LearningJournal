import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const POST = auth(async (req) => {
  if (req.auth) {
    const body = await req.json()

    await prisma.entry.delete({
      where: {
        id: body.id
      }
    })

    const entries = await prisma.entry.findMany({
      where: {
        pageId: body.pageId
      },
      orderBy: {
        order: "asc"
      }
    })

    const newOrdered = []

    for (let index = 0; index < entries.length; index++) {
      const updated = await prisma.entry.update({
        where: {
          id: entries[index].id
        },
        data: {
          order: index + 1
        }
      })
      newOrdered.push(updated)
    }

    return Response.json(newOrdered)
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
