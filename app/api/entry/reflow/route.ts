import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"
import { Entry } from "@prisma/client"

export const POST = auth(async (req) => {
  if (req.auth) {
    const body: Entry[] = await req.json()

    const newOrdered = []

    for await (const [index, entry] of body.entries()) {
      const updated = await prisma.entry.update({
        where: {
          id: entry.id
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
