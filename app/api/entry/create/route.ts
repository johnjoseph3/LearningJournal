import { auth } from "auth"
import { prisma } from "../../../../prisma/prisma"
import sanitizeHtml from "sanitize-html"

export const POST = auth(async (req) => {
  if (req.auth) {
    const body = await req.json()
    const cleanContent = sanitizeHtml(body.content);
  
    const entry = await prisma.entry.create({
        data: {
            pageId: body.pageId,
            content: cleanContent
        }
    })

    return Response.json({ entry })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
