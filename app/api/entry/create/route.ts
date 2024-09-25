import { auth } from "auth"
import { prisma } from "../../../../prisma/prisma"

export const POST = auth(async (req) => {
  if (req.auth) {
    const body = await req.json()
    const entry = await prisma.entry.create({
        data: {
            pageId: body.pageId,
            content: body.content
        }
    })

    return Response.json({ entry })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
