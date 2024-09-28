import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"
import { Entry } from "@prisma/client"

export const POST = auth(async (req) => {
  if (req.auth) {
    const body: Entry[] = await req.json()

    body.forEach(async (entry, index) => {
      await prisma.entry.update({
        where: {
          id: entry.id
        },
        data: {
          order: index + 1
        }
      })
    })

    return Response.json("successfully reflowed entries")
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
