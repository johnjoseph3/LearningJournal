import { auth } from "@/auth.ts"
import { prisma } from "@/prisma/prisma.ts"

export const GET = auth(async (req, context) => {
  const id = context.params?.id as string

  if (req.auth) {
    const subject = await prisma.subject.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    if (!subject) {
      return Response.json(
        { message: "Could not find subject" },
        { status: 500 }
      )
    }

    return Response.json({ subject })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any
